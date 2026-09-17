import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckPromoDto {
  @ApiProperty({ example: 'DISKONHEMAT20' })
  @IsNotEmpty({ message: 'Kode diskon wajib diisi' })
  nama_diskon: string;
}
