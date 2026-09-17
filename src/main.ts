import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import * as fs from 'fs';
import { join } from 'path';

// Pastikan folder penyimpanan file upload sudah ada sebelum server berjalan
function ensureUploadFolders() {
  ['general', 'spaces', 'members'].forEach((folder) => {
    const dir = join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

async function bootstrap() {
  ensureUploadFolders();
  const app = await NestFactory.create(AppModule, { cors: true });

  // Prefix semua endpoint dengan /api, kecuali root ("/") & "/health"
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health'],
  });

  // Validasi otomatis setiap request body sesuai DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hapus field yang tidak ada di DTO
      transform: true, // ubah tipe data otomatis (string -> number, dll)
      forbidNonWhitelisted: false,
    }),
  );

  // Bungkus semua response sukses ke format standar
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Tangani semua error dengan format standar
  app.useGlobalFilters(new AllExceptionsFilter());

  // ======================= SWAGGER (Dokumentasi API) =======================
  // Bisa dibuka lewat browser di http://localhost:3000/docs setelah server jalan.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Coworking Space API - UKK RPL Paket B')
    .setDescription(
      'Dokumentasi lengkap seluruh endpoint Sistem Reservasi Coworking Space. ' +
        'Sebelum mencoba endpoint Member/Admin: (1) buka endpoint POST /maker/register ' +
        'untuk dapat app_key, klik "Authorize" lalu isi di bagian "x-maker-key". ' +
        '(2) login lewat POST /auth/login untuk dapat access_token, klik "Authorize" ' +
        'lalu isi di bagian "bearer" (tanpa kata "Bearer").',
    )
    .setVersion('1.0.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-maker-key', in: 'header' },
      'x-maker-key', // nama security scheme, dipakai lewat @ApiSecurity('x-maker-key')
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer', // nama security scheme, dipakai lewat @ApiBearerAuth('bearer')
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: { persistAuthorization: true }, // supaya token tidak hilang saat refresh halaman
  });
  // ===========================================================================

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Coworking Space API berjalan di: http://localhost:${port}`);
  console.log(`📘 Swagger API Docs tersedia di: http://localhost:${port}/docs`);
  console.log(`📁 File upload dapat diakses di: http://localhost:${port}/uploads`);
}
bootstrap();
