'use client';

import { useState, useEffect } from 'react';

/** Ajusta o tamanho do corpo do artigo via CSS var --ps no #article-prose. */
const SIZES: Record<string, string> = { sm: '0.9375rem', md: '1.0625rem', lg: '1.1875rem' };
const KEY = 'aa-fontsize';

export function FontSizeControls({ label }: { label: string }) {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  function apply(s: 'sm' | 'md' | 'lg') {
    setSize(s);
    const el = document.getElementById('article-prose');
    if (el) el.style.setProperty('--ps', SIZES[s]);
    try { localStorage.setItem(KEY, s); } catch { /* noop */ }
  }

  useEffect(() => {
    try {
      const s = (localStorage.getItem(KEY) as 'sm' | 'md' | 'lg' | null) ?? 'md';
      if (s && SIZES[s]) apply(s);
    } catch { /* noop */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const btn = (s: 'sm' | 'md' | 'lg', txt: string, cls: string) => (
    <button
      type="button"
      onClick={() => apply(s)}
      aria-pressed={size === s}
      aria-label={`${label} ${({ sm: 'S', md: 'M', lg: 'L' } as const)[s]}`}
      className={`w-8 h-8 rounded-full border flex items-center justify-center font-display transition-colors ${cls} ${
        size === s ? 'border-champagne text-champagne bg-champagne/10' : 'border-border text-text-dim hover:text-text'
      }`}
    >
      {txt}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-bronze mr-1" aria-hidden>{label}</span>
      {btn('sm', 'A', 'text-[12px]')}
      {btn('md', 'A', 'text-[15px]')}
      {btn('lg', 'A', 'text-[18px]')}
    </div>
  );
}
