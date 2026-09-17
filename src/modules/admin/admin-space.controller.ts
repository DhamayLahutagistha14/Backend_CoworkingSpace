import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AdminSpaceService } from './admin-space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('8. Admin - Data Space')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('admin/spaces')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin_space)
export class AdminSpaceController {
  constructor(private readonly service: AdminSpaceService) {}

  // GET /api/admin/spaces
  @ApiOperation({ summary: 'Lihat semua space milik coworking space ini' })
  @Get()
  findAll(@MakerId() makerId: number, @Req() req: any) {
    return this.service.findAll(makerId, req.user.ownerId);
  }

  // POST /api/admin/spaces
  @ApiOperation({ summary: 'Tambah space/ruangan baru' })
  @Post()
  create(@MakerId() makerId: number, @Req() req: any, @Body() dto: CreateSpaceDto) {
    return this.service.create(makerId, req.user.ownerId, dto);
  }

  // GET /api/admin/spaces/:id
  @ApiOperation({ summary: 'Lihat detail satu space' })
  @Get(':id')
  findOne(@MakerId() makerId: number, @Req() req: any, @Param('id') id: string) {
    return this.service.findOne(makerId, req.user.ownerId, Number(id));
  }

  // PUT /api/admin/spaces/:id
  @ApiOperation({ summary: 'Update data space' })
  @Put(':id')
  update(
    @MakerId() makerId: number,
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSpaceDto,
  ) {
    return this.service.update(makerId, req.user.ownerId, Number(id), dto);
  }

  // DELETE /api/admin/spaces/:id
  @ApiOperation({ summary: 'Hapus space' })
  @Delete(':id')
  remove(@MakerId() makerId: number, @Req() req: any, @Param('id') id: string) {
    return this.service.remove(makerId, req.user.ownerId, Number(id));
  }
}
