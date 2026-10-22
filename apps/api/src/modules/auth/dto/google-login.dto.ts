import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsNotEmpty({ message: 'idToken must not be empty' })
  @IsString({ message: 'idToken must be a valid string' })
  idToken: string;
}
