import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE = 'aa_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

/** scrypt: ADMIN_PASSWORD_HASH = "saltHex:hashHex". Built-in, sem dependência. */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  return salt + ':' + crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPasswordWith(stored: string, password: string): boolean {
  const [salt, hash] = (stored || '').split(':');
  if (!salt || !hash || !password) return false;
  try {
    const derived = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  return verifyPasswordWith(process.env.ADMIN_PASSWORD_HASH || '', password);
}

export function createSession(email: string): string {
  const secret = process.env.SESSION_SECRET || '';
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined | null): { email: string } | null {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET || '';
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    const a = Buffer.from(sig), b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const p = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!p.exp || p.exp < Date.now()) return null;
    return { email: String(p.email) };
  } catch {
    return null;
  }
}

export async function getSession() {
  const c = await cookies();
  return verifySession(c.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect('/admin/login');
  return s;
}
