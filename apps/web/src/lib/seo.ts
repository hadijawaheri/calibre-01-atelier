import type { Metadata } from "next";

import { publicEnv } from "./public-env";

export const SITE_NAME = "کرونوس";
export const SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | دانشنامهٔ ساعت‌های مکانیکی`, template: `%s | ${SITE_NAME}` },
  description:
    "کرونوس، مرجع فارسی ساعت‌های مکانیکی: موومنت‌های سه‌بعدی که جلوی چشمتان باز می‌شوند، تاریخ برندها و ساعت‌سازی، و توضیح اینکه چند قطعهٔ فلزی چطور زمان را نگه می‌دارند.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};
