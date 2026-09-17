import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateCoworkingProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AdminProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(ownerId: number) {
    const owner = await this.prisma.spaceOwner.findUnique({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException('Profil coworking space tidak ditemukan!');
    return { data: owner };
  }

  async updateProfile(ownerId: number, dto: UpdateCoworkingProfileDto) {
    const owner = await this.prisma.spaceOwner.findUnique({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException('Profil coworking space tidak ditemukan!');

    const updated = await this.prisma.spaceOwner.update({
      where: { id: ownerId },
      data: dto,
    });

    return {
      message: 'Profil Coworking Space berhasil diperbarui!',
      data: updated,
    };
  }
}
