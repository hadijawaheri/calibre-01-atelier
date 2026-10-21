"use client";

import type { PropsWithChildren } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <DirectionProvider dir="rtl">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
