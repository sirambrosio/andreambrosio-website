import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Empresas',
  description:
    'Projetos e empresas fundados por Andre Ambrósio — Ambrosio Company, Ambrosio Health, LogicaOS, VitaAZ, ExoCore, Rovemark.',
};

const EMPRESAS = [
  { nome: 'Ambrosio Company', tag: 'Holding', desc: 'Holding estratégica que organiza investimentos e projetos pessoais.', campos: ['Tecnologia', 'Negócios'], status: 'Ativa', img: '/assets/gen-campo-negocios.png' },
  { nome: 'Ambrosio Health', tag: 'Saúde · Produto', desc: 'Engineering Human Vitality. Saúde contínua, biomarcadores, longevidade como engenharia.', campos: ['Saúde', 'IA', 'Tecnologia'], status: 'Em construção', img: '/assets/gen-campo-saude.png' },
  { nome: 'LogicaOS', tag: 'Software · Produtividade', desc: 'Sistema operacional de agentes para construtores. Arquitetura de decisão assistida por IA.', campos: ['Tecnologia', 'IA', 'Negócios'], status: 'Beta privado', img: '/assets/gen-campo-ia.png' },
  { nome: 'VitaAZ', tag: 'Suplementação', desc: 'Linha de suplementação funcional com formulações proprietárias.', campos: ['Saúde'], status: 'Em construção', img: '/assets/gen-flatlay.png' },
  { nome: 'Ambrosio ExoCore', tag: 'Hardware · Saúde', desc: 'Órgão externo inteligente com biocartuchos. Hardware que se conecta ao corpo.', campos: ['Saúde', 'Tecnologia'], status: 'Prototipagem', img: '/assets/gen-sovereignty.png' },
  { nome: 'Rovemark', tag: 'Estúdio', desc: 'Casa criativa que produz o conteúdo editorial, design e comunicação dos projetos.', campos: ['Tecnologia', 'Negócios'], status: 'Ativa', img: '/assets/gen-campo-tecnologia.png' },
];

export default function Empresas() {
  return (
    <div className="bg-bg text-text">
      <section className="relative px-6 md:px-[8rem] pt-24 pb-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <Image src="/assets/gen-flatlay.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(var(--overlay-fade),0.3) 0%, rgba(var(--overlay-fade),0.8) 60%, var(--bg) 100%)' }} />
        </div>
        <div className="relative max-w-[820px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">Empresas</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,5rem)] leading-[0.98] text-text mb-8 tracking-tight">
            O que construo <span className="italic text-gold-foil">paralelo</span>.
          </h1>
          <p className="text-[1.0625rem] text-text-dim leading-[1.85] max-w-[640px]">
            Seis empresas e projetos. Cada um é uma aplicação da mesma lógica: arquitetura invisível virando sistema visível. Nenhum é side-project.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-[5rem] py-20">
        <div className="max-w-[1200px] mx-auto space-y-px bg-champagne/10">
          {EMPRESAS.map((e, i) => (
            <article key={e.nome} className={`grid grid-cols-1 md:grid-cols-2 bg-bg min-h-[360px] ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative aspect-[4/3] md:aspect-auto min-h-[240px] overflow-hidden">
                <Image src={e.img} alt={e.nome} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bg via-transparent to-transparent" />
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-champagne">{e.tag.toUpperCase()}</span>
                  <span className={`font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded-full border ${e.status === 'Ativa' ? 'border-champagne/40 text-champagne' : 'border-bronze/40 text-bronze'}`}>{e.status}</span>
                </div>
                <h2 className="font-display font-light text-[clamp(2rem,3vw,2.75rem)] leading-[1] tracking-[-0.02em] text-text mb-5">{e.nome}</h2>
                <p className="text-[14.5px] text-text-dim leading-[1.8] mb-7 max-w-[460px]">{e.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {e.campos.map(c => (
                    <span key={c} className="font-mono text-[10px] tracking-[0.15em] text-champagne border border-champagne/30 rounded-full px-3 py-[4px] uppercase">{c}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
