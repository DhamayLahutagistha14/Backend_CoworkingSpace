import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { DiskonService } from './diskon.service';
import { CheckPromoDto } from './dto/check-promo.dto';
import { MakerKeyGuard } from '../../common/guards/maker-key.guard';
import { MakerId } from '../../common/decorators/maker-id.decorator';

@ApiTags('4. Diskon & Promo')
@ApiSecurity('x-maker-key')
@Controller('diskon')
@UseGuards(MakerKeyGuard)
export class DiskonController {
  constructor(private readonly diskonService: DiskonService) {}

  // GET /api/diskon/active
  @ApiOperation({ summary: 'Lihat semua kode promo yang sedang aktif' })
  @Get('active')
  active(@MakerId() makerId: number) {
    return this.diskonService.active(makerId);
  }

  // POST /api/diskon/check
  @ApiOperation({ summary: 'Cek validitas sebuah kode promo' })
  @Post('check')
  check(@MakerId() makerId: number, @Body() dto: CheckPromoDto) {
    return this.diskonService.check(makerId, dto);
  }

  // GET /api/diskon/:id
  @ApiOperation({ summary: 'Lihat detail satu kode promo berdasarkan ID' })
  @Get(':id')
  findOne(@MakerId() makerId: number, @Param('id') id: string) {
    return this.diskonService.findOne(makerId, Number(id));
  }
}
