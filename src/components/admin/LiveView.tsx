'use client';
import { useEffect, useState } from 'react';
import { Card, Stat, RankList } from './ui';

type Feed = { event: string; path: string | null; locale: string | null; country: string | null; t: string };
type Live = { active: number; pv30: number; feed: Feed[]; paths: { label: string; n: number }[] };

export function LiveView() {
  const [d, setD] = useState<Live | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let on = true; let fails = 0;
    const load = async () => {
      try {
        const res = await fetch('/api/admin/live');
        if (res.status === 401) { if (on) setErr(true); return; }
        const r = await res.json();
        if (on && r?.ok) { setD(r); setErr(false); fails = 0; }
      } catch { fails += 1; if (on && fails >= 2) setErr(true); }
    };
    load();
    const id = setInterval(load, 10000);
    return () => { on = false; clearInterval(id); };
  }, []);
  return (
    <div>
      {err && <div role="alert" className="mb-5 flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-bronze bg-surface text-[12px] text-bronze"><span className="w-1.5 h-1.5 rounded-full bg-bronze animate-pulse" />Sem conexão com o servidor — tentando reconectar…</div>}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Stat label="Ativos agora · 5 min" value={d?.active ?? '—'} sub="visitantes únicos" />
        <Stat label="Pageviews · 30 min" value={d?.pv30 ?? '—'} sub="janela recente" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Páginas ativas · 30 min"><RankList items={d?.paths ?? []} empty="ninguém navegando agora" /></Card>
        <Card title="Eventos ao vivo">
          {(!d || d.feed.length === 0) ? <p className="text-[13px] text-text-dimmer">aguardando…</p> : (
            <ul className="space-y-1.5 font-mono text-[12px]">
              {d.feed.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-text-dim">
                  <span className="text-text-dimmer tabular-nums">{f.t}</span>
                  <span className="text-champagne">{f.event}</span>
                  <span className="truncate text-text">{f.path || ''}</span>
                  {f.country && <span className="ml-auto text-text-dimmer uppercase">{f.country}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <p className="mt-4 text-[11px] text-text-dimmer font-mono">{err ? 'reconectando…' : !d ? 'carregando…' : 'ao vivo · atualiza a cada 10s'}</p>
    </div>
  );
}
