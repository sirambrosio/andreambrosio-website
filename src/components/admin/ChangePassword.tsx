'use client';

import { useState } from 'react';

export function ChangePassword() {
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (nw.length < 8) { setMsg('A nova senha precisa de ao menos 8 caracteres.'); return; }
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ current: cur, next: nw }) });
    const d = await r.json().catch(() => ({}));
    setMsg(d.ok ? 'Senha alterada.' : d.error === 'wrong' ? 'Senha atual incorreta.' : 'Falhou.');
    if (d.ok) { setCur(''); setNw(''); }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="max-w-[360px]">
      <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Senha atual" autoComplete="current-password"
        className="w-full h-11 px-4 mb-3 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
      <input type="password" value={nw} onChange={(e) => setNw(e.target.value)} placeholder="Nova senha" autoComplete="new-password"
        className="w-full h-11 px-4 mb-4 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
      <button disabled={busy} className="h-11 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">Alterar senha</button>
      {msg && <p className="text-[12px] text-text-dim mt-3">{msg}</p>}
    </form>
  );
}
