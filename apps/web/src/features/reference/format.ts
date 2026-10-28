import type { CalibreKind } from "./types";

const yearFormat = new Intl.NumberFormat("fa-IR", { useGrouping: false });

/** Years read as Persian digits without a thousands separator, the way the history page writes them. */
export const formatYear = (year: number) => yearFormat.format(year);

export const plateNumber = (index: number) => `Pl. ${String(index + 1).padStart(2, "0")}`;

export const KIND_LABELS: Record<CalibreKind, string> = {
  manual: "کوک دستی",
  automatic: "اتوماتیک",
  chronograph: "کرونوگراف",
  quartz: "کوارتز",
};

/** The first sentence of an entry, which reads as its summary in search results and link previews. */
export const lead = (text: string) => text.split(/(?<=[.؟!])\s/)[0] ?? text;
