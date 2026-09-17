import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminReportService {
  constructor(private prisma: PrismaService) {}

  async monthly(makerId: number, ownerId: number, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const all = await this.prisma.reservasi.findMany({
      where: {
        maker_id: makerId,
        space: { id_owner: ownerId },
        status: { not: 'dibatalkan' },
      },
      include: { space: true },
    });

    const items = all.filter((r) => {
      const d = new Date(r.tanggal_reservasi);
      return d.getUTCMonth() + 1 === targetMonth && d.getUTCFullYear() === targetYear;
    });

    const total_transaksi = items.length;
    const total_jam_terpakai = items.reduce((s, r) => s + r.durasi_jam, 0);
    const estimasi_pendapatan_kotor = items.reduce(
      (s, r) => s + Number(r.total_harga_awal),
      0,
    );
    const total_potongan_diskon = items.reduce(
      (s, r) => s + Number(r.potongan_diskon),
      0,
    );
    const realisasi_pendapatan_bersih = items.reduce(
      (s, r) => s + Number(r.total_bayar),
      0,
    );

    const tipeList = ['desk', 'meeting_room', 'private_office'];
    const labelMap: Record<string, string> = {
      desk: 'Personal Desk',
      meeting_room: 'Meeting Room',
      private_office: 'Private Office',
    };

    const rincian_per_tipe_space = tipeList.map((tipe) => {
      const subset = items.filter((r) => r.space?.tipe === tipe);
      return {
        tipe,
        label: labelMap[tipe],
        total_booking: subset.length,
        total_jam: subset.reduce((s, r) => s + r.durasi_jam, 0),
        total_pendapatan: subset.reduce((s, r) => s + Number(r.total_bayar), 0),
      };
    });

    return {
      data: {
        month: targetMonth,
        year: targetYear,
        total_transaksi,
        total_jam_terpakai,
        estimasi_pendapatan_kotor,
        total_potongan_diskon,
        realisasi_pendapatan_bersih,
        rincian_per_tipe_space,
      },
    };
  }

  async income(makerId: number, ownerId: number, month?: number, year?: number) {
    const full = await this.monthly(makerId, ownerId, month, year);
    return {
      data: {
        month: full.data.month,
        year: full.data.year,
        realisasi_pendapatan_bersih: full.data.realisasi_pendapatan_bersih,
      },
    };
  }
}
