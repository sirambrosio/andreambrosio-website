/** Funil clássico segmentado: faixas coloridas que afunilam, cada etapa com rótulo, valor e conversão. */
type Stage = { label: string; value: number };

const COLORS = [
  { bg: '#C9BCEC', fg: '#2E2747' }, // lavanda
  { bg: '#BAD3F1', fg: '#1E3252' }, // azul
  { bg: '#A6E1CA', fg: '#184030' }, // verde água
  { bg: '#F4D88E', fg: '#473711' }, // âmbar
  { bg: '#F3B89F', fg: '#4A2719' }, // pêssego
  { bg: '#EFA3A3', fg: '#4A1F1F' }, // rosa
];

export function Funnel({ stages }: { stages: Stage[] }) {
  const N = stages.length;
  if (N === 0) return null;
  const span = N > 1 ? 58 : 0; // afunilamento total (%)

  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      {stages.map((s, i) => {
        const wTop = 100 - (i * span) / N;
        const wBot = 100 - ((i + 1) * span) / N;
        const inset = wTop > 0 ? ((1 - wBot / wTop) / 2) * 100 : 0;
        const prev = i > 0 ? stages[i - 1].value : null;
        const conv = prev && prev > 0 ? Math.min(100, (s.value / prev) * 100) : null;
        const c = COLORS[i % COLORS.length];
        return (
          <div key={i} className="w-full flex justify-center" title={`${s.label}: ${s.value.toLocaleString('pt-BR')}${conv !== null ? ` · ${conv.toFixed(1)}% da etapa anterior` : ''}`}>
            <div
              style={{ width: `${wTop}%`, background: c.bg, color: c.fg, clipPath: `polygon(0 0, 100% 0, ${(100 - inset).toFixed(2)}% 100%, ${inset.toFixed(2)}% 100%)` }}
              className="h-[60px] flex flex-col items-center justify-center px-6 text-center transition-[filter] duration-200 hover:brightness-[1.04]"
            >
              <span className="text-[12.5px] font-semibold leading-tight tracking-tight">{s.label}</span>
              <span className="font-mono text-[11.5px] tabular-nums leading-tight mt-0.5 opacity-80">
                {s.value.toLocaleString('pt-BR')}{conv !== null ? ` · ${conv.toFixed(0)}%` : ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
