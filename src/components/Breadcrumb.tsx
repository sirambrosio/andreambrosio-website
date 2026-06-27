import Link from 'next/link';

/** Trilha visual discreta (font-mono champagne). O JSON-LD de Breadcrumb é emitido à parte na página. */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.2em] uppercase text-text-dimmer">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2.5">
          {it.href ? (
            <Link href={it.href} className="hover:text-champagne transition-colors">{it.label}</Link>
          ) : (
            <span className="text-bronze">{it.label}</span>
          )}
          {i < items.length - 1 && <span aria-hidden className="text-text-dimmer/50">/</span>}
        </span>
      ))}
    </nav>
  );
}
