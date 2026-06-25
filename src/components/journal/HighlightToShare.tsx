'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';

/** Seleciona texto no corpo do artigo → botão flutuante pra compartilhar a citação. */
export function HighlightToShare({ url, label }: { url: string; label: string }) {
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    function update() {
      const s = window.getSelection();
      const text = s?.toString().trim() ?? '';
      const prose = document.getElementById('article-prose');
      if (s && text.length >= 12 && text.length <= 280 && prose && s.anchorNode && prose.contains(s.anchorNode)) {
        const r = s.getRangeAt(0).getBoundingClientRect();
        setSel({ text, x: r.left + r.width / 2, y: r.top });
      } else {
        setSel(null);
      }
    }
    document.addEventListener('mouseup', update);
    document.addEventListener('keyup', update);
    const clear = () => {
      const s = window.getSelection();
      if (!s || !s.toString().trim()) setSel(null);
    };
    document.addEventListener('selectionchange', clear);
    window.addEventListener('scroll', clear, { passive: true });
    return () => {
      document.removeEventListener('mouseup', update);
      document.removeEventListener('keyup', update);
      document.removeEventListener('selectionchange', clear);
      window.removeEventListener('scroll', clear);
    };
  }, []);

  if (!sel) return null;

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`“${sel.text}”`)}&url=${encodeURIComponent(url)}`;

  return (
    <a
      href={tweet}
      target="_blank"
      rel="noopener noreferrer"
      onMouseDown={(e) => e.preventDefault()}
      style={{ position: 'fixed', left: sel.x, top: sel.y, transform: 'translate(-50%, -130%)' }}
      className="z-[1600] inline-flex items-center gap-2 h-9 px-4 rounded-full bg-brand-gradient text-ink text-[12px] font-semibold shadow-brand-lg animate-spotlight-fadein"
    >
      <Share2 size={13} /> {label}
    </a>
  );
}
