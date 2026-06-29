import { NextResponse } from 'next/server';
import { getPool } from '@/lib/admin-data';
import { clientIp, firstSeen, isBot } from '@/lib/rate-limit';

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
  let target = HOME;
  try {
    const r = await db.query('select id, target from links where slug=$1', [slug]);
    const link = r.rows[0];
    if (!link) return NextResponse.redirect(HOME, 302);
    target = link.target;
    // log best-effort: ignora bots/preview e dedup mesmo IP+slug em 60s (unfurl/prefetch)
    const ua = (req.headers.get('user-agent') || '');
    if (!isBot(ua) && firstSeen(`click:${clientIp(req)}:${slug}`, 60000)) {
      const country = (req.headers.get('cf-ipcountry') || '').slice(0, 2) || null;
      const refRaw = req.headers.get('referer') || '';
      let ref: string | null = null;
      try { ref = refRaw ? new URL(refRaw).hostname : null; } catch { ref = null; }
      try {
        await db.query('insert into link_clicks (link_id, country, ref, device) values ($1,$2,$3,$4)', [link.id, country, ref, device(ua)]);
        await db.query('update links set clicks = clicks + 1 where id=$1', [link.id]);
      } catch (e) { console.error('[track-link] insert falhou', e); }
    }
  } catch (e) {
    console.error('[track-link] lookup falhou', e);
  }
  return NextResponse.redirect(target, 302);
}
