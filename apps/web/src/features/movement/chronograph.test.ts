import { describe, expect, it } from "vitest";

import { formatChronograph } from "./chronograph";

describe("formatChronograph", () => {
  it.each([
    [0, "۰۰:۰۰٫۰"],
    [99, "۰۰:۰۰٫۰"],
    [7_350, "۰۰:۰۷٫۳"],
    [61_000, "۰۱:۰۱٫۰"],
    [-5, "۰۰:۰۰٫۰"],
  ])("%d ms → %s", (ms, expected) => {
    expect(formatChronograph(ms)).toBe(expected);
  });
});
