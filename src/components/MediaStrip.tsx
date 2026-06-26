import type { Locale } from '@/lib/i18n';

/** Veículos de imprensa que destacaram Andre Ambrósio (prova social factual). */
const OUTLETS: { name: string; url?: string }[] = [
  { name: 'G1', url: 'https://g1.globo.com' },
  { name: 'PEGN', url: 'https://revistapegn.globo.com' },
  { name: 'O Povo', url: 'https://www.opovo.com.br' },
  { name: 'Startup-i', url: 'https://startupi.com.br' },
  { name: 'Tribuna do Ceará' },
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
  const wordmark =
    'font-display font-light text-[1.0625rem] md:text-[1.1875rem] tracking-tight transition-colors';
  return (
    <section className="px-6 md:px-10 py-9 border-b border-border bg-surface">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze shrink-0">{LABEL[locale]}</span>
        <div className="flex flex-wrap items-center gap-2.5">
          {OUTLETS.map((o) =>
            o.url ? (
              <a
                key={o.name}
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                title={o.name}
                className="group inline-flex items-center px-4 py-2 rounded-full border border-border hover:border-champagne hover:bg-bg transition-all hover:-translate-y-px"
              >
                <span className={`${wordmark} text-text-dim group-hover:text-text`}>{o.name}</span>
              </a>
            ) : (
              <span key={o.name} className="inline-flex items-center px-4 py-2 rounded-full border border-border">
                <span className={`${wordmark} text-text-dim`}>{o.name}</span>
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
