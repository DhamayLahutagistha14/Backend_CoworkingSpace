import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('0. Root & Health Check')
@Controller()
export class RootController {
  // GET / - Status API & Petunjuk Penggunaan
  @ApiOperation({ summary: 'Info dasar tentang API ini' })
  @Get()
  root() {
    return {
      data: {
        name: 'Coworking Space Backend API - UKK RPL Paket B',
        version: '1.0.0',
        status: 'online',
        description:
          'Backend service Sistem Reservasi Coworking Space untuk UKK RPL - SMK Telkom Malang.',
      },
    };
  }

  // GET /health - Health Check Server
  @ApiOperation({ summary: 'Cek apakah server sedang hidup' })
  @Get('health')
  health() {
    return { data: { status: 'ok' } };
  }
}
