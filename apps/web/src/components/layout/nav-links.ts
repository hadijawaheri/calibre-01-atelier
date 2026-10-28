import { CALIBRES } from "@/features/movement/calibres";
import { paths } from "@/lib/paths";

export const NAV_LINKS = [
  { href: paths.home, label: "خانه" },
  { href: paths.lab, label: "آزمایشگاه موومنت" },
  { href: paths.calibres, label: "کالیبرها" },
  { href: paths.watches, label: "ساعت‌ها" },
  { href: paths.brands, label: "برندها" },
  { href: paths.complications, label: "کمپلیکیشن‌ها" },
  { href: paths.compare, label: "مقایسه" },
  { href: paths.history, label: "تاریخچه" },
] as const;

/** The four families, linked from the header's second row the way the atlas lists its categories. */
export const FAMILY_LINKS = CALIBRES.map((calibre) => ({
  href: paths.labCalibre(calibre.slug),
  label: calibre.shortName,
}));
