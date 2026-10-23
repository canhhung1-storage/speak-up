import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Google OAuth login endpoint (Hybrid: Web HttpOnly Cookie + Mobile JSON Body).
   * Rate limited to 10 attempts per minute to mitigate brute-force and DoS.
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async googleAuth(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.authenticateWithGoogle(dto);

    // Set HttpOnly Cookie for Web clients
    if (result.refreshToken) {
      this.setRefreshTokenCookie(res, result.refreshToken);
    }

    return result;
  }

  /**
   * Refresh Token rotation endpoint (Hybrid: Reads from Cookie or Body).
   * Rate limited to 30 requests per minute.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async refreshTokens(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    // Hybrid lookup: Read from HttpOnly cookie (Web) or JSON Body (Mobile)
    const token = req.cookies?.['refreshToken'] || dto?.refreshToken;
    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.authService.refreshTokens(token);

    // Rotate HttpOnly Cookie for Web clients
    if (result.refreshToken) {
      this.setRefreshTokenCookie(res, result.refreshToken);
    }

    return result;
  }

  /**
   * Logout endpoint (Purges session from Redis & clears Cookie).
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean; message: string }> {
    const token = req.cookies?.['refreshToken'] || dto?.refreshToken;
    const result = await this.authService.logout(token);

    // Clear HttpOnly Cookie
    res.clearCookie('refreshToken', {
      path: '/api/auth',
      httpOnly: true,
      sameSite: 'lax',
    });

    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: any): Promise<AuthUserDto> {
    return this.authService.getMe(req.user.id);
  }

  /**
   * Helper to set secure HttpOnly cookie for Refresh Token
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 3600 * 1000, // 7 days in milliseconds
    });
  }
}
