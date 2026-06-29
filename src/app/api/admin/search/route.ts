import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const q = (new URL(req.url).searchParams.get('q') || '').trim();
  if (q.length < 2) return NextResponse.json({ ok: true, links: [], subscribers: [] });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: true, links: [], subscribers: [] });
  await ensureAdmin(db);
  const like = `%${q}%`;
  const [links, subscribers] = await Promise.all([
    rows(db, `select slug, title from links where slug ilike $1 or title ilike $1 order by clicks desc limit 6`, [like]),
    rows(db, `select email from newsletter_leads where email ilike $1 order by created_at desc limit 6`, [like]),
  ]);
  return NextResponse.json({ ok: true, links, subscribers });
}
