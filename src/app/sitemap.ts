import type { MetadataRoute } from 'next';
import { getAllEnsaios, CAMPOS } from '@/lib/ensaios';

const BASE = 'https://andreambrosio.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const ensaios = getAllEnsaios();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/sobre`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/campos`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/ensaios`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/empresas`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const campoPages: MetadataRoute.Sitemap = Object.keys(CAMPOS).map(slug => ({
    url: `${BASE}/campos/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const ensaioPages: MetadataRoute.Sitemap = ensaios.map(e => ({
    url: `${BASE}/ensaios/${e.slug}`,
    lastModified: new Date(e.data),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...campoPages, ...ensaioPages];
}
