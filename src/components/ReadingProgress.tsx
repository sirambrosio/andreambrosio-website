'use client';

import { useEffect, useState } from 'react';

/** Barra fina de progresso de leitura, ancorada logo abaixo do header (86px). */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div data-no-print className="fixed top-[86px] left-0 right-0 z-[900] h-[2px] bg-transparent pointer-events-none">
      <div className="h-full bg-brand-gradient transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}
