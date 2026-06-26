import Script from 'next/script';

/**
 * Analytics privacy-first, plugável por env (decidir depois).
 * Umami:    NEXT_PUBLIC_UMAMI_SRC + NEXT_PUBLIC_UMAMI_ID
 * Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 * Sem env → não renderiza nada (zero impacto). Os eventos via track() já estão instrumentados.
 */
export function Analytics() {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (umamiSrc && umamiId) {
    return <Script src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" />;
  }
  if (plausible) {
    return <Script src="https://plausible.io/js/script.tagged-events.js" data-domain={plausible} strategy="afterInteractive" />;
  }
  return null;
}
