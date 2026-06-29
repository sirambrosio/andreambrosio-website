import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function Eventos({ searchParams }: { searchParams: Promise<{ ev?: string }> }) {
  const sess = await requireAdmin();
  const ev = (await searchParams).ev || '';
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const evSafe = ev.slice(0, 60);
  const [byType, recent] = db ? await Promise.all([
    rows(db, `select event, count(*) n from events group by event order by n desc`),
    evSafe
      ? rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD HH24:MI') t, event, path, source, country from events where event = $1 order by ts desc limit 80`, [evSafe])
      : rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD HH24:MI') t, event, path, source, country from events order by ts desc limit 80`),
  ]) : [e, e];
  return (
    <Shell email={sess.email} title="Eventos">
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <Card title="Por tipo (clique p/ filtrar)">
          <ul className="space-y-1">
            <li><Link href="/admin/eventos" className={`flex justify-between py-1.5 px-2 rounded-[8px] text-[13px] ${!ev ? 'bg-surface-alt text-text' : 'text-text-dim hover:bg-surface'}`}><span>todos</span></Link></li>
            {byType.map((x) => (
              <li key={String(x.event)}>
                <Link href={`/admin/eventos?ev=${x.event}`} className={`flex justify-between py-1.5 px-2 rounded-[8px] text-[13px] ${ev === x.event ? 'bg-surface-alt text-text' : 'text-text-dim hover:bg-surface'}`}>
                  <span>{String(x.event)}</span><span className="font-mono tabular-nums">{String(x.n)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={ev ? `Recentes · ${ev}` : 'Recentes'}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-[12.5px] min-w-[460px]">
              <thead><tr className="text-left font-mono text-[9px] tracking-[0.15em] uppercase text-text-dimmer"><th className="px-2 py-2">Quando</th><th className="px-2 py-2">Evento</th><th className="px-2 py-2">Página/Origem</th></tr></thead>
              <tbody>
                {recent.map((x, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-2 py-2 font-mono text-text-dimmer whitespace-nowrap">{String(x.t)}</td>
                    <td className="px-2 py-2 text-text">{String(x.event)}</td>
                    <td className="px-2 py-2 text-text-dim truncate max-w-[280px]">{String(x.source || x.path || '')}{x.country ? ` · ${x.country}` : ''}</td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td colSpan={3} className="px-2 py-6 text-center text-text-dimmer">sem eventos</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
