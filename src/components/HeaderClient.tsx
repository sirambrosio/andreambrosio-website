'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { SpotlightSearch, type SpotlightLabels } from './SpotlightSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { SearchDoc } from '@/lib/search';
import type { Locale } from '@/lib/i18n';

interface NavChild { href: string; label: string; sub?: string }
interface NavItem { href: string; label: string; children?: NavChild[] }
interface Props {
  locale: Locale;
  homeHref: string;
  heroHref: string;
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
    search: string;
  };
}

export function HeaderClient({ locale, homeHref, heroHref, nav, docs, spotlight, t }: Props) {
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const onHero = mounted && !scrolled && pathname === heroHref;
  const logoSrc =
    onHero || isDark ? '/assets/logo-andre-ambrosio-light.png' : '/assets/logo-andre-ambrosio-dark.png';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[86px] z-[999] transition-all duration-300 ${
          scrolled ? 'bg-bg/95 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent border-b border-transparent'
        }`}
        data-on-hero={onHero ? 'true' : undefined}
      >
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 md:px-8">
        <Link href={homeHref} className="flex items-center" aria-label={t.homeLabel}>
          {mounted && (
            <Image src={logoSrc} alt="Andre Ambrósio" width={320} height={72} priority className="h-[42px] md:h-[48px] w-auto" />
          )}
        </Link>

        <nav aria-label="nav" className="hidden md:flex items-center gap-5 h-full">
          {nav.map((item) => {
            const isActive = pathname === item.href || (!!item.children && pathname.startsWith(item.href));
            if (item.children) {
              const isOpen = openMenu === item.href;
              const subId = `submenu-${item.href.replace(/\//g, '-')}`;
              return (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpenMenu(null);
                  }}
                >
                  <Link
                    href={item.href}
                    className={`h-full flex items-center text-[13px] font-medium transition-colors ${isActive ? 'text-champagne font-semibold' : 'text-text-dim hover:text-champagne'}`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={subId}
                    aria-label={item.label}
                    onClick={() => setOpenMenu(isOpen ? null : item.href)}
                    className="h-full flex items-center pl-1 text-text-dim hover:text-champagne transition-colors"
                  >
                    <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    id={subId}
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'}`}
                  >
                    <div className="w-[300px] rounded-2xl bg-surface border border-border-strong shadow-brand-lg p-2">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} onClick={() => setOpenMenu(null)} className="block px-4 py-2.5 rounded-xl hover:bg-surface-alt transition-colors group/item">
                          <span className="block text-[13.5px] text-text group-hover/item:text-champagne transition-colors">{c.label}</span>
                          {c.sub && <span className="block text-[11px] text-text-dim mt-0.5">{c.sub}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
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
            <SpotlightSearch docs={docs} labels={spotlight} variant="button" compactLabel={t.search} />
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
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-[86px] bg-bg/98 backdrop-blur-md z-[998] p-6 overflow-y-auto pb-10 flex flex-col gap-1 md:hidden">
          {nav.map((item) => (
            <div key={item.href} className="border-b border-border">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block text-[14.5px] font-medium text-text-dim py-3 hover:text-champagne"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="pl-4 pb-2 flex flex-col gap-0.5">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[13px] text-text-dimmer py-1.5 hover:text-champagne"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-6 mt-2 border-t border-border">
            <LanguageSwitcher currentLocale={locale} variant="mobile" label={t.language} />
          </div>
        </div>
      )}
    </>
  );
}
