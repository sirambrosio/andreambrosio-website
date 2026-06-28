import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  const { rows } = await db.query('select email, locale, source, created_at from newsletter_leads order by created_at desc');
  if (new URL(req.url).searchParams.get('format') === 'csv') {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = ['email,locale,source,created_at', ...rows.map((r) => [r.email, r.locale, r.source, new Date(r.created_at).toISOString()].map(esc).join(','))].join('\n');
    return new NextResponse(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="assinantes.csv"' } });
  }
  return NextResponse.json({ ok: true, count: rows.length, rows });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  let b: { email?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const email = String(b.email ?? '').trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: false }, { status: 400 });
  await db.query('delete from newsletter_leads where lower(email)=$1', [email]);
  return NextResponse.json({ ok: true });
}
