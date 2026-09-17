import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { toDateOnly } from '../../common/utils/date.util';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  types() {
    return {
      data: [
        {
          tipe: 'desk',
          label: 'Personal Desk',
          deskripsi:
            'Meja kerja individual yang nyaman dengan fasilitas colokan listrik, WiFi kencang, dan air minum.',
        },
        {
          tipe: 'meeting_room',
          label: 'Meeting Room',
          deskripsi:
            'Ruang rapat tertutup dengan fasilitas proyektor/TV LED, whiteboard, sound system, dan AC dingin.',
        },
        {
          tipe: 'private_office',
          label: 'Private Office',
          deskripsi:
            'Ruang kantor privat eksklusif untuk tim kecil hingga menengah dengan akses fleksibel dan keamanan 24 jam.',
        },
      ],
    };
  }

  private mapFoto(space: any) {
    return {
      ...space,
      foto_url: space.foto ? `${BASE_URL}/uploads/spaces/${space.foto}` : null,
    };
  }

  async findAll(makerId: number, tipe?: string, search?: string) {
    const spaces = await this.prisma.space.findMany({
      where: {
        maker_id: makerId,
        ...(tipe ? { tipe: tipe as any } : {}),
        ...(search
          ? {
              OR: [
                { nama_space: { contains: search } },
                { deskripsi: { contains: search } },
              ],
            }
          : {}),
      },
      include: { owner: true },
    });
    return { data: spaces.map((s) => this.mapFoto(s)) };
  }

  async findOne(makerId: number, id: number) {
    const space = await this.prisma.space.findFirst({
      where: { id, maker_id: makerId },
      include: { owner: true },
    });
    if (!space) throw new NotFoundException('Space dengan ID tersebut tidak ditemukan!');
    return { data: this.mapFoto(space) };
  }

  // Menghitung apakah space kosong pada tanggal & jam yang diminta.
  async checkAvailability(
    makerId: number,
    id_space: number,
    tanggal: string,
    jam_mulai: string,
    durasi_jam: number,
  ) {
    if (!id_space || !tanggal || !jam_mulai || !durasi_jam) {
      throw new BadRequestException(
        'Parameter id_space, tanggal, jam_mulai, dan durasi_jam wajib diisi!',
      );
    }

    const space = await this.prisma.space.findFirst({
      where: { id: id_space, maker_id: makerId },
    });
    if (!space) throw new NotFoundException('Space tidak ditemukan!');

    const jamSelesai = this.hitungJamSelesai(jam_mulai, durasi_jam);

    const bentrok = await this.cariJadwalBentrok(id_space, tanggal, jam_mulai, jamSelesai);
    if (bentrok) {
      throw new BadRequestException(
        'Maaf, space sudah terisi atau dibooking pada jam tersebut!',
      );
    }

    return {
      message: 'Space tersedia untuk dipesan pada jadwal yang diminta',
      data: {
        available: true,
        id_space: space.id,
        nama_space: space.nama_space,
        tanggal,
        jam_mulai,
        jam_selesai: jamSelesai,
        durasi_jam,
        harga_per_jam: space.harga_per_jam,
        estimasi_total: space.harga_per_jam * durasi_jam,
      },
    };
  }

  // Ambil semua reservasi aktif di tanggal+space yang sama, lalu cek tabrakan
  // jam di level aplikasi (JS). Ini dipakai bersama oleh SpacesService &
  // ReservasiService supaya logikanya konsisten.
  async cariJadwalBentrok(
    id_space: number,
    tanggal: string,
    jamMulaiBaru: string,
    jamSelesaiBaru: string,
  ) {
    const kandidat = await this.prisma.reservasi.findMany({
      where: {
        id_space,
        tanggal_reservasi: toDateOnly(tanggal),
        status: { not: 'dibatalkan' },
      },
    });

    return kandidat.find(
      (r) => r.jam_mulai < jamSelesaiBaru && r.jam_selesai > jamMulaiBaru,
    );
  }

  hitungJamSelesai(jamMulai: string, durasiJam: number): string {
    const [h, m] = jamMulai.split(':').map(Number);
    const totalMenit = h * 60 + m + durasiJam * 60;
    const jamAkhir = Math.floor(totalMenit / 60) % 24;
    const menitAkhir = totalMenit % 60;
    return `${String(jamAkhir).padStart(2, '0')}:${String(menitAkhir).padStart(2, '0')}`;
  }
}
