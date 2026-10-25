import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The head of an atlas page: the title, its reference line, and a short standfirst, ruled off below. */
export function PageHeader({
  title,
  reference,
  intro,
  children,
  className,
}: {
  title: ReactNode;
  /** The Latin reference set under the title, such as a calibre number. */
  reference?: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 border-b border-border pb-10", className)}>
      <h1 className="max-w-[24ch] display">{title}</h1>
      {reference && (
        <p className="caps text-muted-foreground" dir="ltr">
          {reference}
        </p>
      )}
      {intro && <p className="max-w-2xl leading-8 text-muted-foreground">{intro}</p>}
      {children}
    </header>
  );
}
