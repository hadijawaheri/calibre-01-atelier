"use client";

import type { PageMeta, ReviewDto, ReviewStatus } from "@kronos/contracts";
import { REVIEW_STATUSES } from "@kronos/contracts";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiError, SignInDialog, useSession } from "@/features/account";
import { formatNumber } from "@/lib/format";
import { paths } from "@/lib/paths";

import { reviewsApi } from "../api";
import { STATUS_LABELS } from "../labels";
import { ReviewItem } from "./review-item";

type Queue =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready"; reviews: ReviewDto[]; meta: PageMeta };

const errorMessage = (e: unknown) =>
  e instanceof ApiError ? e.message : "فهرست نظرها بارگیری نشد";

function ModerationQueue({ watchName }: { watchName: (slug: string) => string }) {
  const [status, setStatus] = useState<ReviewStatus>("pending");
  const [page, setPage] = useState(1);
  const [queue, setQueue] = useState<Queue>({ state: "loading" });
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    reviewsApi
      .queue(status, page)
      .then(({ data, meta }) => live && setQueue({ state: "ready", reviews: data, meta }))
      .catch((e: unknown) => live && setQueue({ state: "error", message: errorMessage(e) }));
    return () => {
      live = false;
    };
  }, [status, page]);

  const show = (next: ReviewStatus, nextPage = 1) => {
    setQueue({ state: "loading" });
    setStatus(next);
    setPage(nextPage);
  };

  const moderate = async (review: ReviewDto, next: "published" | "rejected") => {
    setBusy(review.id);
    setActionError(null);
    try {
      await reviewsApi.moderate(review.id, next);
      // A moderated review leaves the tab it was on
      setQueue((current) =>
        current.state === "ready"
          ? {
              ...current,
              reviews: current.reviews.filter((item) => item.id !== review.id),
              meta: { ...current.meta, totalItems: current.meta.totalItems - 1 },
            }
          : current,
      );
    } catch (e: unknown) {
      setActionError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={status} onValueChange={(value) => show(value as ReviewStatus)}>
        <TabsList>
          {REVIEW_STATUSES.map((value) => (
            <TabsTrigger key={value} value={value}>
              {STATUS_LABELS[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      {queue.state === "loading" && <Skeleton className="h-40" />}
      {queue.state === "error" && <p className="text-sm text-destructive">{queue.message}</p>}
      {queue.state === "ready" && (
        <>
          <p className="text-sm text-muted-foreground">
            {formatNumber(queue.meta.totalItems)} نظر {STATUS_LABELS[status]}
          </p>
          {queue.reviews.length === 0 ? (
            <p className="border border-dashed border-border bg-secondary/50 p-6 text-sm text-muted-foreground">
              نظری در این فهرست نیست.
            </p>
          ) : (
            <ul className="flex flex-col gap-px border border-border bg-border">
              {queue.reviews.map((review) => (
                <li key={review.id}>
                  <ReviewItem
                    review={review}
                    aside={
                      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
                        <Link
                          href={paths.watch(review.watchSlug)}
                          className="text-sm underline decoration-border underline-offset-4 hover:text-foreground"
                        >
                          {watchName(review.watchSlug)}
                        </Link>
                        <div className="ms-auto flex gap-2">
                          {review.status !== "published" && (
                            <Button
                              size="sm"
                              disabled={busy === review.id}
                              onClick={() => void moderate(review, "published")}
                            >
                              انتشار
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busy === review.id}
                              onClick={() => void moderate(review, "rejected")}
                            >
                              رد
                            </Button>
                          )}
                        </div>
                      </div>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
          {queue.meta.totalPages > 1 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => show(status, page - 1)}
              >
                قبلی
              </Button>
              <p className="text-sm text-muted-foreground tabular-nums">
                صفحهٔ {formatNumber(page)} از {formatNumber(queue.meta.totalPages)}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= queue.meta.totalPages}
                onClick={() => show(status, page + 1)}
              >
                بعدی
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** The moderation desk. The API enforces the admin role; this only decides what to draw. */
export function AdminReviews({ watchNames }: { watchNames: Record<string, string> }) {
  const session = useSession();
  if (session === undefined) return <Skeleton className="h-40" />;
  if (session === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">برای بررسی نظرها با حساب مدیر وارد شوید.</p>
        <SignInDialog trigger={<Button>ورود</Button>} />
      </div>
    );
  }
  if (session.role !== "admin") {
    return <p className="text-sm text-muted-foreground">این بخش فقط برای مدیران کرونوس است.</p>;
  }
  return <ModerationQueue watchName={(slug) => watchNames[slug] ?? slug} />;
}
