import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Ambil maker_id (ID siswa/App Maker) hasil validasi MakerKeyGuard.
export const MakerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.makerId;
  },
);
