import Link from "next/link";

import { paths } from "@/lib/paths";

export function BrandMark() {
  return (
    <Link href={paths.home} className="flex flex-col items-center leading-none">
      <span className="text-gold-gradient font-display text-2xl tracking-[0.3em]" dir="ltr">
        KRONOS
      </span>
      <span className="text-[10px] text-muted-foreground">آتلیه ساعت‌سازی</span>
    </Link>
  );
}
