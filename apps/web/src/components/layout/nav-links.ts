import { paths } from "@/lib/paths";

export const NAV_LINKS = [
  { href: paths.watches, label: "همه‌ی ساعت‌ها" },
  { href: `${paths.watches}?collection=tourbillon`, label: "توربیون" },
  { href: `${paths.watches}?collection=chronograph`, label: "کرونوگراف" },
  { href: `${paths.home}#calibre`, label: "کالیبر" },
  { href: `${paths.home}#atelier`, label: "آتلیه" },
] as const;
