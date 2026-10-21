import Link from "next/link";

import { paths } from "@/lib/paths";

export function BrandMark() {
  return (
    <Link href={paths.home} className="flex flex-col items-center gap-1 leading-none">
      <span className="font-display text-2xl tracking-[0.4em] text-foreground" dir="ltr">
        KRONOS
      </span>
      <span className="text-[10px] text-muted-foreground">دانشنامهٔ ساعت</span>
    </Link>
  );
}
