import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterMakerDto } from './dto/register-maker.dto';
import { LoginMakerDto } from './dto/login-maker.dto';

@Injectable()
export class MakerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterMakerDto) {
    const exists = await this.prisma.maker.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });
    if (exists) {
      throw new BadRequestException(
        'Username atau Email sudah terdaftar sebagai App Maker!',
      );
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const app_key = `mk_${uuidv4().replace(/-/g, '')}`;

    const saved = await this.prisma.maker.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hashed,
        app_key,
      },
    });

    const access_token = this.jwtService.sign({
      sub: saved.id,
      username: saved.username,
      type: 'maker',
    });

    return {
      message: 'Registrasi App Maker berhasil! Simpan app_key Anda dengan baik.',
      data: {
        id: saved.id,
        name: saved.name,
        username: saved.username,
        email: saved.email,
        app_key: saved.app_key,
        created_at: saved.created_at,
        updated_at: saved.updated_at,
        access_token,
      },
    };
  }

  async login(dto: LoginMakerDto) {
    const maker = await this.prisma.maker.findFirst({
      where: {
        OR: [{ username: dto.usernameOrEmail }, { email: dto.usernameOrEmail }],
      },
    });
    if (!maker || !(await bcrypt.compare(dto.password, maker.password))) {
      throw new UnauthorizedException('Kredensial login App Maker salah!');
    }

    const access_token = this.jwtService.sign({
      sub: maker.id,
      username: maker.username,
      type: 'maker',
    });

    return {
      message: 'Login App Maker berhasil!',
      data: {
        id: maker.id,
        name: maker.name,
        username: maker.username,
        email: maker.email,
        app_key: maker.app_key,
        access_token,
      },
    };
  }

  async me(makerId: number) {
    const maker = await this.prisma.maker.findUnique({ where: { id: makerId } });
    return {
      data: {
        id: maker.id,
        name: maker.name,
        username: maker.username,
        email: maker.email,
        app_key: maker.app_key,
        created_at: maker.created_at,
      },
    };
  }

  async stats(makerId: number) {
    const [total_members, total_spaces, total_diskon, total_reservasi, reservasis] =
      await Promise.all([
        this.prisma.member.count({ where: { maker_id: makerId } }),
        this.prisma.space.count({ where: { maker_id: makerId } }),
        this.prisma.diskon.count({ where: { maker_id: makerId } }),
        this.prisma.reservasi.count({ where: { maker_id: makerId } }),
        this.prisma.reservasi.findMany({ where: { maker_id: makerId } }),
      ]);

    const total_pendapatan = reservasis
      .filter((r) => r.status === 'selesai' || r.status === 'aktif')
      .reduce((sum, r) => sum + Number(r.total_bayar), 0);

    return {
      data: {
        total_members,
        total_spaces,
        total_diskon,
        total_reservasi,
        total_pendapatan,
      },
    };
  }

  async list() {
    const makers = await this.prisma.maker.findMany({ orderBy: { id: 'asc' } });
    return {
      data: makers.map((m) => ({
        id: m.id,
        name: m.name,
        username: m.username,
        email: m.email,
        app_key: m.app_key,
        created_at: m.created_at,
      })),
    };
  }
}
