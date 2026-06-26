import type { Locale } from '@/lib/i18n';

/** Veículos de imprensa que destacaram Andre Ambrósio (prova social factual). */
const OUTLETS = ['G1', 'PEGN', 'O Povo', 'Startup-i', 'Tribuna do Ceará'];

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
  return (
    <section className="px-6 md:px-10 py-9 border-b border-border bg-surface">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze shrink-0">{LABEL[locale]}</span>
        <div className="flex flex-wrap items-center gap-x-7 sm:gap-x-10 gap-y-2">
          {OUTLETS.map((o) => (
            <span key={o} className="font-display font-light text-[1.125rem] md:text-[1.375rem] tracking-tight text-text-dim/70">
              {o}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
