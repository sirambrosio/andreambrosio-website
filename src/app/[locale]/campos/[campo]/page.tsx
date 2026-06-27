import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCampo, getCampos, CAMPO_ORDER, type CampoSlug } from '@/lib/content';
import { getEnsaiosPorCampo } from '@/lib/ensaios';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, SITE_URL, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';
import { Breadcrumb } from '@/components/Breadcrumb';

export function generateStaticParams() {
  return CAMPO_ORDER.map((campo) => ({ campo }));
}

function isCampo(x: string): x is CampoSlug {
  return (CAMPO_ORDER as string[]).includes(x);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; campo: string }> }): Promise<Metadata> {
  const { locale: raw, campo } = await params;
  if (!isLocale(raw) || !isCampo(campo)) return {};
  const c = getCampo(campo, raw as Locale);
  return {
    title: c.nome,
    description: c.descricao,
    alternates: { canonical: localeHref(`/campos/${campo}`, raw as Locale), languages: hreflangAlternates(`/campos/${campo}`) },
    openGraph: { title: `${c.nome} — ${c.subtitulo}`, description: c.descricao, images: [c.img] },
  };
}

export default async function CampoPage({ params }: { params: Promise<{ locale: string; campo: string }> }) {
  const { locale: rawLocale, campo } = await params;
  const locale: Locale = asLocale(rawLocale);
  if (!isCampo(campo)) notFound();
  const d = getDict(locale);
  const c = getCampo(campo, locale);
  const ensaios = getEnsaiosPorCampo(campo, locale);
  const camposArr = getCampos(locale);
  const idx = CAMPO_ORDER.indexOf(campo);
  const romano = ['I', 'II', 'III', 'IV'][idx];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: d.nav.inicio, item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: d.nav.campos, item: `${SITE_URL}/${locale}/campos` },
      { '@type': 'ListItem', position: 3, name: c.nome, item: `${SITE_URL}/${locale}/campos/${c.slug}` },
    ],
  };

  return (
    <div className="bg-bg text-text">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* HERO — cover banner editorial */}
      <header className="relative bg-oled">
        <div className="relative h-[46vh] min-h-[340px] md:h-[54vh] w-full overflow-hidden">
          <Image src={c.img} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,15,15,0.45) 0%, rgba(11,15,15,0.2) 38%, rgba(11,15,15,0.9) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-[8rem] pb-10 md:pb-14">
            <div className="max-w-[1100px] mx-auto">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-champagne">{d.campos.campoLabel} {romano}</span>
                <div className="w-[40px] h-[1px] bg-champagne" />
              </div>
              <h1 className="font-display font-light text-[clamp(2.25rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream mb-4">
                {c.nome}<span className="text-champagne">.</span>
              </h1>
              <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-bronze mb-5">{c.subtitulo}</p>
              <p className="text-[1.0625rem] text-cream/80 leading-[1.7] max-w-[640px]">{c.descricao}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ENSAIOS DO CAMPO */}
      <section className="px-6 md:px-12 lg:px-[8rem] py-24">
        <div className="max-w-[1200px] mx-auto mb-10">
          <Breadcrumb items={[{ label: d.nav.inicio, href: localeHref('/', locale) }, { label: d.nav.campos, href: localeHref('/campos', locale) }, { label: c.nome }]} />
        </div>
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-12">
            <span className="block font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-4">{d.campos.ensaiosLabel}</span>
            <h2 className="font-display font-light text-[clamp(1.75rem,2.8vw,2.5rem)] text-text tracking-tight">{d.campos.leiturasNeste}</h2>
          </div>

          {ensaios.length === 0 ? (
            <div className="rounded-[20px] border border-border bg-surface p-12 text-center">
              <p className="text-[14px] text-text-dim">{d.campos.nenhum}</p>
            </div>
          ) : (
            <div className="border-y border-border">
              {ensaios.map((e) => (
                <Link key={e.slug} href={localeHref(`/ensaios/${e.slug}`, locale)} className="group grid grid-cols-[60px_1fr_auto] md:grid-cols-[100px_1fr_auto_auto] items-baseline gap-6 md:gap-10 py-7 border-b border-border last:border-b-0 hover:pl-4 transition-all">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-champagne">{e.data.slice(0, 7)}</span>
                  <div>
                    <h3 className="font-display font-light text-[clamp(1.125rem,1.8vw,1.625rem)] leading-[1.2] text-text tracking-tight group-hover:italic transition-all">{e.titulo}</h3>
                    {e.subtitulo && <p className="text-[13px] text-text-dim mt-1">{e.subtitulo}</p>}
                  </div>
                  <span className="hidden md:inline font-mono text-[10px] text-text-dimmer">{e.tempo_leitura} {d.ensaios.min}</span>
                  <span className="font-display text-[1.125rem] text-text-dimmer group-hover:text-champagne group-hover:translate-x-1 transition-all">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OUTROS CAMPOS */}
      <section className="px-6 md:px-12 lg:px-[8rem] py-24 bg-surface border-t border-border">
        <div className="max-w-[1100px] mx-auto">
          <span className="block font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-4">{d.campos.outrosCampos}</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
            {camposArr.filter((o) => o.slug !== c.slug).map((o) => (
              <Link key={o.slug} href={localeHref(`/campos/${o.slug}`, locale)} className="rounded-[16px] bg-bg border border-border p-6 hover:border-champagne transition-all group">
                <div className="font-display font-light text-[1.375rem] text-text mb-2 tracking-tight group-hover:text-champagne transition-colors">{o.nome}</div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bronze">{o.subtitulo}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
