import Image from "next/image";

import { cn } from "@/lib/utils";

/** A photograph mounted as an atlas plate: hairline frame, white mat, a numbered caption beneath. */
export function FigurePlate({
  src,
  alt,
  caption,
  number,
  sizes,
  priority = false,
  aspect = "aspect-[4/3]",
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  /** The plate's number, set in the mono beside the caption. */
  number?: string;
  sizes: string;
  priority?: boolean;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col plate", className)}>
      <div className={cn("relative overflow-hidden bg-secondary", aspect)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 border-t border-border px-4 py-3 text-sm">
        <span>{caption}</span>
        {number && (
          <span
            className="shrink-0 caps whitespace-nowrap text-muted-foreground tabular-nums"
            dir="ltr"
          >
            {number}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
