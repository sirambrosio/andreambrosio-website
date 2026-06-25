import type { MetadataRoute } from 'next';
import { getAllEnsaios } from '@/lib/ensaios';
import { CAMPO_ORDER } from '@/lib/content';
import { LOCALES, LOCALE_META, SITE_URL } from '@/lib/i18n';

type Freq = 'weekly' | 'monthly' | 'yearly';

export default function sitemap(): MetadataRoute.Sitemap {
  const ensaios = getAllEnsaios();

  const canonical: { path: string; priority: number; freq: Freq; lastModified?: string }[] = [
    { path: '/', priority: 1, freq: 'weekly' },
    { path: '/sobre', priority: 0.9, freq: 'monthly' },
    { path: '/campos', priority: 0.8, freq: 'weekly' },
    { path: '/ensaios', priority: 0.9, freq: 'weekly' },
    { path: '/empresas', priority: 0.7, freq: 'monthly' },
    ...CAMPO_ORDER.map((slug) => ({ path: `/campos/${slug}`, priority: 0.7, freq: 'weekly' as Freq })),
    ...ensaios.map((e) => ({ path: `/ensaios/${e.slug}`, priority: 0.8, freq: 'yearly' as Freq, lastModified: e.data })),
  ];

  const url = (loc: string, path: string) => `${SITE_URL}/${loc}${path === '/' ? '' : path}`;

  const entries: MetadataRoute.Sitemap = [];
  for (const p of canonical) {
    const languages: Record<string, string> = {};
    for (const loc of LOCALES) languages[LOCALE_META[loc].hreflang] = url(loc, p.path);

    for (const loc of LOCALES) {
      entries.push({
        url: url(loc, p.path),
        changeFrequency: p.freq,
        priority: p.priority,
        lastModified: p.lastModified ? new Date(p.lastModified) : undefined,
        alternates: { languages },
      });
    }
  }

  return entries;
}
