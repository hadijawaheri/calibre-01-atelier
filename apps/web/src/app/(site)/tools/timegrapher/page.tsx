import type { Metadata } from "next";

import { TimegrapherPage } from "@/features/timegrapher";
import { paths } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "تایم‌گرافر آنلاین",
  description:
    "دقت ساعت مکانیکی خود را با میکروفون گوشی بسنجید: خطای روزانه، خطای ضربه و تعداد ضربه در ساعت، بی‌نصب برنامه.",
  path: paths.timegrapher,
});

export default function TimegrapherRoute() {
  return <TimegrapherPage />;
}
