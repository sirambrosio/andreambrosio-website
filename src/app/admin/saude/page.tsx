import { requireAdmin } from '@/lib/admin-auth';
import { getPool, rows, num, ensureAdmin } from '@/lib/admin-data';
import { Shell } from '@/components/admin/Shell';
import { Stat, Card } from '@/components/admin/ui';
import { MaintenanceButton } from '@/components/admin/MaintenanceButton';
export const dynamic = 'force-dynamic';
export default async function Saude() {
  const sess = await requireAdmin();
  const db = getPool();
  let ping = false;
  const counts: { t: string; n: number }[] = [];
  let lastEvent = '—', lastLogin = '—';
  if (db) {
    await ensureAdmin(db);
    try { await db.query('select 1'); ping = true; } catch { ping = false; }
    if (ping) {
      for (const t of ['events', 'newsletter_leads', 'links', 'link_clicks', 'annotations', 'campaigns', 'admin_logins']) {
        try { counts.push({ t, n: num(await rows(db, `select count(*) n from ${t}`)) }); } catch { counts.push({ t, n: -1 }); }
      }
      try { const r = await rows(db, `select to_char(max(ts) at time zone 'America/Sao_Paulo','YYYY-MM-DD HH24:MI') x from events`); lastEvent = String(r[0]?.x || '—'); } catch { /* */ }
      try { const r = await rows(db, `select to_char(max(ts) at time zone 'America/Sao_Paulo','YYYY-MM-DD HH24:MI') x from admin_logins`); lastLogin = String(r[0]?.x || '—'); } catch { /* */ }
    }
  }
  const ENV: [string, string][] = [
    ['Banco de dados', 'DATABASE_URL'], ['Sessão (cookie)', 'SESSION_SECRET'], ['Senha admin', 'ADMIN_PASSWORD_HASH'],
    ['Envio de e-mail (Resend)', 'RESEND_API_KEY'], ['Stats key', 'STATS_KEY'], ['Cloudflare', 'CLOUDFLARE_API_TOKEN'], ['Pexels (imagens)', 'PEXELS_API_KEY'],
  ];
  const env = ENV.map(([label, k]) => ({ label, on: !!process.env[k] }));
  return (
    <Shell email={sess.email} title="Saúde do sistema">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Stat label="Banco de dados" value={ping ? 'Online' : (db ? 'Falha' : 'Sem DB')} sub={ping ? 'respondendo' : 'verificar'} />
        <Stat label="Último evento" value={lastEvent} />
        <Stat label="Último login" value={lastLogin} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Tabelas · linhas">
          <ul className="space-y-2">
            {counts.length === 0 ? <li className="text-[13px] text-text-dimmer">sem dados</li> : counts.map((c) => (
              <li key={c.t} className="flex justify-between text-[13px]"><span className="text-text-dim font-mono">{c.t}</span><span className="font-mono text-text tabular-nums">{c.n < 0 ? '—' : c.n}</span></li>
            ))}
          </ul>
        </Card>
        <Card title="Integrações configuradas">
          <ul className="space-y-2.5">
            {env.map((x) => (
              <li key={x.label} className="flex items-center justify-between text-[13px]">
                <span className="text-text-dim">{x.label}</span>
                <span className={`font-mono text-[11px] ${x.on ? 'text-champagne' : 'text-bronze'}`}>{x.on ? '● ativo' : '○ ausente'}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-text-dimmer">Mostra só se a variável existe — nunca o valor.</p>
        </Card>
      </div>
      <div className="mt-6">
        <Card title="Manutenção">
          <p className="text-[13px] text-text-dim mb-4">Remove eventos com marcadores de teste (paths começando com /verify). Seguro: não toca em dados reais.</p>
          <MaintenanceButton />
        </Card>
      </div>
    </Shell>
  );
}
