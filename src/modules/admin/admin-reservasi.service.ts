import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateStatusDto } from '../reservasi/dto/update-status.dto';
import { toDateOnly, formatDateOnly } from '../../common/utils/date.util';

@Injectable()
export class AdminReservasiService {
  constructor(private prisma: PrismaService) {}

  // Hanya boleh mengakses reservasi milik space yang dimiliki admin ini.
  private async getOwnedReservasiOrFail(makerId: number, ownerId: number, id: number) {
    const reservasi = await this.prisma.reservasi.findFirst({
      where: { id, maker_id: makerId },
      include: { space: true, member: true },
    });
    if (!reservasi || reservasi.space?.id_owner !== ownerId) {
      throw new NotFoundException('Reservasi tidak ditemukan!');
    }
    return reservasi;
  }

  async findAll(
    makerId: number,
    ownerId: number,
    filters: {
      month?: number;
      year?: number;
      status?: string;
      id_space?: number;
      tanggal?: string;
    },
  ) {
    const list = await this.prisma.reservasi.findMany({
      where: {
        maker_id: makerId,
        space: { id_owner: ownerId },
        ...(filters.status ? { status: filters.status as any } : {}),
        ...(filters.id_space ? { id_space: filters.id_space } : {}),
        ...(filters.tanggal ? { tanggal_reservasi: toDateOnly(filters.tanggal) } : {}),
      },
      include: { member: true, space: true },
      orderBy: { tanggal_reservasi: 'desc' },
    });

    // Filter bulan/tahun dilakukan di level aplikasi karena jam_mulai/jam_selesai
    // disimpan sebagai string, sementara tanggal_reservasi tetap DateTime.
    const filtered = list.filter((r) => {
      const d = new Date(r.tanggal_reservasi);
      const matchMonth = filters.month ? d.getUTCMonth() + 1 === filters.month : true;
      const matchYear = filters.year ? d.getUTCFullYear() === filters.year : true;
      return matchMonth && matchYear;
    });

    return {
      data: filtered.map((r) => ({
        ...r,
        tanggal_reservasi: formatDateOnly(r.tanggal_reservasi),
      })),
    };
  }

  async updateStatus(makerId: number, ownerId: number, id: number, dto: UpdateStatusDto) {
    await this.getOwnedReservasiOrFail(makerId, ownerId, id);
    const updated = await this.prisma.reservasi.update({
      where: { id },
      data: { status: dto.status as any },
    });

    return {
      message: `Status reservasi berhasil diperbarui menjadi ${dto.status}`,
      data: { id: updated.id, status: updated.status, updated_at: updated.updated_at },
    };
  }

  async checkIn(makerId: number, ownerId: number, id: number) {
    const reservasi = await this.getOwnedReservasiOrFail(makerId, ownerId, id);
    if (reservasi.status !== 'disetujui') {
      throw new BadRequestException(
        'Reservasi harus berstatus "disetujui" sebelum bisa check-in!',
      );
    }
    const updated = await this.prisma.reservasi.update({
      where: { id },
      data: { status: 'aktif', check_in_time: new Date() },
    });

    return {
      message: 'Check-in member berhasil! Status reservasi aktif.',
      data: { id: updated.id, status: updated.status, check_in_time: updated.check_in_time },
    };
  }

  async checkOut(makerId: number, ownerId: number, id: number) {
    const reservasi = await this.getOwnedReservasiOrFail(makerId, ownerId, id);
    if (reservasi.status !== 'aktif') {
      throw new BadRequestException(
        'Reservasi harus berstatus "aktif" sebelum bisa check-out!',
      );
    }
    const updated = await this.prisma.reservasi.update({
      where: { id },
      data: { status: 'selesai', check_out_time: new Date() },
    });

    return {
      message: 'Check-out member berhasil! Reservasi telah selesai.',
      data: { id: updated.id, status: updated.status, check_out_time: updated.check_out_time },
    };
  }
}
