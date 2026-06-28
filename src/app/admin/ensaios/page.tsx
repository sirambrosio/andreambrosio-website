import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card, RankList } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function EnsaiosAdmin() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const r = db ? await rows(db, `select path, count(*) n from events where event='pageview' and path like '%/ensaios/%' group by path order by n desc limit 100`) : [];
  // agrega por slug (ignora o locale do path)
  const bySlug = new Map<string, number>();
  for (const x of r) {
    const slug = String(x.path).split('/ensaios/')[1] || String(x.path);
    bySlug.set(slug, (bySlug.get(slug) ?? 0) + Number(x.n));
  }
  const items = [...bySlug.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
  return (
    <Shell email={sess.email} title="Ensaios">
      <Card title="Leituras por ensaio (todos os idiomas)"><RankList items={items} empty="sem leituras ainda" /></Card>
    </Shell>
  );
}
