/**
 * Índice de busca do Spotlight — montado server-side (lê ensaios via fs) e
 * passado como prop pro componente client. Localizado por idioma.
 */
import { getAllEnsaios } from '@/lib/ensaios';
import { getCampos, getEmpresas } from '@/lib/content';
import { getDict } from '@/lib/dictionary';
import { type Locale } from '@/lib/i18n';
import { localeHref } from '@/lib/route-translations';

export type SearchGroup = 'pages' | 'fields' | 'essays' | 'companies';

export interface SearchDoc {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
}

export function getSearchIndex(locale: Locale): SearchDoc[] {
  const d = getDict(locale);
  const lh = (p: string) => localeHref(p, locale);

  const pages: SearchDoc[] = [
    { id: 'home', group: 'pages', title: d.nav.inicio, href: lh('/'), keywords: d.footer.tagline },
    { id: 'sobre', group: 'pages', title: d.nav.sobre, href: lh('/sobre'), keywords: d.sobre.lead },
    { id: 'campos', group: 'pages', title: d.nav.campos, href: lh('/campos'), keywords: d.campos.lead },
    { id: 'ensaios', group: 'pages', title: d.nav.ensaios, href: lh('/ensaios'), keywords: d.ensaios.lead },
    { id: 'empresas', group: 'pages', title: d.nav.empresas, href: lh('/empresas'), keywords: d.empresas.lead },
  ];

  const fields: SearchDoc[] = getCampos(locale).map((c) => ({
    id: `campo-${c.slug}`,
    group: 'fields',
    title: c.nome,
    subtitle: c.subtitulo,
    href: lh(`/campos/${c.slug}`),
    keywords: c.descricao,
  }));

  const essays: SearchDoc[] = getAllEnsaios(locale).map((e) => ({
    id: `ensaio-${e.slug}`,
    group: 'essays',
    title: e.titulo,
    subtitle: e.subtitulo,
    href: lh(`/ensaios/${e.slug}`),
    keywords: e.resumo,
  }));

  const companies: SearchDoc[] = getEmpresas(locale).map((e) => ({
    id: `empresa-${e.nome.toLowerCase().replace(/\s+/g, '-')}`,
    group: 'companies',
    title: e.nome,
    subtitle: e.tag,
    href: e.url || lh('/empresas'),
    keywords: e.desc,
  }));

  return [...pages, ...fields, ...essays, ...companies];
}
