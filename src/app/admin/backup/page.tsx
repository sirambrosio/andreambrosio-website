import { requireAdmin } from '@/lib/admin-auth';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

const Btn = ({ href, label, sub }: { href: string; label: string; sub: string }) => (
  <a href={href} className="flex items-center justify-between rounded-[12px] border border-border-strong bg-bg p-5 hover:border-champagne transition-colors group">
    <div>
      <div className="text-[14px] text-text group-hover:text-champagne transition-colors">{label}</div>
      <div className="text-[12px] text-text-dimmer mt-0.5">{sub}</div>
    </div>
    <Download size={18} className="text-text-dimmer group-hover:text-champagne transition-colors" />
  </a>
);

export default async function Backup() {
  const sess = await requireAdmin();
  return (
    <Shell email={sess.email} title="Backup">
      <Card title="Exportar dados (tudo no seu servidor)">
        <div className="grid sm:grid-cols-2 gap-4">
          <Btn href="/api/admin/subscribers?format=csv" label="Assinantes (CSV)" sub="e-mail, idioma, origem, data" />
          <Btn href="/api/admin/backup?type=events" label="Eventos (CSV)" sub="todos os eventos de analytics" />
          <Btn href="/api/admin/backup?type=all" label="Backup completo (JSON)" sub="assinantes + eventos + campanhas" />
        </div>
      </Card>
    </Shell>
  );
}
