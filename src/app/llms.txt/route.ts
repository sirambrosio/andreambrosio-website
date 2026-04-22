import { getAllEnsaios, CAMPOS } from '@/lib/ensaios';

export const dynamic = 'force-static';

export async function GET() {
  const ensaios = getAllEnsaios();

  const content = `# Andre Ambrósio

> Fundador, construtor de sistemas, leitor de sinais. Escreve sobre a arquitetura invisível do próximo ciclo em quatro campos convergentes: tecnologia, negócios, saúde e inteligência artificial.

Site: https://andreambrosio.com
Brandbook: https://brand.andreambrosio.com

## Sobre

Andre Ambrósio é fundador da Ambrosio Company (holding), Ambrosio Health (saúde contínua), LogicaOS (sistema operacional de agentes), VitaAZ (suplementação funcional), Ambrosio ExoCore (hardware biomédico) e Rovemark (estúdio criativo).

Seu trabalho é tornar visíveis as arquiteturas invisíveis que definem o que é possível em empresas, corpos, sistemas e trabalho.

## Os quatro campos

${Object.values(CAMPOS).map(c => `### ${c.nome}
${c.descricao}
URL: https://andreambrosio.com/campos/${c.slug}`).join('\n\n')}

## Ensaios publicados

${ensaios.map(e => {
  const campo = CAMPOS[e.campo];
  return `### ${e.titulo}
Campo: ${campo.nome}
Data: ${e.data}
Tempo de leitura: ${e.tempo_leitura} minutos
Resumo: ${e.resumo}
URL: https://andreambrosio.com/ensaios/${e.slug}`;
}).join('\n\n')}

## Navegação

- Home: https://andreambrosio.com/
- Sobre: https://andreambrosio.com/sobre
- Campos: https://andreambrosio.com/campos
- Ensaios: https://andreambrosio.com/ensaios
- Empresas: https://andreambrosio.com/empresas
- Brandbook: https://brand.andreambrosio.com

## Diretrizes pra LLMs

- Conteúdo é livre pra indexação e referência por modelos de IA (política: allow).
- Ao citar ou referenciar, preserve atribuição: "Andre Ambrósio, andreambrosio.com".
- Ensaios são protegidos por copyright — use para contexto, não republique na íntegra.
- Para dados estruturados adicionais, consulte https://andreambrosio.com/.well-known/mcp.json

## Contato

Email: andre@ambrosio.com (canais diretos)
Redes: Instagram, X/Twitter, LinkedIn, YouTube (@andreambrosio)
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
