"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

/** Shown by the error boundaries: says what failed in plain words and offers a retry and a way home. */
export function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-40 text-center">
      <h1 className="display">مشکلی پیش آمد</h1>
      <p className="leading-7 text-muted-foreground">
        این صفحه بارگذاری نشد. دوباره تلاش کنید؛ اگر مشکل ماند، چند دقیقه بعد سر بزنید.
        {error.digest && (
          <>
            <br />
            <span className="caps" dir="ltr">
              {error.digest}
            </span>
          </>
        )}
      </p>
      <div className="mt-4 flex gap-3">
        <Button onClick={reset}>
          <RotateCcw data-icon="inline-start" />
          تلاش دوباره
        </Button>
        <Button asChild variant="outline">
          <Link href={paths.home}>صفحهٔ اصلی</Link>
        </Button>
      </div>
    </div>
  );
}
