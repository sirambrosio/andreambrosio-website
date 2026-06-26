'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { track } from '@/lib/analytics';

interface Props {
  labels: { placeholder: string; submit: string; success: string; error: string };
  /** footer = sobre fundo escuro (cream) · hero = theme-aware (surface/text) */
  variant?: 'footer' | 'hero';
  /** row = input + botão lado a lado · stacked = empilhado (para colunas estreitas) */
  layout?: 'row' | 'stacked';
  /** de onde veio a inscrição (home, ensaio, footer, rail...) */
  source?: string;
}

/**
 * Captura de e-mail → POST /api/subscribe (grava em Postgres via DATABASE_URL).
 * honeypot anti-bot + estado de loading + erro real (não finge sucesso).
 */
export function NewsletterCapture({ labels, variant = 'footer', layout = 'row', source = 'site' }: Props) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) {
      setState('err');
      return;
    }
    setState('loading');
    try {
      const locale = typeof document !== 'undefined' ? document.documentElement.lang : '';
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale, source, company: hp }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setState('ok');
        setEmail('');
        track('newsletter_subscribe', { source });
      } else {
        setState('err');
      }
    } catch {
      setState('err');
    }
  }

  const isHero = variant === 'hero';

  if (state === 'ok') {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-champagne">
        <Check size={15} /> {labels.success}
      </div>
    );
  }

  const inputBase = isHero
    ? 'bg-surface text-text placeholder:text-text-dimmer'
    : 'bg-cream/[0.04] text-cream placeholder:text-cream/40';
  const inputBorder =
    state === 'err'
      ? 'border-bronze'
      : isHero
        ? 'border-border-strong focus:border-champagne'
        : 'border-cream/15 focus:border-champagne';

  const stacked = layout === 'stacked';
  const loading = state === 'loading';

  return (
    <form onSubmit={submit} className={stacked ? 'flex flex-col items-stretch gap-2 w-full' : 'flex items-center gap-2 w-full max-w-[440px]'}>
      {/* honeypot — escondido de humanos */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="absolute w-px h-px -m-px overflow-hidden opacity-0 pointer-events-none"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === 'err') setState('idle');
        }}
        placeholder={labels.placeholder}
        aria-label={labels.placeholder}
        disabled={loading}
        className={`${stacked ? 'w-full' : 'flex-1'} h-11 px-4 rounded-full border text-[13px] outline-none transition-colors disabled:opacity-60 ${inputBase} ${inputBorder}`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`h-11 px-5 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 ${stacked ? 'w-full' : 'shrink-0'}`}
      >
        {loading ? '…' : labels.submit} {!loading && <ArrowRight size={14} />}
      </button>
    </form>
  );
}
