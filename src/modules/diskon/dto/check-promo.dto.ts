import { IsNotEmpty } from 'class-validator';

export class CheckPromoDto {
  @IsNotEmpty({ message: 'Kode diskon wajib diisi' })
  nama_diskon: string;
}
