import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ReservasiService } from './reservasi.service';
import { CreateReservasiDto } from './dto/create-reservasi.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('5. Reservasi (Member)')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('reservasi')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
export class ReservasiController {
  constructor(private readonly reservasiService: ReservasiService) {}

  // POST /api/reservasi - Member
  @ApiOperation({ summary: 'Buat reservasi/booking space baru (Member)' })
  @Roles(UserRole.member)
  @Post()
  create(
    @MakerId() makerId: number,
    @Req() req: any,
    @Body() dto: CreateReservasiDto,
  ) {
    return this.reservasiService.create(makerId, req.user.memberId, dto);
  }

  // GET /api/reservasi/my - Member
  @ApiOperation({ summary: 'Lihat semua reservasi milik saya (Member yang login)' })
  @Roles(UserRole.member)
  @Get('my')
  findMy(@MakerId() makerId: number, @Req() req: any) {
    return this.reservasiService.findMy(makerId, req.user.memberId);
  }

  // GET /api/reservasi/my/history?month=&year= - Member
  @ApiOperation({ summary: 'Lihat histori reservasi saya per bulan/tahun' })
  @ApiQuery({ name: 'month', required: false, example: 9 })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @Roles(UserRole.member)
  @Get('my/history')
  findMyHistory(
    @MakerId() makerId: number,
    @Req() req: any,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.reservasiService.findMyHistory(
      makerId,
      req.user.memberId,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }

  // GET /api/reservasi/:id/e-ticket - Member/Admin
  @ApiOperation({ summary: 'Lihat e-ticket/bukti reservasi (berisi QR code untuk check-in)' })
  @Get(':id/e-ticket')
  eTicket(@MakerId() makerId: number, @Param('id') id: string, @Req() req: any) {
    return this.reservasiService.eTicket(makerId, Number(id), req.user);
  }

  // GET /api/reservasi/:id - Member/Admin
  @ApiOperation({ summary: 'Lihat detail satu reservasi berdasarkan ID' })
  @Get(':id')
  findOne(@MakerId() makerId: number, @Param('id') id: string, @Req() req: any) {
    return this.reservasiService.findOne(makerId, Number(id), req.user);
  }

  // PATCH /api/reservasi/:id/cancel - Member
  @ApiOperation({ summary: 'Batalkan reservasi milik saya sendiri (Member)' })
  @Roles(UserRole.member)
  @Patch(':id/cancel')
  cancel(@MakerId() makerId: number, @Param('id') id: string, @Req() req: any) {
    return this.reservasiService.cancel(makerId, Number(id), req.user);
  }
}
