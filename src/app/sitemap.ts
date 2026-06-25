import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';
import { localeUrl, hreflangAlternates } from '@/lib/route-translations';
import { CAMPO_ORDER } from '@/lib/content';
import { getAllEnsaios } from '@/lib/ensaios';

/**
 * Sitemap com URLs LOCALIZADAS (slugs traduzidos) + alternates hreflang em cada
 * entrada. 8 idiomas × rotas. Foco SEO/GEO máximo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ensaios = getAllEnsaios();
  const entries: { path: string; lastModified?: string }[] = [
    { path: '/' },
    { path: '/sobre' },
    { path: '/campos' },
    { path: '/ensaios' },
    { path: '/empresas' },
    ...CAMPO_ORDER.map((s) => ({ path: `/campos/${s}` })),
    ...ensaios.map((e) => ({ path: `/ensaios/${e.slug}`, lastModified: e.data })),
  ];

  const out: MetadataRoute.Sitemap = [];
  for (const { path, lastModified } of entries) {
    const languages = hreflangAlternates(path);
    for (const loc of LOCALES) {
      out.push({
        url: localeUrl(path, loc),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        alternates: { languages },
      });
    }
  }
  return out;
}
