import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ROBUT - Entrevistas con IA | Automatiza tu Proceso de Seleccion",
  description: "Plataforma de entrevistas impulsada por Inteligencia Artificial. Automatiza tus procesos de seleccion con entrevistadores AI que trabajan 24/7.",
  openGraph: {
    title: "ROBUT - Entrevistas con IA",
    description: "Plataforma de entrevistas impulsada por Inteligencia Artificial. Automatiza tus procesos de seleccion con entrevistadores AI.",
    siteName: "ROBUT",
    images: [
      {
        url: "/robut-og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROBUT - Entrevistas con IA",
    description: "Automatiza tus procesos de seleccion con entrevistadores AI que trabajan 24/7.",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/browser-client-icon.ico" />
      </head>
      <body className={`${inter.className} ${inter.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
