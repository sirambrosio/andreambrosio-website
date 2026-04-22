'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function Footer() {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark
    ? '/assets/logo-andre-ambrosio-light.png'
    : '/assets/logo-andre-ambrosio-dark.png';

  return (
    <footer className="bg-surface border-t border-border px-6 md:px-12 pt-16 pb-8 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 mb-12">
        <div className="flex flex-col">
          {mounted && (
            <Image src={logoSrc} alt="Andre Ambrósio" width={220} height={56} className="h-14 w-auto object-left mb-5 object-contain" />
          )}
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-champagne mb-2">
            Arquitetura da mudança
          </p>
          <p className="text-xs text-text-dim leading-relaxed max-w-[260px]">
            Leituras sistêmicas em tecnologia, negócios, saúde e inteligência artificial.
          </p>
        </div>

        <div>
          <div className="font-mono text-[9px] font-semibold tracking-[0.25em] uppercase text-champagne mb-3.5">Site</div>
          <Link href="/sobre" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Sobre</Link>
          <Link href="/campos" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Campos</Link>
          <Link href="/ensaios" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Ensaios</Link>
          <Link href="/empresas" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Empresas</Link>
        </div>

        <div>
          <div className="font-mono text-[9px] font-semibold tracking-[0.25em] uppercase text-champagne mb-3.5">Campos</div>
          <Link href="/campos/tecnologia" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Tecnologia</Link>
          <Link href="/campos/negocios" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Negócios</Link>
          <Link href="/campos/saude" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Saúde</Link>
          <Link href="/campos/ia" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">IA</Link>
        </div>

        <div>
          <div className="font-mono text-[9px] font-semibold tracking-[0.25em] uppercase text-champagne mb-3.5">Externo</div>
          <a href="https://brand.andreambrosio.com" target="_blank" rel="noopener" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Brandbook ↗</a>
          <a href="https://instagram.com/andreambrosio" target="_blank" rel="noopener" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">Instagram ↗</a>
          <a href="https://x.com/andreambrosio" target="_blank" rel="noopener" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">X / Twitter ↗</a>
          <a href="https://youtube.com/@andreambrosio" target="_blank" rel="noopener" className="block text-[12.5px] text-text-dim hover:text-champagne py-1 transition-colors">YouTube ↗</a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 pt-6 border-t border-border text-[11px] text-text-dim">
        <span>© 2026 Andre Ambrósio. Todos os direitos reservados.</span>
        <span className="font-mono text-[9px] tracking-[0.2em] text-text-dimmer">TECNOLOGIA · NEGÓCIOS · SAÚDE · IA</span>
      </div>
    </footer>
  );
}
