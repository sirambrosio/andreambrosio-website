'use client';

import { useMemo, useState } from 'react';
import { confirmModal } from '@/lib/confirm';
import { api } from '@/lib/admin-fetch';
import { toast } from '@/lib/toast';
import { Trash2, Search } from 'lucide-react';

type Row = { email: string; locale: string | null; source: string | null; created_at: string };

export function SubscribersTable({ initial }: { initial: Row[] }) {
  const [list, setList] = useState<Row[]>(initial);
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? list.filter((r) => `${r.email} ${r.source ?? ''} ${r.locale ?? ''}`.toLowerCase().includes(s)) : list;
  }, [list, q]);

  async function del(email: string) {
    if (!(await confirmModal(`Excluir ${email}?`))) return;
    const { ok } = await api('/api/admin/subscribers', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }), errorMsg: 'Falha ao excluir assinante.' });
    if (ok) { setList((l) => l.filter((x) => x.email !== email)); toast('Assinante removido.', 'success'); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="relative w-full sm:w-[280px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dimmer" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar e-mail / origem…"
            className="w-full h-10 pl-9 pr-4 rounded-full border border-border-strong bg-surface text-[13px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
        </div>
        <a href="/api/admin/subscribers?format=csv" className="h-10 inline-flex items-center px-5 rounded-full border border-border-strong text-[12px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-champagne hover:border-champagne transition-colors">Exportar CSV</a>
      </div>
      <div className="rounded-[16px] border border-border overflow-x-auto">
        <table className="w-full text-[13px] min-w-[560px]">
          <thead>
            <tr className="bg-surface-alt text-left font-mono text-[10px] tracking-[0.15em] uppercase text-text-dimmer">
              <th className="px-5 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Idioma</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.email} className="border-t border-border hover:bg-surface/60">
                <td className="px-5 py-3 text-text">{r.email}</td>
                <td className="px-4 py-3 text-text-dim">{r.locale || '—'}</td>
                <td className="px-4 py-3 text-text-dim">{r.source || '—'}</td>
                <td className="px-4 py-3 text-text-dimmer font-mono">{String(r.created_at).slice(0, 10)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => del(r.email)} className="text-text-dimmer hover:text-bronze transition-colors" aria-label="Excluir"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-text-dimmer">nenhum resultado</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-text-dimmer mt-3">{filtered.length} de {list.length}</p>
    </div>
  );
}
