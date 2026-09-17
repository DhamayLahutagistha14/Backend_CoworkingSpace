import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';
import { CreateReservasiDto } from './dto/create-reservasi.dto';
import { toDateOnly, formatDateOnly } from '../../common/utils/date.util';

@Injectable()
export class ReservasiService {
  constructor(
    private prisma: PrismaService,
    private spacesService: SpacesService,
  ) {}

  // Ubah field tanggal_reservasi (Date object dari Prisma) balik ke
  // string "YYYY-MM-DD" supaya sesuai format Kontrak API.
  private formatReservasi(r: any) {
    return { ...r, tanggal_reservasi: formatDateOnly(r.tanggal_reservasi) };
  }

  // ==================== MEMBER: BUAT RESERVASI ====================
  async create(makerId: number, memberId: number, dto: CreateReservasiDto) {
    const space = await this.prisma.space.findFirst({
      where: { id: dto.id_space, maker_id: makerId },
    });
    if (!space) throw new NotFoundException('Space tidak ditemukan!');

    const jamSelesai = this.spacesService.hitungJamSelesai(
      dto.jam_mulai,
      dto.durasi_jam,
    );

    // Cek bentrok jadwal
    const bentrok = await this.spacesService.cariJadwalBentrok(
      dto.id_space,
      dto.tanggal_reservasi,
      dto.jam_mulai,
      jamSelesai,
    );
    if (bentrok) {
      throw new BadRequestException(
        'Space tidak tersedia pada tanggal dan rentang jam tersebut!',
      );
    }

    // Hitung harga & diskon
    const totalHargaAwal = space.harga_per_jam * dto.durasi_jam;
    let potongan = 0;
    let idDiskonValid: number | null = null;

    const kodeCari = dto.kode_promo || undefined;
    if (dto.id_diskon || kodeCari) {
      const diskon = await this.prisma.diskon.findFirst({
        where: dto.id_diskon
          ? { id: dto.id_diskon, maker_id: makerId }
          : { nama_diskon: kodeCari, maker_id: makerId },
      });
      const now = new Date();
      if (diskon && diskon.tanggal_awal <= now && diskon.tanggal_akhir >= now) {
        potongan = (totalHargaAwal * diskon.persentase_diskon) / 100;
        idDiskonValid = diskon.id;
      }
    }

    const totalBayar = totalHargaAwal - potongan;

    // Buat dulu dengan kode_booking sementara, lalu update begitu tahu ID-nya
    const reservasi = await this.prisma.reservasi.create({
      data: {
        kode_booking: 'TEMP',
        id_member: memberId,
        id_space: dto.id_space,
        id_diskon: idDiskonValid,
        tanggal_reservasi: toDateOnly(dto.tanggal_reservasi),
        jam_mulai: dto.jam_mulai,
        jam_selesai: jamSelesai,
        durasi_jam: dto.durasi_jam,
        harga_per_jam: space.harga_per_jam,
        total_harga_awal: totalHargaAwal,
        potongan_diskon: potongan,
        total_bayar: totalBayar,
        status: 'belum_dikonfirm',
        maker_id: makerId,
      },
    });

    const tanggalRingkas = dto.tanggal_reservasi.replace(/-/g, '');
    const kode_booking = `BOOK-${tanggalRingkas}-${String(reservasi.id).padStart(4, '0')}`;
    const updated = await this.prisma.reservasi.update({
      where: { id: reservasi.id },
      data: { kode_booking },
    });

    return {
      message: 'Reservasi berhasil dibuat! Silakan tunggu konfirmasi admin.',
      data: this.formatReservasi(updated),
    };
  }

  // ==================== MEMBER: DAFTAR RESERVASI SAYA ====================
  async findMy(makerId: number, memberId: number) {
    const list = await this.prisma.reservasi.findMany({
      where: { id_member: memberId, maker_id: makerId },
      include: { space: true },
      orderBy: { created_at: 'desc' },
    });
    return { data: list.map((r) => this.formatReservasi(r)) };
  }

  // ==================== MEMBER: HISTORI PER BULAN ====================
  async findMyHistory(
    makerId: number,
    memberId: number,
    month?: number,
    year?: number,
  ) {
    const all = await this.prisma.reservasi.findMany({
      where: { id_member: memberId, maker_id: makerId },
      include: { space: true },
      orderBy: { tanggal_reservasi: 'desc' },
    });

    const items = all.filter((r) => {
      const d = new Date(r.tanggal_reservasi);
      const matchMonth = month ? d.getUTCMonth() + 1 === month : true;
      const matchYear = year ? d.getUTCFullYear() === year : true;
      return matchMonth && matchYear;
    });

    const total_pengeluaran = items.reduce(
      (sum, r) => sum + Number(r.total_bayar),
      0,
    );

    return {
      data: {
        month: month || null,
        year: year || null,
        total_reservasi: items.length,
        total_pengeluaran,
        items: items.map((r) => ({
          id: r.id,
          kode_booking: r.kode_booking,
          tanggal_reservasi: formatDateOnly(r.tanggal_reservasi),
          jam_mulai: r.jam_mulai,
          jam_selesai: r.jam_selesai,
          durasi_jam: r.durasi_jam,
          total_bayar: r.total_bayar,
          status: r.status,
          space_name: r.space?.nama_space,
        })),
      },
    };
  }

