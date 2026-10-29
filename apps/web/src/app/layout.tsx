import "./globals.css";

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { AppProviders } from "@/components/providers/app-providers";
import { NONCE_HEADER } from "@/lib/csp";
import { defaultMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

import { amiri, cormorant, plexArabic, plexMono, plexSans } from "./fonts";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1c1d1f" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
  ],
};

// Reading the per-request nonce makes every page dynamic, which the CSP requires (ADR 0013)
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        plexSans.variable,
        plexArabic.variable,
        plexMono.variable,
        cormorant.variable,
        amiri.variable,
      )}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <AppProviders nonce={nonce}>{children}</AppProviders>
      </body>
    </html>
  );
}
