import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './errors';

// ─── AUTH TEMPORARILY DISABLED ───────────────────────────────────────
// Flip this back to false to re-enable real login. While true,
// requireUser() below skips real token verification entirely and
// always returns the same fixed dev identity, and requireRole() never
// blocks anything — every route behaves as if a single admin user for
// one fixed "dev-school" tenant is always logged in. This exists
// because getting real deployment/auth working cost a genuinely long
// stretch of back-and-forth, and there's no reason the rest of the
// app's ~24 modules should stay blocked on that while they're still
// being built and tested. /setup and /login themselves are untouched —
// they still work exactly as before, so flipping this back to false
// later doesn't require rebuilding anything, just re-enabling the check
// that was already built and already proven to work.
const AUTH_DISABLED = true;
const DEV_USER = { userId: 'dev-user', schoolId: 'dev-school', role: 'admin', staffId: undefined };
// ───────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string; // Firestore doc id, users collection
  schoolId: string;
  role: string;
  staffId?: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    // Caught by the env-var preflight check in every route handler
    // before this ever runs in practice — this is a last-resort guard,
    // not the primary way that gap gets surfaced.
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

// Throws UnauthorizedError (not a raw jsonwebtoken error) so route
// handlers can catch one consistent error type regardless of whether
// the failure was "no token", "expired", or "tampered with."
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

// Replaces the JwtAuthGuard + RolesGuard + @CurrentUser() combination —
// pulls the bearer token off a Web-standard Request, verifies it, and
// returns the same {userId, schoolId, role, staffId} shape every
// service function already expects. Call this at the top of any route
// handler that isn't public; it throws UnauthorizedError (caught by
// toHttpResponse in errors.ts) if the token is missing or invalid.
export function requireUser(req: Request): { userId: string; schoolId: string; role: string; staffId?: string } {
  if (AUTH_DISABLED) return DEV_USER;

  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new UnauthorizedError('Missing bearer token');

  const payload = verifyToken(token);
  if (!payload.schoolId) throw new UnauthorizedError('Token missing tenant context');

  return { userId: payload.sub, schoolId: payload.schoolId, role: payload.role, staffId: payload.staffId };
}

// For endpoints gated to specific roles (Case Notes, payroll) — call
// after requireUser(), same two-step shape @Roles()+RolesGuard had.
export function requireRole(user: { role: string }, ...roles: string[]) {
  if (AUTH_DISABLED) return;
  if (!roles.includes(user.role)) {
    throw new ForbiddenError(`Requires one of: ${roles.join(', ')}`);
  }
}
