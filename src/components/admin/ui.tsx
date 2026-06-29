export function Delta({ pct }: { pct: number | null }) {
  if (pct === null || !Number.isFinite(pct)) return null;
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-[11px] ${up ? 'text-champagne' : 'text-bronze'}`} title="vs. período anterior">
      {up ? '\u25B2' : '\u25BC'} {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

export function Stat({ label, value, sub, delta }: { label: string; value: string | number; sub?: string; delta?: number | null }) {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-2">{label}</div>
      <div className="font-display font-light text-[2rem] text-text leading-none">{value}</div>
      <div className="flex items-center gap-2 mt-1.5 min-h-[18px]">
        {sub && <span className="text-[12px] text-text-dim">{sub}</span>}
        {delta !== undefined && <Delta pct={delta ?? null} />}
      </div>
    </div>
  );
}

export function Progress({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="text-text-dim">{label}</span>
        <span className="font-mono text-text tabular-nums">{current} / {target || '—'}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
        <div className="h-full bg-brand-gradient rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Card({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-6">
      {(title || right) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function RankList({ items, empty = 'sem dados' }: { items: { label: string; n: number }[]; empty?: string }) {
  const max = Math.max(1, ...items.map((i) => i.n));
  if (items.length === 0) return <p className="text-[13px] text-text-dimmer py-2">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i}>
          <div className="flex justify-between text-[13px] mb-1">
            <span className="text-text-dim truncate pr-4">{it.label}</span>
            <span className="font-mono text-text tabular-nums">{it.n}</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
            <div className="h-full bg-champagne/50 rounded-full" style={{ width: `${(it.n / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Bars({ data }: { data: { label: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  return (
    <div className="flex items-end gap-[3px] h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end group" title={`${d.label}: ${d.n}`}>
          <div className="w-full rounded-t-[3px] bg-champagne/40 group-hover:bg-champagne/70 transition-colors" style={{ height: `${Math.max(2, (d.n / max) * 100)}%` }} />
        </div>
      ))}
    </div>
  );
}
