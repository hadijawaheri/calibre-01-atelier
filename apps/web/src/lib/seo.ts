import type { Metadata } from "next";

export const SITE_NAME = "آتلیه کرونوس";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7782";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ساعت‌های دست‌ساز سوئیسی`, template: `%s | ${SITE_NAME}` },
  description:
    "فروشگاه ساعت‌های مکانیکی لوکس آتلیه کرونوس: توربیون، کرونوگراف و ساعت‌های رسمی دست‌ساز با ضمانت پنج‌ساله و ارسال بیمه‌شده.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};
