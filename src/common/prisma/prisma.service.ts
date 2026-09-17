import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Service ini membungkus PrismaClient supaya bisa di-inject ke service
// manapun lewat Dependency Injection NestJS, sekaligus mengatur kapan
// koneksi ke database dibuka (saat aplikasi start) dan ditutup (saat stop).
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Koneksi ke database (Prisma) berhasil dibuka');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
