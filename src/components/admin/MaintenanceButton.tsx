'use client';
import { useState } from 'react';
import { confirmModal } from '@/lib/confirm';

export function MaintenanceButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  async function run() {
    if (!(await confirmModal('Remover eventos de teste (paths /verify*)? Não afeta dados reais.'))) return;
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/maintenance', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'purge_test' }) });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? `Removidos: ${d.deleted ?? 0}` : 'Falhou.'); setBusy(false);
  }
  return (
    <div className="flex items-center gap-4">
      <button onClick={run} disabled={busy} className="h-10 px-5 rounded-full border border-border-strong text-[13px] text-text-dim hover:text-text hover:border-champagne transition-colors disabled:opacity-60">Limpar eventos de teste</button>
      {msg && <span className="text-[12px] text-text-dim">{msg}</span>}
    </div>
  );
}
