const yearFormat = new Intl.NumberFormat("fa-IR", { useGrouping: false });

/** Years read as Persian digits without a thousands separator, the way the history page writes them. */
export const formatYear = (year: number) => yearFormat.format(year);

export const plateNumber = (index: number) => `Pl. ${String(index + 1).padStart(2, "0")}`;
