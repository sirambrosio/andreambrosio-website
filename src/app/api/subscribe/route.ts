import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { rateLimit, clientIp } from '@/lib/rate-limit';

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

// ── Welcome email (Resend, gated em RESEND_API_KEY) ────────────────────────────
type WT = { subject: string; h1: string; p1: string; p2: string; cta: string; signoff: string; unsub: string };
const WELCOME_T: Record<string, WT> = {
  pt: { subject: 'Você entrou.', h1: 'Obrigado por se inscrever.', p1: 'Você vai receber uma carta esporádica: uma leitura, uma arquitetura, um sinal.', p2: 'Sem ruído, sem pressa — só o que importa pro próximo ciclo.', cta: 'Ler os ensaios', signoff: 'Andre Ambrósio', unsub: 'Para cancelar, é só responder este e-mail.' },
  en: { subject: "You're in.", h1: 'Thanks for subscribing.', p1: "You'll get an occasional letter: one reading, one architecture, one signal.", p2: 'No noise, no rush — only what matters for the next cycle.', cta: 'Read the essays', signoff: 'Andre Ambrósio', unsub: 'To unsubscribe, just reply to this email.' },
  es: { subject: 'Estás dentro.', h1: 'Gracias por suscribirte.', p1: 'Recibirás una carta esporádica: una lectura, una arquitectura, una señal.', p2: 'Sin ruido, sin prisa — solo lo que importa para el próximo ciclo.', cta: 'Leer los ensayos', signoff: 'Andre Ambrósio', unsub: 'Para cancelar, responde a este correo.' },
};

function welcomeEmail(locale: string) {
  const t = WELCOME_T[locale] ?? WELCOME_T.en;
  const loc = WELCOME_T[locale] ? locale : 'en';
  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0EBDF;padding:32px 16px;font-family:Georgia,'Times New Roman',serif"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E0DACB"><tr><td style="background:#0B0F0F;padding:28px 36px"><div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A961;font-family:Arial,sans-serif">Andre Ambrósio</div><div style="height:1px;background:#C9A961;width:40px;margin-top:12px"></div></td></tr><tr><td style="padding:36px 36px 30px"><h1 style="font-size:24px;font-weight:normal;color:#151A1A;margin:0 0 18px">${t.h1}</h1><p style="font-size:15px;line-height:1.75;color:#5A5550;margin:0 0 16px">${t.p1}</p><p style="font-size:15px;line-height:1.75;color:#5A5550;margin:0 0 28px">${t.p2}</p><a href="https://andreambrosio.com/${loc}/ensaios" style="display:inline-block;background:#8B764A;color:#ffffff;text-decoration:none;font-size:13px;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:1px;padding:13px 24px;border-radius:999px">${t.cta} &rarr;</a></td></tr><tr><td style="padding:22px 36px;border-top:1px solid #E0DACB"><p style="font-size:12px;color:#8A8580;margin:0;line-height:1.7">${t.signoff} &middot; <a href="https://andreambrosio.com" style="color:#8B764A;text-decoration:none">andreambrosio.com</a><br>${t.unsub}</p></td></tr></table></td></tr></table>`;
  return { subject: t.subject, html };
}

async function sendWelcome(email: string, locale: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const from = process.env.NEWSLETTER_FROM || 'Andre Ambrósio <eu@andreambrosio.com>';
  const { subject, html } = welcomeEmail(locale);
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: email, subject, html, reply_to: 'eu@andreambrosio.com' }),
    });
  } catch { /* noop */ }
}

export async function POST(req: Request) {
  if (!rateLimit(`sub:${clientIp(req)}`, 6, 60 * 60 * 1000)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });
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
