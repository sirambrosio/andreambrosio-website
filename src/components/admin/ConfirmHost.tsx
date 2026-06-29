'use client';
import { useEffect, useState } from 'react';

export function ConfirmHost() {
  const [state, setState] = useState<{ message: string; resolve: (b: boolean) => void } | null>(null);
  useEffect(() => {
    const h = (e: Event) => setState((e as CustomEvent).detail);
    window.addEventListener('aa:confirm', h as EventListener);
    return () => window.removeEventListener('aa:confirm', h as EventListener);
  }, []);
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { state.resolve(false); setState(null); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state]);
  if (!state) return null;
  const done = (v: boolean) => { state.resolve(v); setState(null); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" role="dialog" aria-modal="true" aria-label="Confirmação">
      <div className="absolute inset-0 bg-oled/60 backdrop-blur-sm" onClick={() => done(false)} />
      <div className="relative w-full max-w-[380px] rounded-[16px] border border-border-strong bg-surface p-6 shadow-brand-lg">
        <p className="text-[14px] text-text leading-relaxed mb-6">{state.message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => done(false)} className="h-9 px-4 rounded-full text-[12px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-text transition-colors">Cancelar</button>
          <button onClick={() => done(true)} autoFocus className="h-9 px-5 rounded-full bg-brand-gradient text-ink text-[12px] font-mono font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
