import { formatYear } from "./format";
import type { CalibreEntry } from "./types";

/** The register's figures in the order the comparison table uses, each only when a source gives it. */
export function calibreSpecs(calibre: CalibreEntry) {
  return [
    { label: "سازنده", value: calibre.maker },
    { label: "نوع", value: calibre.type },
    calibre.year && { label: "سال معرفی", value: formatYear(calibre.year) },
    calibre.frequency && { label: "فرکانس", value: calibre.frequency },
    calibre.powerReserve && { label: "ذخیرهٔ انرژی", value: calibre.powerReserve },
    calibre.jewels && { label: "یاقوت", value: calibre.jewels },
    calibre.diameter && { label: "قطر", value: calibre.diameter },
    calibre.height && { label: "ارتفاع", value: calibre.height },
  ].filter((spec) => !!spec);
}
