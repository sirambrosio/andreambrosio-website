import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin } from '@/lib/admin-data';
import Link from 'next/link';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card, Bars } from '@/components/admin/ui';
import { Funnel } from '@/components/admin/Funnel';

export const dynamic = 'force-dynamic';

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
  const [pv, pv7, pv1, leads, leads7, series, intent, visitors, linkClicks] = db ? await Promise.all([
    rows(db, `select count(*) n from events where event='pageview'`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '7 days'`),
    rows(db, `select count(*) n from events where event='pageview' and ts > now() - interval '1 day'`),
    rows(db, `select count(*) n from newsletter_leads`),
    rows(db, `select count(*) n from newsletter_leads where created_at > now() - interval '7 days'`),
    rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD') d, count(*) n from events where event='pageview' and ts > now() - interval '14 days' group by d`),
    rows(db, `select count(*) n from events where event in ('product_click','contact_click')`),
    rows(db, `select count(distinct sid) n from events where event='pageview' and sid is not null`),
    rows(db, `select count(*) n from link_clicks`),
  ]) : [e, e, e, e, e, e, e, e, e];
  const tPv = num(pv), tLeads = num(leads), tIntent = num(intent);
  const conv = tPv > 0 ? ((tLeads / tPv) * 100).toFixed(2) : '0';

  return (
    <Shell email={sess.email} title="Visão geral">
      {!db && <p className="text-[13px] text-bronze mb-6">Banco não configurado.</p>}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Link href="/admin/visitas"><Stat label="Pageviews" value={tPv} sub={`${num(pv1)} hoje · ${num(pv7)} em 7d`} /></Link>
        <Link href="/admin/links"><Stat label="Cliques em links" value={num(linkClicks)} sub="tracker" /></Link>
        <Stat label="Inscritos" value={tLeads} sub={`+${num(leads7)} em 7d`} />
        <Link href="/admin/funil"><Stat label="Conversão" value={`${conv}%`} sub="inscritos / pageviews" /></Link>
        <Stat label="Visitantes" value={num(visitors)} sub="sessões únicas" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Visitas — últimos 14 dias"><Bars data={fillDays(series, 14)} /></Card>
        <Card title="Funil"><Funnel stages={[{ label: 'Visitas', value: tPv }, { label: 'Intenção', value: tIntent }, { label: 'Inscrições', value: tLeads }]} /></Card>
      </div>
    </Shell>
  );
}
