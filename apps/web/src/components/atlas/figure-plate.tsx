import Image from "next/image";

import { cn } from "@/lib/utils";

/** A photograph mounted as an atlas plate: hairline frame, white mat, a numbered caption beneath. */
export function FigurePlate({
  src,
  alt,
  caption,
  number,
  note,
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
  /** An honesty note in its own ruled bar under the caption, such as where a stand-in image comes from. */
  note?: string;
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
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-border px-4 py-3 text-sm">
        <span>{caption}</span>
        {number && (
          <span
            className="shrink-0 caps whitespace-nowrap text-muted-foreground tabular-nums"
            dir="ltr"
          >
            {number}
          </span>
        )}
        {note && (
          <span className="basis-full border-t border-border pt-2 label text-muted-foreground">
            {note}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
