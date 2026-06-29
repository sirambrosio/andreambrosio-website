import { requireAdmin } from '@/lib/admin-auth';
import { getPool, ensureAdmin, getConfig } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { GoalsEditor } from '@/components/admin/GoalsEditor';
export const dynamic = 'force-dynamic';
export default async function Metas() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const goals = {
    subscribers: Number((db && await getConfig(db, 'goal_subscribers')) || 0),
    pageviews: Number((db && await getConfig(db, 'goal_pageviews')) || 0),
    clicks: Number((db && await getConfig(db, 'goal_clicks')) || 0),
  };
  return <Shell email={sess.email} title="Metas"><Card title="Definir metas mensais"><GoalsEditor initial={goals} /></Card></Shell>;
}
