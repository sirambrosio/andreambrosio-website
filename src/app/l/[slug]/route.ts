import { NextResponse } from 'next/server';
import { getPool, ensureAdmin } from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOME = 'https://andreambrosio.com';

function device(ua: string): string {
  const u = ua.toLowerCase();
  if (/mobile|iphone|android|ipod/.test(u)) return 'mobile';
  if (/ipad|tablet/.test(u)) return 'tablet';
  return 'desktop';
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const db = getPool();
  if (!db || !slug) return NextResponse.redirect(HOME, 302);
  try {
    await ensureAdmin(db);
    const r = await db.query('select id, target from links where slug=$1', [slug]);
    const link = r.rows[0];
    if (!link) return NextResponse.redirect(HOME, 302);
    const country = (req.headers.get('cf-ipcountry') || '').slice(0, 2) || null;
    const refRaw = req.headers.get('referer') || '';
    let ref: string | null = null;
    try { ref = refRaw ? new URL(refRaw).hostname : null; } catch { ref = null; }
    const ua = (req.headers.get('user-agent') || '').slice(0, 200);
    await db.query('insert into link_clicks (link_id, country, ref, device) values ($1,$2,$3,$4)', [link.id, country, ref, device(ua)]);
    await db.query('update links set clicks = clicks + 1 where id=$1', [link.id]);
    return NextResponse.redirect(link.target, 302);
  } catch {
    return NextResponse.redirect(HOME, 302);
  }
}
