import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { AdminMemberService } from './admin-member.service';
import { CreateMemberAdminDto } from './dto/create-member-admin.dto';
import { UpdateMemberAdminDto } from './dto/update-member-admin.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('7. Admin - Data Member')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('admin/members')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin_space)
export class AdminMemberController {
  constructor(private readonly service: AdminMemberService) {}

  // GET /api/admin/members?search=
  @ApiOperation({ summary: 'Lihat semua member, bisa dicari lewat kata kunci' })
  @ApiQuery({ name: 'search', required: false, example: 'John' })
  @Get()
  findAll(@MakerId() makerId: number, @Query('search') search?: string) {
    return this.service.findAll(makerId, search);
  }

  // POST /api/admin/members
  @ApiOperation({ summary: 'Tambah member baru (dibuatkan oleh Admin)' })
  @Post()
  create(@MakerId() makerId: number, @Body() dto: CreateMemberAdminDto) {
    return this.service.create(makerId, dto);
  }

  // GET /api/admin/members/:id
  @ApiOperation({ summary: 'Lihat detail satu member' })
  @Get(':id')
  findOne(@MakerId() makerId: number, @Param('id') id: string) {
    return this.service.findOne(makerId, Number(id));
  }

  // PUT /api/admin/members/:id
  @ApiOperation({ summary: 'Update data member' })
  @Put(':id')
  update(
    @MakerId() makerId: number,
    @Param('id') id: string,
    @Body() dto: UpdateMemberAdminDto,
  ) {
    return this.service.update(makerId, Number(id), dto);
  }

  // DELETE /api/admin/members/:id
  @ApiOperation({ summary: 'Hapus member' })
  @Delete(':id')
  remove(@MakerId() makerId: number, @Param('id') id: string) {
    return this.service.remove(makerId, Number(id));
  }
}
