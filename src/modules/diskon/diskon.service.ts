import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CheckPromoDto } from './dto/check-promo.dto';

@Injectable()
export class DiskonService {
  constructor(private prisma: PrismaService) {}

  async active(makerId: number) {
    const now = new Date();
    const list = await this.prisma.diskon.findMany({
      where: {
        maker_id: makerId,
        tanggal_awal: { lte: now },
        tanggal_akhir: { gte: now },
      },
    });
    return { data: list };
  }

  async check(makerId: number, dto: CheckPromoDto) {
    const diskon = await this.prisma.diskon.findFirst({
      where: { nama_diskon: dto.nama_diskon, maker_id: makerId },
    });

    const now = new Date();
    const isActive =
      diskon && diskon.tanggal_awal <= now && diskon.tanggal_akhir >= now;

    if (!diskon || !isActive) {
      throw new BadRequestException(
        'Kode promo tidak ditemukan atau sudah kedaluwarsa!',
      );
    }

    return {
      message: 'Kode promo valid dan masih berlaku!',
      data: { ...diskon, is_active: true },
    };
  }

  async findOne(makerId: number, id: number) {
    const diskon = await this.prisma.diskon.findFirst({
      where: { id, maker_id: makerId },
    });
    if (!diskon) throw new NotFoundException('Diskon tidak ditemukan!');
    return { data: diskon };
  }
}
