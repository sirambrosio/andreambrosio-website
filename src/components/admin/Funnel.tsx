export function Funnel({ stages }: { stages: { label: string; value: number }[] }) {
  const top = Math.max(1, stages[0]?.value ?? 1);
  return (
    <div className="py-2">
      {stages.map((s, i) => {
        const w = Math.max(14, (s.value / top) * 100);
        const next = stages[i + 1];
        const drop = next && s.value > 0 ? ((next.value / s.value) * 100).toFixed(1) : null;
        return (
          <div key={i}>
            <div className="mx-auto rounded-[14px] h-[92px] flex items-center justify-center shadow-brand transition-all" style={{ width: `${w}%`, background: 'linear-gradient(135deg, #C9A961 0%, #8B764A 100%)' }}>
              <div className="text-center px-3">
                <div className="font-display font-light text-[1.75rem] text-ink leading-none">{s.value.toLocaleString('pt-BR')}</div>
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/75 mt-1.5">{s.label}</div>
              </div>
            </div>
            {drop && <div className="text-center font-mono text-[11px] text-text-dim py-2">&#9660; {drop}%</div>}
          </div>
        );
      })}
    </div>
  );
}
