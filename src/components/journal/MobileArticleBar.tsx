'use client';

import { useState } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { ArticleTOC } from './ArticleTOC';
import { SaveButton } from './SaveButton';
import { FontSizeControls } from './FontSizeControls';
import { ShareButtons } from './ShareButtons';

interface Props {
  slug: string;
  toc: { id: string; text: string }[];
  shareUrl: string;
  title: string;
  labels: { save: string; font: string; toc: string; share: string };
}

/** Barra de funcionalidades do artigo no mobile/tablet (< lg), onde a sidebar some. */
export function MobileArticleBar({ slug, toc, shareUrl, title, labels }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-10 -mx-1">
      <div className="flex items-center justify-between gap-3 flex-wrap py-3 border-y border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <SaveButton slug={slug} label={labels.save} />
          <FontSizeControls label={labels.font} />
        </div>
        {toc.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-border-strong text-[11px] font-mono uppercase tracking-[0.15em] text-text-dim hover:text-champagne hover:border-champagne transition-colors"
          >
            <List size={13} /> {labels.toc}
            <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {open && toc.length > 0 && (
        <div className="py-5 border-b border-border">
          <ArticleTOC items={toc} label={labels.toc} />
        </div>
      )}

      <ShareButtons url={shareUrl} title={title} label={labels.share} />
    </div>
  );
}
