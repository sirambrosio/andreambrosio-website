'use client';

import { useEffect } from 'react';

/**
 * Ativa as animações [data-reveal] do globals.css adicionando .revealed quando
 * o elemento entra na viewport. Failsafe: revela tudo após 1.6s e em browsers
 * sem IntersectionObserver. (No-JS é coberto por <noscript> no layout.)
 */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (els.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));

    const failsafe = setTimeout(() => els.forEach((el) => el.classList.add('revealed')), 1600);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return null;
}
