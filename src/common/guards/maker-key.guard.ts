import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Guard ini WAJIB dipasang di endpoint yang butuh isolasi data per siswa.
// Cara kerja: baca header "x-maker-key" (atau "x-app-key"), cari App Maker
// pemilik key tersebut, lalu simpan request.makerId supaya bisa dipakai
// di service untuk memfilter data (WHERE maker_id = ...).
@Injectable()
export class MakerKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appKey = request.headers['x-maker-key'] || request.headers['x-app-key'];

    if (!appKey) {
      throw new UnauthorizedException(
        'Header x-maker-key wajib disertakan pada setiap request!',
      );
    }

    const maker = await this.prisma.maker.findUnique({ where: { app_key: appKey } });
    if (!maker) {
      throw new UnauthorizedException('App Key tidak valid atau tidak ditemukan!');
    }

    request.makerId = maker.id;
    request.maker = maker;
    return true;
  }
}
