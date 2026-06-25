'use client';

import { useState, useEffect } from 'react';

interface TocItem { id: string; text: string }

export function ArticleTOC({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: '-90px 0px -68% 0px', threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label={label}>
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">{label}</div>
      <ul className="space-y-1 border-l border-border">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`block pl-4 -ml-px border-l py-1 text-[12.5px] leading-snug transition-colors ${
                active === it.id ? 'border-champagne text-champagne font-medium' : 'border-transparent text-text-dim hover:text-text'
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
