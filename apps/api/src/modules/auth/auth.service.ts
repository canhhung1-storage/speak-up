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
import { randomUUID } from 'crypto';
import { User, UserRole } from '../../database/entities/user.entity';
import { RedisService } from '../../common/redis/redis.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';

interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  familyId: string;
  type: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;
  private readonly refreshSecret: string;
  private readonly ACCESS_TOKEN_TTL = 900; // 15 minutes in seconds
  private readonly REFRESH_TOKEN_TTL = 7 * 24 * 3600; // 7 days in seconds

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.googleClientId =
      this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
    this.googleClient = new OAuth2Client(this.googleClientId);
    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      (this.configService.get<string>('JWT_SECRET', 'speakup_super_secret_jwt_key_2026') + '_refresh');
  }

  /**
   * Verify Google ID token, upsert user in database, and issue Dual Tokens (Access + Refresh)
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

    // Issue Dual Tokens (Access 15m + Refresh 7d stored in Redis)
    return this.generateTokens(user);
  }

  /**
   * Rotate Refresh Token and issue new Access Token + Refresh Token
   */
  async refreshTokens(refreshTokenString: string): Promise<AuthResponseDto> {
    if (!refreshTokenString) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(refreshTokenString, {
        secret: this.refreshSecret,
      });
    } catch (err: any) {
      this.logger.warn(`Refresh token cryptographic verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh' || !payload.tokenId || !payload.sub) {
      throw new UnauthorizedException('Malformed refresh token');
    }

    const redisKey = `auth:refresh:${payload.sub}:${payload.tokenId}`;
    const tokenRecord = await this.redisService.get(redisKey);

    // REUSE DETECTION: If token signature is valid but key is missing from Redis,
    // this token was already rotated or revoked! Purge all sessions to protect user.
    if (!tokenRecord) {
      this.logger.error(
        `🚨 SECURITY ALERT: Refresh token reuse detected for user ${payload.sub} (tokenId: ${payload.tokenId}). Purging all active sessions!`,
      );
      await this.revokeAllUserSessions(payload.sub);
      throw new UnauthorizedException('Security alert: Refresh token reuse detected. All sessions terminated.');
    }

    // Token is valid: Revoke old token immediately (Rotation)
    await this.redisService.del(redisKey);

    // Retrieve user
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User account no longer exists');
    }

    // Issue new dual tokens with the same familyId
    this.logger.log(`Rotating refresh token for user ${user.email} (family: ${payload.familyId})`);
    return this.generateTokens(user, payload.familyId);
  }

  /**
   * Invalidate refresh token session in Redis
   */
  async logout(refreshTokenString?: string): Promise<{ success: boolean; message: string }> {
    if (refreshTokenString) {
      try {
        const decoded = this.jwtService.decode(refreshTokenString) as any;
        if (decoded?.sub && decoded?.tokenId) {
          const redisKey = `auth:refresh:${decoded.sub}:${decoded.tokenId}`;
          await this.redisService.del(redisKey);
          this.logger.log(`Session revoked in Redis for user: ${decoded.sub}`);
        }
      } catch (err: any) {
        this.logger.warn(`Could not parse refresh token on logout: ${err.message}`);
      }
    }
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Revoke all active sessions for a user in Redis
   */
  async revokeAllUserSessions(userId: string): Promise<number> {
    const pattern = `auth:refresh:${userId}:*`;
    const deletedCount = await this.redisService.delPattern(pattern);
    this.logger.log(`Purged ${deletedCount} active sessions for user ${userId}`);
    return deletedCount;
  }

  /**
   * Generate Access Token (15m) + Refresh Token (7d) and store session in Redis
   */
  private async generateTokens(user: User, existingFamilyId?: string): Promise<AuthResponseDto> {
    const tokenId = randomUUID();
    const familyId = existingFamilyId || randomUUID();

    // 1. Access Token (15m)
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
    });

    // 2. Refresh Token (7d)
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      tokenId,
      familyId,
      type: 'refresh',
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.refreshSecret,
      expiresIn: '7d',
    });

    // 3. Store in Redis with 7-day TTL
    const redisKey = `auth:refresh:${user.id}:${tokenId}`;
    const sessionData = JSON.stringify({
      familyId,
      createdAt: Date.now(),
    });
    await this.redisService.set(redisKey, sessionData, this.REFRESH_TOKEN_TTL);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.ACCESS_TOKEN_TTL,
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
  async getMe(userId: string): Promise<AuthUserDto> {
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
