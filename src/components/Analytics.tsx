'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

/** Dispara um pageview a cada navegação (inclui o load inicial). First-party, sem cookie. */
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    track('pageview');
  }, [pathname]);
  return null;
}
