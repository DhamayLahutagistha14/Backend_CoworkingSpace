import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'disetujui',
    enum: ['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'],
  })
  @IsNotEmpty({ message: 'Status wajib diisi' })
  @IsIn(['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'], {
    message:
      'Status harus salah satu dari: belum_dikonfirm, disetujui, aktif, selesai, dibatalkan',
  })
  status: string;
}
