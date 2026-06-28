import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, ensureAdmin } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const rand = () => Math.random().toString(36).slice(2, 8);

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  const { rows } = await db.query(`select slug, target, title, clicks, to_char(created_at,'YYYY-MM-DD') created from links order by created_at desc`);
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
  if (!/^https?:\/\/.+/.test(target)) return NextResponse.json({ ok: false, error: 'target' }, { status: 400 });
  let slug = b.slug ? slugify(b.slug) : '';
  if (!slug) slug = rand();
  // garante unicidade
  for (let i = 0; i < 5; i++) {
    const ex = await db.query('select 1 from links where slug=$1', [slug]);
    if (ex.rows.length === 0) break;
    slug = (b.slug ? slugify(b.slug) + '-' : '') + rand();
  }
  await db.query('insert into links (slug, target, title) values ($1,$2,$3)', [slug, target, String(b.title ?? '').slice(0, 120)]);
  return NextResponse.json({ ok: true, slug });
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
