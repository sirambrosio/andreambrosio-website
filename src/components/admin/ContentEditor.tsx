'use client';
import { useState } from 'react';

export function ContentEditor({ initial }: { initial: string }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  async function save() {
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/content', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content }) });
    setMsg(r.ok ? 'Salvo. Já está no /agora.' : 'Falhou.');
    setBusy(false);
  }
  return (
    <div>
      <p className="text-[13px] text-text-dim mb-4">No que você está focado agora. Aparece em <span className="font-mono text-champagne">andreambrosio.com/pt/agora</span>. Parágrafos separados por linha em branco.</p>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} placeholder="Estou construindo…"
        className="w-full px-4 py-3 mb-4 rounded-[12px] border border-border-strong bg-bg text-[14px] text-text leading-relaxed placeholder:text-text-dimmer outline-none focus:border-champagne resize-y" />
      <div className="flex items-center gap-4">
        <button onClick={save} disabled={busy} className="h-11 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">Salvar</button>
        {msg && <span role="status" aria-live="polite" className="text-[12px] text-text-dim">{msg}</span>}
      </div>
    </div>
  );
}
