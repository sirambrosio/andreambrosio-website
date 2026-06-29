import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { sameOrigin } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: true, items: [] });
  await ensureAdmin(db);
  const items = await rows(db, `select id, to_char(d,'YYYY-MM-DD') d, label from annotations order by d desc limit 100`);
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  let b: { d?: string; label?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const label = String(b.label || '').trim().slice(0, 120);
  const d = /^\d{4}-\d{2}-\d{2}$/.test(String(b.d || '')) ? b.d : null;
  if (!label || !d) return NextResponse.json({ ok: false, error: 'dados' }, { status: 400 });
  await db.query(`insert into annotations (d, label) values ($1,$2)`, [d, label]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await db.query(`delete from annotations where id=$1`, [id]);
  return NextResponse.json({ ok: true });
}
