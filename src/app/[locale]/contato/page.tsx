import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';
import { CONTATO, CONTACT_EMAIL } from '@/lib/legal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const l = raw as Locale;
  return {
    title: CONTATO.eyebrow[l],
    description: CONTATO.lead[l],
    alternates: { canonical: localeHref('/contato', l), languages: hreflangAlternates('/contato') },
  };
}

const ORDER = ['imprensa', 'parceria', 'investimento', 'geral'] as const;

export default async function Contato({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const c = CONTATO;
  const mailto = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="bg-bg text-text min-h-screen">
      <section className="px-6 md:px-[8rem] pt-28 md:pt-36 pb-16 border-b border-border">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-3 mb-9">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{c.eyebrow[locale]}</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] text-gold-foil mb-7 tracking-tight">{c.title[locale]}</h1>
          <p className="text-[1.0625rem] text-text-dim leading-[1.85] max-w-[560px]">{c.lead[locale]}</p>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-16">
        <div className="max-w-[900px] mx-auto grid sm:grid-cols-2 gap-5">
          {ORDER.map((k) => {
            const it = c.intents[k];
            return (
              <a
                key={k}
                href={mailto(`${it.label[locale]} — Andre Ambrósio`)}
                className="group rounded-[20px] border border-border bg-surface p-7 hover:border-champagne transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-3 gap-4">
                  <h2 className="font-display font-light text-[1.5rem] text-text tracking-tight group-hover:text-champagne transition-colors">{it.label[locale]}</h2>
                  <ArrowUpRight size={18} className="shrink-0 text-text-dimmer group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-[13.5px] text-text-dim leading-relaxed">{it.desc[locale]}</p>
              </a>
            );
          })}
        </div>
        <div className="max-w-[900px] mx-auto mt-12 text-center">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-3">{c.emailLabel[locale]}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-display font-light text-[clamp(1.25rem,2.5vw,1.75rem)] text-text hover:text-champagne transition-colors">
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
}
