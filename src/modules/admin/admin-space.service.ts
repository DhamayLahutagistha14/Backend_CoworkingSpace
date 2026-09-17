import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

@Injectable()
export class AdminSpaceService {
  constructor(private prisma: PrismaService) {}

  private mapFoto(space: any) {
    return {
      ...space,
      foto_url: space.foto ? `${BASE_URL}/uploads/spaces/${space.foto}` : null,
    };
  }

  async findAll(makerId: number, ownerId: number) {
    const list = await this.prisma.space.findMany({
      where: { maker_id: makerId, id_owner: ownerId },
      orderBy: { id: 'desc' },
    });
    return { data: list.map((s) => this.mapFoto(s)) };
  }

  async create(makerId: number, ownerId: number, dto: CreateSpaceDto) {
    const space = await this.prisma.space.create({
      data: {
        nama_space: dto.nama_space,
        harga_per_jam: dto.harga_per_jam,
        tipe: dto.tipe as any,
        kapasitas: dto.kapasitas,
        deskripsi: dto.deskripsi,
        foto: dto.foto || null,
        id_owner: ownerId,
        maker_id: makerId,
      },
    });
    return { message: 'Space baru berhasil ditambahkan!', data: space };
  }

  async findOne(makerId: number, ownerId: number, id: number) {
    const space = await this.prisma.space.findFirst({
      where: { id, maker_id: makerId, id_owner: ownerId },
    });
    if (!space) throw new NotFoundException('Space tidak ditemukan!');
    return { data: this.mapFoto(space) };
  }

  async update(makerId: number, ownerId: number, id: number, dto: UpdateSpaceDto) {
    const space = await this.prisma.space.findFirst({
      where: { id, maker_id: makerId, id_owner: ownerId },
    });
    if (!space) throw new NotFoundException('Space tidak ditemukan!');

    const updated = await this.prisma.space.update({
      where: { id },
      data: dto as any,
    });
    return { message: 'Data space berhasil diperbarui!', data: updated };
  }

  async remove(makerId: number, ownerId: number, id: number) {
    const space = await this.prisma.space.findFirst({
      where: { id, maker_id: makerId, id_owner: ownerId },
    });
    if (!space) throw new NotFoundException('Space tidak ditemukan!');

    await this.prisma.space.delete({ where: { id } });
    return { message: 'Space berhasil dihapus!', data: { id, deleted: true } };
  }
}
