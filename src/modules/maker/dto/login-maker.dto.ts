import { IsNotEmpty } from 'class-validator';

export class LoginMakerDto {
  @IsNotEmpty({ message: 'Username atau email wajib diisi' })
  usernameOrEmail: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}
