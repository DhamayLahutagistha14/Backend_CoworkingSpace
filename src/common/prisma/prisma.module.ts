import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() supaya PrismaService otomatis tersedia di SEMUA modul
// tanpa perlu di-import satu-satu (mirip CommonModule).
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
