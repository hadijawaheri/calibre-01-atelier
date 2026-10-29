import type { ReviewDto } from "@kronos/contracts";
import type { ReactNode } from "react";

import { formatDate } from "@/lib/format";

import { OWNERSHIP_LABELS } from "../labels";
import { Stars } from "./stars";

/** One review as readers see it; `aside` holds what only its author or an admin gets. */
export function ReviewItem({ review, aside }: { review: ReviewDto; aside?: ReactNode }) {
  return (
    <article className="flex flex-col gap-3 bg-card p-5">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Stars value={review.rating} />
        <p className="text-sm">{review.authorName}</p>
        {review.ownership && (
          <p className="text-xs text-muted-foreground">{OWNERSHIP_LABELS[review.ownership]}</p>
        )}
        <time dateTime={review.createdAt} className="ms-auto text-xs text-muted-foreground">
          {formatDate(review.createdAt)}
        </time>
      </header>
      <p className="leading-8 whitespace-pre-line text-foreground/85">{review.text}</p>
      {aside}
    </article>
  );
}
