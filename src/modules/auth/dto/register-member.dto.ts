import { IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterMemberDto {
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  nama_member: string;

  @IsNotEmpty({ message: 'Instansi wajib diisi' })
  instansi: string;

  @IsNotEmpty({ message: 'Alamat wajib diisi' })
  alamat: string;

  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  telp: string;

  @IsOptional()
  foto?: string;
}
