import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/admin-auth';
import { getPool, ensureAdmin, getConfig, setConfig } from '@/lib/admin-data';
import { sameOrigin } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  const content = (await getConfig(db, 'now_content')) ?? '';
  return NextResponse.json({ ok: true, content });
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  await ensureAdmin(db);
  let b: { content?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  await setConfig(db, 'now_content', String(b.content ?? '').slice(0, 20000));
  await setConfig(db, 'now_updated', new Date().toISOString().slice(0, 10));
  revalidatePath('/[locale]/agora', 'page');
  return NextResponse.json({ ok: true });
}
