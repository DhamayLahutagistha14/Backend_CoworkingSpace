import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './common/prisma/prisma.module';
import { CommonModule } from './common/common.module';

import { RootModule } from './modules/root/root.module';
import { MakerModule } from './modules/maker/maker.module';
import { AuthModule } from './modules/auth/auth.module';
import { SpacesModule } from './modules/spaces/spaces.module';
import { DiskonModule } from './modules/diskon/diskon.module';
import { ReservasiModule } from './modules/reservasi/reservasi.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    // Baca file .env & sediakan ConfigService ke seluruh aplikasi
    ConfigModule.forRoot({ isGlobal: true }),

    // Koneksi database MySQL lewat Prisma (baca DATABASE_URL di .env).
    // PrismaModule bertanda @Global() sehingga PrismaService otomatis
    // tersedia untuk di-inject di modul manapun tanpa import berulang.
    PrismaModule,

    // Supaya folder ./uploads bisa diakses publik lewat http://localhost:3000/uploads/...
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    CommonModule,
    RootModule,
    MakerModule,
    AuthModule,
    SpacesModule,
    DiskonModule,
    ReservasiModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}
