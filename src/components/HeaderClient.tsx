'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { SpotlightSearch, type SpotlightLabels } from './SpotlightSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { SearchDoc } from '@/lib/search';
import type { Locale } from '@/lib/i18n';

interface NavItem { href: string; label: string }
interface Props {
  locale: Locale;
  homeHref: string;
  nav: NavItem[];
  docs: SearchDoc[];
  spotlight: SpotlightLabels;
  t: {
    homeLabel: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    lightMode: string;
    darkMode: string;
    language: string;
  };
}

export function HeaderClient({ locale, homeHref, nav, docs, spotlight, t }: Props) {
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark ? '/assets/logo-andre-ambrosio-light.png' : '/assets/logo-andre-ambrosio-dark.png';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[86px] z-[999] flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
          scrolled ? 'bg-bg/95 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Link href={homeHref} className="flex items-center" aria-label={t.homeLabel}>
          {mounted && (
            <Image src={logoSrc} alt="Andre Ambrósio" width={320} height={72} priority className="h-[56px] md:h-[64px] w-auto" />
          )}
        </Link>

        <nav aria-label="nav" className="hidden md:flex items-center gap-7 h-full">
          {nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative h-full flex items-center text-[13px] font-medium transition-colors ${
                  isActive ? 'text-champagne font-semibold' : 'text-text-dim hover:text-champagne'
                }`}
              >
                {item.label}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-champagne" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SpotlightSearch docs={docs} labels={spotlight} variant="button" />
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher currentLocale={locale} variant="header" label={t.language} />
          </div>

          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative w-[56px] h-[28px] rounded-full bg-surface-alt border border-border-strong flex items-center px-[3px] transition-colors hover:border-champagne"
            aria-label={t.toggleTheme}
            role="switch"
            aria-checked={isDark}
            title={mounted ? (isDark ? t.lightMode : t.darkMode) : t.toggleTheme}
          >
            <Sun className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] text-text-dimmer pointer-events-none" strokeWidth={1.5} />
            <Moon className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] text-text-dimmer pointer-events-none" strokeWidth={1.5} />
            <span
              className="relative z-10 w-[22px] h-[22px] rounded-full bg-brand-gradient shadow-brand flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: mounted && isDark ? 'translateX(26px)' : 'translateX(0)' }}
            >
              {mounted && (isDark ? <Moon className="w-[10px] h-[10px] text-ink" strokeWidth={2.5} /> : <Sun className="w-[10px] h-[10px] text-ink" strokeWidth={2.5} />)}
            </span>
          </button>

          <div className="md:hidden">
            <SpotlightSearch docs={docs} labels={spotlight} variant="button" />
          </div>
          <button
            type="button"
            className="md:hidden p-2 text-text-dim"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-[86px] bg-bg/98 backdrop-blur-md z-[998] p-6 overflow-y-auto pb-10 flex flex-col gap-1 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-[14.5px] font-medium text-text-dim py-3 border-b border-border hover:text-champagne"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6">
            <LanguageSwitcher currentLocale={locale} variant="header" label={t.language} />
          </div>
        </div>
      )}
    </>
  );
}
