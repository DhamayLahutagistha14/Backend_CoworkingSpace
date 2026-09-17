import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { AdminReportService } from './admin-report.service';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('11. Admin - Rekapitulasi Laporan')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('admin/reports')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin_space)
export class AdminReportController {
  constructor(private readonly service: AdminReportService) {}

  // GET /api/admin/reports/monthly?month=&year=
  @ApiOperation({ summary: 'Rekap pendapatan bulanan, dirinci per tipe space' })
  @ApiQuery({ name: 'month', required: false, example: 9 })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @Get('monthly')
  monthly(
    @MakerId() makerId: number,
    @Req() req: any,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.service.monthly(
      makerId,
      req.user.ownerId,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }

  // GET /api/admin/reports/income?month=&year=
  @ApiOperation({ summary: 'Ringkasan total pendapatan (versi lebih singkat dari monthly)' })
  @ApiQuery({ name: 'month', required: false, example: 9 })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @Get('income')
  income(
    @MakerId() makerId: number,
    @Req() req: any,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.service.income(
      makerId,
      req.user.ownerId,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }
}
