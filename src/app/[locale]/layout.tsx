import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import "../globals.css";
import { AgroGreenTheme } from "@/components/ui/theme-provider";

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-emerald-950 text-stone-100 antialiased">
        <NextIntlClientProvider messages={messages}>
          <AgroGreenTheme />
          {children}
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
