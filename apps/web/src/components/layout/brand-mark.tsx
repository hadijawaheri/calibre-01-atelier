import Link from "next/link";

import { paths } from "@/lib/paths";

export function BrandMark() {
  return (
    <Link href={paths.home} className="flex shrink-0 flex-col gap-0.5 leading-none">
      {/* The tracking would leave a gap after the last letter; the negative margin takes it back */}
      <span
        className="-me-[0.3em] font-display text-2xl font-medium tracking-[0.3em] text-foreground"
        dir="ltr"
        aria-hidden
      >
        KRONOS
      </span>
      <span className="sr-only">کرونوس، </span>
      <span className="text-[0.6875rem] text-muted-foreground">دانشنامهٔ فارسی ساعت</span>
    </Link>
  );
}
