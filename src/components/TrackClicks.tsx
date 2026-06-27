'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Rastreia cliques em qualquer elemento com [data-track="evento:origem"] via
 * delegação — funciona em server components (é só um atributo). Ex.:
 *   data-track="product_click:logicaos"  ·  data-track="contact_click:imprensa"
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-track]');
      if (!el) return;
      const v = el.getAttribute('data-track') || '';
      if (!v) return;
      const i = v.indexOf(':');
      const event = i === -1 ? v : v.slice(0, i);
      const source = i === -1 ? undefined : v.slice(i + 1);
      track(event, source ? { source } : undefined);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
