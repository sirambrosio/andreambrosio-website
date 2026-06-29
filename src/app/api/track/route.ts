import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { rateLimit, clientIp, isBot } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

let ready = false;
async function ensure(p: Pool) {
  if (ready) return;
  await p.query(
    `create table if not exists events (
       id bigserial primary key,
       ts timestamptz not null default now(),
       event text not null,
       path text,
       locale text,
       source text,
       ref text,
       country text
     )`,
  );
  await p.query(`create index if not exists events_ts_idx on events (ts)`);
  await p.query(`create index if not exists events_event_idx on events (event)`);
  try { await p.query(`alter table events add column if not exists country text`); } catch { /* ok */ }
  ready = true;
}

const s = (v: unknown, n: number) => (v == null ? null : String(v).slice(0, n));

// Analytics first-party, sem cookie, sem IP, sem PII. Best-effort: nunca quebra a UX.
export async function POST(req: Request) {
  // ignora bots/preview e limita flood por IP
  if (isBot(req.headers.get('user-agent') || '')) return new NextResponse(null, { status: 204 });
  if (!rateLimit(`track:${clientIp(req)}`, 200, 60000)) return new NextResponse(null, { status: 204 });
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* corpo vazio */ }
  const event = s(b.event, 60);
  if (!event) return new NextResponse(null, { status: 204 });
  const db = getPool();
  if (!db) return new NextResponse(null, { status: 204 });
  try {
    await ensure(db);
    const country = (req.headers.get('cf-ipcountry') || '').slice(0, 2) || null;
    await db.query(
      `insert into events (event, path, locale, source, ref, country) values ($1,$2,$3,$4,$5,$6)`,
      [event, s(b.path, 200), s(b.locale, 8), s(b.source, 60), s(b.ref, 120), country],
    );
  } catch (e) { console.error('[track] insert falhou', e); }
  return new NextResponse(null, { status: 204 });
}
