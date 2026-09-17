import { Module } from '@nestjs/common';
import { MakerController } from './maker.controller';
import { MakerService } from './maker.service';

// Catatan: dengan Prisma, tidak perlu lagi TypeOrmModule.forFeature([...]).
// PrismaService sudah tersedia otomatis di semua modul lewat PrismaModule (@Global).
@Module({
  controllers: [MakerController],
  providers: [MakerService],
})
export class MakerModule {}
