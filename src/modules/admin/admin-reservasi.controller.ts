import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { AdminReservasiService } from './admin-reservasi.service';
import { UpdateStatusDto } from '../reservasi/dto/update-status.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('10. Admin - Kelola Reservasi')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('admin/reservasi')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin_space)
export class AdminReservasiController {
  constructor(private readonly service: AdminReservasiService) {}

  // GET /api/admin/reservasi?month=&year=&status=&id_space=&tanggal=
  @ApiOperation({ summary: 'Lihat semua reservasi di lokasi ini, dengan berbagai filter' })
  @ApiQuery({ name: 'month', required: false, example: 9 })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @ApiQuery({ name: 'status', required: false, enum: ['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'] })
  @ApiQuery({ name: 'id_space', required: false, example: 1 })
  @ApiQuery({ name: 'tanggal', required: false, example: '2026-10-01' })
  @Get()
  findAll(
    @MakerId() makerId: number,
    @Req() req: any,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
    @Query('id_space') id_space?: string,
    @Query('tanggal') tanggal?: string,
  ) {
    return this.service.findAll(makerId, req.user.ownerId, {
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      status,
      id_space: id_space ? Number(id_space) : undefined,
      tanggal,
    });
  }

  // PATCH /api/admin/reservasi/:id/status
  @ApiOperation({ summary: 'Ubah status reservasi (misal: setujui atau tolak)' })
  @Patch(':id/status')
  updateStatus(
    @MakerId() makerId: number,
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.service.updateStatus(makerId, req.user.ownerId, Number(id), dto);
  }

  // POST /api/admin/reservasi/:id/check-in
  @ApiOperation({ summary: 'Check-in tamu yang sudah disetujui (mulai memakai space)' })
  @Post(':id/check-in')
  checkIn(@MakerId() makerId: number, @Req() req: any, @Param('id') id: string) {
    return this.service.checkIn(makerId, req.user.ownerId, Number(id));
  }

  // POST /api/admin/reservasi/:id/check-out
  @ApiOperation({ summary: 'Check-out tamu (selesai memakai space)' })
  @Post(':id/check-out')
  checkOut(@MakerId() makerId: number, @Req() req: any, @Param('id') id: string) {
    return this.service.checkOut(makerId, req.user.ownerId, Number(id));
  }
}
