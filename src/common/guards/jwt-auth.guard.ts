import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard untuk endpoint yang wajib login sebagai USER (member / admin_space).
// Pasang setelah MakerKeyGuard: @UseGuards(MakerKeyGuard, JwtAuthGuard)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
