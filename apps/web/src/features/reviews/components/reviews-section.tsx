"use client";

import type { ReviewDto, ReviewPageMeta } from "@kronos/contracts";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, SignInDialog, signOut, useSession } from "@/features/account";
import { formatNumber } from "@/lib/format";

import { reviewsApi } from "../api";
import { formatRating, STATUS_LABELS } from "../labels";
import { ReviewForm } from "./review-form";
import { ReviewItem } from "./review-item";
import { Stars } from "./stars";

type Listing =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready"; reviews: ReviewDto[]; meta: ReviewPageMeta; more: boolean };

const errorMessage = (e: unknown) =>
  e instanceof ApiError ? e.message : "نظرها الان در دسترس نیستند";

function Summary({ meta }: { meta: ReviewPageMeta }) {
  if (meta.average === null) {
    return (
      <p className="text-sm leading-7 text-muted-foreground">
        هنوز نظری برای این ساعت منتشر نشده است. اولین نفر باشید.
      </p>
    );
  }
  return (
    <div className="flex items-end gap-4">
      <p className="font-display text-5xl leading-none tabular-nums">
        {formatRating(meta.average)}
      </p>
      <div className="flex flex-col gap-1">
        <Stars value={meta.average} />
        <p className="text-xs text-muted-foreground">از {formatNumber(meta.totalItems)} نظر</p>
      </div>
    </div>
  );
}

/** The signed-in reader's own review: its moderation state, and the way to change or remove it. */
function MyReview({ slug, watchName }: { slug: string; watchName: string }) {
  const session = useSession();
  const userId = session?.id;
  const [mine, setMine] = useState<ReviewDto | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let live = true;
    reviewsApi
      .mine(slug)
      .then(({ data }) => live && setMine(data))
      .catch((e: unknown) => live && setError(errorMessage(e)));
    return () => {
      live = false;
    };
  }, [slug, userId]);

  if (session === undefined) return <Skeleton className="h-10 w-40" />;

  if (session === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm leading-7 text-muted-foreground">
          برای نوشتن نظر دربارهٔ {watchName} وارد شوید.
        </p>
        <SignInDialog trigger={<Button variant="outline">ورود و نوشتن نظر</Button>} />
      </div>
    );
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (mine === undefined) return <Skeleton className="h-10 w-40" />;

  const signOutButton = (
    <Button
      variant="link"
      className="h-auto self-start p-0 text-muted-foreground"
      onClick={() => void signOut()}
    >
      خروج از حساب
    </Button>
  );

  if (!mine || editing) {
    return (
      <div className="flex flex-col gap-4">
        <ReviewForm
          slug={slug}
          user={session}
          review={mine}
          onSaved={(saved) => {
            setMine(saved);
            setEditing(false);
          }}
          onCancel={mine ? () => setEditing(false) : undefined}
        />
        {signOutButton}
      </div>
    );
  }

  const remove = async () => {
    setRemoving(true);
    try {
      await reviewsApi.remove(slug);
      setMine(null);
    } catch (e: unknown) {
      setError(errorMessage(e));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="label">نظر شما</p>
      <ReviewItem
        review={mine}
        aside={
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
            <Badge variant={mine.status === "published" ? "default" : "secondary"}>
              {STATUS_LABELS[mine.status]}
            </Badge>
            {mine.status === "pending" && (
              <p className="text-xs text-muted-foreground">
                پس از تأیید برای همه نمایش داده می‌شود.
              </p>
            )}
            <div className="ms-auto flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                ویرایش
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" disabled={removing}>
                    {removing && <Spinner />}
                    حذف
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>نظرتان حذف شود؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      نظر شما دربارهٔ {watchName} پاک می‌شود و بعداً می‌توانید نظر تازه‌ای بنویسید.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void remove()}>حذف</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        }
      />
      {signOutButton}
    </div>
  );
}

/** Readers' reviews of one watch. The page itself is static; reviews load in the browser. */
export function ReviewsSection({ slug, watchName }: { slug: string; watchName: string }) {
  const [listing, setListing] = useState<Listing>({ state: "loading" });
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let live = true;
    reviewsApi
      .list(slug, 1)
      .then(({ data, meta }) => {
        if (live) setListing({ state: "ready", reviews: data, meta, more: meta.totalPages > 1 });
      })
      .catch((e: unknown) => live && setListing({ state: "error", message: errorMessage(e) }));
    return () => {
      live = false;
    };
  }, [slug]);

  const loadMore = async () => {
    if (listing.state !== "ready") return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { data, meta } = await reviewsApi.list(slug, next);
      setPage(next);
      setListing({
        state: "ready",
        reviews: [...listing.reviews, ...data],
        meta,
        more: next < meta.totalPages,
      });
    } catch (e: unknown) {
      setListing({ state: "error", message: errorMessage(e) });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section aria-labelledby="reviews-title" className="flex flex-col gap-6">
      <h2 id="reviews-title" className="border-b border-border pb-3 font-display text-2xl">
        نظر خوانندگان
      </h2>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
        <div className="flex flex-col gap-8">
          {listing.state === "ready" && <Summary meta={listing.meta} />}
          {listing.state === "loading" && <Skeleton className="h-12 w-48" />}
          <MyReview slug={slug} watchName={watchName} />
        </div>

        <div
          className="flex flex-col gap-4"
          aria-live="polite"
          aria-busy={listing.state === "loading"}
        >
          {listing.state === "loading" && (
            <div className="flex flex-col gap-px border border-border bg-border">
              <Skeleton className="h-28 rounded-none" />
              <Skeleton className="h-28 rounded-none" />
            </div>
          )}
          {listing.state === "error" && (
            <p className="border border-dashed border-border bg-secondary/50 p-6 text-sm leading-7 text-muted-foreground">
              {listing.message}
            </p>
          )}
          {listing.state === "ready" && listing.reviews.length > 0 && (
            <ul className="flex flex-col gap-px border border-border bg-border">
              {listing.reviews.map((review) => (
                <li key={review.id}>
                  <ReviewItem review={review} />
                </li>
              ))}
            </ul>
          )}
          {listing.state === "ready" && listing.more && (
            <Button
              variant="outline"
              className="self-start"
              disabled={loadingMore}
              onClick={() => void loadMore()}
            >
              {loadingMore && <Spinner />}
              نظرهای بیشتر
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
