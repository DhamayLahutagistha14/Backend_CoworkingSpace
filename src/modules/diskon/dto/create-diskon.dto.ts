import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiskonDto {
  @ApiProperty({ example: 'DISKONHEMAT20' })
  @IsNotEmpty({ message: 'Nama/kode diskon wajib diisi' })
  nama_diskon: string;

  @ApiProperty({ example: 20, minimum: 1, maximum: 100 })
  @IsNumber({}, { message: 'Persentase diskon harus berupa angka' })
  @Min(1, { message: 'Persentase diskon minimal 1' })
  @Max(100, { message: 'Persentase diskon maksimal 100' })
  persentase_diskon: number;

  @ApiProperty({ example: '2026-10-01T00:00:00.000Z' })
  @IsNotEmpty({ message: 'Tanggal awal wajib diisi' })
  tanggal_awal: string;

  @ApiProperty({ example: '2026-10-31T23:59:59.000Z' })
  @IsNotEmpty({ message: 'Tanggal akhir wajib diisi' })
  tanggal_akhir: string;
}
