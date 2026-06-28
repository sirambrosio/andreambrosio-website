import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';
import { Broadcast } from '@/components/admin/Broadcast';

export const dynamic = 'force-dynamic';

export default async function Newsletter() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const hist = db ? await rows(db, `select to_char(ts,'YYYY-MM-DD HH24:MI') t, subject, sent, total from campaigns order by ts desc limit 30`) : [];
  return (
    <Shell email={sess.email} title="Campanhas">
      <div className="grid lg:grid-cols-2 gap-6">
        <Broadcast esp={!!process.env.RESEND_API_KEY} />
        <Card title="Histórico de envios">
          <ul className="divide-y divide-border">
            {hist.map((c, i) => (
              <li key={i} className="py-3">
                <div className="flex justify-between gap-4">
                  <span className="text-[13.5px] text-text truncate">{String(c.subject)}</span>
                  <span className="font-mono text-[12px] text-text-dim whitespace-nowrap tabular-nums">{String(c.sent)}/{String(c.total)}</span>
                </div>
                <div className="font-mono text-[10px] text-text-dimmer mt-0.5">{String(c.t)}</div>
              </li>
            ))}
            {hist.length === 0 && <li className="py-3 text-[13px] text-text-dimmer">nenhuma campanha enviada</li>}
          </ul>
        </Card>
      </div>
    </Shell>
  );
}
