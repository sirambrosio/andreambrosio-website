'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Garante que toda navegação SPA comece no topo da página. O Next deveria fazer
 * isso, mas o `scroll-behavior: smooth` global atrapalhava (animava/parava no
 * meio). Ignora navegação por âncora (#hash).
 */
export function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}
