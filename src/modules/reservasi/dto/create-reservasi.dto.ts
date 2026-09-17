import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateReservasiDto {
  @IsNumber({}, { message: 'id_space harus berupa angka' })
  id_space: number;

  @IsNotEmpty({ message: 'Tanggal reservasi wajib diisi (format YYYY-MM-DD)' })
  tanggal_reservasi: string;

  @IsNotEmpty({ message: 'Jam mulai wajib diisi (format HH:mm)' })
  jam_mulai: string;

  @IsNumber({}, { message: 'Durasi jam harus berupa angka' })
  @Min(1, { message: 'Durasi jam minimal 1 jam' })
  durasi_jam: number;

  @IsOptional()
  @IsNumber()
  id_diskon?: number;

  @IsOptional()
  kode_promo?: string;
}
