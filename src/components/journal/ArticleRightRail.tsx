import Link from 'next/link';
import { NewsletterCapture } from '@/components/NewsletterCapture';

interface RailItem { href: string; titulo: string; campo: string }

interface Props {
  related: RailItem[];
  relatedLabel: string;
  newsletter: { title: string; lead: string; placeholder: string; submit: string; success: string; error: string };
}

export function ArticleRightRail({ related, relatedLabel, newsletter }: Props) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[110px] space-y-8">
        <div className="rounded-[20px] border border-champagne/20 bg-surface p-6">
          <div className="font-display font-light text-[1.25rem] text-text mb-1.5 leading-tight">{newsletter.title}</div>
          <p className="text-[12.5px] text-text-dim mb-4 leading-relaxed">{newsletter.lead}</p>
          <NewsletterCapture
            variant="hero"
            labels={{ placeholder: newsletter.placeholder, submit: newsletter.submit, success: newsletter.success, error: newsletter.error }}
          />
        </div>

        {related.length > 0 && (
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">{relatedLabel}</div>
            <div className="space-y-3">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="block rounded-[14px] border border-border bg-surface p-4 hover:border-champagne transition-all group">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-champagne mb-1.5">{r.campo}</div>
                  <div className="font-display font-light text-[1.0625rem] text-text leading-snug group-hover:text-champagne transition-colors">{r.titulo}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
