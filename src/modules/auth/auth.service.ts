import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAdminSpaceDto } from './dto/register-admin-space.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerMember(makerId: number, dto: RegisterMemberDto) {
    const exists = await this.prisma.user.findFirst({
      where: { username: dto.username, maker_id: makerId },
    });
    if (exists) {
      throw new BadRequestException('Username sudah digunakan oleh akun lain!');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    // Buat User + Member sekaligus dalam satu transaksi supaya konsisten
    const { user, member } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashed,
          role: UserRole.member,
          maker_id: makerId,
        },
      });
      const member = await tx.member.create({
        data: {
          id_user: user.id,
          nama_member: dto.nama_member,
          instansi: dto.instansi,
          alamat: dto.alamat,
          telp: dto.telp,
          foto: dto.foto || null,
          maker_id: makerId,
        },
      });
      return { user, member };
    });

    const access_token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
      makerId,
      memberId: member.id,
    });

    return {
      message: 'Registrasi member berhasil!',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        member: {
          id: member.id,
          nama_member: member.nama_member,
          instansi: member.instansi,
          alamat: member.alamat,
          telp: member.telp,
          foto: member.foto,
        },
        access_token,
      },
    };
  }

  async registerAdminSpace(makerId: number, dto: RegisterAdminSpaceDto) {
    const exists = await this.prisma.user.findFirst({
      where: { username: dto.username, maker_id: makerId },
    });
    if (exists) {
      throw new BadRequestException('Username sudah digunakan oleh akun lain!');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const { user, owner } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashed,
          role: UserRole.admin_space,
          maker_id: makerId,
        },
      });
      const owner = await tx.spaceOwner.create({
        data: {
          id_user: user.id,
          nama_coworking: dto.nama_coworking,
          nama_pemilik: dto.nama_pemilik,
          telp: dto.telp,
          maker_id: makerId,
        },
      });
      return { user, owner };
    });

    const access_token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
      makerId,
      ownerId: owner.id,
    });

    return {
      message: 'Registrasi Admin Space berhasil!',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        space_owner: {
          id: owner.id,
          nama_coworking: owner.nama_coworking,
          nama_pemilik: owner.nama_pemilik,
          telp: owner.telp,
        },
        access_token,
      },
    };
  }

  async login(makerId: number, dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { username: dto.username, maker_id: makerId },
      include: { member: true, space_owner: true },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Username atau Password salah!');
    }

    const access_token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
      makerId,
      memberId: user.member?.id,
      ownerId: user.space_owner?.id,
    });

    return {
      message: 'Login berhasil!',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        maker_id: makerId,
        member: user.member
          ? {
              id: user.member.id,
              nama_member: user.member.nama_member,
              instansi: user.member.instansi,
              alamat: user.member.alamat,
              telp: user.member.telp,
              foto: user.member.foto,
            }
          : null,
        space_owner: user.space_owner
          ? {
              id: user.space_owner.id,
              nama_coworking: user.space_owner.nama_coworking,
              nama_pemilik: user.space_owner.nama_pemilik,
              telp: user.space_owner.telp,
            }
          : null,
        access_token,
      },
    };
  }

  async profile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { member: true, space_owner: true },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan!');

    return {
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        member: user.member || null,
        space_owner: user.space_owner || null,
      },
    };
  }
}
