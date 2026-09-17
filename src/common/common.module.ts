import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from './strategies/jwt.strategy';
import { MakerJwtStrategy } from './strategies/maker-jwt.strategy';
import { MakerKeyGuard } from './guards/maker-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MakerJwtGuard } from './guards/maker-jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { MakerFlexibleGuard } from './guards/maker-flexible.guard';

// Modul global berisi semua "alat bantu" (guard, strategy JWT) yang dipakai
// berulang kali di modul lain. Ditandai @Global supaya tidak perlu di-import
// satu-satu di setiap modul.
//
// CATATAN MIGRASI DARI TypeORM -> Prisma:
// Sebelumnya modul ini juga harus meng-import & meng-export
// TypeOrmModule.forFeature([Maker]) supaya MakerKeyGuard punya akses ke
// Repository<Maker> di modul lain (ini sempat jadi sumber bug DI).
// Dengan Prisma, PrismaService adalah satu service tunggal yang sudah
// @Global() lewat PrismaModule, jadi masalah itu otomatis hilang -
// guard di bawah ini tinggal @Inject(PrismaService) seperti biasa.
@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1d' },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    MakerJwtStrategy,
    MakerKeyGuard,
    JwtAuthGuard,
    MakerJwtGuard,
    RolesGuard,
    MakerFlexibleGuard,
  ],
  exports: [
    JwtModule,
    MakerKeyGuard,
    JwtAuthGuard,
    MakerJwtGuard,
    RolesGuard,
    MakerFlexibleGuard,
  ],
})
export class CommonModule {}
