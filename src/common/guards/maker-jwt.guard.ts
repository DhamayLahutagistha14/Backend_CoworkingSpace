import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard untuk endpoint yang wajib login sebagai App Maker (akun siswa).
@Injectable()
export class MakerJwtGuard extends AuthGuard('maker-jwt') {}
