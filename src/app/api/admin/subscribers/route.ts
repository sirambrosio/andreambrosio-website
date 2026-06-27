import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false } });
  return pool;
}

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
