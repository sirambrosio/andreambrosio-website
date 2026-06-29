import { requireAdmin } from '@/lib/admin-auth';
import { Shell } from '@/components/admin/Shell';
import { LiveView } from '@/components/admin/LiveView';
export const dynamic = 'force-dynamic';
export default async function AoVivo() {
  const sess = await requireAdmin();
  return <Shell email={sess.email} title="Ao Vivo"><LiveView /></Shell>;
}
