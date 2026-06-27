import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, Sparkles, Globe, BookOpen, Layers, Building2 } from 'lucide-react';
import { getDict } from '@/lib/dictionary';
import { getCampos, getEmpresas } from '@/lib/content';
import { getAllEnsaios } from '@/lib/ensaios';
import { getSearchIndex } from '@/lib/search';
import { LOCALES, type Locale } from '@/lib/i18n';
import { localeHref } from '@/lib/route-translations';
import { SOCIALS } from '@/lib/socials';
import { SocialIcon } from './SocialIcon';
import { NewsletterCapture } from './NewsletterCapture';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SpotlightSearch } from './SpotlightSearch';

export function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const campos = getCampos(locale);
  const empresas = getEmpresas(locale);
  const ensaios = getAllEnsaios(locale);
  const docs = getSearchIndex(locale);
  const lh = (p: string) => localeHref(p, locale);
  const year = 2026;

  const siteLinks = [
    { href: lh('/sobre'), label: d.nav.sobre },
    { href: lh('/campos'), label: d.nav.campos },
    { href: lh('/ensaios'), label: d.nav.ensaios },
    { href: lh('/empresas'), label: d.nav.empresas },
    { href: lh('/links'), label: 'Links' },
  ];

  const stats = [
    { Icon: Globe, value: LOCALES.length, label: d.footer.statLanguages },
    { Icon: Layers, value: campos.length, label: d.footer.statFields },
    { Icon: BookOpen, value: ensaios.length, label: d.footer.statEssays },
    { Icon: Building2, value: empresas.length, label: d.footer.statCompanies },
  ];

  return (
    <footer className="relative bg-oled text-cream overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-champagne/[0.04] to-champagne/[0.08] pointer-events-none" />
      <div className="relative">
        {/* CTA */}
        <div className="border-b border-cream/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="font-display font-light text-[clamp(1.75rem,3vw,2.75rem)] leading-tight text-cream">{d.footer.ctaTitle}</h2>
                <p className="text-[14px] text-cream/55 mt-2 max-w-[520px]">{d.footer.ctaSubtitle}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href={lh('/ensaios')} className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-gradient text-ink rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity">
                  {d.footer.ctaPrimary} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={lh('/sobre')} className="inline-flex items-center gap-2 px-6 py-3.5 border border-cream/20 rounded-full text-[13px] font-medium text-cream hover:bg-cream/10 transition-colors">
                  <Sparkles className="w-4 h-4 text-champagne" /> {d.footer.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-b border-cream/10 bg-cream/[0.02]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-12 items-center">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-champagne font-semibold mb-3">
                  <Mail className="w-3 h-3" /> {d.footer.newsletterEyebrow}
                </p>
                <h3 className="font-display font-light text-[clamp(1.5rem,2.5vw,2.25rem)] text-cream leading-tight mb-2">{d.footer.newsletterTitle}</h3>
                <p className="text-[14px] text-cream/55 leading-relaxed">{d.footer.newsletterLead}</p>
              </div>
              <NewsletterCapture
                source="footer"
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

        {/* Stats */}
        <div className="border-b border-cream/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-7">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-10 gap-y-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <s.Icon className="w-4 h-4 text-champagne" />
                  <span className="text-[13.5px] text-cream/65">
                    <strong className="text-cream font-semibold">{s.value}</strong> {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Image src="/assets/logo-andre-ambrosio-light.png" alt="Andre Ambrósio" width={220} height={56} className="h-12 w-auto object-contain object-left mb-5" />
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-champagne mb-3">{d.footer.tagline}</p>
              <p className="text-[13px] text-cream/55 leading-relaxed max-w-[280px] mb-6">{d.footer.description}</p>
              <a href="mailto:eu@andreambrosio.com" className="inline-flex items-center gap-2 text-[13px] text-cream/55 hover:text-champagne transition-colors mb-6">
                <Mail className="w-4 h-4 text-champagne" /> eu@andreambrosio.com
              </a>
              <LanguageSwitcher currentLocale={locale} variant="footer" label={d.header.language} />
            </div>

            {/* Site */}
            <div>
              <h3 className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-champagne mb-4">{d.footer.colSite}</h3>
              <ul className="space-y-2.5">
                {siteLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-cream/55 hover:text-champagne transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campos */}
            <div>
              <h3 className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-champagne mb-4">{d.footer.colFields}</h3>
              <ul className="space-y-2.5">
                {campos.map((c) => (
                  <li key={c.slug}>
                    <Link href={lh(`/campos/${c.slug}`)} className="text-[13px] text-cream/55 hover:text-champagne transition-colors">{c.nome}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresas */}
            <div>
              <h3 className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-champagne mb-4">{d.footer.colCompanies}</h3>
              <ul className="space-y-2.5">
                {empresas.map((e) =>
                  e.url && e.url.startsWith('http') ? (
                    <li key={e.nome}>
                      <a href={e.url} target="_blank" rel="noopener" className="text-[13px] text-cream/55 hover:text-champagne transition-colors">{e.nome} ↗</a>
                    </li>
                  ) : (
                    <li key={e.nome}>
                      <Link href={lh('/empresas')} className="text-[13px] text-cream/55 hover:text-champagne transition-colors">{e.nome}</Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Redes */}
            <div>
              <h3 className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-champagne mb-4">{d.footer.colSocial}</h3>
              <ul className="space-y-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener" className="text-[13px] text-cream/55 hover:text-champagne transition-colors">{s.name} ↗</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Spotlight band */}
        <div className="border-t border-cream/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-light text-[clamp(1.5rem,2.5vw,2rem)] text-cream leading-tight mb-1">{d.footer.searchTitle}</h3>
                <p className="text-[13.5px] text-cream/55">
                  {d.footer.searchSubtitle} <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cream/10 text-cream/70">⌘K</kbd>
                </p>
              </div>
              <div className="w-full md:max-w-[380px]">
                <SpotlightSearch docs={docs} labels={d.spotlight} variant="bar" />
              </div>
            </div>
          </div>
        </div>

        {/* SEO + copyright */}
        <div className="border-t border-cream/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
            <p className="text-[10px] text-cream/25 leading-relaxed mb-5 max-w-5xl">{d.footer.seo} {empresas.map((e) => e.nome).join(' · ')}.</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-cream/40">© {year} · {d.footer.copyright}</p>
              <div className="flex items-center gap-4">
                {SOCIALS.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener" aria-label={s.name} title={s.handle} className="text-cream/40 hover:text-champagne transition-colors">
                    <SocialIcon icon={s.icon} size={16} />
                  </a>
                ))}
                <span className="font-mono text-[9px] tracking-[0.2em] text-cream/25 hidden sm:inline">
                  {campos.map((c) => c.nome).join(' · ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
