'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display font-light text-[1.5rem] mb-2">Algo deu errado.</p>
        <p className="text-[13px] text-text-dim mb-6">Falha ao carregar o painel.</p>
        <button onClick={reset} className="h-10 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity">Tentar de novo</button>
      </div>
    </div>
  );
}
