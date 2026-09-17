import { IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemberAdminDto {
  @ApiProperty({ example: 'janedoe' })
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @ApiProperty({ example: 'Secret123!', minLength: 6 })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  nama_member: string;

  @ApiProperty({ example: 'Universitas Indonesia' })
  @IsNotEmpty({ message: 'Instansi wajib diisi' })
  instansi: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 123, Jakarta' })
  @IsNotEmpty({ message: 'Alamat wajib diisi' })
  alamat: string;

  @ApiProperty({ example: '081234567890' })
  @IsNotEmpty({ message: 'Telepon wajib diisi' })
  telp: string;

  @ApiPropertyOptional({ example: 'foto-1234567890.jpg' })
  @IsOptional()
  foto?: string;
}
