import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';
import { SOCIALS, PROJECTS } from '@/lib/socials';
import { SocialIcon } from '@/components/SocialIcon';
import { HideChrome } from '@/components/HideChrome';

const T = {
  projetos: { pt: 'Projetos', en: 'Projects', es: 'Proyectos', zh: '项目', fr: 'Projets', de: 'Projekte', ja: 'プロジェクト', ru: 'Проекты' },
  redes: { pt: 'Redes', en: 'Social', es: 'Redes', zh: '社交', fr: 'Réseaux', de: 'Social', ja: 'SNS', ru: 'Соцсети' },
} as const;

const PROJ_TAGS: Record<string, Record<Locale, string>> = {
  logicaos: { pt: 'Sistema operacional de agentes', en: 'Agent operating system', es: 'Sistema operativo de agentes', zh: '智能体操作系统', fr: "Système d'exploitation d'agents", de: 'Agenten-Betriebssystem', ja: 'エージェントOS', ru: 'Операционная система агентов' },
  health: { pt: 'Engineering Human Vitality', en: 'Engineering Human Vitality', es: 'Engineering Human Vitality', zh: 'Engineering Human Vitality', fr: 'Engineering Human Vitality', de: 'Engineering Human Vitality', ja: 'Engineering Human Vitality', ru: 'Engineering Human Vitality' },
  vitaaz: { pt: 'Suplementação funcional', en: 'Functional supplements', es: 'Suplementación funcional', zh: '功能性营养补充', fr: 'Compléments fonctionnels', de: 'Funktionale Supplemente', ja: '機能性サプリメント', ru: 'Функциональные добавки' },
  traders: { pt: 'Comunidade + IA de trading', en: 'Trading community + AI', es: 'Comunidad + IA de trading', zh: '交易社区 + AI', fr: 'Communauté trading + IA', de: 'Trading-Community + KI', ja: 'トレード・コミュニティ + AI', ru: 'Трейдинг-сообщество + ИИ' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const d = getDict(locale);
  return {
    title: 'Links · Andre Ambrósio',
    description: d.footer.description,
    alternates: { canonical: localeHref('/links', locale), languages: hreflangAlternates('/links') },
    openGraph: { title: 'Andre Ambrósio — Links', description: d.footer.description, images: ['/assets/andre-portrait.jpg'] },
  };
}

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = asLocale(raw);
  const d = getDict(locale);

  const internal = [
    { href: localeHref('/ensaios', locale), label: d.nav.ensaios },
    { href: localeHref('/empresas', locale), label: d.nav.empresas },
    { href: localeHref('/sobre', locale), label: d.nav.sobre },
  ];

  return (
    <main className="fixed inset-0 z-[1000] overflow-y-auto overflow-x-hidden bg-oled text-cream">
      <HideChrome />
      {/* fundo: retrato desfocado + brilho champagne */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/assets/andre-portrait.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-[0.12] blur-2xl scale-110" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 50% -10%, rgba(201,169,97,0.18) 0%, rgba(11,15,15,0.7) 45%, var(--oled,#0b0f0f) 100%)' }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[560px] px-6 py-16 md:py-20 flex flex-col items-center">
        {/* avatar */}
        <div className="relative w-[96px] h-[96px] rounded-full overflow-hidden ring-2 ring-champagne/50 shadow-brand-lg">
          <Image src="/assets/andre-portrait.jpg" alt="Andre Ambrósio" fill priority sizes="96px" className="object-cover object-[30%_center]" />
        </div>
        <h1 className="font-display font-light text-[2rem] tracking-tight text-cream mt-5">Andre Ambrósio</h1>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mt-2">{d.home.eyebrow}</div>
        <p className="text-[13.5px] text-cream/70 leading-relaxed text-center mt-4 max-w-[420px]">{d.footer.description}</p>

        {/* interno */}
        <div className="w-full mt-10 space-y-3">
          {internal.map((l) => (
            <Link key={l.href} href={l.href} className="group flex items-center justify-between gap-3 w-full rounded-2xl border border-cream/15 bg-cream/[0.04] backdrop-blur-sm px-5 py-4 hover:border-champagne hover:bg-cream/[0.07] transition-all">
              <span className="font-display text-[1.0625rem] text-cream">{l.label}</span>
              <ArrowUpRight size={17} className="text-cream/40 group-hover:text-champagne transition-colors" />
            </Link>
          ))}
        </div>

        {/* projetos */}
        <div className="w-full mt-8">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-3 pl-1">{T.projetos[locale]}</div>
          <div className="space-y-3">
            {PROJECTS.map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 w-full rounded-2xl border border-cream/15 bg-cream/[0.04] backdrop-blur-sm px-5 py-4 hover:border-champagne hover:bg-cream/[0.07] transition-all">
                <span className="min-w-0">
                  <span className="block font-display text-[1.0625rem] text-cream leading-tight">{p.name}</span>
                  <span className="block text-[12px] text-cream/55 mt-0.5 truncate">{PROJ_TAGS[p.tagKey][locale]}</span>
                </span>
                <ArrowUpRight size={17} className="text-cream/40 group-hover:text-champagne transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* redes */}
        <div className="w-full mt-9">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-3 pl-1 text-center">{T.redes[locale]}</div>
          <div className="flex items-center justify-center gap-3">
            {SOCIALS.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={`${s.name} · ${s.handle}`} className="w-12 h-12 rounded-full border border-cream/15 bg-cream/[0.04] flex items-center justify-center text-cream/80 hover:text-ink hover:bg-brand-gradient hover:border-transparent transition-all">
                <SocialIcon icon={s.icon} size={19} />
              </a>
            ))}
          </div>
        </div>

        <Link href={localeHref('/', locale)} className="mt-12 font-mono text-[11px] tracking-[0.2em] text-cream/45 hover:text-champagne transition-colors">
          andreambrosio.com
        </Link>
      </div>
    </main>
  );
}
