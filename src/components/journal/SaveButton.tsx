'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

const KEY = 'aa-saved';

export function SaveButton({ slug, label }: { slug: string; label: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      setSaved(list.includes(slug));
    } catch { /* noop */ }
  }, [slug]);

  function toggle() {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
      localStorage.setItem(KEY, JSON.stringify(next));
      setSaved(next.includes(slug));
    } catch { /* noop */ }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      title={label}
      className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-full border text-[11px] font-mono uppercase tracking-[0.15em] transition-colors ${
        saved ? 'border-champagne text-champagne bg-champagne/10' : 'border-border-strong text-text-dim hover:text-champagne hover:border-champagne'
      }`}
    >
      <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
      {label}
    </button>
  );
}
