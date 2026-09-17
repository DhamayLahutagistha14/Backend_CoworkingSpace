import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAdminSpaceDto {
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsNotEmpty({ message: 'Nama coworking wajib diisi' })
  nama_coworking: string;

  @IsNotEmpty({ message: 'Nama pemilik wajib diisi' })
  nama_pemilik: string;

  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  telp: string;
}
