import { getAllEnsaios } from '@/lib/ensaios';
import { SITE_URL, DEFAULT_LOCALE } from '@/lib/i18n';

export const dynamic = 'force-static';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const ensaios = getAllEnsaios(DEFAULT_LOCALE);
  const base = `${SITE_URL}/${DEFAULT_LOCALE}`;

  const items = ensaios
    .map((e) => {
      const url = `${base}/ensaios/${e.slug}`;
      return `    <item>
      <title>${esc(e.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(e.data).toUTCString()}</pubDate>
      <description>${esc(e.resumo)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Andre Ambrósio — Ensaios</title>
    <link>${base}/ensaios</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Leituras sistêmicas sobre tecnologia, negócios, saúde e inteligência artificial.</description>
    <language>pt-BR</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
