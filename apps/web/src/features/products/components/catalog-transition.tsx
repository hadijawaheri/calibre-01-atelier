"use client";

import type { PropsWithChildren, TransitionStartFunction } from "react";
import { createContext, use, useTransition } from "react";

import { cn } from "@/lib/utils";

interface CatalogTransition {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const CatalogTransitionContext = createContext<CatalogTransition | null>(null);

/** Filters re-render the server list; the shared transition dims the stale results meanwhile. */
export function CatalogTransitionProvider({ children }: PropsWithChildren) {
  const [isPending, startTransition] = useTransition();
  return <CatalogTransitionContext value={{ isPending, startTransition }}>{children}</CatalogTransitionContext>;
}

export function useCatalogTransition(): CatalogTransition {
  const context = use(CatalogTransitionContext);
  if (!context) throw new Error("useCatalogTransition must be used inside CatalogTransitionProvider");
  return context;
}

export function CatalogResults({ children }: PropsWithChildren) {
  const { isPending } = useCatalogTransition();
  return (
    <div
      aria-busy={isPending}
      className={cn("transition-opacity duration-300", isPending && "pointer-events-none opacity-50")}
    >
      {children}
    </div>
  );
}
