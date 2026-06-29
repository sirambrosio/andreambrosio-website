import { requireAdmin } from '@/lib/admin-auth';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { Annotations } from '@/components/admin/Annotations';
export const dynamic = 'force-dynamic';
export default async function AnotacoesPage() {
  const sess = await requireAdmin();
  return <Shell email={sess.email} title="Anotações"><Card title="Marcos da timeline"><Annotations /></Card></Shell>;
}
