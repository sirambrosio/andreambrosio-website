'use client';
import { useEffect, useState } from 'react';
type T = { id: number; message: string; kind: string };
export function ToastHost() {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    let n = 0;
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail as { message: string; kind: string };
      const id = ++n;
      setItems((x) => [...x, { id, message: d.message, kind: d.kind }]);
      setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3500);
    };
    window.addEventListener('aa:toast', h as EventListener);
    return () => window.removeEventListener('aa:toast', h as EventListener);
  }, []);
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2 max-w-[360px]" role="region" aria-live="polite" aria-label="Notificações">
      {items.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border bg-surface shadow-brand-lg text-[13px] text-text animate-[reveal-up_0.3s_ease] ${t.kind === 'error' ? 'border-bronze' : t.kind === 'success' ? 'border-champagne/50' : 'border-border-strong'}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.kind === 'error' ? 'bg-bronze' : 'bg-champagne'}`} />
          {t.message}
        </div>
      ))}
    </div>
  );
}
