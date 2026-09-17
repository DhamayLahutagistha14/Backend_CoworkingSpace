import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Strategy ini memvalidasi Bearer Token milik USER (member / admin_space).
// Payload token: { sub: userId, role, makerId, memberId?, ownerId? }
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Hasil return di sini otomatis menjadi request.user
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      makerId: payload.makerId,
      memberId: payload.memberId,
      ownerId: payload.ownerId,
    };
  }
}
