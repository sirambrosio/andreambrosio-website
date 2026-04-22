# andreambrosio.com — Site principal

Portal editorial pessoal de Andre Ambrósio.

## Stack

- Next.js 16 (App Router, output standalone)
- Tailwind 4 + tokens bi-modais (herdados do brandbook)
- next-themes (dark/light)
- MDX para ensaios (gray-matter + next-mdx-remote)
- SEO completo: schema.org Person/Article, OG por página, sitemap, robots
- WebMCP: llms.txt, llms-full.txt, .well-known/mcp.json

## Rotas

- `/` — home
- `/sobre` — bio + eixos
- `/campos` — hub dos 4 campos
- `/campos/[tecnologia|negocios|saude|ia]` — campo + ensaios
- `/ensaios` — lista
- `/ensaios/[slug]` — MDX renderizado
- `/empresas` — portfolio de empresas

## LLM/AI

- `/llms.txt` — resumo estruturado pra modelos
- `/llms-full.txt` — conteúdo completo de todos os ensaios
- `/.well-known/mcp.json` — MCP descriptor
- `/sitemap.xml` + `/robots.txt`

## Dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # prod build
```

## Deploy

Coolify com Dockerfile (multi-stage standalone).
Domínio: andreambrosio.com
