import { NextResponse } from 'next/server';
import { SESSION_COOKIE, getSession } from '@/lib/admin-auth';
import { getPool, bumpTokenVersion } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function POST() {
  // só revoga tudo se a sessão for válida (evita bump anônimo)
  if (await getSession()) { const db = getPool(); if (db) { try { await bumpTokenVersion(db); } catch { /* */ } } }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
