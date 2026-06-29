import { requireAdmin } from '@/lib/admin-auth';
import { getPool, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { SubscribersTable } from '@/components/admin/SubscribersTable';

export const dynamic = 'force-dynamic';

export default async function Assinantes() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const raw = db ? (await db.query('select email, locale, source, created_at from newsletter_leads order by created_at desc limit 5000')).rows : [];
  const initial = raw.map((r) => ({ email: r.email, locale: r.locale, source: r.source, created_at: new Date(r.created_at).toISOString() }));
  return (
    <Shell email={sess.email} title={`Assinantes (${initial.length})`}>
      <SubscribersTable initial={initial} />
    </Shell>
  );
}
