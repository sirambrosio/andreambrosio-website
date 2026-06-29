import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool, ensureAdmin, getConfig, setConfig } from '@/lib/admin-data';
import { sameOrigin } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function read(db: import('pg').Pool) {
  return {
    subscribers: Number((await getConfig(db, 'goal_subscribers')) || 0),
    pageviews: Number((await getConfig(db, 'goal_pageviews')) || 0),
    clicks: Number((await getConfig(db, 'goal_clicks')) || 0),
  };
}

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  return NextResponse.json({ ok: true, goals: await read(db) });
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* */ }
  for (const k of ['subscribers', 'pageviews', 'clicks'] as const) {
    if (b[k] !== undefined) await setConfig(db, `goal_${k}`, String(Math.max(0, Math.floor(Number(b[k]) || 0))));
  }
  return NextResponse.json({ ok: true, goals: await read(db) });
}
