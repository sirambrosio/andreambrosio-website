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

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: 'no_esp' }, { status: 400 });
  let b: { subject?: string; html?: string; test?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  const subject = String(b.subject ?? '').trim();
  const html = String(b.html ?? '').trim();
  if (!subject || !html) return NextResponse.json({ ok: false, error: 'missing' }, { status: 400 });
  const from = process.env.NEWSLETTER_FROM || 'Andre Ambrósio <eu@andreambrosio.com>';

  // modo teste: envia só pro endereço informado
  let recipients: string[];
  if (b.test) {
    recipients = [String(b.test).trim()];
  } else {
    const db = getPool();
    if (!db) return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
    const { rows } = await db.query('select email from newsletter_leads order by created_at asc');
    recipients = rows.map((r) => r.email);
  }

  let sent = 0;
  for (const to of recipients) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from, to, subject, html, reply_to: 'eu@andreambrosio.com' }),
      });
      if (r.ok) sent++;
    } catch { /* segue */ }
    await new Promise((res) => setTimeout(res, 550));
  }
  if (!b.test) {
    const dbc = getPool();
    if (dbc) { try { await dbc.query(`create table if not exists campaigns (id bigserial primary key, ts timestamptz not null default now(), subject text, sent int, total int)`); await dbc.query(`insert into campaigns (subject, sent, total) values ($1,$2,$3)`, [subject, sent, recipients.length]); } catch { /* */ } }
  }
  return NextResponse.json({ ok: true, sent, total: recipients.length });
}
