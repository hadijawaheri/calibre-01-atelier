import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

import { formatRating } from "../labels";

/** Five stars, filled to the nearest whole one; the exact figure is read out to screen readers. */
export function Stars({ value, className }: { value: number; className?: string }) {
  const filled = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span className="sr-only">امتیاز {formatRating(value)} از ۵</span>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-4",
            index < filled ? "fill-current text-metal-ink" : "text-muted-foreground/50",
          )}
        />
      ))}
    </span>
  );
}
