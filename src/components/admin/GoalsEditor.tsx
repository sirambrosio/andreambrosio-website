'use client';
import { useState } from 'react';

type Goals = { subscribers: number; pageviews: number; clicks: number };

export function GoalsEditor({ initial }: { initial: Goals }) {
  const [g, setG] = useState<Goals>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  async function save() {
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/goals', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(g) });
    setMsg(r.ok ? 'Metas salvas.' : 'Falhou.'); setBusy(false);
  }
  const field = (k: keyof Goals, label: string) => (
    <label className="block">
      <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-2">{label}</span>
      <input type="number" min={0} value={g[k] || ''} onChange={(e) => setG({ ...g, [k]: Number(e.target.value) })}
        className="w-full h-11 px-4 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text outline-none focus:border-champagne" />
    </label>
  );
  return (
    <div>
      <p className="text-[13px] text-text-dim mb-5">Metas mensais. O progresso aparece na Visão geral.</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        {field('subscribers', 'Inscritos / mês')}
        {field('pageviews', 'Pageviews / mês')}
        {field('clicks', 'Cliques / mês')}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={save} disabled={busy} className="h-11 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 disabled:opacity-60">Salvar metas</button>
        {msg && <span className="text-[12px] text-text-dim">{msg}</span>}
      </div>
    </div>
  );
}
