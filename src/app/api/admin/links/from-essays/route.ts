import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, ensureAdmin } from '@/lib/admin-data';
import { getAllEnsaios } from '@/lib/ensaios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  const ensaios = getAllEnsaios();
  let created = 0;
  for (const e of ensaios) {
    const target = `https://andreambrosio.com/pt/ensaios/${e.slug}`;
    const r = await db.query('insert into links (slug, target, title) values ($1,$2,$3) on conflict (slug) do nothing', [e.slug, target, String(e.titulo).slice(0, 120)]);
    if ((r.rowCount ?? 0) > 0) created++;
  }
  return NextResponse.json({ ok: true, created, total: ensaios.length });
}
