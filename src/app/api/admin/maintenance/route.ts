import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { getPool } from '@/lib/admin-data';
import { sameOrigin } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const db = getPool();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  let b: { action?: string } = {};
  try { b = await req.json(); } catch { /* */ }
  if (b.action === 'purge_test') {
    // remove só eventos com marcadores de teste — nunca dados reais
    const r = await db.query(`delete from events where path like '/verify%' or path = '/verify-utm' or sid like 'verify%'`);
    return NextResponse.json({ ok: true, deleted: r.rowCount });
  }
  return NextResponse.json({ ok: false, error: 'ação desconhecida' }, { status: 400 });
}
