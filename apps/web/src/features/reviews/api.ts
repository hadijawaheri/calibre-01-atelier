import type {
  ApiResponse,
  PaginatedResponse,
  ReviewDto,
  ReviewInput,
  ReviewPageMeta,
  ReviewStatus,
} from "@kronos/contracts";

import { apiFetch, jsonBody } from "@/features/account";

export const REVIEWS_PER_PAGE = 10;

export type ReviewPage = { data: ReviewDto[]; meta: ReviewPageMeta };

export const reviewsApi = {
  list: (slug: string, page: number) =>
    apiFetch<ReviewPage>(`/watches/${slug}/reviews?page=${page}&limit=${REVIEWS_PER_PAGE}`),
  mine: (slug: string) => apiFetch<ApiResponse<ReviewDto | null>>(`/watches/${slug}/reviews/mine`),
  save: (slug: string, input: ReviewInput) =>
    apiFetch<ApiResponse<ReviewDto>>(`/watches/${slug}/reviews/mine`, {
      method: "PUT",
      ...jsonBody(input),
    }),
  remove: (slug: string) => apiFetch<void>(`/watches/${slug}/reviews/mine`, { method: "DELETE" }),
  queue: (status: ReviewStatus, page: number) =>
    apiFetch<PaginatedResponse<ReviewDto>>(
      `/admin/reviews?status=${status}&page=${page}&limit=${REVIEWS_PER_PAGE}`,
    ),
  moderate: (id: string, status: Exclude<ReviewStatus, "pending">) =>
    apiFetch<ApiResponse<ReviewDto>>(`/admin/reviews/${id}`, {
      method: "PATCH",
      ...jsonBody({ status }),
    }),
};
