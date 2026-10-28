const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/* Folds what people actually type into one form: Arabic ye and kaf, Persian and Arabic digits, the
   zero-width non-joiner, harakat, the hamza seat and Latin case. "سيكو ۱۹۶۹" and "سیکو 1969" then match alike. */
export function fold(text: string) {
  return text
    .toLowerCase()
    .replaceAll("ي", "ی")
    .replaceAll("ى", "ی")
    .replaceAll("ك", "ک")
    .replaceAll("ة", "ه")
    .replaceAll("ۀ", "ه")
    .replace(/[ً-ٰٟٔ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[‌‏‎]/g, " ")
    .replace(/[٬,]/g, "")
    .replace(/[-–_/·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface Searchable {
  label: string;
  latin?: string;
  terms: string;
}

/* Every word of the query must appear somewhere in the entry. Matches on the name rank above matches deeper
   in its facts, and a name that starts with the query ranks first. */
function score(entry: Searchable, query: string, words: readonly string[]) {
  const terms = fold(`${entry.label} ${entry.latin ?? ""} ${entry.terms}`);
  if (!words.every((word) => terms.includes(word))) return -1;
  const names = [fold(entry.label), fold(entry.latin ?? "")];
  if (names.some((name) => name === query)) return 4;
  if (names.some((name) => name.startsWith(query))) return 3;
  if (names.some((name) => name.includes(query))) return 2;
  if (words.every((word) => names.some((name) => name.includes(word)))) return 1;
  return 0;
}

/** The entries that match, best first; equal scores keep the index's own order. */
export function search<T extends Searchable>(entries: readonly T[], rawQuery: string) {
  const query = fold(rawQuery);
  if (!query) return [];
  const words = query.split(" ");
  return entries
    .map((entry, order) => ({ entry, order, score: score(entry, query, words) }))
    .filter((hit) => hit.score >= 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((hit) => hit.entry);
}
