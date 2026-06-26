import Image from 'next/image';
import { SOCIALS } from '@/lib/socials';

export function AuthorCard({ label, bio }: { label: string; bio: string }) {
  return (
    <section className="my-14 p-7 md:p-8 rounded-[24px] bg-surface border border-border-strong shadow-brand flex flex-col sm:flex-row gap-6 items-start">
      <Image
        src="/assets/andre-portrait.jpg"
        alt="Andre Ambrósio"
        width={88}
        height={88}
        className="rounded-full w-[72px] h-[72px] object-cover object-[30%_center] shrink-0 border border-champagne/30"
      />
      <div>
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bronze mb-2">{label}</div>
        <div className="font-display font-light text-[1.5rem] text-text mb-2 tracking-tight">Andre Ambrósio</div>
        <p className="text-[14px] text-text-dim leading-[1.75] max-w-[540px] mb-4">{bio}</p>
        <div className="flex flex-wrap gap-5 text-[11px] font-mono uppercase tracking-[0.15em]">
          {SOCIALS.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener" className="text-champagne hover:text-text transition-colors">{s.name} ↗</a>
          ))}
        </div>
      </div>
    </section>
  );
}
