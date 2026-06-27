'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight } from 'lucide-react';
import { NewsletterCapture } from '@/components/NewsletterCapture';

export type PortalItem = {
  slug: string;
  titulo: string;
  subtitulo: string;
  resumo: string;
  campo: string;
  campoNome: string;
  data: string;
  tempo: number;
  destaque: boolean;
  imagem: string;
  href: string;
};
export type PortalTab = { slug: string; nome: string; count: number };
type Labels = {
  ler: string;
  min: string;
  nenhum: string;
  buscar: string;
  todosCurto: string;
  camposTitle: string;
  recentesTitle: string;
};
type NL = { title: string; lead: string; placeholder: string; submit: string; success: string; error: string };

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export function EnsaiosPortal({
  items,
  featuredSlug,
  tabs,
  labels,
  nl,
}: {
  items: PortalItem[];
  featuredSlug: string | null;
  tabs: PortalTab[];
  labels: Labels;
  nl: NL;
}) {
  const [filtro, setFiltro] = useState<string>('todos');
  const [q, setQ] = useState('');

  const allTabs: PortalTab[] = useMemo(
    () => [{ slug: 'todos', nome: labels.todosCurto, count: items.length }, ...tabs],
    [items.length, tabs, labels.todosCurto],
  );

  useEffect(() => {
    const h = window.location.hash.replace('#campo-', '');
    if (h && allTabs.some((t) => t.slug === h)) setFiltro(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = useMemo(
    () => items.find((e) => e.slug === featuredSlug) ?? items[0] ?? null,
    [items, featuredSlug],
  );

  const busca = q.trim();
  const filtered = useMemo(
    () =>
      items.filter((e) => {
        if (filtro !== 'todos' && e.campo !== filtro) return false;
        if (busca) {
          const hay = norm(`${e.titulo} ${e.subtitulo} ${e.resumo} ${e.campoNome}`);
          return busca.split(/\s+/).every((t) => hay.includes(norm(t)));
        }
        return true;
      }),
    [items, filtro, busca],
  );

  const showFeatured = filtro === 'todos' && !busca;
  const grid = showFeatured && featured ? filtered.filter((e) => e.slug !== featured.slug) : filtered;

  return (
    <>
      {/* FEATURED — peça-assinatura, capa dark-native + texto cream (legível nos 2 temas) */}
      {showFeatured && featured && (
        <section className="px-6 md:px-[8rem] pt-16">
          <Link
            href={featured.href}
            className="group relative block overflow-hidden rounded-[24px] border border-border image-card aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]"
          >
            <Image
              src={featured.imagem}
              alt={featured.titulo}
              fill
              priority
              sizes="100vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-oled/85 via-oled/30 to-transparent" />
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-oled/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-14 max-w-[760px]">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-cream bg-oled/55 backdrop-blur px-3 py-1.5 rounded-full border border-cream/15">
                  {featured.campoNome}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/70">
                  {featured.data} · {featured.tempo} {labels.min}
                </span>
              </div>
              <h2 className="font-display font-light text-cream tracking-tight leading-[1.04] text-[clamp(1.875rem,4vw,3.5rem)] group-hover:italic transition-all">
                {featured.titulo}
              </h2>
              {featured.subtitulo && (
                <p className="mt-4 text-[14px] md:text-[15px] text-cream/80 leading-[1.7] max-w-[560px] hidden sm:block">
                  {featured.subtitulo}
                </p>
              )}
              <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-champagne group-hover:gap-3.5 transition-all">
                {labels.ler} <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* TOOLBAR sticky — abas de campo + busca */}
      <div className="sticky top-[86px] z-20 px-6 md:px-[8rem] bg-bg/85 backdrop-blur-md border-y border-border py-4 mt-16 mb-12">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-x-6 gap-y-3 flex-wrap">
          <div className="flex items-center gap-6 md:gap-7 overflow-x-auto scrollbar-hide max-w-full">
            {allTabs.map((t) => {
              const active = filtro === t.slug;
              return (
                <button
                  key={t.slug}
                  onClick={() => setFiltro(t.slug)}
                  aria-pressed={active}
                  className={`relative shrink-0 font-mono text-[11px] tracking-[0.2em] uppercase pb-2 transition-colors ${
                    active ? 'text-text' : 'text-text-dimmer hover:text-text-dim'
                  }`}
                >
                  {t.nome}
                  <span className="ml-1.5 text-[9px] text-text-dimmer">{t.count}</span>
                  <span
                    className={`absolute left-0 -bottom-px h-[1.5px] bg-champagne transition-all duration-300 ${
                      active ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="relative shrink-0 w-full md:w-[260px]">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dimmer pointer-events-none"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={labels.buscar}
              aria-label={labels.buscar}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-border-strong bg-surface text-[13px] text-text placeholder:text-text-dimmer outline-none focus:border-champagne transition-colors"
            />
          </div>
        </div>
      </div>

      {/* CORPO — grid + rail */}
      <div className="px-6 md:px-[8rem]">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start pb-4">
          <div className="min-w-0">
            {grid.length === 0 ? (
              <div className="rounded-[20px] border border-border bg-surface p-12 text-center">
                <p className="text-[14px] text-text-dim">{labels.nenhum}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {grid.map((e) => (
                  <Link
                    key={e.slug}
                    href={e.href}
                    className="group rounded-[20px] overflow-hidden border border-border bg-surface hover:border-champagne transition-all flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={e.imagem}
                        alt={e.titulo}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-oled/45 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.2em] uppercase text-cream bg-oled/55 backdrop-blur px-2.5 py-1 rounded-full">
                        {e.campoNome}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="font-mono text-[10px] tracking-[0.1em] text-text-dimmer mb-3">
                        {e.data} · {e.tempo} {labels.min}
                      </div>
                      <h3 className="font-display font-light text-[1.375rem] leading-[1.2] text-text tracking-tight group-hover:text-champagne transition-colors mb-2">
                        {e.titulo}
                      </h3>
                      <p className="text-[13.5px] text-text-dim leading-relaxed line-clamp-3 flex-1">{e.resumo}</p>
                      <span className="mt-5 font-mono text-[11px] tracking-[0.2em] uppercase text-champagne inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        {labels.ler} →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[170px] space-y-9">
              <div className="rounded-[20px] border border-border-strong bg-surface p-6 shadow-brand">
                <div className="font-display font-light text-[1.25rem] text-text mb-1.5 leading-tight">{nl.title}</div>
                <p className="text-[12px] text-text-dim mb-4 leading-relaxed">{nl.lead}</p>
                <NewsletterCapture
                  variant="hero"
                  layout="stacked"
                  source="ensaios-rail"
                  labels={{ placeholder: nl.placeholder, submit: nl.submit, success: nl.success, error: nl.error }}
                />
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">{labels.camposTitle}</div>
                <ul className="border-t border-border">
                  {allTabs.map((t) => (
                    <li key={t.slug}>
                      <button
                        onClick={() => setFiltro(t.slug)}
                        aria-pressed={filtro === t.slug}
                        className="w-full flex items-baseline justify-between py-3 border-b border-border group text-left"
                      >
                        <span
                          className={`font-display font-light text-[1.0625rem] tracking-tight transition-colors ${
                            filtro === t.slug ? 'text-champagne italic' : 'text-text group-hover:text-champagne'
                          }`}
                        >
                          {t.nome}
                        </span>
                        <span className="font-mono text-[10px] text-text-dimmer tabular-nums">
                          {String(t.count).padStart(2, '0')}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-4">{labels.recentesTitle}</div>
                <div className="space-y-3">
                  {items.slice(0, 3).map((r) => (
                    <Link
                      key={r.slug}
                      href={r.href}
                      className="block rounded-[14px] border border-border-strong bg-surface p-4 hover:border-champagne transition-all group"
                    >
                      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-champagne mb-1.5">{r.campoNome}</div>
                      <div className="font-display font-light text-[1rem] text-text leading-snug group-hover:text-champagne transition-colors line-clamp-2">
                        {r.titulo}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
