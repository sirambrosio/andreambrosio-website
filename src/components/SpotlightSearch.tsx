'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import type { SearchDoc, SearchGroup } from '@/lib/search';

export interface SpotlightLabels {
  placeholder: string;
  pages: string;
  fields: string;
  essays: string;
  companies: string;
  noResults: string;
  hintNavigate: string;
  hintOpen: string;
  hintClose: string;
}

interface Props {
  docs: SearchDoc[];
  labels: SpotlightLabels;
  variant?: 'button' | 'bar';
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const GROUP_ORDER: SearchGroup[] = ['pages', 'fields', 'essays', 'companies'];

export function SpotlightSearch({ docs, labels, variant = 'button' }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const groupLabel: Record<SearchGroup, string> = {
    pages: labels.pages,
    fields: labels.fields,
    essays: labels.essays,
    companies: labels.companies,
  };

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return docs;
    return docs.filter((d) => norm(`${d.title} ${d.subtitle ?? ''} ${d.keywords}`).includes(q));
  }, [query, docs]);

  // flat list (na ordem dos grupos) pra navegação por teclado
  const flat = useMemo(() => {
    const out: SearchDoc[] = [];
    for (const g of GROUP_ORDER) out.push(...filtered.filter((d) => d.group === g));
    return out;
  }, [filtered]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const go = useCallback(
    (doc?: SearchDoc) => {
      const target = doc ?? flat[active];
      if (!target) return;
      close();
      router.push(target.href);
    },
    [flat, active, close, router],
  );

  // ⌘K / Ctrl+K global
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // focus + scroll-lock quando abre
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go();
    }
  };

  // mantém o item ativo visível
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  return (
    <>
      {variant === 'button' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={labels.placeholder}
          className="inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-full border border-border-strong text-text-dim hover:text-champagne hover:border-champagne transition-colors"
        >
          <Search size={14} strokeWidth={1.8} />
          <span className="hidden lg:inline text-[12px]">{labels.placeholder.replace(/[.·…]+$/, '')}</span>
          <kbd className="hidden lg:inline-flex items-center font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-surface-alt border border-border text-text-dimmer">⌘K</kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={labels.placeholder}
          className="w-full inline-flex items-center gap-3 h-11 px-4 rounded-full border border-cream/15 bg-cream/[0.03] text-cream/50 hover:border-champagne/50 transition-colors text-left"
        >
          <Search size={15} strokeWidth={1.8} className="text-champagne" />
          <span className="flex-1 text-[13px] truncate">{labels.placeholder}</span>
          <kbd className="font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-cream/10 text-cream/60">⌘K</kbd>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center px-4 pt-[12vh] animate-spotlight-fadein" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-oled/70 backdrop-blur-sm" onClick={close} aria-hidden />

          <div className="relative w-full max-w-[640px] rounded-[20px] bg-surface border border-border-strong shadow-brand-lg overflow-hidden animate-spotlight-scalein">
            {/* input */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
              <Search size={18} className="text-champagne shrink-0" strokeWidth={1.8} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={labels.placeholder}
                className="flex-1 bg-transparent outline-none text-[15px] text-text placeholder:text-text-dimmer"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" onClick={close} className="font-mono text-[10px] tracking-wider px-2 py-1 rounded border border-border text-text-dimmer hover:text-champagne transition-colors">
                ESC
              </button>
            </div>

            {/* resultados */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
              {flat.length === 0 ? (
                <div className="px-5 py-10 text-center text-[13.5px] text-text-dim">
                  {labels.noResults} <span className="text-text">“{query}”</span>
                </div>
              ) : (
                GROUP_ORDER.map((g) => {
                  const items = filtered.filter((d) => d.group === g);
                  if (items.length === 0) return null;
                  return (
                    <div key={g} className="mb-1">
                      <div className="px-5 pt-3 pb-1.5 font-mono text-[9px] tracking-[0.25em] uppercase text-bronze">{groupLabel[g]}</div>
                      {items.map((d) => {
                        const idx = flat.indexOf(d);
                        const isActive = idx === active;
                        return (
                          <button
                            key={d.id}
                            data-idx={idx}
                            type="button"
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => go(d)}
                            className={`w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors ${isActive ? 'bg-champagne/10' : 'hover:bg-surface-alt'}`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-champagne' : 'bg-border-strong'}`} />
                            <span className="flex-1 min-w-0">
                              <span className="block text-[14px] text-text truncate">{d.title}</span>
                              {d.subtitle && <span className="block text-[12px] text-text-dim truncate">{d.subtitle}</span>}
                            </span>
                            {isActive && <CornerDownLeft size={14} className="text-champagne shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* hints */}
            <div className="flex items-center gap-4 px-5 h-11 border-t border-border text-[10px] text-text-dimmer font-mono">
              <span className="inline-flex items-center gap-1"><ArrowUp size={11} /><ArrowDown size={11} /> {labels.hintNavigate}</span>
              <span className="inline-flex items-center gap-1"><CornerDownLeft size={11} /> {labels.hintOpen}</span>
              <span className="inline-flex items-center gap-1">esc {labels.hintClose}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
