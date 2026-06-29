'use client';

import { useState } from 'react';

export function Broadcast({ esp }: { esp: boolean }) {
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [test, setTest] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);

  async function send(asTest: boolean) {
    if (!subject || !html) { setMsg('Preencha assunto e conteúdo.'); return; }
    if (asTest && !test) { setMsg('Informe um e-mail de teste.'); return; }
    if (!asTest && !confirm('Enviar para TODOS os assinantes?')) return;
    setBusy(true); setMsg('Enviando…');
    try {
      const r = await fetch('/api/admin/broadcast', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, html, test: asTest ? test : undefined }),
      });
      const d = await r.json().catch(() => ({}));
      if (d.ok) setMsg(`Enviados: ${d.sent}/${d.total}.`);
      else if (d.error === 'no_esp') setMsg('Resend não configurado (falta RESEND_API_KEY).');
      else setMsg('Falhou.');
    } catch { setMsg('Erro de rede.'); }
    setBusy(false);
  }

  return (
    <div className="rounded-[16px] border border-border bg-surface p-6">
      <h2 className="font-display font-light text-[1.25rem] text-text mb-1">Enviar newsletter</h2>
      {!esp && <p className="text-[12px] text-bronze mb-4">Resend não configurado — defina RESEND_API_KEY para habilitar o envio.</p>}
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto"
        className="w-full h-11 px-4 mb-3 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
      <div className="flex items-center justify-end mb-1">
        <button type="button" onClick={() => setPreview((v) => !v)} className="text-[11px] font-mono uppercase tracking-[0.15em] text-text-dimmer hover:text-champagne transition-colors">{preview ? 'Editar HTML' : 'Pré-visualizar'}</button>
      </div>
      {preview ? (
        <iframe title="preview" sandbox="" srcDoc={html || '<p style=\'font-family:sans-serif;color:#888;padding:20px\'>sem conteúdo</p>'} className="w-full h-[260px] mb-3 rounded-[10px] border border-border-strong bg-white" />
      ) : (
        <textarea value={html} onChange={(e) => setHtml(e.target.value)} placeholder="HTML do e-mail" rows={8}
          className="w-full px-4 py-3 mb-3 rounded-[10px] border border-border-strong bg-bg text-[13px] font-mono text-text placeholder:text-text-dimmer outline-none focus:border-champagne resize-y" />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input value={test} onChange={(e) => setTest(e.target.value)} placeholder="e-mail de teste"
          className="flex-1 min-w-[160px] h-10 px-4 rounded-full border border-border-strong bg-bg text-[13px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
        <button disabled={busy} onClick={() => send(true)} className="h-10 px-5 rounded-full border border-border-strong text-[12px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-champagne hover:border-champagne transition-colors disabled:opacity-50">Teste</button>
        <button disabled={busy} onClick={() => send(false)} className="h-10 px-5 rounded-full bg-brand-gradient text-ink text-[12px] font-mono font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50">Enviar a todos</button>
      </div>
      {msg && <p role="status" aria-live="polite" className="text-[12px] text-text-dim mt-3">{msg}</p>}
    </div>
  );
}
