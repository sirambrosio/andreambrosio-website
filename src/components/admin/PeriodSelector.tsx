'use client';
import { usePathname, useRouter } from 'next/navigation';

const OPTS = [{ v: '7', l: '7d' }, { v: '30', l: '30d' }, { v: '90', l: '90d' }, { v: 'all', l: 'Tudo' }];

export function PeriodSelector({ current }: { current: string }) {
  const pathname = usePathname();
  const router = useRouter();
  function set(v: string) {
    const q = v === '30' ? '' : `?range=${v}`;
    router.push(`${pathname}${q}`);
  }
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border-strong p-0.5">
      {OPTS.map((o) => (
        <button key={o.v} onClick={() => set(o.v)} className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.1em] transition-colors ${current === o.v ? 'bg-surface-alt text-text' : 'text-text-dim hover:text-text'}`}>{o.l}</button>
      ))}
    </div>
  );
}
