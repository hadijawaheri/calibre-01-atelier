import type { ReviewDto } from "@kronos/contracts";

import type { Review } from "./schemas/review.schema.js";

export function toReviewDto(review: Review): ReviewDto {
  return {
    id: review._id.toString(),
    watchSlug: review.watchSlug,
    rating: review.rating,
    text: review.text,
    ownership: review.ownership ?? null,
    authorName: review.authorName,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

const ANONYMOUS = "کاربر کرونوس";

/** First name and the initial of the last name: enough to tell reviewers apart, too little to find them. */
export function authorNameOf(user: { firstName: string | null; lastName: string | null }): string {
  const first = user.firstName?.trim();
  if (!first) return ANONYMOUS;
  const initial = user.lastName?.trim().at(0);
  return initial ? `${first} ${initial}.` : first;
}
