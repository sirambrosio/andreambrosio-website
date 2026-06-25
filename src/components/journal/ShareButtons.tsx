'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export function ShareButtons({ url, title, label }: { url: string; title: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const ln = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  function copy() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const cls = 'inline-flex items-center justify-center h-9 px-4 rounded-full border border-border-strong text-[11px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-champagne hover:border-champagne transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-3 my-10">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze">{label}</span>
      <a href={x} target="_blank" rel="noopener" className={cls}>X</a>
      <a href={ln} target="_blank" rel="noopener" className={cls}>LinkedIn</a>
      <button type="button" onClick={copy} className={cls}>
        {copied ? <Check size={13} className="text-champagne" /> : <Link2 size={13} />}
      </button>
    </div>
  );
}
