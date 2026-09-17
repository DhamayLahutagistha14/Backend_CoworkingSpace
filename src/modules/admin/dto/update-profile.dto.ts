import { IsNotEmpty } from 'class-validator';

export class UpdateCoworkingProfileDto {
  @IsNotEmpty({ message: 'Nama coworking wajib diisi' })
  nama_coworking: string;

  @IsNotEmpty({ message: 'Nama pemilik wajib diisi' })
  nama_pemilik: string;

  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  telp: string;

  deskripsi?: string;
  alamat?: string;
}
