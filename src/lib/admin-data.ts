import { Pool } from 'pg';

let pool: Pool | null = null;
export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 4, ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false } });
  return pool;
}

let ensured = false;
export async function ensureAdmin(db: Pool) {
  if (ensured) return;
  await db.query(`create table if not exists campaigns (id bigserial primary key, ts timestamptz not null default now(), subject text, sent int, total int)`);
  await db.query(`create table if not exists admin_logins (id bigserial primary key, ts timestamptz not null default now(), ua text)`);
  await db.query(`create table if not exists admin_config (key text primary key, value text, updated_at timestamptz not null default now())`);
  try { await db.query(`alter table events add column if not exists country text`); } catch { /* ok */ }
  await db.query(`create table if not exists links (id bigserial primary key, slug text unique not null, target text not null, title text, clicks int not null default 0, created_at timestamptz not null default now())`);
  await db.query(`create table if not exists link_clicks (id bigserial primary key, link_id bigint not null, ts timestamptz not null default now(), country text, ref text, device text)`);
  await db.query(`create index if not exists link_clicks_lid_idx on link_clicks (link_id)`);
  ensured = true;
}

export async function rows(db: Pool, sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
  try { return (await db.query(sql, params)).rows; } catch { return []; }
}
export const num = (r: Record<string, unknown>[]) => (r[0] ? Number((r[0] as { n: number }).n) : 0);

export async function getConfig(db: Pool, key: string): Promise<string | null> {
  try { const r = await db.query(`select value from admin_config where key=$1`, [key]); return r.rows[0]?.value ?? null; } catch { return null; }
}
export async function setConfig(db: Pool, key: string, value: string) {
  await db.query(`insert into admin_config (key, value, updated_at) values ($1,$2,now()) on conflict (key) do update set value=$2, updated_at=now()`, [key, value]);
}
/** Hash efetivo da senha: override no DB > env. */
export async function effectivePasswordHash(db: Pool | null): Promise<string> {
  if (db) { try { const o = await getConfig(db, 'password_hash'); if (o) return o; } catch { /* */ } }
  return process.env.ADMIN_PASSWORD_HASH || '';
}
