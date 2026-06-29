import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
export const dynamic = 'force-dynamic';
function flag(cc: string) {
  if (!/^[A-Za-z]{2}$/.test(cc)) return '🌐';
  return String.fromCodePoint(...cc.toUpperCase().split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
export default async function Geografia() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const data = db ? await rows(db, `select coalesce(nullif(country,''),'??') cc, count(*) n from events where event='pageview' group by 1 order by n desc limit 40`) : [];
  const total = data.reduce((a, r) => a + Number(r.n), 0) || 1;
  return (
    <Shell email={sess.email} title="Geografia">
      <Card title="Visitantes por país">
        {data.length === 0 ? <p className="text-[13px] text-text-dimmer">sem dados</p> : (
          <ul className="space-y-2.5">
            {data.map((r, i) => {
              const cc = String(r.cc); const n = Number(r.n); const pct = ((n / total) * 100).toFixed(1);
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-[18px] w-7">{flag(cc)}</span>
                  <span className="text-[13px] text-text-dim w-10 font-mono uppercase">{cc}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-alt overflow-hidden"><div className="h-full bg-champagne/50 rounded-full" style={{ width: `${pct}%` }} /></div>
                  <span className="font-mono text-[12px] text-text tabular-nums w-12 text-right">{n}</span>
                  <span className="font-mono text-[11px] text-text-dimmer tabular-nums w-12 text-right">{pct}%</span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </Shell>
  );
}
