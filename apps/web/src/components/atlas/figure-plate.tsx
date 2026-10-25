import Image from "next/image";

import { cn } from "@/lib/utils";

/** Who took a freely licensed photograph and on what terms; the licence asks for all four to be shown. */
export interface PhotoCredit {
  author: string;
  license: string;
  licenseUrl: string;
  /** The file's page, where the licence was checked. */
  sourceUrl: string;
}

/** A photograph mounted as an atlas plate: hairline frame, white mat, a numbered caption beneath. */
export function FigurePlate({
  src,
  alt,
  caption,
  number,
  note,
  credit,
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
  credit?: PhotoCredit;
  sizes: string;
  priority?: boolean;
  aspect?: string;
  className?: string;
}) {
  // Remote photos are already sized thumbnails on the archive's own CDN; the browser fetches them as they are
  const remote = /^https?:\/\//.test(src);
  return (
    <figure className={cn("flex flex-col plate", className)}>
      <div className={cn("relative overflow-hidden bg-secondary", aspect)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={remote}
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
        {credit && (
          <span className="basis-full border-t border-border pt-2 text-xs leading-6 text-muted-foreground">
            عکس:{" "}
            <a
              href={credit.sourceUrl}
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              {credit.author}
            </a>
            {" · "}
            <a
              href={credit.licenseUrl}
              target="_blank"
              rel="noreferrer license"
              dir="ltr"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              {credit.license}
            </a>
            {" · ویکی‌مدیا کامنز"}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
