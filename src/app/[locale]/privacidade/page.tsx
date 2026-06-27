import type { Metadata } from 'next';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';
import { PRIVACIDADE } from '@/lib/legal';

const UPDATED = '2026-06-27';
const ORDER = ['dados', 'base', 'retencao', 'direitos', 'contato'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const l = raw as Locale;
  return {
    title: PRIVACIDADE.title[l],
    description: PRIVACIDADE.lead[l],
    alternates: { canonical: localeHref('/privacidade', l), languages: hreflangAlternates('/privacidade') },
    robots: { index: true, follow: true },
  };
}

export default async function Privacidade({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const p = PRIVACIDADE;

  return (
    <div className="bg-bg text-text min-h-screen">
      <section className="px-6 md:px-[8rem] pt-28 md:pt-36 pb-14 border-b border-border">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-3 mb-9">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{p.eyebrow[locale]}</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] text-gold-foil mb-6 tracking-tight">{p.title[locale]}</h1>
          <p className="text-[1.0625rem] text-text-dim leading-[1.85] max-w-[600px]">{p.lead[locale]}</p>
          <p className="mt-6 font-mono text-[11px] tracking-[0.1em] text-text-dimmer">{p.updatedLabel[locale]}: {UPDATED}</p>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-16">
        <div className="max-w-[760px] mx-auto space-y-12">
          {ORDER.map((k) => (
            <div key={k}>
              <h2 className="font-display font-light text-[1.5rem] text-text tracking-tight mb-3">{p.sections[k].h[locale]}</h2>
              <p className="text-[15px] text-text-dim leading-[1.85]">{p.sections[k].p[locale]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
