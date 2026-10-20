import { describe, expect, it } from "vitest";

import { normalizeDigits } from "./digits";
import { isValidNationalCode, mobileSchema, postalCodeSchema } from "./iran";

describe("normalizeDigits", () => {
  it.each([
    ["۰۹۱۲۳۴۵۶۷۸۹", "09123456789"],
    ["٠٩١٢", "0912"],
    ["abc ۱2٣", "abc 123"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeDigits(input)).toBe(expected);
  });
});

describe("mobileSchema", () => {
  it("accepts Persian digits and trims", () => {
    expect(mobileSchema.parse(" ۰۹۱۲۳۴۵۶۷۸۹ ")).toBe("09123456789");
  });
  it.each(["9123456789", "0912345678", "08123456789", "abc"])("rejects %s", (value) => {
    expect(mobileSchema.safeParse(value).success).toBe(false);
  });
});

describe("postalCodeSchema", () => {
  it("requires exactly 10 digits", () => {
    expect(postalCodeSchema.parse("۱۲۳۴۵۶۷۸۹۰")).toBe("1234567890");
    expect(postalCodeSchema.safeParse("12345").success).toBe(false);
  });
});

describe("isValidNationalCode", () => {
  it.each([
    ["0499370899", true],
    ["0790419904", true],
    ["0499370898", false],
    ["1111111111", false],
    ["123", false],
  ])("%s → %s", (code, expected) => {
    expect(isValidNationalCode(code)).toBe(expected);
  });
});
