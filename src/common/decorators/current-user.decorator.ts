import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Ambil data user yang sedang login (hasil decode JWT) di dalam controller.
// Contoh: create(@CurrentUser() user) { ... }
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
