'use client';

import { useEffect } from 'react';

/** Esconde header/footer globais (marca o body) — usado na página /links (bio imersiva). */
export function HideChrome() {
  useEffect(() => {
    document.body.setAttribute('data-bare', '');
    return () => document.body.removeAttribute('data-bare');
  }, []);
  return null;
}
