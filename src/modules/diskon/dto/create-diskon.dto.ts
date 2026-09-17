import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateDiskonDto {
  @IsNotEmpty({ message: 'Nama/kode diskon wajib diisi' })
  nama_diskon: string;

  @IsNumber({}, { message: 'Persentase diskon harus berupa angka' })
  @Min(1, { message: 'Persentase diskon minimal 1' })
  @Max(100, { message: 'Persentase diskon maksimal 100' })
  persentase_diskon: number;

  @IsNotEmpty({ message: 'Tanggal awal wajib diisi' })
  tanggal_awal: string;

  @IsNotEmpty({ message: 'Tanggal akhir wajib diisi' })
  tanggal_akhir: string;
}
