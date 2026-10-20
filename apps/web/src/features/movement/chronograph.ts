const twoDigits = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false });
const oneDigit = new Intl.NumberFormat("fa-IR", { useGrouping: false });

/** mm:ss.t in Persian digits; tenths are truncated like a real chronograph hand. */
export function formatChronograph(elapsedMs: number): string {
  const tenths = Math.floor(Math.max(0, elapsedMs) / 100);
  const minutes = Math.floor(tenths / 600) % 60;
  const seconds = Math.floor(tenths / 10) % 60;
  return `${twoDigits.format(minutes)}:${twoDigits.format(seconds)}٫${oneDigit.format(tenths % 10)}`;
}
