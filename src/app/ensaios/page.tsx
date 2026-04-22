import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllEnsaios, CAMPOS } from '@/lib/ensaios';

export const metadata: Metadata = {
  title: 'Ensaios',
  description:
    'Leituras sistêmicas sobre tecnologia, negócios, saúde e inteligência artificial. Arquitetura invisível do próximo ciclo.',
};

export default function EnsaiosPage() {
  const ensaios = getAllEnsaios();

  return (
    <div className="bg-bg text-text min-h-screen">
      <section className="px-6 md:px-[8rem] pt-24 pb-16 border-b border-border">
        <div className="max-w-[820px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">Ensaios</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,5rem)] leading-[0.98] text-text mb-8 tracking-tight">
            Leituras <span className="italic text-gold-foil">sistêmicas</span>.
          </h1>
          <p className="text-[1.0625rem] text-text-dim leading-[1.85] max-w-[640px]">
            Peças longas e densas. Cada ensaio descreve uma arquitetura — por que ela existe, o que ela muda, pra onde aponta. Ordenados por data.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-20">
        <div className="max-w-[1100px] mx-auto">
          {ensaios.length === 0 ? (
            <div className="rounded-[20px] border border-border bg-surface p-12 text-center">
              <p className="text-[14px] text-text-dim">Nenhum ensaio publicado ainda. Em breve.</p>
            </div>
          ) : (
            <div className="border-y border-border">
              {ensaios.map(e => {
                const campo = CAMPOS[e.campo];
                return (
                  <Link key={e.slug} href={`/ensaios/${e.slug}`} className="group grid grid-cols-[80px_1fr_auto] md:grid-cols-[120px_1fr_auto_auto] items-baseline gap-6 md:gap-10 py-8 md:py-10 border-b border-border last:border-b-0 hover:pl-4 transition-all">
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">{campo.nome}</div>
                      <div className="font-mono text-[9px] tracking-[0.15em] text-text-dimmer mt-1">{e.data}</div>
                    </div>
                    <div>
                      <h2 className="font-display font-light text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.15] text-text tracking-tight group-hover:italic transition-all">{e.titulo}</h2>
                      {e.subtitulo && <p className="text-[13.5px] text-text-dim mt-1.5">{e.subtitulo}</p>}
                      <p className="text-[12.5px] text-text-dimmer leading-[1.6] mt-3 max-w-[580px] hidden md:block">{e.resumo}</p>
                    </div>
                    <span className="hidden md:inline font-mono text-[10px] text-text-dimmer whitespace-nowrap">{e.tempo_leitura} min</span>
                    <span className="font-display text-[1.25rem] text-text-dimmer group-hover:text-champagne group-hover:translate-x-1 transition-all">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
