import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: true, active: 0, pv30: 0, feed: [], paths: [] });
  await ensureAdmin(db);
  const [active, pv30, feed, paths] = await Promise.all([
    rows(db, `select count(distinct sid) n from events where ts > now() - interval '5 minutes' and sid is not null`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '30 minutes'`),
    rows(db, `select event, path, locale, country, to_char(ts at time zone 'America/Sao_Paulo','HH24:MI:SS') t from events order by ts desc limit 15`),
    rows(db, `select coalesce(path,'—') label, count(*) n from events where event='pageview' and ts > now() - interval '30 minutes' group by path order by n desc limit 6`),
  ]);
  return NextResponse.json({ ok: true, active: num(active), pv30: num(pv30), feed, paths });
}
