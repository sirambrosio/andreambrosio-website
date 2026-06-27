import { NextResponse } from 'next/server';
import { verifyPassword, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let b: { email?: string; password?: string } = {};
  try { b = await req.json(); } catch { /* corpo inválido */ }
  const email = String(b.email ?? '').trim().toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (!adminEmail || !process.env.SESSION_SECRET || email !== adminEmail || !verifyPassword(String(b.password ?? ''))) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSession(adminEmail), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SESSION_MAX_AGE,
  });
  return res;
}
