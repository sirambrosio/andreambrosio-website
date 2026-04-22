import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Quem é Andre Ambrósio — fundador, construtor de sistemas, leitor de sinais. Trajetória, eixos de pensamento e empresas.',
  openGraph: {
    title: 'Sobre — Andre Ambrósio',
    description: 'Fundador, construtor de sistemas, leitor de sinais.',
  },
};

const EIXOS = [
  { t: 'Pensamento sistêmico', d: 'Vejo arquitetura onde outros veem eventos.' },
  { t: 'Engenharia do futuro', d: 'Construo infraestrutura antes dela ser pedida.' },
  { t: 'Presença silenciosa', d: 'Falo com peso, não com volume.' },
  { t: 'Longo prazo', d: 'Tudo que importa leva décadas.' },
];

export default function Sobre() {
  return (
    <div className="bg-bg text-text">
      <section className="relative min-h-[calc(100vh-86px)] flex items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 md:w-[48%] md:right-auto">
          <Image src="/assets/andre-portrait.jpg" alt="Andre Ambrósio" fill priority sizes="(max-width:768px) 100vw, 48vw" className="object-cover object-[30%_center]" />
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-transparent via-bg/70 to-bg" />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-bg/10 to-bg" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-[5rem] py-24 md:py-0 md:ml-[48%]">
          <div className="max-w-[580px]">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-[40px] h-[1px] bg-champagne" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">Sobre</span>
            </div>
            <h1 className="font-display font-light text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-text mb-8">
              Andre <span className="italic text-gold-foil">Ambrósio</span>.
            </h1>
            <p className="text-[1.0625rem] text-text-dim leading-[1.85]">
              Fundador. Construtor de sistemas. Leitor de sinais. Passo o dia entendendo como tecnologia, negócios, saúde e IA se reorganizam — e articulando o que vem a seguir.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-32">
        <div className="max-w-[680px] mx-auto">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-10 text-center">§ I · Quem sou</div>
          <div className="space-y-7 text-[1.0625rem] leading-[1.85] text-text font-body">
            <p className="first-letter:font-display first-letter:font-normal first-letter:text-[5rem] first-letter:float-left first-letter:mr-4 first-letter:leading-[0.85] first-letter:text-text">
              Nasci com a sensação de que o mundo opera em camadas — e que a maior parte das pessoas só enxerga a superfície. Empresas, corpos, sociedades, tecnologia: tudo é arquitetura. Tudo tem uma estrutura invisível que define o que pode acontecer.
            </p>
            <p>
              Meu trabalho sempre foi tornar essas arquiteturas visíveis. Primeiro em empresas que fundei e construí. Depois em saúde, ao perceber que o modelo atual é tão reativo quanto um sistema de energia que só liga quando a casa já está no escuro. Depois em IA, ao ver que a maioria trata isso como magia enquanto poucos veem a camada de decisão que está se formando.
            </p>
            <p>
              Não sou jornalista, analista, coach ou influencer. Sou fundador e pensador. Meu posicionamento público existe porque o que eu vejo precisa ser nomeado. Se não for, outros nomeiam de forma mais rasa — e a conversa fica aprisionada na superfície.
            </p>
            <p>
              Não falo para todos. Falo para quem também opera em camadas: fundadores, arquitetos, pensadores, construtores do próximo ciclo. Gente que entende que o que importa não é a tendência do mês, é a arquitetura da década.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-32 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 text-center">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-8">§ II · Eixos</div>
            <h2 className="font-display font-light text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] text-text tracking-tight">
              Quatro convicções que <span className="italic text-gold-foil">organizam tudo</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EIXOS.map((e, i) => (
              <div key={e.t} className="rounded-[20px] bg-bg border border-border p-8">
                <div className="font-mono text-[10px] tracking-[0.25em] text-champagne mb-4">{['I', 'II', 'III', 'IV'][i]}</div>
                <div className="font-display font-light text-[1.75rem] text-text tracking-tight mb-3">{e.t}</div>
                <div className="text-[14px] text-text-dim leading-[1.75]">{e.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-32 bg-bg border-t border-border">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne mb-10">§ III · Próximo</div>
          <h2 className="font-display font-light text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] text-text tracking-tight mb-10">
            Continue pelas <span className="italic text-gold-foil">leituras</span>.
          </h2>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            <Link href="/ensaios" className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gradient rounded-full text-[13px] font-semibold text-ink shadow-brand hover:opacity-90 transition-all">
              Ler ensaios <ArrowRight size={14} />
            </Link>
            <Link href="/empresas" className="text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors">
              Ver empresas →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
