import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getCampos } from '@/lib/content';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, localeHref, hreflangAlternates, type Locale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const d = getDict(raw as Locale);
  return {
    title: d.campos.eyebrow,
    description: d.campos.lead,
    alternates: { canonical: `/${raw}/campos`, languages: hreflangAlternates('/campos') },
  };
}

export default async function CamposPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const d = getDict(locale);
  const campos = getCampos(locale);
  const romanos = ['I', 'II', 'III', 'IV'];

  return (
    <div className="bg-bg text-text">
      <section className="px-6 md:px-[8rem] pt-24 pb-16 border-b border-border">
        <div className="max-w-[820px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{d.campos.eyebrow}</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,5rem)] leading-[0.98] text-gold-foil mb-8 tracking-tight">
            {d.campos.title}
          </h1>
          <p className="text-[1.0625rem] text-text-dim leading-[1.85] max-w-[640px]">
            {d.campos.lead}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-[5rem] py-20">
        <div className="max-w-[1400px] mx-auto space-y-px bg-champagne/10">
          {campos.map((c, i) => (
            <Link
              key={c.slug}
              href={localeHref(`/campos/${c.slug}`, locale)}
              className={`group grid grid-cols-1 md:grid-cols-2 bg-bg min-h-[380px] ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="relative aspect-[4/3] md:aspect-auto min-h-[260px] overflow-hidden">
                <Image src={c.img} alt={c.nome} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bg via-transparent to-transparent" />
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <span className="font-mono text-[11px] tracking-[0.3em] text-champagne mb-5">{romanos[i]}</span>
                <h2 className="font-display font-light text-[clamp(2rem,3vw,2.75rem)] leading-[1] tracking-[-0.02em] text-text mb-4 group-hover:italic transition-all">{c.nome}</h2>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-6">{c.subtitulo}</p>
                <p className="text-[14.5px] text-text-dim leading-[1.8] max-w-[460px] mb-6">{c.descricao}</p>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono font-semibold tracking-[0.25em] uppercase text-champagne opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  {d.campos.verEnsaios} <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
