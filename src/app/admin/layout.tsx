import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = { title: 'Admin · Andre Ambrósio', robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="antialiased bg-bg text-text min-h-screen">{children}</body>
    </html>
  );
}
