'use client';

import { useState } from 'react';
import { confirmModal } from '@/lib/confirm';
import { api } from '@/lib/admin-fetch';
import { toast } from '@/lib/toast';
import Link from 'next/link';
import { Copy, Trash2, ExternalLink, BarChart3, Check, Pencil, FileText, X } from 'lucide-react';

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
  const [edit, setEdit] = useState<{ slug: string; target: string } | null>(null);
  const [showUtm, setShowUtm] = useState(false);
  const [utm, setUtm] = useState({ source: '', medium: '', campaign: '' });

  async function refresh() {
    const d = await fetch('/api/admin/links').then((r) => r.json()).catch(() => null);
    if (d?.ok) setList(d.rows.map((r: Record<string, unknown>) => ({ slug: r.slug, target: r.target, title: r.title, clicks: Number(r.clicks), created: r.created })));
  }
  function applyUtm(t: string): string {
    if (!utm.source && !utm.medium && !utm.campaign) return t;
    try { const u = new URL(t); if (utm.source) u.searchParams.set('utm_source', utm.source); if (utm.medium) u.searchParams.set('utm_medium', utm.medium); if (utm.campaign) u.searchParams.set('utm_campaign', utm.campaign); return u.toString(); } catch { return t; }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!/^https?:\/\/.+/.test(target)) { setMsg('Cole uma URL http(s) válida.'); return; }
    setBusy(true); setMsg('');
    const finalTarget = applyUtm(target);
    const r = await fetch('/api/admin/links', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ target: finalTarget, slug, title }) });
    const d = await r.json().catch(() => ({}));
    if (d.ok) { setList((l) => [{ slug: d.slug, target: applyUtm(target), title: title || null, clicks: 0, created: new Date().toISOString().slice(0, 10) }, ...l]); setTarget(''); setSlug(''); setTitle(''); setUtm({ source: '', medium: '', campaign: '' }); }
    else setMsg(d.error === 'slug' ? 'Atalho já em uso.' : 'URL inválida.');
    setBusy(false);
  }
  async function fromEssays() {
    if (!(await confirmModal('Gerar um link rastreável para cada ensaio?'))) return;
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/links/from-essays', { method: 'POST' });
    const d = await r.json().catch(() => ({}));
    if (d.ok) { setMsg(`${d.created} novos · ${d.total} ensaios.`); await refresh(); }
    setBusy(false);
  }
  async function saveEdit() {
    if (!edit) return;
    if (!/^https?:\/\/.+/.test(edit.target)) { toast('URL inválida — use http(s).', 'error'); return; }
    const { ok } = await api('/api/admin/links', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: edit.slug, target: edit.target }), errorMsg: 'Falha ao salvar link.' });
    if (ok) { setList((l) => l.map((x) => (x.slug === edit.slug ? { ...x, target: edit.target } : x))); setEdit(null); toast('Link atualizado.', 'success'); }
  }
  async function del(s: string) {
    if (!(await confirmModal('Excluir este link? Os cliques registrados também serão apagados.'))) return;
    const r = await fetch('/api/admin/links', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: s }) });
    if (r.ok) setList((l) => l.filter((x) => x.slug !== s));
  }
  function copy(s: string) { navigator.clipboard?.writeText(BASE + s); setCopied(s); setTimeout(() => setCopied(''), 1500); }

  return (
    <div>
      <form onSubmit={create} className="rounded-[16px] border border-border bg-surface p-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze">Criar link rastreável</h2>
          <button type="button" onClick={fromEssays} disabled={busy} className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border-strong text-[12px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-champagne hover:border-champagne transition-colors disabled:opacity-50"><FileText size={13} /> Gerar dos ensaios</button>
        </div>
        <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="URL de destino (https://…)" className="w-full h-11 px-4 mb-3 rounded-[10px] border border-border-strong bg-bg text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center rounded-[10px] border border-border-strong bg-bg h-11 px-3 flex-1 min-w-[220px]">
            <span className="font-mono text-[12px] text-text-dimmer">track.andreambrosio.com/</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="atalho (opcional)" className="flex-1 bg-transparent text-[13px] text-text placeholder:text-text-dimmer outline-none" />
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (opcional)" className="h-11 px-4 rounded-[10px] border border-border-strong bg-bg text-[13px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne flex-1 min-w-[160px]" />
          <button disabled={busy} className="h-11 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">Criar</button>
        </div>
        <button type="button" onClick={() => setShowUtm((v) => !v)} className="mt-3 text-[11px] font-mono uppercase tracking-[0.15em] text-text-dimmer hover:text-champagne transition-colors">{showUtm ? '− UTM' : '+ UTM'}</button>
        {showUtm && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <input value={utm.source} onChange={(e) => setUtm({ ...utm, source: e.target.value })} placeholder="utm_source" className="h-10 px-3 rounded-[8px] border border-border-strong bg-bg text-[12px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
            <input value={utm.medium} onChange={(e) => setUtm({ ...utm, medium: e.target.value })} placeholder="utm_medium" className="h-10 px-3 rounded-[8px] border border-border-strong bg-bg text-[12px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
            <input value={utm.campaign} onChange={(e) => setUtm({ ...utm, campaign: e.target.value })} placeholder="utm_campaign" className="h-10 px-3 rounded-[8px] border border-border-strong bg-bg text-[12px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne" />
          </div>
        )}
        {msg && <p role="status" aria-live="polite" className="text-[12px] text-text-dim mt-3">{msg}</p>}
      </form>

      <div className="rounded-[16px] border border-border overflow-x-auto">
        <table className="w-full text-[13px] min-w-[640px]">
          <thead><tr className="bg-surface-alt text-left font-mono text-[10px] tracking-[0.15em] uppercase text-text-dimmer">
            <th className="px-5 py-3 font-medium">Link</th><th className="px-4 py-3 font-medium">Destino</th><th className="px-4 py-3 font-medium">Cliques</th><th className="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.slug} className="border-t border-border hover:bg-surface/60">
                <td className="px-5 py-3 align-top">
                  <div className="flex items-center gap-2"><span className="text-text font-mono">/{r.slug}</span><button onClick={() => copy(r.slug)} className="text-text-dimmer hover:text-champagne" aria-label="Copiar">{copied === r.slug ? <Check size={13} className="text-champagne" /> : <Copy size={13} />}</button></div>
                  {r.title && <div className="text-[11px] text-text-dimmer mt-0.5 max-w-[180px] truncate">{r.title}</div>}
                </td>
                <td className="px-4 py-3 align-top max-w-[280px]">
                  {edit?.slug === r.slug ? (
                    <div className="flex items-center gap-1.5">
                      <input value={edit.target} onChange={(e) => setEdit({ slug: r.slug, target: e.target.value })} className="flex-1 h-8 px-2 rounded-[8px] border border-champagne bg-bg text-[12px] text-text outline-none" />
                      <button onClick={saveEdit} className="text-champagne" aria-label="Salvar"><Check size={14} /></button>
                      <button onClick={() => setEdit(null)} className="text-text-dimmer" aria-label="Cancelar"><X size={14} /></button>
                    </div>
                  ) : (
                    <a href={r.target} target="_blank" rel="noopener" className="text-text-dim hover:text-champagne inline-flex items-center gap-1 truncate"><span className="truncate">{r.target.replace(/^https?:\/\//, '')}</span> <ExternalLink size={11} className="shrink-0" /></a>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-text tabular-nums align-top">{r.clicks}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap align-top">
                  <button onClick={() => setEdit({ slug: r.slug, target: r.target })} className="text-text-dimmer hover:text-champagne inline-block mr-3" aria-label="Editar"><Pencil size={13} /></button>
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
