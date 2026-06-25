/**
 * Leitura dos ensaios (server-only — usa node:fs).
 * Corpo (MDX) permanece no idioma original (PT); título/subtítulo/resumo são
 * localizados via overlay de @/lib/content quando há tradução disponível.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import { ENSAIO_I18N, type CampoSlug } from '@/lib/content';

export type { CampoSlug } from '@/lib/content';

export type Ensaio = {
  slug: string;
  titulo: string;
  subtitulo?: string;
  resumo: string;
  campo: CampoSlug;
  data: string;
  tempo_leitura: number;
  destaque?: boolean;
  imagem?: string;
  conteudo: string;
  /** true quando título/resumo foram exibidos no locale pedido (não no original PT) */
  metaLocalized: boolean;
};

const ENSAIOS_DIR = path.join(process.cwd(), 'src/content/ensaios');

type RawEnsaio = Omit<Ensaio, 'metaLocalized'>;

function readRaw(): RawEnsaio[] {
  if (!fs.existsSync(ENSAIOS_DIR)) return [];
  const files = fs.readdirSync(ENSAIOS_DIR).filter((f) => f.endsWith('.mdx'));
  const ensaios = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(ENSAIOS_DIR, filename), 'utf8');
    const { data, content } = matter(raw);
    return {
      slug,
      titulo: data.titulo || '',
      subtitulo: data.subtitulo,
      resumo: data.resumo || '',
      campo: (data.campo || 'tecnologia') as CampoSlug,
      data:
        typeof data.data === 'string'
          ? data.data
          : data.data instanceof Date
            ? data.data.toISOString().slice(0, 10)
            : '2026-01-01',
      tempo_leitura: data.tempo_leitura || 5,
      destaque: data.destaque || false,
      imagem: data.imagem,
      conteudo: content,
    } as RawEnsaio;
  });
  return ensaios.sort((a, b) => (a.data > b.data ? -1 : 1));
}

/** Corpo traduzido em content/ensaios/<locale>/<slug>.mdx (markdown puro). */
function readLocalizedBody(slug: string, locale: Locale): string | null {
  if (locale === DEFAULT_LOCALE) return null;
  const p = path.join(ENSAIOS_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(p)) return null;
  const { content } = matter(fs.readFileSync(p, 'utf8'));
  return content.trim() ? content : null;
}

function localize(e: RawEnsaio, locale: Locale): Ensaio {
  const overlay = ENSAIO_I18N[e.slug]?.[locale];
  const body = readLocalizedBody(e.slug, locale);
  return {
    ...e,
    titulo: overlay?.titulo ?? e.titulo,
    subtitulo: overlay?.subtitulo ?? e.subtitulo,
    resumo: overlay?.resumo ?? e.resumo,
    conteudo: body ?? e.conteudo,
    // nota "original em português" só quando o locale ≠ pt E o corpo NÃO foi traduzido
    metaLocalized: locale !== DEFAULT_LOCALE && !body,
  };
}

export function getAllEnsaios(locale: Locale = DEFAULT_LOCALE): Ensaio[] {
  return readRaw().map((e) => localize(e, locale));
}

export function getEnsaio(slug: string, locale: Locale = DEFAULT_LOCALE): Ensaio | null {
  const raw = readRaw().find((e) => e.slug === slug);
  return raw ? localize(raw, locale) : null;
}

export function getEnsaiosPorCampo(campo: CampoSlug, locale: Locale = DEFAULT_LOCALE): Ensaio[] {
  return getAllEnsaios(locale).filter((e) => e.campo === campo);
}
