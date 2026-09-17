import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole, Member } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateMemberAdminDto } from './dto/create-member-admin.dto';
import { UpdateMemberAdminDto } from './dto/update-member-admin.dto';
 
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
 
@Injectable()
export class AdminMemberService {
  constructor(private prisma: PrismaService) {}
 
  // Sama seperti spaces.service.ts: sertakan foto_url siap-pakai supaya
  // Frontend tidak perlu menyusun URL foto secara manual.
  private mapFoto(member: Member) {
    return {
      ...member,
      foto_url: member.foto ? `${BASE_URL}/uploads/members/${member.foto}` : null,
    };
  }
 
  async findAll(makerId: number, search?: string) {
    const list = await this.prisma.member.findMany({
      where: {
        maker_id: makerId,
        ...(search
          ? {
              OR: [
                { nama_member: { contains: search } },
                { instansi: { contains: search } },
                { telp: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { id: 'desc' },
    });
    return { data: list.map((m) => this.mapFoto(m)) };
  }
 
  async create(makerId: number, dto: CreateMemberAdminDto) {
    const exists = await this.prisma.user.findFirst({
      where: { username: dto.username, maker_id: makerId },
    });
    if (exists) throw new BadRequestException('Username sudah digunakan!');
 
    const hashed = await bcrypt.hash(dto.password, 10);
 
    const member = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashed,
          role: UserRole.member,
          maker_id: makerId,
        },
      });
      return tx.member.create({
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
    });
 
    return { message: 'Data member baru berhasil ditambahkan!', data: this.mapFoto(member) };
  }
 
  async findOne(makerId: number, id: number) {
    const member = await this.prisma.member.findFirst({
      where: { id, maker_id: makerId },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan!');
    return { data: this.mapFoto(member) };
  }
 
  async update(makerId: number, id: number, dto: UpdateMemberAdminDto) {
    const member = await this.prisma.member.findFirst({
      where: { id, maker_id: makerId },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan!');
 
    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      await this.prisma.user.update({
        where: { id: member.id_user },
        data: { password: hashed },
      });
    }
 
    const { password, ...rest } = dto;
    const updated = await this.prisma.member.update({
      where: { id },
      data: rest,
    });
 
    return { message: 'Data member berhasil diperbarui!', data: this.mapFoto(updated) };
  }
 
  async remove(makerId: number, id: number) {
    const member = await this.prisma.member.findFirst({
      where: { id, maker_id: makerId },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan!');
 
    // Hapus User induknya - relasi onDelete: Cascade otomatis menghapus Member juga
    await this.prisma.user.delete({ where: { id: member.id_user } });
 
    return { message: 'Data member berhasil dihapus!', data: { id, deleted: true } };
  }
}