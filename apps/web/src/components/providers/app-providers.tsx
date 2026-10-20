"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <DirectionProvider dir="rtl">
        <NuqsAdapter>
          <QueryProvider>
            <TooltipProvider delayDuration={150}>
              {children}
              <Toaster dir="rtl" position="top-center" closeButton />
            </TooltipProvider>
          </QueryProvider>
        </NuqsAdapter>
      </DirectionProvider>
    </ThemeProvider>
  );
}
