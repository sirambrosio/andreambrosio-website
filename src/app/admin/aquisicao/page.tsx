import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card, RankList, toRank } from '@/components/admin/ui';
export const dynamic = 'force-dynamic';
export default async function Aquisicao() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [refs, srcLeads, utmSource, utmCampaign, devices] = db ? await Promise.all([
    rows(db, `select coalesce(nullif(ref,''),'(direto)') label, count(*) n from events where event='pageview' group by 1 order by n desc limit 12`),
    rows(db, `select coalesce(nullif(source,''),'(sem origem)') label, count(*) n from newsletter_leads group by 1 order by n desc limit 12`),
    rows(db, `select coalesce(nullif(utm_source,''),'(sem utm)') label, count(*) n from events where event='pageview' and utm_source is not null group by 1 order by n desc limit 10`),
    rows(db, `select coalesce(nullif(utm_campaign,''),'(sem campanha)') label, count(*) n from events where event='pageview' and utm_campaign is not null group by 1 order by n desc limit 10`),
    rows(db, `select coalesce(nullif(device,''),'?') label, count(*) n from events where event='pageview' group by 1 order by n desc`),
  ]) : [e, e, e, e, e];
    return (
    <Shell email={sess.email} title="Aquisição">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="De onde vêm as visitas · referenciador"><RankList items={toRank(refs)} empty="sem dados" /></Card>
        <Card title="De onde vêm os inscritos · origem"><RankList items={toRank(srcLeads)} empty="sem inscritos ainda" /></Card>
        <Card title="Campanhas · UTM source"><RankList items={toRank(utmSource)} empty="sem UTM ainda — gere links com UTM" /></Card>
        <Card title="Campanhas · UTM campaign"><RankList items={toRank(utmCampaign)} empty="sem campanha ainda" /></Card>
        <Card title="Dispositivos"><RankList items={toRank(devices)} empty="sem dados" /></Card>
      </div>
    </Shell>
  );
}
