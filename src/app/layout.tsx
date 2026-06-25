import './globals.css';

/**
 * Root layout — pass-through.
 * O <html>/<body> e todo o chrome vivem em app/[locale]/layout.tsx pra que o
 * atributo lang e os metadados sejam por idioma (SEO/hreflang). Este layout só
 * propaga os filhos e garante o CSS global (inclusive para o /_not-found).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
