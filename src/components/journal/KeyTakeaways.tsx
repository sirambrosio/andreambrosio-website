import { Sparkles } from 'lucide-react';
import { inlineMd } from '@/lib/inline-md';

export function KeyTakeaways({ items, label }: { items: string[]; label: string }) {
  if (!items?.length) return null;
  return (
    <aside className="my-12 p-7 md:p-9 rounded-[24px] bg-surface border border-champagne/20 shadow-brand" data-tldr>
      <h2 className="font-display font-light text-[1.5rem] md:text-[1.75rem] tracking-tight text-text mb-6 flex items-center gap-2.5">
        <Sparkles size={20} className="text-champagne" strokeWidth={1.7} />
        {label}
      </h2>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 text-[15.5px] md:text-[16.5px] leading-[1.7] text-text">
            <span className="font-mono text-[12px] text-champagne font-semibold pt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <span dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
