'use client';

import { useEffect, useState } from 'react';

/** Minutos restantes de leitura, calculados a partir do scroll. */
export function TimeRemaining({ total, label }: { total: number; label: string }) {
  const [rem, setRem] = useState(total);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
      setRem(Math.max(0, Math.ceil(total * (1 - pct))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [total]);

  return <span>{rem} {label}</span>;
}
