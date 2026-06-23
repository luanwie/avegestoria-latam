import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import "../globals.css";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { PageViewTracker } from "@/components/seo/PageViewTracker";
import AuthProvider from "@/components/auth/AuthProvider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

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
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#05120a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-brand-green-deeper text-stone-100 antialiased font-sans">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 grain" />
              <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-brand-green/10 blur-[140px] animate-[blobMove_25s_ease-in-out_infinite]" />
              <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-brand-gold/4 blur-[120px] animate-[blobMove_25s_ease-in-out_infinite]" style={{ animationDelay: "-12s" }} />
              <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-brand-green/6 blur-[100px] animate-[blobMove_25s_ease-in-out_infinite]" style={{ animationDelay: "-6s" }} />
            </div>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23eba61c' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
            />
            <PageViewTracker />
            {children}
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#0a150f", color: "#f5f5f4", border: "1px solid rgba(235,166,28,0.15)" },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
