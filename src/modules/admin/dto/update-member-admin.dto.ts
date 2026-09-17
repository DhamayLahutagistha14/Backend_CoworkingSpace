import { IsOptional } from 'class-validator';

export class UpdateMemberAdminDto {
  @IsOptional()
  nama_member?: string;

  @IsOptional()
  instansi?: string;

  @IsOptional()
  alamat?: string;

  @IsOptional()
  telp?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  foto?: string;
}
