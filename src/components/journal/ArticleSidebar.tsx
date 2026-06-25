'use client';

import Image from 'next/image';
import { ArticleTOC } from './ArticleTOC';
import { ShareButtons } from './ShareButtons';
import { SaveButton } from './SaveButton';
import { FontSizeControls } from './FontSizeControls';

interface Props {
  slug: string;
  date: string;
  readingTime: number;
  toc: { id: string; text: string }[];
  shareUrl: string;
  title: string;
  labels: { by: string; min: string; save: string; font: string; toc: string; share: string };
}

export function ArticleSidebar({ slug, date, readingTime, toc, shareUrl, title, labels }: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[110px] space-y-7">
        {/* autor mini */}
        <div className="flex items-center gap-3 pb-6 border-b border-border">
          <Image src="/assets/andre-portrait.jpg" alt="Andre Ambrósio" width={44} height={44} className="rounded-full w-[44px] h-[44px] object-cover object-[30%_center] border border-champagne/30" />
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">{labels.by}</div>
            <div className="text-[13px] text-text leading-tight">Andre Ambrósio</div>
            <div className="text-[11px] text-text-dimmer mt-0.5">{date} · {readingTime} {labels.min}</div>
          </div>
        </div>

        {/* ações */}
        <div className="space-y-4">
          <SaveButton slug={slug} label={labels.save} />
          <FontSizeControls label={labels.font} />
        </div>

        {/* índice */}
        {toc.length > 0 && (
          <div className="pt-2">
            <ArticleTOC items={toc} label={labels.toc} />
          </div>
        )}

        {/* compartilhar */}
        <div className="pt-2 border-t border-border">
          <ShareButtons url={shareUrl} title={title} label={labels.share} />
        </div>
      </div>
    </aside>
  );
}
