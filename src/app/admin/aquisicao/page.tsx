import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card, RankList } from '@/components/admin/ui';
export const dynamic = 'force-dynamic';
export default async function Aquisicao() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [refs, srcLeads, srcEvents] = db ? await Promise.all([
    rows(db, `select coalesce(nullif(ref,''),'(direto)') label, count(*) n from events where event='pageview' group by 1 order by n desc limit 12`),
    rows(db, `select coalesce(nullif(source,''),'(sem origem)') label, count(*) n from newsletter_leads group by 1 order by n desc limit 12`),
    rows(db, `select coalesce(nullif(source,''),'(sem origem)') label, count(*) n from events where event='pageview' group by 1 order by n desc limit 12`),
  ]) : [e, e, e];
  const map = (r: Record<string, unknown>[]) => r.map((x) => ({ label: String(x.label), n: Number(x.n) }));
  return (
    <Shell email={sess.email} title="Aquisição">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="De onde vêm as visitas · referenciador"><RankList items={map(refs)} empty="sem dados" /></Card>
        <Card title="De onde vêm os inscritos · origem"><RankList items={map(srcLeads)} empty="sem inscritos ainda" /></Card>
        <Card title="Origem das páginas vistas"><RankList items={map(srcEvents)} empty="sem dados" /></Card>
      </div>
    </Shell>
  );
}
