import { NextResponse } from 'next/server';
import { getSession, verifyPasswordWith, hashPassword } from '@/lib/admin-auth';
import { getPool, ensureAdmin, effectivePasswordHash, setConfig, bumpTokenVersion } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  let b: { current?: string; next?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const current = String(b.current ?? ''), next = String(b.next ?? '');
  if (next.length < 8) return NextResponse.json({ ok: false, error: 'short' }, { status: 400 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  await ensureAdmin(db);
  const hash = await effectivePasswordHash(db);
  if (!verifyPasswordWith(hash, current)) return NextResponse.json({ ok: false, error: 'wrong' }, { status: 401 });
  await setConfig(db, 'password_hash', hashPassword(next));
  await bumpTokenVersion(db);
  return NextResponse.json({ ok: true });
}
