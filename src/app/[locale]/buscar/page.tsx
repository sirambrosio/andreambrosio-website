import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getSearchIndex, type SearchGroup } from '@/lib/search';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref } from '@/lib/route-translations';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const d = getDict(raw as Locale);
  return { title: d.header.search, robots: { index: false, follow: true } };
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default async function Buscar({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const locale: Locale = asLocale((await params).locale);
  const q = ((await searchParams).q || '').toString();
  const d = getDict(locale);
  const docs = getSearchIndex(locale);
  const groupLabel: Record<SearchGroup, string> = {
    pages: d.spotlight.pages, fields: d.spotlight.fields, essays: d.spotlight.essays, companies: d.spotlight.companies,
  };

  const nq = norm(q.trim());
  const results = nq ? docs.filter((x) => norm(`${x.title} ${x.subtitle ?? ''} ${x.keywords}`).includes(nq)) : [];

  return (
    <div className="bg-bg text-text min-h-[calc(100vh-86px)]">
      <section className="px-6 md:px-[8rem] pt-24 pb-16 border-b border-border">
        <div className="max-w-[820px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{d.header.search}</span>
          </div>
          <form action={localeHref('/buscar', locale)} method="get" className="flex items-center gap-3 max-w-[560px]">
            <div className="flex-1 flex items-center gap-3 h-12 px-4 rounded-full border border-border-strong bg-surface">
              <Search size={16} className="text-champagne shrink-0" />
              <input name="q" defaultValue={q} placeholder={d.spotlight.placeholder} className="flex-1 bg-transparent outline-none text-[14px] text-text placeholder:text-text-dimmer" autoFocus />
            </div>
            <button type="submit" className="h-12 px-6 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold">{d.header.search}</button>
          </form>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-16">
        <div className="max-w-[820px]">
          {!nq ? null : results.length === 0 ? (
            <p className="text-[14px] text-text-dim">{d.spotlight.noResults} “{q}”</p>
          ) : (
            <div className="border-y border-border">
              {results.map((r) => (
                <Link key={r.id} href={r.href} className="group grid grid-cols-[auto_1fr] gap-5 items-baseline py-5 border-b border-border last:border-b-0 hover:pl-3 transition-all">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-bronze pt-1">{groupLabel[r.group]}</span>
                  <div>
                    <h2 className="font-display font-light text-[clamp(1.125rem,1.8vw,1.5rem)] text-text tracking-tight group-hover:italic transition-all">{r.title}</h2>
                    {r.subtitle && <p className="text-[13px] text-text-dim mt-1">{r.subtitle}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
