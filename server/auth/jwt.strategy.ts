import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  schoolId: string;
  role: string;
  staffId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // set via env, never hardcoded
    });
  }

  // Whatever this returns becomes `request.user` — every controller
  // downstream reads req.user.schoolId instead of a hardcoded string.
  async validate(payload: JwtPayload) {
    if (!payload.schoolId) throw new UnauthorizedException('Token missing tenant context');
    return { userId: payload.sub, schoolId: payload.schoolId, role: payload.role, staffId: payload.staffId };
  }
}
