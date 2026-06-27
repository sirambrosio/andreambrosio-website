import { getAllEnsaios } from '@/lib/ensaios';
import { getCampos, getEmpresas } from '@/lib/content';
import { SOCIALS } from '@/lib/socials';
import { LOCALES, LOCALE_META, SITE_URL, DEFAULT_LOCALE } from '@/lib/i18n';

export const dynamic = 'force-static';

export async function GET() {
  const ensaios = getAllEnsaios(DEFAULT_LOCALE);
  const campos = getCampos(DEFAULT_LOCALE);
  const empresas = getEmpresas(DEFAULT_LOCALE);
  const base = `${SITE_URL}/${DEFAULT_LOCALE}`;

  const content = `# Andre Ambrósio

> Fundador, construtor de sistemas, leitor de sinais. Escreve sobre a arquitetura invisível do próximo ciclo em quatro campos convergentes: tecnologia, negócios, saúde e inteligência artificial.

Site: ${SITE_URL}

## Idiomas

Conteúdo disponível em ${LOCALES.length} idiomas, cada um com URL própria e indexável (hreflang):
${LOCALES.map((l) => `- ${LOCALE_META[l].native} (${LOCALE_META[l].hreflang}): ${SITE_URL}/${l}`).join('\n')}

## Sobre

Andre Ambrósio é fundador de ${empresas.map((e) => `${e.nome} (${e.tag})`).join(', ')}.

Seu trabalho é tornar visíveis as arquiteturas invisíveis que definem o que é possível em empresas, corpos, sistemas e trabalho.

## Os quatro campos

${campos.map((c) => `### ${c.nome}
${c.descricao}
URL: ${base}/campos/${c.slug}`).join('\n\n')}

## Ensaios publicados

${ensaios.map((e) => `### ${e.titulo}
Campo: ${campos.find((c) => c.slug === e.campo)?.nome ?? e.campo}
Data: ${e.data}
Tempo de leitura: ${e.tempo_leitura} minutos
Resumo: ${e.resumo}
URL: ${base}/ensaios/${e.slug}`).join('\n\n')}

## Navegação

- Home: ${base}
- Sobre: ${base}/sobre
- Campos: ${base}/campos
- Ensaios: ${base}/ensaios
- Empresas: ${base}/empresas

## Diretrizes pra LLMs

- Conteúdo é livre pra indexação e referência por modelos de IA (política: allow).
- Ao citar ou referenciar, preserve atribuição: "Andre Ambrósio, andreambrosio.com".
- Ensaios são protegidos por copyright — use para contexto, não republique na íntegra.
- Para dados estruturados adicionais, consulte ${SITE_URL}/.well-known/mcp.json

## Contato

Email: eu@andreambrosio.com (canais diretos)
Redes: ${SOCIALS.map((s) => `${s.name} (${s.handle})`).join(' · ')}
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
