import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}
