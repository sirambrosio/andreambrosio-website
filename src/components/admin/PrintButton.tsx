'use client';
import { Printer } from 'lucide-react';
export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-brand-gradient text-ink text-[13px] font-semibold hover:opacity-90 transition-opacity">
      <Printer size={15} /> Imprimir / PDF
    </button>
  );
}
