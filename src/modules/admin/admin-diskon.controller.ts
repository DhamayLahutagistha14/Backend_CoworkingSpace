import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AdminDiskonService } from './admin-diskon.service';
import { CreateDiskonDto } from '../diskon/dto/create-diskon.dto';
import { UpdateDiskonDto } from '../diskon/dto/update-diskon.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('9. Admin - Diskon & Promo')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('admin/diskon')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin_space)
export class AdminDiskonController {
  constructor(private readonly service: AdminDiskonService) {}

  // GET /api/admin/diskon
  @ApiOperation({ summary: 'Lihat semua kode promo milik coworking space ini' })
  @Get()
  findAll(@MakerId() makerId: number) {
    return this.service.findAll(makerId);
  }

  // POST /api/admin/diskon
  @ApiOperation({ summary: 'Tambah kode promo baru' })
  @Post()
  create(@MakerId() makerId: number, @Body() dto: CreateDiskonDto) {
    return this.service.create(makerId, dto);
  }

  // GET /api/admin/diskon/:id
  @ApiOperation({ summary: 'Lihat detail satu kode promo' })
  @Get(':id')
  findOne(@MakerId() makerId: number, @Param('id') id: string) {
    return this.service.findOne(makerId, Number(id));
  }

  // PUT /api/admin/diskon/:id
  @ApiOperation({ summary: 'Update kode promo' })
  @Put(':id')
  update(
    @MakerId() makerId: number,
    @Param('id') id: string,
    @Body() dto: UpdateDiskonDto,
  ) {
    return this.service.update(makerId, Number(id), dto);
  }

  // DELETE /api/admin/diskon/:id
  @ApiOperation({ summary: 'Hapus kode promo' })
  @Delete(':id')
  remove(@MakerId() makerId: number, @Param('id') id: string) {
    return this.service.remove(makerId, Number(id));
  }
}
