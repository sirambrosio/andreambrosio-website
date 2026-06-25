'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { inlineMd } from '@/lib/inline-md';

interface FAQItem { q: string; a: string }

export function ArticleFAQ({ faqs, label }: { faqs: FAQItem[]; label: string }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!faqs?.length) return null;

  return (
    <section className="my-16">
      <h2 className="font-display font-light text-[clamp(1.75rem,2.8vw,2.5rem)] tracking-tight text-text mb-8 flex items-center gap-2.5">
        <HelpCircle size={22} className="text-champagne" strokeWidth={1.7} />
        {label}
      </h2>
      <div className="divide-y divide-border border-y border-border">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-start justify-between gap-4 py-5 text-left group"
              >
                <span className="font-display font-normal text-[1.125rem] md:text-[1.25rem] text-text leading-snug group-hover:text-champagne transition-colors">{item.q}</span>
                <span className="shrink-0 mt-1 text-champagne">{isOpen ? <Minus size={18} /> : <Plus size={18} />}</span>
              </button>
              {isOpen && (
                <div className="pb-6 pr-8 text-[15px] leading-[1.8] text-text-dim" dangerouslySetInnerHTML={{ __html: inlineMd(item.a) }} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
