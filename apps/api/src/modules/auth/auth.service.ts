import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { User, UserRole } from '../../database/entities/user.entity';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.googleClientId =
      this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  /**
   * Verify Google ID token, upsert user in database, and issue SpeakUp JWT
   */
  async authenticateWithGoogle(dto: GoogleLoginDto): Promise<AuthResponseDto> {
    this.logger.log('Initiating Google ID token verification');

    let payload: TokenPayload | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: this.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (err: any) {
      this.logger.warn(`Google ID token verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired Google token');
    }

    if (!payload || !payload.email) {
      this.logger.warn('Google token verification succeeded but email is missing');
      throw new UnauthorizedException('Google account does not provide an email address');
    }

    if (!payload.email_verified) {
      this.logger.warn(`Google token email is not verified: ${payload.email}`);
      throw new UnauthorizedException('Google email address is not verified');
    }

    const { email, sub: googleId, name, picture } = payload;
    this.logger.log(`Google token verified successfully for email: ${email}`);

    // Upsert User: check if user exists by googleId or email
    let user = await this.userRepository.findOne({
      where: [{ googleId }, { email }],
    });

    if (!user) {
      this.logger.log(`Creating new user account for: ${email}`);
      user = this.userRepository.create({
        email,
        googleId,
        fullName: name || 'Google Learner',
        avatarUrl: picture,
        role: UserRole.LEARNER,
      });
      await this.userRepository.save(user);
    } else {
      let needsUpdate = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsUpdate = true;
      }
      if (picture && user.avatarUrl !== picture) {
        user.avatarUrl = picture;
        needsUpdate = true;
      }
      if (name && user.fullName !== name) {
        user.fullName = name;
        needsUpdate = true;
      }
      if (needsUpdate) {
        await this.userRepository.save(user);
      }
    }

    // Issue JWT token
    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 7 * 24 * 3600, // 7 days in seconds
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Fetch current authenticated user profile by ID
   */
  async getMe(userId: string): Promise<AuthResponseDto['user']> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User account not found');
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }
}
