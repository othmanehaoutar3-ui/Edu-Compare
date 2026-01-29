import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Sup Advisor | Trouvez l'école parfaite",
  description: "Intelligence artificielle pour prédire vos chances d'admission. Comparez 500+ écoles, calculez vos probabilités, et prenez les bonnes décisions.",
  keywords: ["orientation", "écoles", "admission", "parcoursup", "calculateur", "IA", "étudiants"],
  authors: [{ name: "Sup Advisor" }],
  creator: "Sup Advisor",
  publisher: "Sup Advisor",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://yourdomain.com",
    siteName: "Sup Advisor",
    title: "Sup Advisor | Trouvez l'école parfaite",
    description: "Intelligence artificielle pour prédire vos chances d'admission. Comparez 500+ écoles, calculez vos probabilités, et prenez les bonnes décisions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sup Advisor - Trouvez votre école",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sup Advisor | Trouvez l'école parfaite",
    description: "IA pour prédire vos chances d'admission. Comparez 500+ écoles et prenez les bonnes décisions.",
    images: ["/og-image.png"],
    creator: "@supadvisor",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
