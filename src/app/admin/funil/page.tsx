import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card, Stat, RankList } from '@/components/admin/ui';
import { Funnel } from '@/components/admin/Funnel';

export const dynamic = 'force-dynamic';
const rk = (r: Record<string, unknown>[], k: string) => r.map((x) => ({ label: String(x[k] ?? '—'), n: Number(x.n) }));

export default async function FunilPage() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [pv, prod, contact, leads, prodBy, contactBy] = db ? await Promise.all([
    rows(db, `select count(*) n from events where event='pageview'`),
    rows(db, `select count(*) n from events where event='product_click'`),
    rows(db, `select count(*) n from events where event='contact_click'`),
    rows(db, `select count(*) n from newsletter_leads`),
    rows(db, `select source, count(*) n from events where event='product_click' group by source order by n desc limit 8`),
    rows(db, `select source, count(*) n from events where event='contact_click' group by source order by n desc limit 8`),
  ]) : [e, e, e, e, e, e];
  const tPv = num(pv), tIntent = num(prod) + num(contact), tLeads = num(leads);
  return (
    <Shell email={sess.email} title="Funil">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <Card title="Visitas &rarr; Intenção &rarr; Inscrição">
          <Funnel stages={[{ label: 'Visitas', value: tPv }, { label: 'Intenção (cliques)', value: tIntent }, { label: 'Inscrições', value: tLeads }]} />
        </Card>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Stat label="Visita &rarr; Intenção" value={`${tPv ? ((tIntent / tPv) * 100).toFixed(1) : 0}%`} />
          <Stat label="Intenção &rarr; Inscrição" value={`${tIntent ? ((tLeads / tIntent) * 100).toFixed(1) : 0}%`} />
          <Stat label="Visita &rarr; Inscrição" value={`${tPv ? ((tLeads / tPv) * 100).toFixed(2) : 0}%`} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card title="Cliques em produto"><RankList items={rk(prodBy, 'source')} empty="sem cliques ainda" /></Card>
        <Card title="Cliques em contato"><RankList items={rk(contactBy, 'source')} empty="sem cliques ainda" /></Card>
      </div>
    </Shell>
  );
}
