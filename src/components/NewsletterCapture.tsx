'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface Props {
  labels: { placeholder: string; submit: string; success: string; error: string };
  /** footer = sobre fundo escuro (cream) · hero = theme-aware (surface/text) */
  variant?: 'footer' | 'hero';
  /** row = input + botão lado a lado · stacked = empilhado (para colunas estreitas) */
  layout?: 'row' | 'stacked';
}

/**
 * Captura de e-mail. O front está completo; para persistir de fato, plugar um
 * endpoint em onSubmit (ex.: POST /api/subscribe). Hoje guarda local + confirma.
 */
export function NewsletterCapture({ labels, variant = 'footer', layout = 'row' }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'err'>('idle');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /.+@.+\..+/.test(email);
    if (!valid) {
      setState('err');
      return;
    }
    try {
      const key = 'aa-newsletter';
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem(key, JSON.stringify(list));
      setState('ok');
      setEmail('');
    } catch {
      setState('err');
    }
  }

  const isHero = variant === 'hero';

  if (state === 'ok') {
    return (
      <div className={`inline-flex items-center gap-2 text-[13px] ${isHero ? 'text-champagne' : 'text-champagne'}`}>
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

  return (
    <form onSubmit={submit} className={stacked ? 'flex flex-col items-stretch gap-2 w-full' : 'flex items-center gap-2 w-full max-w-[440px]'}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === 'err') setState('idle');
        }}
        placeholder={labels.placeholder}
        aria-label={labels.placeholder}
        className={`${stacked ? 'w-full' : 'flex-1'} h-11 px-4 rounded-full border text-[13px] outline-none transition-colors ${inputBase} ${inputBorder}`}
      />
      <button
        type="submit"
        className={`h-11 px-5 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${stacked ? 'w-full' : 'shrink-0'}`}
      >
        {labels.submit} <ArrowRight size={14} />
      </button>
    </form>
  );
}
