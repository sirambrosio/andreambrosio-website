import { NextResponse } from 'next/server';
import { Pool } from 'pg';

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
    `create table if not exists newsletter_leads (
       id bigserial primary key,
       email text not null unique,
       locale text,
       source text,
       created_at timestamptz not null default now()
     )`,
  );
  ready = true;
}

export async function POST(req: Request) {
  let body: { email?: string; locale?: string; source?: string; company?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* corpo inválido */
  }

  // honeypot — bots preenchem 'company'; respondemos ok sem gravar
  if (body.company) return NextResponse.json({ ok: true });

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const db = getPool();
  if (!db) {
    // DATABASE_URL não setada — NÃO finge sucesso
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  }

  try {
    await ensure(db);
    await db.query(
      `insert into newsletter_leads (email, locale, source)
       values ($1, $2, $3)
       on conflict (email) do nothing`,
      [email, String(body.locale ?? '').slice(0, 8), String(body.source ?? 'site').slice(0, 48)],
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
