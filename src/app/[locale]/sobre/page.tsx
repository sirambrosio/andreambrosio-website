import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const d = getDict(raw as Locale);
  return {
    title: d.nav.sobre,
    description: d.sobre.lead,
    alternates: { canonical: localeHref('/sobre', raw as Locale), languages: hreflangAlternates('/sobre') },
    openGraph: { title: `${d.nav.sobre} — Andre Ambrósio`, description: d.sobre.lead },
  };
}

export default async function Sobre({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const d = getDict(locale);
  const lh = (p: string) => localeHref(p, locale);
  const romanos = ['I', 'II', 'III', 'IV'];
  const paras = [d.sobre.p1, d.sobre.p2, d.sobre.p3, d.sobre.p4];

  return (
    <div className="bg-bg text-text">
      <section className="relative min-h-[calc(100vh-86px)] flex items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 md:w-[48%] md:right-auto">
          <Image src="/assets/andre-portrait.jpg" alt="Andre Ambrósio" fill priority sizes="(max-width:768px) 100vw, 48vw" className="object-cover object-[30%_center]" />
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-transparent via-bg/70 to-bg" />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-bg/10 to-bg" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-[5rem] py-24 md:py-0 md:ml-[48%]">
          <div className="max-w-[580px]">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-[40px] h-[1px] bg-champagne" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{d.sobre.eyebrow}</span>
            </div>
            <h1 className="font-display font-light text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-text mb-8">
              Andre <span className="italic text-gold-foil">Ambrósio</span>.
            </h1>
            <p className="text-[1.0625rem] text-text-dim leading-[1.85]">
              {d.sobre.lead}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-32">
        <div className="max-w-[680px] mx-auto">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-10 text-center">{d.sobre.secI}</div>
          <div className="space-y-7 text-[1.0625rem] leading-[1.85] text-text font-body">
            {paras.map((p, i) => (
              <p key={i} className={i === 0 ? 'first-letter:font-display first-letter:font-normal first-letter:text-[5rem] first-letter:float-left first-letter:mr-4 first-letter:leading-[0.85] first-letter:text-text' : ''}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-32 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 text-center">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-8">{d.sobre.secII}</div>
            <h2 className="font-display font-light text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] text-text tracking-tight">
              {d.sobre.axesTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {d.sobre.eixos.map((e, i) => (
              <div key={e.t} className="rounded-[20px] bg-bg border border-border p-8">
                <div className="font-mono text-[10px] tracking-[0.25em] text-champagne mb-4">{romanos[i]}</div>
                <div className="font-display font-light text-[1.75rem] text-text tracking-tight mb-3">{e.t}</div>
                <div className="text-[14px] text-text-dim leading-[1.75]">{e.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-32 bg-bg border-t border-border">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-10">{d.sobre.secIII}</div>
          <h2 className="font-display font-light text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] text-text tracking-tight mb-10">
            {d.sobre.ctaTitle}
          </h2>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            <Link href={lh('/ensaios')} className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gradient rounded-full text-[13px] font-semibold text-ink shadow-brand hover:opacity-90 transition-all">
              {d.sobre.ctaEssays} <ArrowRight size={14} />
            </Link>
            <Link href={lh('/empresas')} className="text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors">
              {d.sobre.verEmpresas} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
