'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import {
  LOCALES,
  LOCALE_META,
  stripLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from '@/lib/i18n';
import { canonicalizePath, localizePath } from '@/lib/route-translations';

interface Props {
  currentLocale: Locale;
  variant?: 'header' | 'footer';
  label?: string;
}

export function LanguageSwitcher({ currentLocale, variant = 'header', label = 'Idioma' }: Props) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALE_META[currentLocale];

  function change(locale: Locale) {
    if (locale === currentLocale) {
      setOpen(false);
      return;
    }
    // 1) tira o prefixo de locale; 2) canonicaliza usando o locale de origem;
    // 3) re-localiza pro novo idioma — assim /en/fields/technology vira /de/felder/technologie.
    const { locale: sourceFromPath, rest } = stripLocale(pathname);
    let decoded = rest;
    try { decoded = decodeURIComponent(rest); } catch { /* mantém */ }
    const canonical = canonicalizePath(decoded, sourceFromPath ?? currentLocale);
    const localized = localizePath(canonical, locale);
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const target = `/${locale}${localized === '/' ? '' : localized}${search}`;
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};SameSite=Lax`;
    window.location.href = target;
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const isFooter = variant === 'footer';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} · ${current.native}`}
        className={
          isFooter
            ? 'inline-flex items-center gap-2 text-[12px] px-4 py-2 rounded-full border border-cream/15 text-cream/70 hover:text-cream hover:border-cream/30 transition-colors'
            : 'inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-full text-text-dim hover:text-champagne transition-colors'
        }
      >
        <Globe size={13} strokeWidth={1.8} />
        <span aria-hidden>{current.flag}</span>
        <span className="hidden sm:inline">{current.native}</span>
        <span aria-hidden className="opacity-50 text-[9px]">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute z-[1000] min-w-[210px] rounded-2xl border overflow-hidden shadow-brand-lg ${
            isFooter
              ? 'bottom-full mb-2 left-0 bg-oled-deep border-cream/15'
              : 'top-full mt-2 right-0 bg-surface border-border-strong'
          }`}
        >
          {LOCALES.map((loc) => {
            const m = LOCALE_META[loc];
            const active = loc === currentLocale;
            return (
              <button
                key={loc}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => change(loc)}
                className={`w-full px-4 py-2.5 text-left text-[13px] flex items-center gap-3 transition-colors ${
                  isFooter
                    ? `text-cream/80 ${active ? 'bg-champagne/15' : 'hover:bg-cream/[0.06]'}`
                    : `text-text ${active ? 'bg-champagne/10' : 'hover:bg-surface-alt'}`
                }`}
              >
                <span aria-hidden className="text-base">{m.flag}</span>
                <span className="flex-1">{m.native}</span>
                {active && <Check size={14} className="text-champagne shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
