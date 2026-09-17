import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// Menangkap SEMUA error dan mengubahnya ke format standar sesuai Kontrak API:
// { status: false, statusCode, message, error, timestamp }
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Terjadi kesalahan pada server';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res: any = exception.getResponse();
      message = res?.message || exception.message;
      error = res?.error || HttpException.name;
    }

    response.status(statusCode).json({
      status: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
