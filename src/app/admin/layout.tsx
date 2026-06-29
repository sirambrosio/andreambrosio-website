import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = { title: 'Admin · Andre Ambrósio', robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="antialiased bg-bg text-text min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
