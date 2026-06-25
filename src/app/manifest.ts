import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Andre Ambrósio',
    short_name: 'A. Ambrósio',
    description: 'Ensaios e leituras sistêmicas sobre tecnologia, negócios, saúde e IA.',
    start_url: '/',
    display: 'standalone',
    background_color: '#151A1A',
    theme_color: '#151A1A',
    lang: 'pt-BR',
    categories: ['education', 'business', 'news'],
    icons: [
      { src: '/assets/simbolo-andre-ambrosio-dark.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/simbolo-andre-ambrosio-dark.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
