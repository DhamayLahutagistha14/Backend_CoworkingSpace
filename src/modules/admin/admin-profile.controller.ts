import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AdminProfileService } from './admin-profile.service';
import { UpdateCoworkingProfileDto } from './dto/update-profile.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('6. Admin - Profil Lokasi')
@ApiSecurity('x-maker-key')
@ApiBearerAuth('bearer')
@Controller('admin/profile')
@UseGuards(MakerKeyGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin_space)
export class AdminProfileController {
  constructor(private readonly service: AdminProfileService) {}

  // GET /api/admin/profile
  @ApiOperation({ summary: 'Lihat profil lokasi coworking space milik Admin yang login' })
  @Get()
  get(@Req() req: any) {
    return this.service.getProfile(req.user.ownerId);
  }

  // PUT /api/admin/profile
  @ApiOperation({ summary: 'Update profil lokasi coworking space' })
  @Put()
  update(@Req() req: any, @Body() dto: UpdateCoworkingProfileDto) {
    return this.service.updateProfile(req.user.ownerId, dto);
  }
}
