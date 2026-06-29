import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin, range } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card, RankList, Bars } from '@/components/admin/ui';
import { PeriodSelector } from '@/components/admin/PeriodSelector';

export const dynamic = 'force-dynamic';
const rk = (r: Record<string, unknown>[], k: string) => r.map((x) => ({ label: String(x[k] ?? '—') || '—', n: Number(x.n) }));
function fillDays(data: Record<string, unknown>[], days: number) {
  const m = new Map(data.map((r) => [String(r.d), Number(r.n)]));
  const out: { label: string; n: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) { const dt = new Date(now.getTime() - i * 86400000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); out.push({ label: dt.slice(5), n: m.get(dt) ?? 0 }); }
  return out;
}

export default async function Visitas({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sess = await requireAdmin();
  const rg = range((await searchParams).range);
  const db = getPool();
  if (db) await ensureAdmin(db);
  const w = rg.where();
  const e: Record<string, unknown>[] = [];
  const [series, paths, locales, refs, countries] = db ? await Promise.all([
    rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD') d, count(*) n from events where event='pageview' ${w} group by d`),
    rows(db, `select path, count(*) n from events where event='pageview' ${w} group by path order by n desc limit 15`),
    rows(db, `select locale, count(*) n from events where event='pageview' and locale<>'' ${w} group by locale order by n desc limit 10`),
    rows(db, `select ref, count(*) n from events where event='pageview' and ref is not null and ref<>'' ${w} group by ref order by n desc limit 10`),
    rows(db, `select country, count(*) n from events where event='pageview' and country is not null ${w} group by country order by n desc limit 12`),
  ]) : [e, e, e, e, e];
  return (
    <Shell email={sess.email} title="Visitas" actions={<PeriodSelector current={rg.key} />}>
      <Card title={`Pageviews — ${rg.key === 'all' ? 'último ano' : `${rg.key} dias`}`}><Bars data={fillDays(series, rg.days)} /></Card>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card title="Páginas mais vistas"><RankList items={rk(paths, 'path')} /></Card>
        <Card title="Por idioma"><RankList items={rk(locales, 'locale')} /></Card>
        <Card title="Referenciadores"><RankList items={rk(refs, 'ref')} empty="sem referenciador externo" /></Card>
        <Card title="Por país"><RankList items={rk(countries, 'country')} empty="sem dados de país ainda" /></Card>
      </div>
    </Shell>
  );
}
