import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import "../globals.css";
import { AgroGreenTheme } from "@/components/ui/theme-provider";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import AuthProvider from "@/components/auth/AuthProvider";

export async function generateMetadata() {
  return {
    title: {
      default: "AveGestoria — Gestión Inteligente para Granjas de Ponedoras",
      template: "%s | AveGestoria",
    },
    description:
      "Software de gestión avícola para granjas de gallinas ponedoras. Controla producción, finanzas y rentabilidad desde tu celular. IA trabajando para ti.",
    keywords: [
      "software para granjas de ponedoras",
      "gestión avícola",
      "control de producción de huevos",
      "rentabilidad por lote",
      "app para avicultores",
      "granja inteligente",
    ],
    openGraph: {
      title: "AveGestoria — Gestión Inteligente para Granjas de Ponedoras",
      description:
        "Controla tu granja desde el celular. Producción, finanzas, rentabilidad e IA en un solo lugar.",
      type: "website",
      locale: "es_LA",
      siteName: "AveGestoria",
    },
    twitter: {
      card: "summary_large_image",
      title: "AveGestoria — Gestión Inteligente para Granjas de Ponedoras",
      description:
        "Controla tu granja desde el celular. Producción, finanzas, rentabilidad e IA en un solo lugar.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f3d20" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-emerald-950 text-stone-100 antialiased">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AgroGreenTheme />
            {children}
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0d1f1a",
                color: "#f8fbf5",
                border: "1px solid #2d5a3d",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
