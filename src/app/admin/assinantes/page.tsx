import { Pool } from 'pg';
import { requireAdmin } from '@/lib/admin-auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { Broadcast } from '@/components/admin/Broadcast';

export const dynamic = 'force-dynamic';

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false } });
  return pool;
}

export default async function Assinantes() {
  const sess = await requireAdmin();
  const db = getPool();
  const rows = db ? (await db.query('select email, locale, source, created_at from newsletter_leads order by created_at desc')).rows : [];

  return (
    <div>
      <AdminNav email={sess.email} />
      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-12">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-2">Assinantes</div>
            <div className="font-display font-light text-[2.25rem] text-text leading-none">{rows.length}</div>
          </div>
          <a href="/api/admin/subscribers?format=csv" className="h-10 inline-flex items-center px-5 rounded-full border border-border-strong text-[12px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-champagne hover:border-champagne transition-colors">
            Exportar CSV
          </a>
        </div>

        <div className="rounded-[16px] border border-border overflow-hidden mb-12">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface text-left font-mono text-[10px] tracking-[0.15em] uppercase text-text-dimmer">
                <th className="px-5 py-3 font-medium">E-mail</th>
                <th className="px-5 py-3 font-medium">Idioma</th>
                <th className="px-5 py-3 font-medium">Origem</th>
                <th className="px-5 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-t border-border">
                  <td className="px-5 py-3 text-text">{r.email}</td>
                  <td className="px-5 py-3 text-text-dim">{r.locale || '—'}</td>
                  <td className="px-5 py-3 text-text-dim">{r.source || '—'}</td>
                  <td className="px-5 py-3 text-text-dimmer font-mono">{new Date(r.created_at).toISOString().slice(0, 10)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-text-dimmer">nenhum assinante ainda</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Broadcast esp={!!process.env.RESEND_API_KEY} />
      </main>
    </div>
  );
}
