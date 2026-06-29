import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, ensureAdmin } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const rand = () => Math.random().toString(36).slice(2, 8);
const validTarget = (t: string) => { try { const u = new URL(t); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; } };

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  const { rows } = await db.query(`select slug, target, title, clicks, to_char(created_at at time zone 'America/Sao_Paulo','YYYY-MM-DD') created from links order by created_at desc`);
  return NextResponse.json({ ok: true, rows });
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  let b: { slug?: string; target?: string; title?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const target = String(b.target ?? '').trim();
  if (!validTarget(target)) return NextResponse.json({ ok: false, error: 'target' }, { status: 400 });
  const base = b.slug ? slugify(b.slug) : rand();
  for (let i = 0; i < 6; i++) {
    const slug = i === 0 ? base : `${base}-${rand()}`;
    const r = await db.query('insert into links (slug, target, title) values ($1,$2,$3) on conflict (slug) do nothing returning slug', [slug, target, String(b.title ?? '').slice(0, 120)]);
    if (r.rows.length) return NextResponse.json({ ok: true, slug });
  }
  return NextResponse.json({ ok: false, error: 'slug' }, { status: 409 });
}

export async function PATCH(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  let b: { slug?: string; target?: string; title?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const slug = String(b.slug ?? '');
  const target = String(b.target ?? '').trim();
  if (!slug || !validTarget(target)) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  await db.query('update links set target=$2, title=$3 where slug=$1', [slug, target, String(b.title ?? '').slice(0, 120)]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  let b: { slug?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const slug = String(b.slug ?? '');
  if (!slug) return NextResponse.json({ ok: false }, { status: 400 });
  const r = await db.query('select id from links where slug=$1', [slug]);
  if (r.rows[0]) { await db.query('delete from link_clicks where link_id=$1', [r.rows[0].id]); await db.query('delete from links where slug=$1', [slug]); }
  return NextResponse.json({ ok: true });
}
