import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginMakerDto {
  @ApiProperty({ example: 'budisantoso' })
  @IsNotEmpty({ message: 'Username atau email wajib diisi' })
  usernameOrEmail: string;

  @ApiProperty({ example: 'Password123!' })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}
