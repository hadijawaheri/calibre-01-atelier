import { cn } from "@/lib/utils";

export interface SourceLink {
  /** The publisher and page, as a reader would cite it. */
  label: string;
  url: string;
}

/** The references an entry was checked against, so every claim can be traced to where it came from. */
export function SourceList({
  sources,
  id,
  className,
}: {
  sources: readonly SourceLink[];
  id: string;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-3", className)}>
      <h3 id={id} className="label">
        منابع
      </h3>
      <ol className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              dir="ltr"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
