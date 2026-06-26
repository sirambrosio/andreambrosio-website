import type { Locale } from '@/lib/i18n';

/**
 * Veículos de imprensa que destacaram Andre Ambrósio (prova social factual).
 * Logos oficiais + link da matéria original (recuperada do site antigo).
 */
const OUTLETS: { name: string; logo: string; url?: string }[] = [
  { name: 'G1', logo: '/assets/media/g1.svg', url: 'https://g1.globo.com' },
  { name: 'PEGN', logo: '/assets/media/pegn.png', url: 'http://revistapegn.globo.com/Startups/noticia/2014/08/bome-oferece-programa-de-vantagens-para-pequenos-e-medios-negocios.html' },
  { name: 'O Povo', logo: '/assets/media/opovo.svg', url: 'https://www.youtube.com/watch?v=3flyzlbhlFE' },
  { name: 'Startupi', logo: '/assets/media/startupi.svg', url: 'https://startupi.com.br/2014/07/aceleradora-85-labs-anuncia-primeira-turma-de-startups/' },
  { name: 'Tribuna do Ceará', logo: '/assets/media/tribuna.svg' },
];

const LABEL: Record<Locale, string> = {
  pt: 'Como visto na mídia',
  en: 'As featured in',
  es: 'Visto en los medios',
  zh: '媒体报道',
  fr: 'Vu dans les médias',
  de: 'Bekannt aus den Medien',
  ja: 'メディア掲載',
  ru: 'О нём писали',
};

export function MediaStrip({ locale }: { locale: Locale }) {
  const plate =
    'inline-flex items-center justify-center h-12 px-5 rounded-xl bg-white border border-border-strong/50 shadow-sm transition-all';
  return (
    <section className="px-6 md:px-10 py-8 border-b border-border bg-surface">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze shrink-0">{LABEL[locale]}</span>
        <div className="flex flex-wrap items-center gap-3">
          {OUTLETS.map((o) => {
            // eslint-disable-next-line @next/next/no-img-element
            const img = <img src={o.logo} alt={o.name} loading="lazy" className="h-[22px] md:h-6 w-auto object-contain" />;
            return o.url ? (
              <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer" title={o.name} className={`${plate} hover:border-champagne hover:-translate-y-px`}>
                {img}
              </a>
            ) : (
              <span key={o.name} title={o.name} className={plate}>
                {img}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
