import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
export const dynamic = 'force-dynamic';
const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export default async function Horarios() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const data = db ? await rows(db, `select extract(dow from ts at time zone 'America/Sao_Paulo')::int dow, extract(hour from ts at time zone 'America/Sao_Paulo')::int h, count(*) n from events where event='pageview' group by 1,2`) : [];
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  let max = 0;
  for (const r of data) { const dw = Number(r.dow), h = Number(r.h), n = Number(r.n); if (grid[dw]) { grid[dw][h] = n; if (n > max) max = n; } }
  max = max || 1;
  return (
    <Shell email={sess.email} title="Horários">
      <Card title="Quando te visitam · hora (Brasília) × dia">
        <div className="overflow-x-auto">
          <div className="min-w-[660px]">
            <div className="flex gap-[3px] mb-1 pl-10">
              {Array.from({ length: 24 }, (_, h) => (<div key={h} className="flex-1 text-center font-mono text-[8px] text-text-dimmer">{h % 3 === 0 ? h : ''}</div>))}
            </div>
            {grid.map((row, dw) => (
              <div key={dw} className="flex gap-[3px] items-center mb-[3px]">
                <div className="w-10 font-mono text-[10px] text-text-dim shrink-0">{DOW[dw]}</div>
                {row.map((n, h) => (
                  <div key={h} className="flex-1 aspect-square rounded-[2px] border border-border/40" title={`${DOW[dw]} ${h}h · ${n} visitas`}
                    style={{ backgroundColor: n > 0 ? `rgba(200,164,100,${(0.14 + (n / max) * 0.86).toFixed(3)})` : 'transparent' }} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[11px] text-text-dimmer">Mais dourado = mais visitas. Use pra achar a melhor hora de publicar.</p>
      </Card>
    </Shell>
  );
}
