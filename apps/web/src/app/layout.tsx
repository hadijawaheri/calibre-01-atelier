import "./globals.css";

import type { Metadata, Viewport } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { defaultMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

import { cormorant, jetbrains, vazirmatn } from "./fonts";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("antialiased", vazirmatn.variable, cormorant.variable, jetbrains.variable)}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
