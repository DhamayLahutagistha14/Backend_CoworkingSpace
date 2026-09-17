import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

// Beberapa endpoint App Maker (misal /api/maker/stats) menurut Kontrak API
// boleh diakses dengan Bearer Token ATAU header x-maker-key. Guard ini
// mencoba keduanya secara berurutan.
@Injectable()
export class MakerFlexibleGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const appKey = request.headers['x-maker-key'] || request.headers['x-app-key'];

    // Coba 1: Bearer Token App Maker
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = this.jwtService.verify(token);
        if (payload?.type === 'maker') {
          request.makerId = payload.sub;
          return true;
        }
      } catch {
        // lanjut coba cara ke-2 di bawah
      }
    }

    // Coba 2: Header x-maker-key
    if (appKey) {
      const maker = await this.prisma.maker.findUnique({ where: { app_key: appKey } });
      if (maker) {
        request.makerId = maker.id;
        return true;
      }
    }

    throw new UnauthorizedException(
      'Sertakan Bearer Token App Maker ATAU header x-maker-key yang valid!',
    );
  }
}
