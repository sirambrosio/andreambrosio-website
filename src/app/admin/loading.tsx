import { ADMIN_NAV } from '@/lib/admin-nav';
export default function Loading() {
  return (
    <div className="min-h-screen bg-bg text-text flex">
      <aside className="hidden lg:flex w-[240px] shrink-0 border-r border-border bg-surface flex-col fixed inset-y-0 left-0">
        <div className="px-6 h-16 flex items-center border-b border-border">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne/50">Andre Ambrósio</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {ADMIN_NAV.slice(0, 13).map((it) => (
            <div key={it.href} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-4 h-4 rounded bg-surface-alt" />
              <div className="h-3 rounded bg-surface-alt" style={{ width: `${48 + (it.label.length % 5) * 9}px` }} />
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1 lg:ml-[240px]">
        <header className="h-16 border-b border-border bg-bg flex items-center px-5 md:px-8">
          <div className="h-5 w-44 rounded bg-surface-alt animate-pulse" />
        </header>
        <main className="px-5 md:px-8 py-8 max-w-[1200px]">
          <div className="h-9 w-72 rounded bg-surface-alt animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-[112px] rounded-[16px] border border-border bg-surface animate-pulse" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-[240px] rounded-[16px] border border-border bg-surface animate-pulse" />)}
          </div>
        </main>
      </div>
    </div>
  );
}
