import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAdminSpaceDto } from './dto/register-admin-space.dto';
import { LoginDto } from './dto/login.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('2. Autentikasi (Member & Admin Space)')
@ApiSecurity('x-maker-key')
@Controller('auth')
@UseGuards(MakerKeyGuard) // semua endpoint di sini wajib header x-maker-key
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register/member
  @ApiOperation({ summary: 'Registrasi akun baru sebagai Member/pelanggan' })
  @Post('register/member')
  registerMember(@MakerId() makerId: number, @Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(makerId, dto);
  }

  // POST /api/auth/register/admin-space
  @ApiOperation({ summary: 'Registrasi akun baru sebagai Admin pengelola coworking space' })
  @Post('register/admin-space')
  registerAdminSpace(
    @MakerId() makerId: number,
    @Body() dto: RegisterAdminSpaceDto,
  ) {
    return this.authService.registerAdminSpace(makerId, dto);
  }

  // POST /api/auth/login
  @ApiOperation({ summary: 'Login untuk Member maupun Admin Space (satu endpoint untuk keduanya)' })
  @Post('login')
  login(@MakerId() makerId: number, @Body() dto: LoginDto) {
    return this.authService.login(makerId, dto);
  }

  // GET /api/auth/profile
  @ApiOperation({ summary: 'Lihat profil akun yang sedang login (Member/Admin Space)' })
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return this.authService.profile(req.user.id);
  }
}
