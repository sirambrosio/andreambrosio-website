'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const SECTIONS: [string, string][] = [
  ['Visão geral', '/admin'], ['Ao Vivo', '/admin/ao-vivo'], ['Visitas', '/admin/visitas'], ['Funil', '/admin/funil'],
  ['Aquisição', '/admin/aquisicao'], ['Geografia', '/admin/geografia'], ['Ensaios', '/admin/ensaios'], ['Eventos', '/admin/eventos'],
  ['Metas', '/admin/metas'], ['Conteúdo', '/admin/conteudo'], ['Anotações', '/admin/anotacoes'], ['Links', '/admin/links'],
  ['Assinantes', '/admin/assinantes'], ['Campanhas', '/admin/newsletter'], ['Acessos', '/admin/acessos'], ['Backup', '/admin/backup'], ['Configurações', '/admin/config'],
];
type SearchRes = { links: { slug: string; title?: string | null }[]; subscribers: { email: string }[] };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [res, setRes] = useState<SearchRes>({ links: [], subscribers: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === 'Escape') setOpen(false);
    };
    const onEvt = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('aa:cmdk', onEvt as EventListener);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('aa:cmdk', onEvt as EventListener); };
  }, []);

  useEffect(() => {
    if (open) { const t = setTimeout(() => inputRef.current?.focus(), 30); return () => clearTimeout(t); }
    setQ(''); setRes({ links: [], subscribers: [] });
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) { setRes({ links: [], subscribers: [] }); return; }
    const id = setTimeout(async () => {
      const r = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`).then((x) => x.json()).catch(() => null);
      if (r?.ok) setRes({ links: r.links, subscribers: r.subscribers });
    }, 180);
    return () => clearTimeout(id);
  }, [q]);

  if (!open) return null;
  const go = (href: string) => { setOpen(false); router.push(href); };
  const ql = q.toLowerCase();
  const secs = SECTIONS.filter(([l]) => l.toLowerCase().includes(ql));

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Busca">
      <div className="absolute inset-0 bg-oled/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-[560px] rounded-[16px] border border-border-strong bg-surface shadow-brand-lg overflow-hidden">
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar seções, links, assinantes…"
          className="w-full px-5 h-14 bg-transparent text-[15px] text-text placeholder:text-text-dimmer outline-none border-b border-border" />
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {secs.length > 0 && (
            <div>
              <div className="px-5 pt-2 pb-1 font-mono text-[9px] tracking-[0.2em] uppercase text-text-dimmer">Seções</div>
              {secs.map(([l, h]) => (
                <button key={h} onClick={() => go(h)} className="w-full text-left px-5 py-2.5 text-[14px] text-text-dim hover:text-text hover:bg-surface-alt transition-colors">{l}</button>
              ))}
            </div>
          )}
          {res.links.length > 0 && (
            <div>
              <div className="px-5 pt-2 pb-1 font-mono text-[9px] tracking-[0.2em] uppercase text-text-dimmer">Links</div>
              {res.links.map((l) => (
                <button key={l.slug} onClick={() => go(`/admin/links/${l.slug}`)} className="w-full text-left px-5 py-2.5 text-[14px] text-text-dim hover:text-text hover:bg-surface-alt transition-colors">/{l.slug}{l.title ? <span className="text-text-dimmer"> · {l.title}</span> : null}</button>
              ))}
            </div>
          )}
          {res.subscribers.length > 0 && (
            <div>
              <div className="px-5 pt-2 pb-1 font-mono text-[9px] tracking-[0.2em] uppercase text-text-dimmer">Assinantes</div>
              {res.subscribers.map((sx) => (
                <button key={sx.email} onClick={() => go('/admin/assinantes')} className="w-full text-left px-5 py-2.5 text-[14px] text-text-dim hover:text-text hover:bg-surface-alt transition-colors">{sx.email}</button>
              ))}
            </div>
          )}
          {secs.length === 0 && res.links.length === 0 && res.subscribers.length === 0 && (
            <p className="px-5 py-6 text-[13px] text-text-dimmer">Nada encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
