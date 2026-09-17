import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCoworkingProfileDto {
  @ApiProperty({ example: 'Moklet Hub Coworking' })
  @IsNotEmpty({ message: 'Nama coworking wajib diisi' })
  nama_coworking: string;

  @ApiProperty({ example: 'Ahmad Bidin' })
  @IsNotEmpty({ message: 'Nama pemilik wajib diisi' })
  nama_pemilik: string;

  @ApiProperty({ example: '081298765432' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  telp: string;

  @ApiPropertyOptional({ example: 'WiFi cepat, AC dingin, parkir luas, keamanan 24 jam' })
  deskripsi?: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No. 45, Malang' })
  alamat?: string;
}
