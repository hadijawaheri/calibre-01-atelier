import { FigurePlate } from "@/components/atlas";

import type { WatchEntry } from "../types";

/* The model's plate, or an honest empty mat when no free photo exists. */
export function WatchPhoto({
  watch,
  number,
  sizes,
  priority,
}: {
  watch: WatchEntry;
  number?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (watch.photo) {
    return (
      <FigurePlate
        src={watch.photo.src}
        alt={watch.photo.alt}
        caption={watch.photo.caption}
        number={number}
        credit={watch.photo.credit}
        aspect="aspect-[4/5]"
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return (
    <div className="grid aspect-[4/5] place-items-center border border-dashed border-border bg-secondary/50 p-8 text-center">
      <p className="max-w-[24ch] text-sm leading-7 text-muted-foreground">
        عکسی با مجوز آزاد از این مدل پیدا نشد. عکس‌های سایت سازنده حق نشر دارند و اینجا نیامده‌اند.
      </p>
    </div>
  );
}
