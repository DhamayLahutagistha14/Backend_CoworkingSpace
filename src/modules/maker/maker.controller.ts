import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { MakerService } from './maker.service';
import { RegisterMakerDto } from './dto/register-maker.dto';
import { LoginMakerDto } from './dto/login-maker.dto';
import { MakerJwtGuard } from '../../common/guards/maker-jwt.guard';
import { MakerFlexibleGuard } from '../../common/guards/maker-flexible.guard';

@ApiTags('1. App Maker (Multi-Tenancy)')
@Controller('maker')
export class MakerController {
  constructor(private readonly makerService: MakerService) {}

  // POST /api/maker/register - Publik
  @ApiOperation({ summary: 'Daftar akun App Maker (siswa) baru, dapat app_key' })
  @Post('register')
  register(@Body() dto: RegisterMakerDto) {
    return this.makerService.register(dto);
  }

  // POST /api/maker/login - Publik
  @ApiOperation({ summary: 'Login akun App Maker yang sudah ada' })
  @Post('login')
  login(@Body() dto: LoginMakerDto) {
    return this.makerService.login(dto);
  }

  // GET /api/maker/me - Wajib Bearer Token App Maker
  @ApiOperation({ summary: 'Lihat profil App Maker yang sedang login' })
  @ApiBearerAuth('bearer')
  @UseGuards(MakerJwtGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.makerService.me(req.user.makerId);
  }

  // GET /api/maker/stats - Bearer Token App Maker ATAU header x-maker-key
  @ApiOperation({ summary: 'Statistik jumlah data milik App Maker ini' })
  @ApiBearerAuth('bearer')
  @ApiSecurity('x-maker-key')
  @UseGuards(MakerFlexibleGuard)
  @Get('stats')
  stats(@Req() req: any) {
    return this.makerService.stats(req.makerId);
  }

  // GET /api/maker/list - Publik (panel guru/penguji)
  @ApiOperation({ summary: 'Lihat daftar semua App Maker terdaftar (untuk guru/penguji)' })
  @Get('list')
  list() {
    return this.makerService.list();
  }
}
