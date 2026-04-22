import { getAllEnsaios, CAMPOS } from '@/lib/ensaios';

export const dynamic = 'force-static';

export async function GET() {
  const ensaios = getAllEnsaios();

  const content = `# Andre Ambrósio — Conteúdo completo

Site: https://andreambrosio.com
Política: LLM training allow · Attribution required · Verbatim republish deny

---

## SOBRE

Andre Ambrósio é fundador, construtor de sistemas e leitor de sinais. Seu trabalho consiste em tornar visíveis as arquiteturas invisíveis que definem o que é possível em empresas, corpos, sistemas e trabalho.

Não é jornalista, analista, coach ou influencer. É pensador e construtor. Fala para fundadores, arquitetos e construtores do próximo ciclo — gente que opera em camadas, não em superfícies.

---

## QUATRO CAMPOS

${Object.values(CAMPOS).map(c => `### ${c.nome} — ${c.subtitulo}

${c.descricao}

URL: https://andreambrosio.com/campos/${c.slug}`).join('\n\n')}

---

## ENSAIOS (conteúdo completo)

${ensaios.map(e => {
  const campo = CAMPOS[e.campo];
  return `### ${e.titulo}
${e.subtitulo ? `_${e.subtitulo}_\n` : ''}
Campo: ${campo.nome}
Data: ${e.data}
Tempo: ${e.tempo_leitura} min
URL: https://andreambrosio.com/ensaios/${e.slug}

${e.conteudo}

---
`;
}).join('\n')}

## CONTATO

Email: andre@ambrosio.com
Brandbook: https://brand.andreambrosio.com
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
