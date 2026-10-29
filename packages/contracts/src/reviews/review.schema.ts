import { z } from "zod";

import type { PageMeta } from "../common/api";
import { paginationQuerySchema } from "../common/pagination";

/** A review is hidden until an admin publishes it, and stays hidden if rejected. */
export const REVIEW_STATUSES = ["pending", "published", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/** How the reviewer knows the watch; it tells readers how much weight the review carries. */
export const REVIEW_OWNERSHIPS = ["owner", "former-owner", "handled"] as const;
export type ReviewOwnership = (typeof REVIEW_OWNERSHIPS)[number];

export const watchSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "شناسهٔ ساعت معتبر نیست")
  .max(80);

export const reviewInputSchema = z.object({
  rating: z
    .number("امتیاز را انتخاب کنید")
    .int("امتیاز باید عدد صحیح باشد")
    .min(1, "امتیاز از ۱ تا ۵ است")
    .max(5, "امتیاز از ۱ تا ۵ است"),
  text: z.string().trim().min(20, "دست‌کم ۲۰ حرف بنویسید").max(2000, "حداکثر ۲۰۰۰ حرف مجاز است"),
  ownership: z.enum(REVIEW_OWNERSHIPS).nullable().default(null),
});
export type ReviewInput = z.input<typeof reviewInputSchema>;

export const reviewModerationSchema = z.object({
  status: z.enum(["published", "rejected"]),
});
export type ReviewModerationInput = z.input<typeof reviewModerationSchema>;

export const adminReviewsQuerySchema = paginationQuerySchema.extend({
  status: z.enum(REVIEW_STATUSES).default("pending"),
});
export type AdminReviewsQuery = z.input<typeof adminReviewsQuerySchema>;

export interface ReviewDto {
  id: string;
  watchSlug: string;
  rating: number;
  text: string;
  ownership: ReviewOwnership | null;
  /** First name and last initial only; the mobile number never leaves the API */
  authorName: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPageMeta extends PageMeta {
  /** Mean of the published ratings, null while there are none */
  average: number | null;
}
