import type { Metadata } from "next";

import { publicEnv } from "./public-env";

export const SITE_NAME = "کرونوس";
export const SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL;

const openGraphDefaults = {
  type: "website",
  locale: "fa_IR",
  siteName: SITE_NAME,
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | دانشنامهٔ ساعت‌های مکانیکی`, template: `%s | ${SITE_NAME}` },
  description:
    "کرونوس، مرجع فارسی ساعت‌های مکانیکی: موومنت‌های سه‌بعدی که جلوی چشمتان باز می‌شوند، تاریخ برندها و ساعت‌سازی، و توضیح اینکه چند قطعهٔ فلزی چطور زمان را نگه می‌دارند.",
  applicationName: SITE_NAME,
  openGraph: openGraphDefaults,
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

/* The site's link-preview image (app/opengraph-image.jpg). Next drops the file-based image from any page that
   sets openGraph itself, so pages without a photo of their own name it again. */
const SITE_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "موومنت اتوماتیک سوئیسی از سمت پشت، با روتور نیم‌دایره و چرخ بالانس طلایی",
};

/* A page's own metadata. Next replaces a parent's openGraph object rather than merging it, so the site-wide
   fields are repeated here. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphDefaults,
      type,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      images: [image ?? SITE_IMAGE],
    },
  };
}

/** schema.org breadcrumbs, so search results show where a page sits in the atlas. */
export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
