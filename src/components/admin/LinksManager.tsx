'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Trash2, ExternalLink, BarChart3, Check } from 'lucide-react';

type Row = { slug: string; target: string; title: string | null; clicks: number; created: string };
const BASE = 'https://track.andreambrosio.com/';

export function LinksManager({ initial }: { initial: Row[] }) {
  const [list, setList] = useState<Row[]>(initial);
  const [target, setTarget] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState('');

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!/^https?:\/\/.+/.test(target)) { setMsg('Cole uma URL http(s) válida.'); return; }
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/links', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ target, slug, title }) });
    const d = await r.json().catch(() => ({}));
    if (d.ok) { setList((l) => [{ slug: d.slug, target, title: title || null, clicks: 0, created: new Date().toISOString().slice(0, 10) }, ...l]); setTarget(''); setSlug(''); setTitle(''); setMsg(''); }
    else setMsg('Falhou.');
    setBusy(false);
  }
  async function del(s: string) {
    if (!confirm('Excluir este link? Os cliques registrados também serão apagados.')) return;
    const r = await fetch('/api/admin/links', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: s }) });
    if (r.ok) setList((l) => l.filter((x) => x.slug !== s));
  }
  function copy(s: string) { navigator.clipboard?.writeText(BASE + s); setCopied(s); setTimeout(() => setCopied(''), 1500); }

  return (
    <div>
      <form onSubmit={create} className="rounded-[16px] border border-border bg-surface p-6 mb-6">
        <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Criar link rastreável</h2>
        <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="URL de destino (https://…)" className="w-full h-11 px-4 mb-3 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center rounded-[10px] border border-border-strong bg-bg h-11 px-3 flex-1 min-w-[220px]">
            <span className="font-mono text-[12px] text-text-dimmer">track.andreambrosio.com/</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="atalho (opcional)" className="flex-1 bg-transparent text-[13px] text-text placeholder:text-text-dimmer outline-none" />
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (opcional)" className="h-11 px-4 rounded-[10px] border border-border-strong bg-bg text-[13px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne flex-1 min-w-[160px]" />
          <button disabled={busy} className="h-11 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">Criar</button>
        </div>
        {msg && <p className="text-[12px] text-bronze mt-3">{msg}</p>}
      </form>

      <div className="rounded-[16px] border border-border overflow-hidden">
        <table className="w-full text-[13px]">
          <thead><tr className="bg-surface-alt text-left font-mono text-[10px] tracking-[0.15em] uppercase text-text-dimmer">
            <th className="px-5 py-3 font-medium">Link</th><th className="px-4 py-3 font-medium">Destino</th><th className="px-4 py-3 font-medium">Cliques</th><th className="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.slug} className="border-t border-border hover:bg-surface/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-text font-mono">/{r.slug}</span>
                    <button onClick={() => copy(r.slug)} className="text-text-dimmer hover:text-champagne" aria-label="Copiar">{copied === r.slug ? <Check size={13} className="text-champagne" /> : <Copy size={13} />}</button>
                  </div>
                  {r.title && <div className="text-[11px] text-text-dimmer mt-0.5">{r.title}</div>}
                </td>
                <td className="px-4 py-3 text-text-dim truncate max-w-[260px]"><a href={r.target} target="_blank" rel="noopener" className="hover:text-champagne inline-flex items-center gap-1">{r.target.replace(/^https?:\/\//, '')} <ExternalLink size={11} /></a></td>
                <td className="px-4 py-3 font-mono text-text tabular-nums">{r.clicks}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/links/${r.slug}`} className="text-text-dimmer hover:text-champagne inline-block mr-3" aria-label="Estatísticas"><BarChart3 size={14} /></Link>
                  <button onClick={() => del(r.slug)} className="text-text-dimmer hover:text-bronze" aria-label="Excluir"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-text-dimmer">nenhum link ainda</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
