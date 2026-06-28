import { requireAdmin } from '@/lib/admin-auth';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { ChangePassword } from '@/components/admin/ChangePassword';

export const dynamic = 'force-dynamic';

function Status({ label, ok, note }: { label: string; ok: boolean; note: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-[14px] text-text">{label}</div>
        <div className="text-[12px] text-text-dimmer">{note}</div>
      </div>
      <span className={`font-mono text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border ${ok ? 'border-champagne/40 text-champagne' : 'border-bronze/40 text-bronze'}`}>{ok ? 'ativo' : 'inativo'}</span>
    </div>
  );
}

export default async function Config() {
  const sess = await requireAdmin();
  return (
    <Shell email={sess.email} title="Configurações">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Integrações">
          <Status label="Banco de dados" ok={!!process.env.DATABASE_URL} note="Postgres (analytics + assinantes)" />
          <Status label="Envio de e-mail (Resend)" ok={!!process.env.RESEND_API_KEY} note="welcome + broadcast" />
          <Status label="Cloudflare" ok={!!process.env.CLOUDFLARE_API_KEY} note="DNS + cache + país" />
          <Status label="Analytics first-party" ok={!!process.env.DATABASE_URL} note="pageviews + eventos, sem cookie" />
        </Card>
        <Card title="Trocar senha">
          <ChangePassword />
        </Card>
      </div>
    </Shell>
  );
}
