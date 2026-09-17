import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMakerDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsNotEmpty({ message: 'Nama wajib diisi' })
  name: string;

  @ApiProperty({ example: 'budisantoso' })
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @ApiProperty({ example: 'budi@smk.sch.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 6 })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
