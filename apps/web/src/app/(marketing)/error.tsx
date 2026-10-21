"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

export default function SectionError({
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
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-32 text-center">
      <h1 className="font-display text-4xl">مشکلی پیش آمد</h1>
      <p className="leading-7 text-muted-foreground">
        این صفحه بارگذاری نشد. دوباره تلاش کنید؛ اگر مشکل ماند، چند دقیقه بعد سر بزنید.
        {error.digest && (
          <>
            <br />
            <span className="font-mono text-xs" dir="ltr">
              {error.digest}
            </span>
          </>
        )}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RotateCcw data-icon="inline-start" />
          تلاش دوباره
        </Button>
        <Button asChild variant="outline">
          <Link href={paths.home}>صفحه‌ی اصلی</Link>
        </Button>
      </div>
    </div>
  );
}
