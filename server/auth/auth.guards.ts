import {
  Injectable,
  ExecutionContext,
  CanActivate,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

// Applied globally in main.ts — every route requires a valid JWT unless
// explicitly marked @Public().
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Role-gating for sensitive endpoints — Case Notes and payroll are the
// two the audit specifically flagged as needing this.
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // no @Roles() decorator = no restriction

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}

// Pulls {userId, schoolId, role} straight off the validated JWT —
// replaces every `'school_placeholder'` literal across all 28 services.
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
