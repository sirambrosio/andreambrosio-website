'use client';
import Link from 'next/link';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-6">
      <div className="max-w-[460px] text-center">
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-[40px] h-[1px] bg-bronze" />
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze">Erro</span>
          <div className="w-[40px] h-[1px] bg-bronze" />
        </div>
        <p className="font-display font-light text-[1.875rem] text-text mb-3 tracking-tight">Algo deu errado.</p>
        <p className="text-[13.5px] text-text-dim mb-2 leading-relaxed">Falha ao carregar esta seção. Pode ser o banco fora do ar — confira a página <span className="text-champagne">Saúde</span>.</p>
        {isDev && error?.message && <p className="text-[11px] font-mono text-bronze bg-surface border border-border rounded-[8px] px-3 py-2 my-5 break-words text-left">{error.message}</p>}
        <div className="flex items-center justify-center gap-3 mt-7">
          <button onClick={reset} className="h-10 px-5 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity">Tentar de novo</button>
          <Link href="/admin" className="h-10 px-5 inline-flex items-center rounded-full border border-border-strong text-[13px] text-text-dim hover:text-text hover:border-champagne transition-colors">Ir para a Visão geral</Link>
        </div>
      </div>
    </div>
  );
}
