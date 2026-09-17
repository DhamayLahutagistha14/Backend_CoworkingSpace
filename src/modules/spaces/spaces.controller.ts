import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('3. Spaces (Katalog & Ketersediaan)')
@ApiSecurity('x-maker-key')
@Controller('spaces')
@UseGuards(MakerKeyGuard)
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  // GET /api/spaces/types
  @ApiOperation({ summary: 'Lihat daftar tipe space yang tersedia (desk, meeting_room, private_office)' })
  @Get('types')
  types() {
    return this.spacesService.types();
  }

  // GET /api/spaces/availability?id_space=&tanggal=&jam_mulai=&durasi_jam=
  @ApiOperation({ summary: 'Cek apakah sebuah space kosong pada tanggal & jam tertentu' })
  @ApiQuery({ name: 'id_space', example: 1 })
  @ApiQuery({ name: 'tanggal', example: '2026-10-01', description: 'Format YYYY-MM-DD' })
  @ApiQuery({ name: 'jam_mulai', example: '09:00', description: 'Format HH:mm' })
  @ApiQuery({ name: 'durasi_jam', example: 2 })
  @Get('availability')
  availability(
    @MakerId() makerId: number,
    @Query('id_space') id_space: string,
    @Query('tanggal') tanggal: string,
    @Query('jam_mulai') jam_mulai: string,
    @Query('durasi_jam') durasi_jam: string,
  ) {
    return this.spacesService.checkAvailability(
      makerId,
      Number(id_space),
      tanggal,
      jam_mulai,
      Number(durasi_jam),
    );
  }

  // GET /api/spaces?tipe=&search=
  @ApiOperation({ summary: 'Lihat katalog semua space, bisa difilter tipe/kata kunci' })
  @ApiQuery({ name: 'tipe', required: false, enum: ['desk', 'meeting_room', 'private_office'] })
  @ApiQuery({ name: 'search', required: false, example: 'Personal Desk' })
  @Get()
  findAll(
    @MakerId() makerId: number,
    @Query('tipe') tipe?: string,
    @Query('search') search?: string,
  ) {
    return this.spacesService.findAll(makerId, tipe, search);
  }

  // GET /api/spaces/:id
  @ApiOperation({ summary: 'Lihat detail satu space berdasarkan ID' })
  @Get(':id')
  findOne(@MakerId() makerId: number, @Param('id') id: string) {
    return this.spacesService.findOne(makerId, Number(id));
  }
}
