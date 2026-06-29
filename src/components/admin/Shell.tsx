'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ConfirmHost } from './ConfirmHost';
import { ToastHost } from './ToastHost';
import { ADMIN_NAV } from '@/lib/admin-nav';
import { CommandPalette } from './CommandPalette';
import { Sun, Moon, Menu, X, LogOut, Search } from 'lucide-react';

// NAV agora vem de @/lib/admin-nav (fonte única)

export function Shell({ email, title, actions, children }: { email: string; title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);
  const isDark = mounted && resolvedTheme === 'dark';

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-6 h-16 flex items-center border-b border-border">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Andre Ambrósio</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {ADMIN_NAV.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <div key={it.href}>
              {it.group && <div className="px-3 pt-5 pb-2 font-mono text-[9px] tracking-[0.2em] uppercase text-text-dimmer">{it.group}</div>}
              <Link
                href={it.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] transition-colors ${active ? 'bg-surface-alt text-text font-medium' : 'text-text-dim hover:text-text hover:bg-surface'}`}
              >
                <Icon size={16} />
                {it.label}
                {it.dot && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-bronze animate-pulse" />}
              </Link>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="px-3 py-1.5 font-mono text-[10px] text-text-dimmer truncate">{email}</div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] text-text-dim hover:text-bronze hover:bg-surface transition-colors">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <ConfirmHost />
      <ToastHost />
      <CommandPalette />
      {/* sidebar desktop */}
      <aside className="hidden lg:flex w-[240px] shrink-0 border-r border-border bg-surface flex-col fixed inset-y-0 left-0 print:hidden">{sidebar}</aside>

      {/* drawer mobile */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-oled/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-[260px] bg-surface border-r border-border">
            <button onClick={() => setOpen(false)} aria-label="Fechar menu" className="absolute top-4 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-text-dim hover:text-text hover:bg-surface-alt transition-colors"><X size={18} /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-[240px] min-w-0 print:ml-0">
        {/* header */}
        <header className="h-16 border-b border-border bg-bg/90 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-5 md:px-8 print:hidden">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 -ml-1.5 text-text-dim" onClick={() => setOpen(true)} aria-label="Menu"><Menu size={20} /></button>
            <h1 className="font-display font-light text-[1.5rem] text-text tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-3"><button onClick={() => window.dispatchEvent(new CustomEvent('aa:cmdk'))} aria-label="Buscar" className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-full border border-border-strong text-text-dimmer hover:text-text hover:border-champagne transition-colors text-[12px]"><Search size={14} /><kbd className="font-mono text-[10px]">\u2318K</kbd></button>{actions}<button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Tema" className="w-9 h-9 rounded-full border border-border-strong flex items-center justify-center text-text-dim hover:text-champagne hover:border-champagne transition-colors">{mounted && (isDark ? <Sun size={15} /> : <Moon size={15} />)}</button></div>
        </header>
        <main className="px-5 md:px-8 py-8 max-w-[1200px]">{children}</main>
      </div>
    </div>
  );
}
