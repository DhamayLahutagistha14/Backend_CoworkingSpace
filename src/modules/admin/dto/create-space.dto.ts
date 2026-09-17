import { IsNotEmpty, IsNumber, IsIn, IsOptional, Min } from 'class-validator';

export class CreateSpaceDto {
  @IsNotEmpty({ message: 'Nama space wajib diisi' })
  nama_space: string;

  @IsNumber({}, { message: 'Harga per jam harus berupa angka' })
  @Min(0)
  harga_per_jam: number;

  @IsIn(['desk', 'meeting_room', 'private_office'], {
    message: 'Tipe harus salah satu dari: desk, meeting_room, private_office',
  })
  tipe: string;

  @IsNumber({}, { message: 'Kapasitas harus berupa angka' })
  @Min(1)
  kapasitas: number;

  @IsNotEmpty({ message: 'Deskripsi wajib diisi' })
  deskripsi: string;

  @IsOptional()
  foto?: string;
}
