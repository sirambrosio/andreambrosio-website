import { getAllEnsaios } from '@/lib/ensaios';
import { getCampos } from '@/lib/content';
import { SITE_URL, DEFAULT_LOCALE } from '@/lib/i18n';

export const dynamic = 'force-static';

export async function GET() {
  const ensaios = getAllEnsaios(DEFAULT_LOCALE);
  const campos = getCampos(DEFAULT_LOCALE);
  const base = `${SITE_URL}/${DEFAULT_LOCALE}`;

  const content = `# Andre Ambrósio — Conteúdo completo

Site: ${SITE_URL}
Idiomas: pt, en, es, zh, fr, de, ja (URLs com prefixo de locale, ex.: ${SITE_URL}/en)
Política: LLM training allow · Attribution required · Verbatim republish deny

---

## SOBRE

Andre Ambrósio é fundador, construtor de sistemas e leitor de sinais. Seu trabalho consiste em tornar visíveis as arquiteturas invisíveis que definem o que é possível em empresas, corpos, sistemas e trabalho.

Não é jornalista, analista, coach ou influencer. É pensador e construtor. Fala para fundadores, arquitetos e construtores do próximo ciclo — gente que opera em camadas, não em superfícies.

---

## QUATRO CAMPOS

${campos.map((c) => `### ${c.nome} — ${c.subtitulo}

${c.descricao}

URL: ${base}/campos/${c.slug}`).join('\n\n')}

---

## ENSAIOS (conteúdo completo)

${ensaios.map((e) => `### ${e.titulo}
${e.subtitulo ? `_${e.subtitulo}_\n` : ''}
Campo: ${campos.find((c) => c.slug === e.campo)?.nome ?? e.campo}
Data: ${e.data}
Tempo: ${e.tempo_leitura} min
URL: ${base}/ensaios/${e.slug}

${e.conteudo}

---
`).join('\n')}

## CONTATO

Email: eu@andreambrosio.com
Redes: @andreambrosio (Instagram, X, YouTube, LinkedIn)
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
