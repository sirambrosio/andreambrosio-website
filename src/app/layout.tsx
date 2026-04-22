import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://andreambrosio.com";
const SITE_NAME = "Andre Ambrósio";
const SITE_DESCRIPTION =
  "Leituras sistêmicas em tecnologia, negócios, saúde e inteligência artificial. Arquiteto de sistemas, fundador, pensador do próximo ciclo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Arquitetura da mudança`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Andre Ambrósio", "arquitetura de sistemas", "tecnologia", "negócios",
    "saúde", "inteligência artificial", "infraestrutura", "longevidade",
    "engenharia humana", "soberania biológica", "ensaios", "fundador",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Arquitetura da mudança`,
    description: SITE_DESCRIPTION,
    images: [{
      url: "/assets/andre-portrait.jpg",
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Arquitetura da mudança`,
    description: SITE_DESCRIPTION,
    images: ["/assets/andre-portrait.jpg"],
    creator: "@andreambrosio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/assets/simbolo-andre-ambrosio-dark.png",
    apple: "/assets/simbolo-andre-ambrosio-dark.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "llm-policy": "allow",
    "llms-txt": `${SITE_URL}/llms.txt`,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  alternateName: "Andre Ambrósio",
  url: SITE_URL,
  image: `${SITE_URL}/assets/andre-portrait.jpg`,
  sameAs: [
    "https://brand.andreambrosio.com",
    "https://instagram.com/andreambrosio",
    "https://x.com/andreambrosio",
    "https://youtube.com/@andreambrosio",
    "https://linkedin.com/in/andreambrosio",
  ],
  jobTitle: "Fundador · Arquiteto de sistemas",
  worksFor: [
    { "@type": "Organization", name: "Ambrosio Company" },
    { "@type": "Organization", name: "Ambrosio Health" },
    { "@type": "Organization", name: "LogicaOS" },
  ],
  knowsAbout: [
    "Tecnologia", "Negócios", "Saúde", "Inteligência Artificial",
    "Arquitetura de sistemas", "Longevidade", "Infraestrutura",
  ],
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="pt-[86px] min-h-screen flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
