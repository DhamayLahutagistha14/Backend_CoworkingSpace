import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Strategy khusus untuk Bearer Token milik App Maker (akun siswa).
// Dibedakan namanya ('maker-jwt') supaya tidak tertukar dengan token user biasa.
@Injectable()
export class MakerJwtStrategy extends PassportStrategy(Strategy, 'maker-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      makerId: payload.sub,
      username: payload.username,
      type: payload.type,
    };
  }
}
