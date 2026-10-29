"use client";

import type { PropsWithChildren } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children, nonce }: PropsWithChildren<{ nonce?: string }>) {
  return (
    // next-themes injects an inline script; without the nonce the CSP would block it
    <ThemeProvider nonce={nonce}>
      <DirectionProvider dir="rtl">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
