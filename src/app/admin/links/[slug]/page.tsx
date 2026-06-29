import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card, RankList, Bars } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';
const rk = (r: Record<string, unknown>[], k: string) => r.map((x) => ({ label: String(x[k] ?? '—') || '—', n: Number(x.n) }));
function fillDays(data: Record<string, unknown>[], days: number) {
  const m = new Map(data.map((r) => [String(r.d), Number(r.n)]));
  const out: { label: string; n: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) { const dt = new Date(now.getTime() - i * 86400000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); out.push({ label: dt.slice(5), n: m.get(dt) ?? 0 }); }
  return out;
}

export default async function LinkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const sess = await requireAdmin();
  const { slug } = await params;
  const db = getPool();
  if (db) await ensureAdmin(db);
  const link = db ? (await db.query('select id, slug, target, title, clicks from links where slug=$1', [slug])).rows[0] : null;
  if (db && !link) notFound();
  const id = link?.id;
  const e: Record<string, unknown>[] = [];
  const [series, countries, refs, devices, recent] = (db && id) ? await Promise.all([
    rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD') d, count(*) n from link_clicks where link_id=$1 and ts > now() - interval '30 days' group by d`, [id]),
    rows(db, `select country, count(*) n from link_clicks where link_id=$1 and country is not null group by country order by n desc limit 10`, [id]),
    rows(db, `select ref, count(*) n from link_clicks where link_id=$1 and ref is not null group by ref order by n desc limit 10`, [id]),
    rows(db, `select device, count(*) n from link_clicks where link_id=$1 group by device order by n desc`, [id]),
    rows(db, `select to_char(ts at time zone 'America/Sao_Paulo','YYYY-MM-DD HH24:MI') t, country, ref, device from link_clicks where link_id=$1 order by ts desc limit 20`, [id]),
  ]) : [e, e, e, e, e];

  return (
    <Shell email={sess.email} title={`Link /${slug}`} actions={<Link href="/admin/links" className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-dim hover:text-champagne">← Links</Link>}>
      <div className="mb-6 text-[13px] text-text-dim">→ <a href={link?.target} target="_blank" rel="noopener" className="hover:text-champagne break-all">{link?.target}</a></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Cliques" value={Number(link?.clicks ?? 0)} />
        <Stat label="Países" value={countries.length} />
        <Stat label="Referenciadores" value={refs.length} />
        <Stat label="Link curto" value={`/${slug}`} />
      </div>
      <Card title="Cliques — últimos 30 dias"><Bars data={fillDays(series, 30)} /></Card>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card title="Por país"><RankList items={rk(countries, 'country')} empty="sem dados" /></Card>
        <Card title="Referenciadores"><RankList items={rk(refs, 'ref')} empty="acesso direto" /></Card>
        <Card title="Dispositivo"><RankList items={rk(devices, 'device')} empty="sem dados" /></Card>
      </div>
    </Shell>
  );
}
