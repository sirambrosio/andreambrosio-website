#!/usr/bin/env node
// Broadcast da newsletter via Resend. Uso:
//   DATABASE_URL=... RESEND_API_KEY=... node scripts/broadcast.mjs "Assunto" caminho/email.html [--dry]
import { readFileSync } from 'node:fs';
import pg from 'pg';

const [subject, htmlPath, ...flags] = process.argv.slice(2);
const dry = flags.includes('--dry');
if (!subject || !htmlPath) { console.error('uso: node scripts/broadcast.mjs "Assunto" arquivo.html [--dry]'); process.exit(1); }
const DATABASE_URL = process.env.DATABASE_URL, KEY = process.env.RESEND_API_KEY;
const FROM = process.env.NEWSLETTER_FROM || 'Andre Ambrósio <eu@andreambrosio.com>';
if (!DATABASE_URL) { console.error('falta DATABASE_URL'); process.exit(1); }
if (!KEY && !dry) { console.error('falta RESEND_API_KEY (ou use --dry)'); process.exit(1); }

const html = readFileSync(htmlPath, 'utf8');
const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false } });
const { rows } = await pool.query('select email from newsletter_leads order by created_at asc');
console.log(`${rows.length} inscritos · assunto: "${subject}"${dry ? ' · DRY RUN' : ''}`);

let sent = 0;
for (const { email } of rows) {
  if (dry) { console.log('  →', email); continue; }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: email, subject, html }),
    });
    if (res.ok) sent++; else console.error('  falhou', email, res.status);
    await new Promise((r) => setTimeout(r, 600)); // rate-limit gentil
  } catch (e) { console.error('  erro', email, e.message); }
}
console.log(`enviados: ${sent}/${rows.length}`);
await pool.end();
