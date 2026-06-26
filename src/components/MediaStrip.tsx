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
  // monocromático que reage ao tema: escuro no light, claro no dark (dark:invert
  // também neutraliza o fundo branco do PNG da PEGN — vira preto e funde no escuro)
  const logoCls =
    'h-[26px] md:h-7 w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:opacity-100 dark:invert dark:opacity-70 dark:hover:opacity-100';
  return (
    <section className="px-6 md:px-10 py-9 border-b border-border bg-bg">
      <div className="max-w-[1100px] mx-auto flex flex-col items-center sm:flex-row sm:items-center sm:justify-center gap-5 sm:gap-9">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze shrink-0">{LABEL[locale]}</span>
        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 gap-y-4">
          {OUTLETS.map((o) => {
            // eslint-disable-next-line @next/next/no-img-element
            const img = <img src={o.logo} alt={o.name} loading="lazy" className={logoCls} />;
            return o.url ? (
              <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer" title={o.name} className="inline-flex items-center">
                {img}
              </a>
            ) : (
              <span key={o.name} title={o.name} className="inline-flex items-center">
                {img}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
