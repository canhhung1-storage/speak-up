export class AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken?: string; // Optional in response body (for Mobile App / testing)
  tokenType: string;
  expiresIn: number;
  user: AuthUserDto;
}
