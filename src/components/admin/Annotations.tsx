'use client';
import { useEffect, useState } from 'react';
import { confirmModal } from '@/lib/confirm';
import { api } from '@/lib/admin-fetch';
import { toast } from '@/lib/toast';

type Item = { id: number; d: string; label: string };

export function Annotations() {
  const [items, setItems] = useState<Item[]>([]);
  const [d, setD] = useState('');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    const r = await fetch('/api/admin/annotations').then((x) => x.json()).catch(() => null);
    if (r?.ok) setItems(r.items);
  }
  useEffect(() => { load(); }, []);
  async function add() {
    if (!d || !label.trim()) return;
    setBusy(true);
    const { ok } = await api('/api/admin/annotations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ d, label }), errorMsg: 'Falha ao adicionar anotação.' });
    setBusy(false);
    if (ok) { setLabel(''); toast('Anotação adicionada.', 'success'); load(); }
  }
  async function del(id: number) {
    if (!(await confirmModal('Excluir esta anotação?'))) return;
    const { ok } = await api(`/api/admin/annotations?id=${id}`, { method: 'DELETE', errorMsg: 'Falha ao excluir.' });
    if (ok) { toast('Anotação removida.', 'success'); load(); }
  }
  return (
    <div>
      <p className="text-[13px] text-text-dim mb-5">Marque momentos (lançamentos, posts) pra dar contexto aos picos de visita.</p>
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-2">Data</span>
          <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="h-11 px-4 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text outline-none focus:border-champagne" />
        </label>
        <label className="block flex-1 min-w-[200px]">
          <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-2">O que aconteceu</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Publiquei no LinkedIn" className="w-full h-11 px-4 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text outline-none focus:border-champagne" />
        </label>
        <button onClick={add} disabled={busy} className="h-11 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 disabled:opacity-60">Adicionar</button>
      </div>
      {items.length === 0 ? <p className="text-[13px] text-text-dimmer">nenhuma anotação ainda</p> : (
        <ul className="divide-y divide-border">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 py-3">
              <span className="font-mono text-[12px] text-bronze tabular-nums shrink-0">{it.d}</span>
              <span className="text-[14px] text-text flex-1">{it.label}</span>
              <button onClick={() => del(it.id)} className="text-[12px] text-text-dimmer hover:text-bronze transition-colors">excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
