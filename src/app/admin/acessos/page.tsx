import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Card } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function Acessos() {
  const sess = await requireAdmin();
  const db = getPool();
  if (db) await ensureAdmin(db);
  const logins = db ? await rows(db, `select to_char(ts,'YYYY-MM-DD HH24:MI') t, ua from admin_logins order by ts desc limit 40`) : [];
  return (
    <Shell email={sess.email} title="Acessos">
      <Card title="Logins do admin (mais recentes)">
        <ul className="divide-y divide-border">
          {logins.map((l, i) => (
            <li key={i} className="py-3 flex justify-between gap-4">
              <span className="font-mono text-[12px] text-text">{String(l.t)}</span>
              <span className="text-[12px] text-text-dim truncate max-w-[60%] text-right">{String(l.ua || '—')}</span>
            </li>
          ))}
          {logins.length === 0 && <li className="py-3 text-[13px] text-text-dimmer">sem registros</li>}
        </ul>
      </Card>
    </Shell>
  );
}
