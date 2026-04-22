import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Ensaio = {
  slug: string;
  titulo: string;
  subtitulo?: string;
  resumo: string;
  campo: 'tecnologia' | 'negocios' | 'saude' | 'ia';
  data: string;
  tempo_leitura: number;
  destaque?: boolean;
  imagem?: string;
  conteudo: string;
};

const ENSAIOS_DIR = path.join(process.cwd(), 'src/content/ensaios');

export function getAllEnsaios(): Ensaio[] {
  if (!fs.existsSync(ENSAIOS_DIR)) return [];
  const files = fs.readdirSync(ENSAIOS_DIR).filter(f => f.endsWith('.mdx'));
  const ensaios = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(ENSAIOS_DIR, filename), 'utf8');
    const { data, content } = matter(raw);
    return {
      slug,
      titulo: data.titulo || '',
      subtitulo: data.subtitulo,
      resumo: data.resumo || '',
      campo: data.campo || 'tecnologia',
      data: typeof data.data === 'string' ? data.data : data.data instanceof Date ? data.data.toISOString().slice(0, 10) : '2026-01-01',
      tempo_leitura: data.tempo_leitura || 5,
      destaque: data.destaque || false,
      imagem: data.imagem,
      conteudo: content,
    } as Ensaio;
  });
  return ensaios.sort((a, b) => (a.data > b.data ? -1 : 1));
}

export function getEnsaio(slug: string): Ensaio | null {
  return getAllEnsaios().find(e => e.slug === slug) ?? null;
}

export function getEnsaiosPorCampo(campo: Ensaio['campo']): Ensaio[] {
  return getAllEnsaios().filter(e => e.campo === campo);
}

export const CAMPOS = {
  tecnologia: {
    slug: 'tecnologia',
    nome: 'Tecnologia',
    subtitulo: 'Infraestrutura digital como ambiente',
    descricao:
      'Leitura da arquitetura digital que está sendo reescrita — da camada física ao comportamento humano. Sistemas se tornando ambiente invisível.',
    img: '/assets/gen-campo-tecnologia.png',
    cor: '#C0C4C4',
  },
  negocios: {
    slug: 'negocios',
    nome: 'Negócios',
    subtitulo: 'Vantagem estrutural em transição',
    descricao:
      'Arquitetura de empresas que sobrevivem à passagem de era. Modelos de receita, vantagem durável, o que escala sob a nova lógica.',
    img: '/assets/gen-campo-negocios.png',
    cor: '#A87248',
  },
  saude: {
    slug: 'saude',
    nome: 'Saúde',
    subtitulo: 'Soberania biológica',
    descricao:
      'Saúde como infraestrutura pessoal — contínua, preditiva, legível. Engenharia humana no lugar da medicina reativa.',
    img: '/assets/gen-campo-saude.png',
    cor: '#0F3326',
  },
  ia: {
    slug: 'ia',
    nome: 'Inteligência Artificial',
    subtitulo: 'Camada de decisão',
    descricao:
      'IA não como hype — como infraestrutura que reescreve trabalho, saúde, sistemas produtivos e a relação humano-máquina.',
    img: '/assets/gen-campo-ia.png',
    cor: '#C9A961',
  },
} as const;

export type CampoSlug = keyof typeof CAMPOS;
