import { getAllEnsaios, CAMPOS } from '@/lib/ensaios';

export const dynamic = 'force-static';

export async function GET() {
  const ensaios = getAllEnsaios();

  const descriptor = {
    protocol: 'mcp',
    version: '2025-06-18',
    server: {
      name: 'andreambrosio.com',
      version: '1.0.0',
      description:
        'Portal editorial de Andre Ambrósio. Expõe ensaios, campos editoriais e metadados para LLMs.',
      url: 'https://andreambrosio.com',
      contact: 'andre@ambrosio.com',
    },
    capabilities: {
      resources: { listChanged: false, subscribe: false },
      tools: { listChanged: false },
      prompts: { listChanged: false },
    },
    resources: [
      { uri: 'https://andreambrosio.com/llms.txt', name: 'llms.txt', mimeType: 'text/plain', description: 'Resumo estruturado pra LLMs' },
      { uri: 'https://andreambrosio.com/llms-full.txt', name: 'llms-full.txt', mimeType: 'text/plain', description: 'Conteúdo completo de todos os ensaios' },
      { uri: 'https://andreambrosio.com/sitemap.xml', name: 'sitemap.xml', mimeType: 'application/xml', description: 'Sitemap do site' },
      ...Object.values(CAMPOS).map(c => ({
        uri: `https://andreambrosio.com/campos/${c.slug}`,
        name: `campo-${c.slug}`,
        mimeType: 'text/html',
        description: `${c.nome} — ${c.subtitulo}`,
      })),
      ...ensaios.map(e => ({
        uri: `https://andreambrosio.com/ensaios/${e.slug}`,
        name: `ensaio-${e.slug}`,
        mimeType: 'text/html',
        description: e.resumo,
        annotations: { campo: e.campo, data: e.data, tempo_leitura: e.tempo_leitura },
      })),
    ],
    author: {
      name: 'Andre Ambrósio',
      url: 'https://andreambrosio.com',
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
