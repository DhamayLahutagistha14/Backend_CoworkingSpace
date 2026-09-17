import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterMakerDto {
  @IsNotEmpty({ message: 'Nama wajib diisi' })
  name: string;

  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
