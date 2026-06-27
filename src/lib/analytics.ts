/** Analytics first-party soberano: envia eventos pra /api/track (Postgres). Sem cookie, sem terceiro. */
type Props = Record<string, string | number | boolean>;

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      event,
      path: location.pathname,
      locale: document.documentElement.lang || '',
      source: props?.source != null ? String(props.source) : undefined,
      ref: document.referrer ? (() => { try { return new URL(document.referrer).hostname; } catch { return undefined; } })() : undefined,
    };
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      void fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true });
    }
  } catch { /* noop */ }
}
