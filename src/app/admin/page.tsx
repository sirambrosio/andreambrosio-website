import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin, getConfig } from '@/lib/admin-data';
import Link from 'next/link';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card, Bars, Progress, PageHeader, SectionLabel, RankList, toRank, countryFlag } from '@/components/admin/ui';
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

const delta = (cur: number, prev: number): number | null => (prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? 100 : null);

export default async function Overview() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const e: Record<string, unknown>[] = [];
  const [pv, pv7, pv1, leads, leads7, series, intent, visitors, linkClicks,
    pv30, pvPrev30, leads30, leadsPrev30, clicks30, clicksPrev30, pvMonth, leadsMonth, clicksMonth,
    topPages, topRefs, topCountries, recentSubs, activeNow] = db ? await Promise.all([
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
    rows(db, `select path label, count(*) n from events where event='pageview' and ts > now() - interval '30 days' group by path order by n desc limit 6`),
    rows(db, `select coalesce(nullif(ref,''),'(direto)') label, count(*) n from events where event='pageview' group by 1 order by n desc limit 6`),
    rows(db, `select country cc, count(*) n from events where event='pageview' and country is not null and country <> '' group by 1 order by n desc limit 6`),
    rows(db, `select email, coalesce(source,'—') source, to_char(created_at at time zone 'America/Sao_Paulo','DD/MM') d from newsletter_leads order by created_at desc limit 6`),
    rows(db, `select count(distinct sid) n from events where ts > now() - interval '5 minutes' and sid is not null`),
  ]) : Array(23).fill(e);
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
  const dias = fillDays(series, 14);
  const pico = Math.max(0, ...dias.map((d) => d.n));
  const total14 = dias.reduce((a, d) => a + d.n, 0);
  const ativos = num(activeNow);
  const countryItems = (topCountries as Record<string, unknown>[]).map((r) => ({ label: `${countryFlag(String(r.cc))}  ${String(r.cc).toUpperCase()}`, n: Number(r.n) }));
  type Sub = { email: string; source: string; d: string };

  return (
    <Shell email={sess.email} title="Visão geral">
      <PageHeader
        eyebrow="Painel · andreambrosio.com"
        title={`${saud}, Andre`}
        sub={`${dataFmt.charAt(0).toUpperCase() + dataFmt.slice(1)} — aqui está o panorama do seu site.`}
        right={
          <Link href="/admin/ao-vivo" className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border-strong bg-surface hover:border-champagne transition-colors text-[12.5px] text-text-dim">
            <span className={`w-2 h-2 rounded-full ${ativos > 0 ? 'bg-champagne animate-pulse' : 'bg-text-dimmer'}`} />
            <span className="font-mono tabular-nums text-text">{ativos}</span> ativos agora
          </Link>
        }
      />

      {!db && <p className="text-[13px] text-bronze mb-6">Banco não configurado.</p>}

      <div className="space-y-9">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat href="/admin/visitas" label="Pageviews" value={tPv} sub={`${num(pv1)} hoje`} delta={delta(num(pv30), num(pvPrev30))} />
          <Stat href="/admin/links" label="Cliques em links" value={num(linkClicks)} sub="tracker" delta={delta(num(clicks30), num(clicksPrev30))} />
          <Stat href="/admin/assinantes" label="Inscritos" value={tLeads} sub={`+${num(leads7)} em 7d`} delta={delta(num(leads30), num(leadsPrev30))} />
          <Stat href="/admin/funil" label="Conversão" value={`${conv}%`} sub="inscritos / pageviews" />
          <Stat href="/admin/retencao" label="Visitantes" value={num(visitors)} sub="sessões únicas" />
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

        <section>
          <SectionLabel>Tráfego</SectionLabel>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Visitas — últimos 14 dias" right={<span className="font-mono text-[10px] text-text-dimmer tabular-nums">pico {pico} · total {total14}</span>}>
                <Bars data={dias} />
              </Card>
            </div>
            <Card title="Funil">
              <Funnel stages={[{ label: 'Visitas', value: tPv }, { label: 'Visitantes', value: num(visitors) }, { label: 'Intenção', value: tIntent }, { label: 'Inscrições', value: tLeads }]} />
            </Card>
          </div>
        </section>

        <section>
          <SectionLabel>Conteúdo &amp; aquisição</SectionLabel>
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Páginas mais vistas · 30d"><RankList items={toRank(topPages)} empty="sem dados" /></Card>
            <Card title="De onde vêm" right={<Link href="/admin/aquisicao" className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dimmer hover:text-champagne transition-colors">mais</Link>}><RankList items={toRank(topRefs)} empty="sem dados" /></Card>
            <Card title="Países" right={<Link href="/admin/geografia" className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dimmer hover:text-champagne transition-colors">mapa</Link>}><RankList items={countryItems} empty="sem dados" /></Card>
          </div>
        </section>

        <section>
          <SectionLabel>Pessoas</SectionLabel>
          <Card title="Últimas inscrições" right={<Link href="/admin/assinantes" className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dimmer hover:text-champagne transition-colors">ver todas</Link>}>
            {(recentSubs as Sub[]).length === 0 ? (
              <p className="text-[13px] text-text-dimmer py-2">nenhuma inscrição ainda</p>
            ) : (
              <ul className="divide-y divide-border">
                {(recentSubs as Sub[]).map((r, i) => (
                  <li key={i} className="flex items-center gap-4 py-2.5">
                    <span className="text-[13.5px] text-text flex-1 truncate">{r.email}</span>
                    <span className="text-[12px] text-text-dim hidden sm:inline">{r.source}</span>
                    <span className="font-mono text-[11px] text-text-dimmer tabular-nums shrink-0">{r.d}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </Shell>
  );
}
