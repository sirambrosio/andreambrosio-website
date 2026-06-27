import type { Metadata } from 'next';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Painel', robots: { index: false, follow: false } };

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function q<T = Record<string, unknown>>(db: Pool, sql: string): Promise<T[]> {
  try { return (await db.query(sql)).rows as T[]; } catch { return []; }
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-6">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bronze mb-2">{label}</div>
      <div className="font-display font-light text-[2.25rem] text-text leading-none">{value}</div>
      {sub && <div className="text-[12px] text-text-dim mt-1.5">{sub}</div>}
    </div>
  );
}

export default async function Painel({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k } = await searchParams;
  const KEY = process.env.STATS_KEY;

  if (!KEY || k !== KEY) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center px-6">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-text-dim">acesso negado</p>
      </div>
    );
  }

  const db = getPool();
  const empty = { total: 0 };
  const num = (r: Record<string, unknown>[], key = 'n') => (r[0] ? Number(r[0][key]) : 0);

  const [pv, pv7, pv1, leads, leads7, topPaths, evts, srcs, byLoc] = db
    ? await Promise.all([
        q(db, `select count(*) n from events where event='pageview'`),
        q(db, `select count(*) n from events where event='pageview' and ts > now() - interval '7 days'`),
        q(db, `select count(*) n from events where event='pageview' and ts > now() - interval '1 day'`),
        q(db, `select count(*) n from newsletter_leads`),
        q(db, `select count(*) n from newsletter_leads where created_at > now() - interval '7 days'`),
        q(db, `select path, count(*) n from events where event='pageview' group by path order by n desc limit 12`),
        q(db, `select event, count(*) n from events group by event order by n desc limit 12`),
        q(db, `select source, count(*) n from newsletter_leads group by source order by n desc limit 8`),
        q(db, `select locale, count(*) n from events where event='pageview' and locale<>'' group by locale order by n desc limit 8`),
      ])
    : [[empty], [empty], [empty], [empty], [empty], [], [], [], []];

  const clicks = db ? await q(db, `select event, source, count(*) n from events where event in ('product_click','contact_click') and source is not null group by event, source order by n desc limit 14`) : [];
  const totalPv = num(pv), totalLeads = num(leads);
  const conv = totalPv > 0 ? ((totalLeads / totalPv) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-bg text-text px-6 md:px-12 py-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-[40px] h-[1px] bg-champagne" />
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">Painel · andreambrosio.com</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat label="Pageviews" value={totalPv} sub={`${num(pv1)} hoje · ${num(pv7)} em 7d`} />
          <Stat label="Inscritos" value={totalLeads} sub={`+${num(leads7)} em 7d`} />
          <Stat label="Conversão" value={`${conv}%`} sub="inscritos / pageviews" />
          <Stat label="Pageviews 7d" value={num(pv7)} />
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
            <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Eventos</h2>
            <ul className="divide-y divide-border mb-8">
              {evts.map((r) => (
                <li key={String(r.event)} className="flex justify-between py-2.5 text-[13px]">
                  <span className="text-text-dim">{String(r.event)}</span>
                  <span className="font-mono text-text tabular-nums">{String(r.n)}</span>
                </li>
              ))}
            </ul>
            {clicks.length > 0 && (
              <>
                <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">Intenção (produto / contato)</h2>
                <ul className="divide-y divide-border">
                  {clicks.map((r) => (
                    <li key={`${String(r.event)}-${String(r.source)}`} className="flex justify-between py-2.5 text-[13px]">
                      <span className="text-text-dim">{String(r.event) === 'product_click' ? '→ ' : '✉ '}{String(r.source)}</span>
                      <span className="font-mono text-text tabular-nums">{String(r.n)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
