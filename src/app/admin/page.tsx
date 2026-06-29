import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin, getConfig } from '@/lib/admin-data';
import Link from 'next/link';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card, Bars, Progress, PageHeader } from '@/components/admin/ui';
import { Funnel } from '@/components/admin/Funnel';

export const dynamic = 'force-dynamic';

const delta = (cur: number, prev: number): number | null => (prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? 100 : null);

function fillDays(data: Record<string, unknown>[], days: number) {
  const m = new Map(data.map((r) => [String(r.d), Number(r.n)]));
  const out: { label: string; n: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(now.getTime() - i * 86400000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    out.push({ label: dt.slice(5), n: m.get(dt) ?? 0 });
  }
  return out;
}

export default async function Overview() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [pv, pv7, pv1, leads, leads7, series, intent, visitors, linkClicks,
    pv30, pvPrev30, leads30, leadsPrev30, clicks30, clicksPrev30, pvMonth, leadsMonth, clicksMonth] = db ? await Promise.all([
    rows(db, `select count(*) n from events where event='pageview'`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '7 days'`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '1 day'`),
    rows(db, `select count(*) n from newsletter_leads`),
    rows(db, `select count(*) n from newsletter_leads where created_at > now() - interval '7 days'`),
    rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD') d, count(*) n from events where event='pageview' and ts > now() - interval '14 days' group by d`),
    rows(db, `select count(*) n from events where event in ('product_click','contact_click')`),
    rows(db, `select count(distinct sid) n from events where event='pageview' and sid is not null`),
    rows(db, `select count(*) n from link_clicks`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '30 days'`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '60 days' and ts <= now() - interval '30 days'`),
    rows(db, `select count(*) n from newsletter_leads where created_at > now() - interval '30 days'`),
    rows(db, `select count(*) n from newsletter_leads where created_at > now() - interval '60 days' and created_at <= now() - interval '30 days'`),
    rows(db, `select count(*) n from link_clicks where ts > now() - interval '30 days'`),
    rows(db, `select count(*) n from link_clicks where ts > now() - interval '60 days' and ts <= now() - interval '30 days'`),
    rows(db, `select count(*) n from events where event='pageview' and ts >= date_trunc('month', now())`),
    rows(db, `select count(*) n from newsletter_leads where created_at >= date_trunc('month', now())`),
    rows(db, `select count(*) n from link_clicks where ts >= date_trunc('month', now())`),
  ]) : Array(18).fill(e);
  const tPv = num(pv), tLeads = num(leads), tIntent = num(intent);
  const conv = tPv > 0 ? ((tLeads / tPv) * 100).toFixed(2) : '0';
  const goals = {
    subscribers: Number((db && (await getConfig(db, 'goal_subscribers'))) || 0),
    pageviews: Number((db && (await getConfig(db, 'goal_pageviews'))) || 0),
    clicks: Number((db && (await getConfig(db, 'goal_clicks'))) || 0),
  };
  const hasGoals = goals.subscribers > 0 || goals.pageviews > 0 || goals.clicks > 0;
  const agora = new Date();
  const hora = Number(agora.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' }));
  const saud = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const dataFmt = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' });

  return (
    <Shell email={sess.email} title="Visão geral">
      <PageHeader eyebrow="Painel · andreambrosio.com" title={`${saud}, Andre`} sub={`${dataFmt.charAt(0).toUpperCase() + dataFmt.slice(1)} — aqui está o panorama do seu site.`} />
      {!db && <p className="text-[13px] text-bronze mb-6">Banco não configurado.</p>}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Stat href="/admin/visitas" label="Pageviews" value={tPv} sub={`${num(pv1)} hoje`} delta={delta(num(pv30), num(pvPrev30))} />
        <Stat href="/admin/links" label="Cliques em links" value={num(linkClicks)} sub="tracker" delta={delta(num(clicks30), num(clicksPrev30))} />
        <Stat label="Inscritos" value={tLeads} sub={`+${num(leads7)} em 7d`} delta={delta(num(leads30), num(leadsPrev30))} />
        <Stat href="/admin/funil" label="Conversão" value={`${conv}%`} sub="inscritos / pageviews" />
        <Stat label="Visitantes" value={num(visitors)} sub="sessões únicas" />
      </div>
      {hasGoals && (
        <Card title="Metas do mês" right={<Link href="/admin/metas" className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dimmer hover:text-champagne transition-colors">editar</Link>}>
          <div className="grid sm:grid-cols-3 gap-6">
            {goals.subscribers > 0 && <Progress label="Inscritos" current={num(leadsMonth)} target={goals.subscribers} />}
            {goals.pageviews > 0 && <Progress label="Pageviews" current={num(pvMonth)} target={goals.pageviews} />}
            {goals.clicks > 0 && <Progress label="Cliques" current={num(clicksMonth)} target={goals.clicks} />}
          </div>
        </Card>
      )}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card title="Visitas — últimos 14 dias"><Bars data={fillDays(series, 14)} /></Card>
        <Card title="Funil"><Funnel stages={[{ label: 'Visitas', value: tPv }, { label: 'Intenção', value: tIntent }, { label: 'Inscrições', value: tLeads }]} /></Card>
      </div>
    </Shell>
  );
}
