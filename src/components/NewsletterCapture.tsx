'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface Props {
  labels: { placeholder: string; submit: string; success: string; error: string };
}

/**
 * Captura de e-mail. O front está completo; para persistir de fato, plugar um
 * endpoint em onSubmit (ex.: POST /api/subscribe). Hoje guarda local + confirma.
 */
export function NewsletterCapture({ labels }: Props) {
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

  if (state === 'ok') {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-champagne">
        <Check size={15} /> {labels.success}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 w-full max-w-[420px]">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === 'err') setState('idle');
        }}
        placeholder={labels.placeholder}
        aria-label={labels.placeholder}
        className={`flex-1 h-11 px-4 rounded-full bg-cream/[0.04] border text-[13px] text-cream placeholder:text-cream/40 outline-none transition-colors ${
          state === 'err' ? 'border-bronze' : 'border-cream/15 focus:border-champagne'
        }`}
      />
      <button
        type="submit"
        className="h-11 px-5 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
      >
        {labels.submit} <ArrowRight size={14} />
      </button>
    </form>
  );
}
