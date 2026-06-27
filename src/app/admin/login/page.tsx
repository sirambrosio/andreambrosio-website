'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(false);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (r.ok) { router.push('/admin'); router.refresh(); }
      else { setErr(true); setLoading(false); }
    } catch { setErr(true); setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-[360px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[40px] h-[1px] bg-champagne" />
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">Admin</span>
        </div>
        <h1 className="font-display font-light text-[2rem] text-text tracking-tight mb-8">Entrar.</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-mail" autoComplete="username" required
          className="w-full h-11 px-4 mb-3 rounded-full border border-border-strong bg-surface text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne transition-colors" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha" autoComplete="current-password" required
          className="w-full h-11 px-4 mb-4 rounded-full border border-border-strong bg-surface text-[14px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne transition-colors" />
        {err && <p className="text-[12px] text-bronze mb-4">E-mail ou senha incorretos.</p>}
        <button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
          {loading ? '…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
