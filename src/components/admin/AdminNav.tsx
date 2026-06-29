'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = [
    { href: '/admin', label: 'Painel' },
    { href: '/admin/assinantes', label: 'Assinantes' },
  ];
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-7">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">Admin</span>
          <nav className="flex items-center gap-6">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link key={it.href} href={it.href} className={`text-[13px] transition-colors ${active ? 'text-text font-medium' : 'text-text-dim hover:text-champagne'}`}>
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[10px] text-text-dimmer">{email}</span>
          <button onClick={logout} className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-dim hover:text-bronze transition-colors">Sair</button>
        </div>
      </div>
    </header>
  );
}
