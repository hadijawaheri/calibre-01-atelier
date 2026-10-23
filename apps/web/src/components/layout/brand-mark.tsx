import Link from "next/link";

import { paths } from "@/lib/paths";

export function BrandMark() {
  return (
    <Link href={paths.home} className="flex flex-col items-center gap-1.5 leading-none">
      {/* The tracking would leave a gap after the last letter; the negative margin centres the word again */}
      <span
        className="-me-[0.45em] font-display text-xl tracking-[0.45em] text-foreground"
        dir="ltr"
        aria-hidden
      >
        KRONOS
      </span>
      <span className="sr-only">کرونوس، </span>
      <span className="text-[10px] text-muted-foreground">دانشنامهٔ ساعت</span>
    </Link>
  );
}
