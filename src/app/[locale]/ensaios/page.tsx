import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllEnsaios } from '@/lib/ensaios';
import { campoNome } from '@/lib/content';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';
import { NewsletterCapture } from '@/components/NewsletterCapture';
import { EnsaiosPortal } from '@/components/journal/EnsaiosPortal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const d = getDict(raw as Locale);
  return {
    title: d.ensaios.eyebrow,
    description: d.ensaios.lead,
    alternates: { canonical: localeHref('/ensaios', raw as Locale), languages: hreflangAlternates('/ensaios') },
  };
}

export default async function EnsaiosPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const d = getDict(locale);
  const ensaios = getAllEnsaios(locale);

  const items = ensaios.map((e) => ({
    slug: e.slug,
    titulo: e.titulo,
    subtitulo: e.subtitulo ?? '',
    resumo: e.resumo,
    campo: e.campo,
    campoNome: campoNome(e.campo, locale),
    data: e.data,
    tempo: e.tempo_leitura,
    destaque: !!e.destaque,
    imagem: e.imagem || `/assets/gen-campo-${e.campo}.png`,
    href: localeHref(`/ensaios/${e.slug}`, locale),
  }));
  const featured = items.find((e) => e.destaque) ?? items[0] ?? null;
  const ordem = [...new Set(items.map((e) => e.campo))];
  const tabs = ordem
    .map((slug) => {
      const list = items.filter((e) => e.campo === slug);
      return { slug, nome: list[0].campoNome, count: list.length };
    })
    .filter((t) => t.count > 0);

  const labels = {
    ler: d.common.ler,
    min: d.ensaios.min,
    nenhum: d.ensaios.nenhum,
    buscar: d.ensaios.buscar,
    todosCurto: d.ensaios.todosCurto,
    camposTitle: d.ensaios.camposTitle,
    recentesTitle: d.ensaios.recentesTitle,
  };
  const nl = {
    title: d.footer.newsletterTitle,
    lead: d.footer.newsletterLead,
    placeholder: d.footer.newsletterPlaceholder,
    submit: d.footer.newsletterSubmit,
    success: d.footer.newsletterSuccess,
    error: d.footer.newsletterError,
  };

  return (
    <div className="bg-bg text-text min-h-screen">
      {/* HERO cinematográfico full-bleed — imagem arquitetural atrás do menu transparente */}
      <section className="bg-oled relative -mt-[86px] min-h-[82vh] md:min-h-[90vh] flex items-end overflow-hidden">
        <Image src="/assets/ensaios-hero.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        {/* escurece base, lado esquerdo (texto) e topo (menu) */}
        <div className="absolute inset-0 bg-gradient-to-t from-oled via-oled/55 to-oled/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-oled/85 via-oled/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-oled/85 via-oled/40 to-transparent" />

        <div className="relative z-10 w-full px-6 md:px-[8rem] pt-[150px] pb-16 md:pb-24">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-[40px] h-[1px] bg-champagne" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{d.ensaios.eyebrow}</span>
            </div>
            <h1
              className="font-display font-light text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.96] text-cream tracking-tight mb-7"
            >
              {d.ensaios.title}
            </h1>
            <p className="text-[1.0625rem] md:text-[1.1875rem] text-cream/75 leading-[1.8] max-w-[600px] mb-10">
              {d.ensaios.lead}
            </p>
            <div className="max-w-[460px]">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-cream/55 mb-3">{d.footer.newsletterTitle}</p>
              <NewsletterCapture
                variant="footer"
                source="ensaios-hero"
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

      {items.length === 0 ? (
        <section className="px-6 md:px-[8rem] py-20">
          <div className="max-w-[1100px] mx-auto rounded-[20px] border border-border bg-surface p-12 text-center">
            <p className="text-[14px] text-text-dim">{d.ensaios.nenhum}</p>
          </div>
        </section>
      ) : (
        <EnsaiosPortal items={items} featuredSlug={featured?.slug ?? null} tabs={tabs} labels={labels} nl={nl} />
      )}

      {/* FECHO / CTA newsletter — garante captura no mobile (rail some) */}
      <section className="relative px-6 md:px-[8rem] py-28 mt-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-[0.16] pointer-events-none">
          <Image src="/assets/gen-library.png" alt="" fill sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(var(--overlay-fade),0.55) 0%, rgba(var(--overlay-fade),0.95) 70%, var(--bg) 100%)',
            }}
          />
        </div>
        <div className="relative max-w-[560px] mx-auto text-center">
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-6">{d.footer.newsletterEyebrow}</div>
          <p className="font-display italic text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] text-gold-foil tracking-tight mb-8">
            “{d.footer.ctaTitle}”
          </p>
          <div className="flex justify-center">
            <NewsletterCapture
              variant="hero"
              source="ensaios-fecho"
              labels={{
                placeholder: d.footer.newsletterPlaceholder,
                submit: d.footer.newsletterSubmit,
                success: d.footer.newsletterSuccess,
                error: d.footer.newsletterError,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
