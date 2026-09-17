import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminSpaceDto {
  @ApiProperty({ example: 'adminspace1' })
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @ApiProperty({ example: 'Admin123!', minLength: 6 })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ example: 'Moklet Hub Coworking' })
  @IsNotEmpty({ message: 'Nama coworking wajib diisi' })
  nama_coworking: string;

  @ApiProperty({ example: 'Ahmad Bidin' })
  @IsNotEmpty({ message: 'Nama pemilik wajib diisi' })
  nama_pemilik: string;

  @ApiProperty({ example: '081298765432' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  telp: string;
}
