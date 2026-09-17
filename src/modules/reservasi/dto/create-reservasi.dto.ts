import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservasiDto {
  @ApiProperty({ example: 1, description: 'ID space yang mau dipesan' })
  @IsNumber({}, { message: 'id_space harus berupa angka' })
  id_space: number;

  @ApiProperty({ example: '2026-10-01', description: 'Format YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Tanggal reservasi wajib diisi (format YYYY-MM-DD)' })
  tanggal_reservasi: string;

  @ApiProperty({ example: '09:00', description: 'Format HH:mm' })
  @IsNotEmpty({ message: 'Jam mulai wajib diisi (format HH:mm)' })
  jam_mulai: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsNumber({}, { message: 'Durasi jam harus berupa angka' })
  @Min(1, { message: 'Durasi jam minimal 1 jam' })
  durasi_jam: number;

  @ApiPropertyOptional({ example: 1, description: 'Opsional, ID kode diskon (kalau tahu ID-nya)' })
  @IsOptional()
  @IsNumber()
  id_diskon?: number;

  @ApiPropertyOptional({ example: 'DISKONHEMAT20', description: 'Opsional, kode promo/diskon' })
  @IsOptional()
  kode_promo?: string;
}
