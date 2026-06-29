const buckets = new Map<string, { count: number; reset: number }>();
let lastClean = 0;

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastClean > 60000) { for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k); lastClean = now; }
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { count: 1, reset: now + windowMs }); return true; }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

export function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

const seen = new Map<string, number>();
/** true se a chave NÃO foi vista na janela (marca como vista). Pra dedup de cliques/eventos. */
export function firstSeen(key: string, windowMs: number): boolean {
  const now = Date.now();
  const t = seen.get(key);
  if (t && now - t < windowMs) return false;
  seen.set(key, now);
  if (seen.size > 8000) { for (const [k, v] of seen) if (now - v > windowMs) seen.delete(k); }
  return true;
}

const BOT_RE = /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|facebookexternalhit|whatsapp|telegram|slackbot|discordbot|twitterbot|bingpreview|bingbot|googlebot|yandex|baidu|semrush|ahrefs|safelinks|curl|wget|python-requests|node-fetch|go-http|axios|okhttp|java\/|phantomjs|pingdom|uptime/i;
export function isBot(ua: string): boolean {
  return !ua || BOT_RE.test(ua);
}

export function getCountry(req: Request): string | null {
  return (req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || req.headers.get('x-country') || '').slice(0, 2).toUpperCase() || null;
}

/** CSRF defense: aceita só requests do próprio domínio (Origin ausente = cliente nativo, permitido). */
export function sameOrigin(req: Request): boolean {
  const o = req.headers.get('origin');
  if (!o) return true;
  try { return new URL(o).hostname.endsWith('andreambrosio.com'); } catch { return false; }
}
