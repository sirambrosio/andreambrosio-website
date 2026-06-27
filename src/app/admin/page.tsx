import { Pool } from 'pg';
import { requireAdmin } from '@/lib/admin-auth';
import { AdminNav } from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false } });
  return pool;
}
async function q(db: Pool, sql: string): Promise<Record<string, unknown>[]> {
  try { return (await db.query(sql)).rows; } catch { return []; }
}
const n = (r: Record<string, unknown>[]) => (r[0] ? Number(r[0].n) : 0);

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-6">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-2">{label}</div>
      <div className="font-display font-light text-[2.25rem] text-text leading-none">{value}</div>
      {sub && <div className="text-[12px] text-text-dim mt-1.5">{sub}</div>}
    </div>
  );
}

export default async function AdminDashboard() {
  const sess = await requireAdmin();
  const db = getPool();
  const e: Record<string, unknown>[] = [];
  const [pv, pv7, pv1, leads, leads7, topPaths, evts, srcs, clicks] = db
    ? await Promise.all([
        q(db, `select count(*) n from events where event='pageview'`),
        q(db, `select count(*) n from events where event='pageview' and ts > now() - interval '7 days'`),
        q(db, `select count(*) n from events where event='pageview' and ts > now() - interval '1 day'`),
        q(db, `select count(*) n from newsletter_leads`),
        q(db, `select count(*) n from newsletter_leads where created_at > now() - interval '7 days'`),
        q(db, `select path, count(*) n from events where event='pageview' group by path order by n desc limit 12`),
        q(db, `select event, count(*) n from events group by event order by n desc limit 12`),
        q(db, `select source, count(*) n from newsletter_leads group by source order by n desc limit 8`),
        q(db, `select event, source, count(*) n from events where event in ('product_click','contact_click') and source is not null group by event, source order by n desc limit 14`),
      ])
    : [e, e, e, e, e, e, e, e, e];
  const totalPv = n(pv), totalLeads = n(leads);
  const conv = totalPv > 0 ? ((totalLeads / totalPv) * 100).toFixed(2) : '0';

  return (
    <div>
      <AdminNav email={sess.email} />
      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-12">
        {!db && <p className="text-[13px] text-bronze mb-8">Banco não configurado (DATABASE_URL).</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat label="Pageviews" value={totalPv} sub={`${n(pv1)} hoje · ${n(pv7)} em 7d`} />
          <Stat label="Inscritos" value={totalLeads} sub={`+${n(leads7)} em 7d`} />
          <Stat label="Conversão" value={`${conv}%`} sub="inscritos / pageviews" />
          <Stat label="Pageviews 7d" value={n(pv7)} />
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Páginas mais vistas</h2>
            <ul className="divide-y divide-border">
              {topPaths.map((r) => (
                <li key={String(r.path)} className="flex justify-between py-2.5 text-[13px]">
                  <span className="text-text-dim truncate pr-4">{String(r.path)}</span>
                  <span className="font-mono text-text tabular-nums">{String(r.n)}</span>
                </li>
              ))}
              {topPaths.length === 0 && <li className="py-2.5 text-[13px] text-text-dimmer">sem dados ainda</li>}
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Inscritos por origem</h2>
            <ul className="divide-y divide-border mb-8">
              {srcs.map((r) => (
                <li key={String(r.source)} className="flex justify-between py-2.5 text-[13px]">
                  <span className="text-text-dim">{String(r.source) || '—'}</span>
                  <span className="font-mono text-text tabular-nums">{String(r.n)}</span>
                </li>
              ))}
              {srcs.length === 0 && <li className="py-2.5 text-[13px] text-text-dimmer">sem inscritos ainda</li>}
            </ul>
            {clicks.length > 0 && (
              <>
                <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Intenção (produto / contato)</h2>
                <ul className="divide-y divide-border mb-8">
                  {clicks.map((r) => (
                    <li key={`${String(r.event)}-${String(r.source)}`} className="flex justify-between py-2.5 text-[13px]">
                      <span className="text-text-dim">{String(r.event) === 'product_click' ? '→ ' : '✉ '}{String(r.source)}</span>
                      <span className="font-mono text-text tabular-nums">{String(r.n)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Eventos</h2>
            <ul className="divide-y divide-border">
              {evts.map((r) => (
                <li key={String(r.event)} className="flex justify-between py-2.5 text-[13px]">
                  <span className="text-text-dim">{String(r.event)}</span>
                  <span className="font-mono text-text tabular-nums">{String(r.n)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
