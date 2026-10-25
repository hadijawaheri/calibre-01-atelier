import { z } from "zod";

import { digitsString, mobileSchema } from "../common/iran";

export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const requestOtpSchema = z.object({ mobile: mobileSchema });
export type RequestOtpInput = z.input<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  mobile: mobileSchema,
  code: digitsString.pipe(z.string().regex(/^\d{6}$/, "کد تأیید ۶ رقمی است")),
});
export type VerifyOtpInput = z.input<typeof verifyOtpSchema>;

const personName = z
  .string()
  .trim()
  .min(2, "حداقل ۲ حرف وارد کنید")
  .max(50, "حداکثر ۵۰ حرف مجاز است");

export const updateProfileSchema = z.object({
  firstName: personName,
  lastName: personName,
  email: z.email("ایمیل معتبر نیست").max(120).nullable().optional(),
});
export type UpdateProfileInput = z.input<typeof updateProfileSchema>;

export interface UserDto {
  id: string;
  mobile: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: Role;
  createdAt: string;
}
