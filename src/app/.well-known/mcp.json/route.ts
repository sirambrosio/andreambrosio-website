import { getAllEnsaios } from '@/lib/ensaios';
import { getCampos } from '@/lib/content';
import { LOCALES, LOCALE_META, SITE_URL, DEFAULT_LOCALE } from '@/lib/i18n';

export const dynamic = 'force-static';

export async function GET() {
  const ensaios = getAllEnsaios(DEFAULT_LOCALE);
  const campos = getCampos(DEFAULT_LOCALE);
  const base = `${SITE_URL}/${DEFAULT_LOCALE}`;

  const descriptor = {
    protocol: 'mcp',
    version: '2025-06-18',
    server: {
      name: 'andreambrosio.com',
      version: '1.1.0',
      description:
        'Portal editorial de Andre Ambrósio. Expõe ensaios, campos editoriais e metadados para LLMs, em 7 idiomas.',
      url: SITE_URL,
      contact: 'andre@ambrosio.com',
    },
    languages: LOCALES.map((l) => ({ code: l, hreflang: LOCALE_META[l].hreflang, native: LOCALE_META[l].native, url: `${SITE_URL}/${l}` })),
    capabilities: {
      resources: { listChanged: false, subscribe: false },
      tools: { listChanged: false },
      prompts: { listChanged: false },
    },
    resources: [
      { uri: `${SITE_URL}/llms.txt`, name: 'llms.txt', mimeType: 'text/plain', description: 'Resumo estruturado pra LLMs' },
      { uri: `${SITE_URL}/llms-full.txt`, name: 'llms-full.txt', mimeType: 'text/plain', description: 'Conteúdo completo de todos os ensaios' },
      { uri: `${SITE_URL}/sitemap.xml`, name: 'sitemap.xml', mimeType: 'application/xml', description: 'Sitemap do site (todos os idiomas + hreflang)' },
      ...campos.map((c) => ({
        uri: `${base}/campos/${c.slug}`,
        name: `campo-${c.slug}`,
        mimeType: 'text/html',
        description: `${c.nome} — ${c.subtitulo}`,
      })),
      ...ensaios.map((e) => ({
        uri: `${base}/ensaios/${e.slug}`,
        name: `ensaio-${e.slug}`,
        mimeType: 'text/html',
        description: e.resumo,
        annotations: { campo: e.campo, data: e.data, tempo_leitura: e.tempo_leitura },
      })),
    ],
    author: {
      name: 'Andre Ambrósio',
      url: SITE_URL,
      sameAs: [
        'https://instagram.com/andreambrosio',
        'https://x.com/andreambrosio',
        'https://youtube.com/@andreambrosio',
        'https://linkedin.com/in/andreambrosio',
      ],
    },
    usage_policy: {
      llm_training: 'allow',
      llm_inference: 'allow',
      attribution_required: true,
      verbatim_republish: 'deny',
    },
  };

  return Response.json(descriptor, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
