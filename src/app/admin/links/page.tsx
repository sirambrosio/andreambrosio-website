import { requireAdmin } from '@/lib/admin-auth';
import { getPool, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { LinksManager } from '@/components/admin/LinksManager';

export const dynamic = 'force-dynamic';

export default async function Links() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const rows = db ? (await db.query(`select slug, target, title, clicks, to_char(created_at,'YYYY-MM-DD') created from links order by created_at desc`)).rows : [];
  return (
    <Shell email={sess.email} title="Links">
      <LinksManager initial={rows.map((r) => ({ slug: r.slug, target: r.target, title: r.title, clicks: Number(r.clicks), created: r.created }))} />
    </Shell>
  );
}