  // Ambil reservasi + validasi kepemilikan (member hanya boleh lihat miliknya sendiri)
  private async getReservasiOrFail(
    makerId: number,
    id: number,
    user: { role: string; memberId?: number },
  ) {
    const reservasi = await this.prisma.reservasi.findFirst({
      where: { id, maker_id: makerId },
      include: { member: true, space: { include: { owner: true } }, diskon: true },
    });
    if (!reservasi) {
      throw new NotFoundException('Reservasi tidak ditemukan!');
    }
    if (user.role === 'member' && reservasi.id_member !== user.memberId) {
      throw new ForbiddenException('Anda tidak berhak mengakses reservasi ini!');
    }
    return reservasi;
  }

  // ==================== DETAIL RESERVASI ====================
  async findOne(makerId: number, id: number, user: any) {
    const reservasi = await this.getReservasiOrFail(makerId, id, user);
    return {
      data: {
        id: reservasi.id,
        kode_booking: reservasi.kode_booking,
        id_member: reservasi.id_member,
        id_space: reservasi.id_space,
        tanggal_reservasi: formatDateOnly(reservasi.tanggal_reservasi),
        jam_mulai: reservasi.jam_mulai,
        jam_selesai: reservasi.jam_selesai,
        durasi_jam: reservasi.durasi_jam,
        total_bayar: reservasi.total_bayar,
        status: reservasi.status,
        member: {
          nama_member: reservasi.member?.nama_member,
          telp: reservasi.member?.telp,
        },
        space: {
          nama_space: reservasi.space?.nama_space,
          harga_per_jam: reservasi.space?.harga_per_jam,
        },
      },
    };
  }

  // ==================== E-TICKET ====================
  async eTicket(makerId: number, id: number, user: any) {
    const r = await this.getReservasiOrFail(makerId, id, user);
    const tanggalRingkas = formatDateOnly(r.tanggal_reservasi).replace(/-/g, '');

    return {
      message: 'E-Ticket berhasil dimuat',
      data: {
        e_ticket_number: `TICKET-${(r.space?.owner?.nama_coworking || 'COWORKING')
          .replace(/\s+/g, '')
          .toUpperCase()}-${tanggalRingkas}-${String(r.id).padStart(4, '0')}`,
        kode_booking: r.kode_booking,
        coworking_space: {
          nama: r.space?.owner?.nama_coworking,
          telepon: r.space?.owner?.telp,
        },
        member: {
          nama: r.member?.nama_member,
          instansi: r.member?.instansi,
          telp: r.member?.telp,
        },
        space: {
          nama: r.space?.nama_space,
          tipe: r.space?.tipe,
          harga_per_jam: r.space?.harga_per_jam,
        },
        jadwal: {
          tanggal: formatDateOnly(r.tanggal_reservasi),
          jam_mulai: r.jam_mulai,
          jam_selesai: r.jam_selesai,
          durasi: `${r.durasi_jam} Jam`,
        },
        rincian_pembayaran: {
          tarif_kotor: r.total_harga_awal,
          diskon_promo: r.diskon
            ? `${r.diskon.persentase_diskon}% (${r.diskon.nama_diskon})`
            : 'Tidak ada',
          potongan: r.potongan_diskon,
          total_dibayar: r.total_bayar,
        },
        status_reservasi: r.status,
        qr_code_payload: `VERIFY-RESERVASI-${r.id}`,
      },
    };
  }

  // ==================== MEMBER: BATALKAN RESERVASI ====================
  async cancel(makerId: number, id: number, user: any) {
    const r = await this.getReservasiOrFail(makerId, id, user);
    if (['selesai', 'dibatalkan'].includes(r.status)) {
      throw new BadRequestException(
        `Reservasi dengan status "${r.status}" tidak dapat dibatalkan!`,
      );
    }
    const updated = await this.prisma.reservasi.update({
      where: { id: r.id },
      data: { status: 'dibatalkan' },
    });

    return {
      message: 'Reservasi berhasil dibatalkan oleh pengguna',
      data: { id: updated.id, status: updated.status, updated_at: updated.updated_at },
    };
  }
}
