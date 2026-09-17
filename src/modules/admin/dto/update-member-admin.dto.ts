import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMemberAdminDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  nama_member?: string;

  @ApiPropertyOptional({ example: 'Universitas Indonesia' })
  @IsOptional()
  instansi?: string;

  @ApiPropertyOptional({ example: 'Jl. Sudirman No. 123, Jakarta' })
  @IsOptional()
  alamat?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  telp?: string;

  @ApiPropertyOptional({ example: 'PasswordBaru123!', description: 'Kosongkan kalau tidak ingin mengubah password' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'foto-1234567890.jpg' })
  @IsOptional()
  foto?: string;
}
