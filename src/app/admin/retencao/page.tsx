import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card } from '@/components/admin/ui';
export const dynamic = 'force-dynamic';
export default async function Retencao() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [total, returning, pv] = db ? await Promise.all([
    rows(db, `select count(distinct sid) n from events where sid is not null`),
    rows(db, `select count(*) n from (select sid from events where sid is not null group by sid having count(distinct (ts at time zone 'America/Sao_Paulo')::date) > 1) x`),
    rows(db, `select count(*) n from events where event='pageview' and sid is not null`),
  ]) : [e, e, e];
  const t = num(total), ret = num(returning), nw = Math.max(0, t - ret);
  const rate = t > 0 ? ((ret / t) * 100).toFixed(1) : '0';
  const avg = t > 0 ? (num(pv) / t).toFixed(1) : '0';
  const pct = t > 0 ? (ret / t) * 100 : 0;
  return (
    <Shell email={sess.email} title="Retenção">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Visitantes" value={t} sub="sessões únicas" />
        <Stat label="Recorrentes" value={ret} sub="voltaram outro dia" />
        <Stat label="Taxa de retorno" value={`${rate}%`} sub="recorrentes / total" />
        <Stat label="Páginas / visitante" value={avg} sub="média" />
      </div>
      <Card title="Novos vs. recorrentes">
        <div className="flex h-8 rounded-full overflow-hidden border border-border">
          <div className="bg-champagne/30 flex items-center justify-center text-[11px] text-text" style={{ width: `${100 - pct}%` }} title={`Novos: ${nw}`}>{nw > 0 ? `Novos ${nw}` : ''}</div>
          <div className="bg-brand-gradient flex items-center justify-center text-[11px] text-ink font-medium" style={{ width: `${pct}%` }} title={`Recorrentes: ${ret}`}>{ret > 0 ? `Recorrentes ${ret}` : ''}</div>
        </div>
        <p className="mt-4 text-[12px] text-text-dim">Recorrente = visitante visto em mais de um dia diferente.</p>
      </Card>
    </Shell>
  );
}
