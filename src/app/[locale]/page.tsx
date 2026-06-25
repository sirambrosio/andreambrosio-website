import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getAllEnsaios } from '@/lib/ensaios';
import { getCampos, campoNome } from '@/lib/content';
import { getDict } from '@/lib/dictionary';
import { asLocale } from '@/lib/i18n';
import { localeHref } from '@/lib/route-translations';
import { NewsletterCapture } from '@/components/NewsletterCapture';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const d = getDict(locale);
  const campos = getCampos(locale);
  const ensaios = getAllEnsaios(locale).slice(0, 3);
  const lh = (p: string) => localeHref(p, locale);
  const romanos = ['I', 'II', 'III', 'IV'];

  return (
    <div className="bg-bg text-text">
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-86px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 md:w-[52%] md:right-auto">
          <Image src="/assets/andre-portrait.jpg" alt="Andre Ambrósio" fill priority sizes="(max-width:768px) 100vw, 52vw" className="object-cover object-[30%_center]" />
          <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(180deg, rgba(var(--overlay-fade),0.2) 0%, rgba(var(--overlay-fade),0.85) 60%, var(--bg) 100%)' }} />
          <div className="hidden md:block absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(var(--overlay-fade),0.3) 0%, rgba(var(--overlay-fade),0.15) 40%, var(--bg) 100%)' }} />
        </div>

        <div className="relative z-10 w-full px-6 md:px-[5rem] py-24 md:py-0 md:ml-[52%]">
          <div className="max-w-[620px]">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-[40px] h-[1px] bg-champagne" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{d.home.eyebrow}</span>
            </div>

            <h1 className="font-display font-light text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.98] tracking-[-0.03em] text-text mb-8">
              {d.home.h1Line1}<br />
              <span className="italic text-gold-foil">{d.home.h1Line2}</span>.
            </h1>

            <p className="text-[1.0625rem] md:text-[1.125rem] text-text-dim leading-[1.85] mb-10 max-w-[540px]">
              {d.home.lead}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link href={lh('/ensaios')} className="group inline-flex items-center gap-3 text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-champagne hover:text-text transition-colors">
                <span className="w-[24px] h-[1px] bg-current transition-all group-hover:w-[48px]" />
                {d.home.ctaEssays}
              </Link>
              <Link href={lh('/sobre')} className="text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors">
                {d.home.ctaAbout} →
              </Link>
            </div>

            {/* CAPTURA NO HERO */}
            <div className="mt-12 pt-9 border-t border-border max-w-[460px]">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-3">{d.footer.newsletterTitle}</p>
              <NewsletterCapture
                variant="hero"
                labels={{
                  placeholder: d.footer.newsletterPlaceholder,
                  submit: d.footer.newsletterSubmit,
                  success: d.footer.newsletterSuccess,
                  error: d.footer.newsletterError,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CAMPOS */}
      <section className="px-6 md:px-[5rem] py-24 md:py-32 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20 text-center" data-reveal>
            <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-8">§ I · {d.home.camposEyebrow}</div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-text">
              {d.home.camposTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-champagne/10">
            {campos.map((c, i) => (
              <Link key={c.slug} href={lh(`/campos/${c.slug}`)} className="group bg-surface p-10 md:p-14 flex flex-col min-h-[280px] hover:bg-bg transition-colors">
                <span className="font-mono text-[11px] tracking-[0.3em] text-champagne mb-5">{romanos[i]}</span>
                <h3 className="font-display font-light text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.05] text-text mb-3 tracking-tight group-hover:text-champagne transition-colors">{c.nome}</h3>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-5">{c.subtitulo}</p>
                <p className="text-[13.5px] text-text-dim leading-[1.75] flex-1 max-w-[420px]">{c.descricao}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono font-semibold tracking-[0.25em] uppercase text-champagne opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  {d.home.explorar} <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ÚLTIMOS ENSAIOS */}
      {ensaios.length > 0 && (
        <section className="px-6 md:px-[8rem] py-24 md:py-32">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-4" data-reveal>
              <div>
                <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-6">§ II · {d.home.ensaiosEyebrow}</div>
                <h2 className="font-display font-light text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] text-text tracking-tight">{d.home.ensaiosTitle}</h2>
              </div>
              <Link href={lh('/ensaios')} className="group inline-flex items-center gap-3 text-[11px] font-mono font-semibold tracking-[0.25em] uppercase text-champagne hover:text-text transition-colors">
                <span className="w-[24px] h-[1px] bg-current transition-all group-hover:w-[48px]" />
                {d.common.verTodos}
              </Link>
            </div>

            <div className="border-y border-border">
              {ensaios.map((e) => (
                <Link key={e.slug} href={lh(`/ensaios/${e.slug}`)} className="group grid grid-cols-[80px_1fr_auto] md:grid-cols-[120px_1fr_auto_auto] items-baseline gap-6 md:gap-10 py-8 border-b border-border last:border-b-0 hover:pl-4 transition-all">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">{campoNome(e.campo, locale)}</span>
                  <div>
                    <h3 className="font-display font-light text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.2] text-text tracking-tight group-hover:italic transition-all">{e.titulo}</h3>
                    {e.subtitulo && <p className="text-[13px] text-text-dim mt-1">{e.subtitulo}</p>}
                  </div>
                  <span className="hidden md:inline font-mono text-[10px] text-text-dimmer">{e.tempo_leitura} {d.ensaios.min}</span>
                  <span className="font-display text-[1.25rem] text-text-dimmer group-hover:text-champagne group-hover:translate-x-1 transition-all">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FECHO EDITORIAL */}
      <section className="relative px-6 md:px-[8rem] py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
          <Image src="/assets/gen-library.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(var(--overlay-fade),0.5) 0%, rgba(var(--overlay-fade),0.95) 70%, var(--bg) 100%)' }} />
        </div>
        <div className="relative max-w-[820px] mx-auto text-center" data-reveal>
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-8">§ III · {d.home.ctaBannerEyebrow}</div>
          <p className="font-display italic text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.3] text-gold-foil tracking-tight">
            “{d.home.ctaBannerTitle}”
          </p>
        </div>
      </section>
    </div>
  );
}
