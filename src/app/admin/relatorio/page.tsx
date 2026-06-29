import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card, RankList, toRank } from '@/components/admin/ui';
import { PrintButton } from '@/components/admin/PrintButton';
export const dynamic = 'force-dynamic';
export default async function Relatorio() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const M = `ts >= date_trunc('month', now())`;
  const [pv, vis, leads, clicks, pages, countries, refs] = db ? await Promise.all([
    rows(db, `select count(*) n from events where event='pageview' and ${M}`),
    rows(db, `select count(distinct sid) n from events where sid is not null and ${M}`),
    rows(db, `select count(*) n from newsletter_leads where created_at >= date_trunc('month', now())`),
    rows(db, `select count(*) n from link_clicks where ${M}`),
    rows(db, `select path label, count(*) n from events where event='pageview' and ${M} group by 1 order by n desc limit 6`),
    rows(db, `select coalesce(nullif(country,''),'??') label, count(*) n from events where event='pageview' and ${M} group by 1 order by n desc limit 6`),
    rows(db, `select coalesce(nullif(ref,''),'(direto)') label, count(*) n from events where event='pageview' and ${M} group by 1 order by n desc limit 6`),
  ]) : [e, e, e, e, e, e, e];
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
  return (
    <Shell email={sess.email} title="Relatório mensal" actions={<PrintButton />}>
      <div className="mb-6">
        <p className="font-display font-light text-[1.75rem] text-text capitalize">{mes}</p>
        <p className="text-[13px] text-text-dim">andreambrosio.com · relatório de desempenho</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Pageviews" value={num(pv)} />
        <Stat label="Visitantes" value={num(vis)} />
        <Stat label="Novos inscritos" value={num(leads)} />
        <Stat label="Cliques em links" value={num(clicks)} />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Páginas mais vistas"><RankList items={toRank(pages)} /></Card>
        <Card title="Países"><RankList items={toRank(countries)} /></Card>
        <Card title="Origem do tráfego"><RankList items={toRank(refs)} /></Card>
      </div>
    </Shell>
  );
}
