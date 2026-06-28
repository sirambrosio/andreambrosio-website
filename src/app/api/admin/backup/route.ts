import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  const type = new URL(req.url).searchParams.get('type');
  if (type === 'events') {
    const { rows } = await db.query(`select ts, event, path, locale, source, ref, country from events order by ts desc limit 100000`);
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = ['ts,event,path,locale,source,ref,country', ...rows.map((r) => [new Date(r.ts).toISOString(), r.event, r.path, r.locale, r.source, r.ref, r.country].map(esc).join(','))].join('\n');
    return new NextResponse(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="eventos.csv"' } });
  }
  if (type === 'all') {
    const [subs, events, camps] = await Promise.all([
      db.query('select * from newsletter_leads order by created_at'),
      db.query('select * from events order by ts desc limit 100000'),
      db.query('select * from campaigns order by ts').catch(() => ({ rows: [] })),
    ]);
    const payload = JSON.stringify({ exported_at: new Date().toISOString(), subscribers: subs.rows, events: events.rows, campaigns: camps.rows }, null, 2);
    return new NextResponse(payload, { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': 'attachment; filename="backup-andreambrosio.json"' } });
  }
  return NextResponse.json({ ok: false, error: 'type' }, { status: 400 });
}
