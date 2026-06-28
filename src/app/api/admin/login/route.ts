import { NextResponse } from 'next/server';
import { verifyPasswordWith, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-auth';
import { getPool, ensureAdmin, effectivePasswordHash } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let b: { email?: string; password?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const email = String(b.email ?? '').trim().toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const db = getPool();
  if (db) { try { await ensureAdmin(db); } catch { /* */ } }
  const hash = await effectivePasswordHash(db);
  if (!adminEmail || !process.env.SESSION_SECRET || email !== adminEmail || !verifyPasswordWith(hash, String(b.password ?? ''))) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 401 });
  }
  if (db) { try { await db.query(`insert into admin_logins (ua) values ($1)`, [String(req.headers.get('user-agent') || '').slice(0, 200)]); } catch { /* */ } }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSession(adminEmail), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SESSION_MAX_AGE });
  return res;
}
