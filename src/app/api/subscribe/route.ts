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

const WELCOME: Record<string, { subject: string; html: string }> = {
  pt: { subject: 'Você entrou.', html: '<div style="font-family:Georgia,serif;max-width:520px;margin:auto;color:#151A1A"><p style="font-size:18px">Obrigado por se inscrever.</p><p style="color:#5A5550;line-height:1.7">Você vai receber uma carta esporádica: uma leitura, uma arquitetura, um sinal. Sem ruído, sem pressa.</p><p style="color:#5A5550">— Andre Ambrósio<br><a href="https://andreambrosio.com" style="color:#8B764A">andreambrosio.com</a></p></div>' },
  en: { subject: "You're in.", html: '<div style="font-family:Georgia,serif;max-width:520px;margin:auto;color:#151A1A"><p style="font-size:18px">Thanks for subscribing.</p><p style="color:#5A5550;line-height:1.7">You\'ll get an occasional letter: one reading, one architecture, one signal. No noise, no rush.</p><p style="color:#5A5550">— Andre Ambrósio<br><a href="https://andreambrosio.com" style="color:#8B764A">andreambrosio.com</a></p></div>' },
};

async function sendWelcome(email: string, locale: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const from = process.env.NEWSLETTER_FROM || 'Andre Ambrósio <eu@andreambrosio.com>';
  const w = WELCOME[locale] ?? WELCOME.en;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: email, subject: w.subject, html: w.html }),
    });
  } catch { /* noop */ }
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
    const loc = String(body.locale ?? '').slice(0, 8);
    const r = await db.query(
      `insert into newsletter_leads (email, locale, source)
       values ($1, $2, $3)
       on conflict (email) do nothing`,
      [email, loc, String(body.source ?? 'site').slice(0, 48)],
    );
    if ((r.rowCount ?? 0) > 0) await sendWelcome(email, loc);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
