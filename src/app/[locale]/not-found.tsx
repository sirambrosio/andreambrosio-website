'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { asLocale, stripLocale } from '@/lib/i18n';
import { localeHref } from '@/lib/route-translations';
import { getDict } from '@/lib/dictionary';

export default function LocaleNotFound() {
  const pathname = usePathname() || '/';
  const { locale: maybe } = stripLocale(pathname);
  const locale = asLocale(maybe);
  const d = getDict(locale);

  return (
    <div className="bg-bg text-text min-h-[calc(100vh-86px)] flex items-center justify-center px-6">
      <div className="max-w-[520px] text-center">
        <div className="font-display font-light text-[clamp(5rem,18vw,11rem)] leading-none text-gold-foil mb-6">404</div>
        <h1 className="font-display font-light text-[clamp(1.5rem,3vw,2.25rem)] text-text tracking-tight mb-5">{d.notFound.title}</h1>
        <p className="text-[14.5px] text-text-dim leading-[1.8] mb-10">{d.notFound.lead}</p>
        <div className="flex flex-wrap gap-5 justify-center items-center">
          <Link href={localeHref('/', locale)} className="inline-flex items-center gap-2 px-7 py-3 bg-brand-gradient rounded-full text-[13px] font-semibold text-ink shadow-brand hover:opacity-90 transition-all">
            {d.notFound.home}
          </Link>
          <Link href={localeHref('/ensaios', locale)} className="text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors">
            {d.notFound.essays} →
          </Link>
        </div>
      </div>
    </div>
  );
}
