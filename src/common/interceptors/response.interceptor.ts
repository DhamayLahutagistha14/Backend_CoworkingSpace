import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Membungkus SEMUA response sukses ke format standar sesuai Kontrak API:
// { status, statusCode, message, data, timestamp }
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    return next.handle().pipe(
      map((result) => {
        // Controller boleh mengembalikan { message, data } atau langsung data.
        const message = result?.message ?? 'Berhasil memproses permintaan';
        const data = result?.data !== undefined ? result.data : result;
        return {
          status: true,
          statusCode: response.statusCode,
          message,
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
