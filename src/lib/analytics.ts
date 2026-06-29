/** Analytics first-party soberano: envia eventos pra /api/track (Postgres). Sem cookie, sem terceiro. */
type Props = Record<string, string | number | boolean>;


function sid(): string {
  try {
    const KEY = 'aa_sid';
    const now = Date.now();
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const i = raw.indexOf('.');
      const id = raw.slice(0, i);
      const ts = Number(raw.slice(i + 1));
      if (id && now - ts < 1800000) { sessionStorage.setItem(KEY, `${id}.${now}`); return id; }
    }
    const id = Math.random().toString(36).slice(2, 12);
    sessionStorage.setItem(KEY, `${id}.${now}`);
    return id;
  } catch { return ''; }
}

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      event,
      path: location.pathname,
      locale: document.documentElement.lang || '',
      source: props?.source != null ? String(props.source) : undefined,
      sid: sid(),
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
