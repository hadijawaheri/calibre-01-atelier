import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A small ruled tag for a function, a material or a reference. Latin tags take the tracked mono. */
export function Tag({
  children,
  latin = false,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  latin?: boolean;
  tone?: "muted" | "ink";
  className?: string;
}) {
  return (
    <span
      dir={latin ? "ltr" : undefined}
      className={cn(
        "inline-flex items-center border border-border bg-card px-2 py-0.5 whitespace-nowrap",
        latin ? "caps text-[0.625rem]" : "text-xs",
        tone === "ink" ? "text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
