/** Wrapper de analytics agnóstico — no-op até plugar um provedor via env (Umami/Plausible). */
type Props = Record<string, string | number | boolean>;

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    umami?: { track: (e: string, p?: Props) => void };
    plausible?: (e: string, o?: { props?: Props }) => void;
  };
  try {
    if (w.umami?.track) w.umami.track(event, props);
    else if (w.plausible) w.plausible(event, props ? { props } : undefined);
  } catch {
    /* noop */
  }
}
