import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin, range } from '@/lib/admin-data';
import { PeriodSelector } from '@/components/admin/PeriodSelector';
import { Shell } from '@/components/admin/Shell';
import { Card, Stat, RankList, toRank } from '@/components/admin/ui';
import { Funnel } from '@/components/admin/Funnel';

export const dynamic = 'force-dynamic';

export default async function FunilPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sess = await requireAdmin();
  const rg = range((await searchParams).range);
  const w = rg.where();
  const wl = rg.where('created_at');
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [pv, prod, contact, leads, prodBy, contactBy] = db ? await Promise.all([
    rows(db, `select count(*) n from events where event='pageview' ${w}`),
    rows(db, `select count(*) n from events where event='product_click' ${w}`),
    rows(db, `select count(*) n from events where event='contact_click' ${w}`),
    rows(db, `select count(*) n from newsletter_leads where true ${wl}`),
    rows(db, `select source, count(*) n from events where event='product_click' ${w} group by source order by n desc limit 8`),
    rows(db, `select source, count(*) n from events where event='contact_click' ${w} group by source order by n desc limit 8`),
  ]) : [e, e, e, e, e, e];
  const tPv = num(pv), tIntent = num(prod) + num(contact), tLeads = num(leads);
  return (
    <Shell email={sess.email} title="Funil" actions={<PeriodSelector current={rg.key} />}>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <Card title="Visitas &rarr; Intenção &rarr; Inscrição">
          <Funnel stages={[{ label: 'Visitas', value: tPv }, { label: 'Intenção (cliques)', value: tIntent }, { label: 'Inscrições', value: tLeads }]} />
        </Card>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Stat label="Visita &rarr; Intenção" value={`${tPv ? Math.min(100, (tIntent / tPv) * 100).toFixed(1) : 0}%`} />
          <Stat label="Intenção &rarr; Inscrição" value={`${tIntent ? Math.min(100, (tLeads / tIntent) * 100).toFixed(1) : 0}%`} />
          <Stat label="Visita &rarr; Inscrição" value={`${tPv ? Math.min(100, (tLeads / tPv) * 100).toFixed(2) : 0}%`} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card title="Cliques em produto"><RankList items={toRank(prodBy, 'source')} empty="sem cliques ainda" /></Card>
        <Card title="Cliques em contato"><RankList items={toRank(contactBy, 'source')} empty="sem cliques ainda" /></Card>
      </div>
    </Shell>
  );
}
