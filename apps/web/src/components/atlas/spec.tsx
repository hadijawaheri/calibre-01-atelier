import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** One measured fact on its own white plate: the label above, the value set to be read and compared. */
export function Spec({
  label,
  value,
  latin = false,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  /** A Latin value (a reference, vph) is set in the mono, left to right. */
  latin?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 bg-card p-4", className)}>
      <dt className="label">{label}</dt>
      <dd
        className={cn("text-sm tabular-nums", latin ? "font-mono" : "text-start")}
        dir={latin ? "ltr" : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

/** Specs in a ruled grid: the gaps are the rules, so every cell shares one hairline with its neighbours. */
export function SpecGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <dl className={cn("grid gap-px border border-border bg-border", className)}>{children}</dl>
  );
}
