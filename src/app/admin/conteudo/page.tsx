import { requireAdmin } from '@/lib/admin-auth';
import { getPool, ensureAdmin, getConfig } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { ContentEditor } from '@/components/admin/ContentEditor';

export const dynamic = 'force-dynamic';

export default async function Conteudo() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const content = db ? ((await getConfig(db, 'now_content')) ?? '') : '';
  return (
    <Shell email={sess.email} title="Conteúdo · Agora">
      <Card title="Página /agora"><ContentEditor initial={content} /></Card>
    </Shell>
  );
}
