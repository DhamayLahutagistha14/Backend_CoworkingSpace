import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateDiskonDto } from '../diskon/dto/create-diskon.dto';
import { UpdateDiskonDto } from '../diskon/dto/update-diskon.dto';

@Injectable()
export class AdminDiskonService {
  constructor(private prisma: PrismaService) {}

  async findAll(makerId: number) {
    const list = await this.prisma.diskon.findMany({
      where: { maker_id: makerId },
      orderBy: { id: 'desc' },
    });
    return { data: list };
  }

  async create(makerId: number, dto: CreateDiskonDto) {
    const diskon = await this.prisma.diskon.create({
      data: {
        nama_diskon: dto.nama_diskon,
        persentase_diskon: dto.persentase_diskon,
        tanggal_awal: new Date(dto.tanggal_awal),
        tanggal_akhir: new Date(dto.tanggal_akhir),
        maker_id: makerId,
      },
    });
    return { message: 'Kode promo baru berhasil dibuat!', data: diskon };
  }

  async findOne(makerId: number, id: number) {
    const diskon = await this.prisma.diskon.findFirst({ where: { id, maker_id: makerId } });
    if (!diskon) throw new NotFoundException('Diskon tidak ditemukan!');
    return { data: diskon };
  }

  async update(makerId: number, id: number, dto: UpdateDiskonDto) {
    const diskon = await this.prisma.diskon.findFirst({ where: { id, maker_id: makerId } });
    if (!diskon) throw new NotFoundException('Diskon tidak ditemukan!');

    const updated = await this.prisma.diskon.update({
      where: { id },
      data: {
        ...(dto.nama_diskon && { nama_diskon: dto.nama_diskon }),
        ...(dto.persentase_diskon && { persentase_diskon: dto.persentase_diskon }),
        ...(dto.tanggal_awal && { tanggal_awal: new Date(dto.tanggal_awal) }),
        ...(dto.tanggal_akhir && { tanggal_akhir: new Date(dto.tanggal_akhir) }),
      },
    });

    return { message: 'Data promo diskon berhasil diperbarui!', data: updated };
  }

  async remove(makerId: number, id: number) {
    const diskon = await this.prisma.diskon.findFirst({ where: { id, maker_id: makerId } });
    if (!diskon) throw new NotFoundException('Diskon tidak ditemukan!');

    await this.prisma.diskon.delete({ where: { id } });
    return { message: 'Kode promo berhasil dihapus!', data: { id, deleted: true } };
  }
}
