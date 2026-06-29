/** Funil SVG: trapézios conectados que afunilam continuamente (largura ∝ valor). */
export function Funnel({ stages }: { stages: { label: string; value: number }[] }) {
  const N = stages.length;
  if (N === 0) return null;
  const max = Math.max(1, ...stages.map((s) => s.value));
  const BH = 76, GAP = 7;
  const H = N * BH + (N - 1) * GAP;
  const w = (v: number) => Math.max(13, (v / max) * 100);

  return (
    <div className="relative w-full max-w-[440px] mx-auto py-2">
      <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="w-full block" style={{ height: H * 1.7 }}>
        <defs>
          <linearGradient id="aa-funnel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8D285" />
            <stop offset="55%" stopColor="#C9A961" />
            <stop offset="100%" stopColor="#8B764A" />
          </linearGradient>
        </defs>
        {stages.map((s, i) => {
          const y0 = i * (BH + GAP);
          const wt = w(s.value);
          const wb = i < N - 1 ? w(stages[i + 1].value) : Math.max(10, wt * 0.5);
          const pts = `${50 - wt / 2},${y0} ${50 + wt / 2},${y0} ${50 + wb / 2},${y0 + BH} ${50 - wb / 2},${y0 + BH}`;
          return <polygon key={i} points={pts} fill="url(#aa-funnel)" opacity={1 - i * 0.1} />;
        })}
      </svg>
      <div className="absolute inset-0">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].value : null;
          const conv = prev && prev > 0 ? ((s.value / prev) * 100).toFixed(1) : null;
          return (
            <div key={i} className="absolute left-0 right-0 flex flex-col items-center justify-center text-center px-2" style={{ top: `${((i * (BH + GAP)) / H) * 100}%`, height: `${(BH / H) * 100}%` }}>
              <div className="font-display font-light text-[1.7rem] leading-none text-ink drop-shadow-sm">{s.value.toLocaleString('pt-BR')}</div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink/75 mt-1.5">{s.label}{conv ? `  ·  ${conv}%` : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
