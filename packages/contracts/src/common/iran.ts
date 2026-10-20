import { z } from "zod";

import { normalizeDigits } from "./digits";

export const digitsString = z.string().trim().transform(normalizeDigits);

export const mobileSchema = digitsString.pipe(
  z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
);

export const postalCodeSchema = digitsString.pipe(
  z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
);

/** Validates an Iranian national code (کد ملی) using its check digit. */
export function isValidNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) return false;
  const digits = code.split("").map(Number);
  const sum = digits.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0);
  const remainder = sum % 11;
  const check = digits[9];
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

export const nationalCodeSchema = digitsString.pipe(
  z.string().refine(isValidNationalCode, "کد ملی معتبر نیست"),
);
