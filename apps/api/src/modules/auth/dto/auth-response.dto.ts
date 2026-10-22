export class AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export class AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUserDto;
}
