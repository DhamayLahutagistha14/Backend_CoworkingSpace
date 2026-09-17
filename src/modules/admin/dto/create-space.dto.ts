import { IsNotEmpty, IsNumber, IsIn, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Personal Desk Alpha 01' })
  @IsNotEmpty({ message: 'Nama space wajib diisi' })
  nama_space: string;

  @ApiProperty({ example: 25000, minimum: 0 })
  @IsNumber({}, { message: 'Harga per jam harus berupa angka' })
  @Min(0)
  harga_per_jam: number;

  @ApiProperty({ example: 'desk', enum: ['desk', 'meeting_room', 'private_office'] })
  @IsIn(['desk', 'meeting_room', 'private_office'], {
    message: 'Tipe harus salah satu dari: desk, meeting_room, private_office',
  })
  tipe: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsNumber({}, { message: 'Kapasitas harus berupa angka' })
  @Min(1)
  kapasitas: number;

  @ApiProperty({ example: 'WiFi 100Mbps, colokan listrik, air minum gratis' })
  @IsNotEmpty({ message: 'Deskripsi wajib diisi' })
  deskripsi: string;

  @ApiPropertyOptional({ example: 'foto-1234567890.jpg', description: 'Nama file hasil upload dari POST /upload/spaces' })
  @IsOptional()
  foto?: string;
}
