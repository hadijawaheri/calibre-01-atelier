export const ERROR_CODES = [
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "OTP_INVALID",
  "OTP_EXPIRED",
  "OUT_OF_STOCK",
  "PAYMENT_FAILED",
  "SMS_UNAVAILABLE",
  "INTERNAL",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export interface ApiErrorBody {
  statusCode: number;
  code: ErrorCode;
  /** Persian, safe to show to the user */
  message: string;
  details?: unknown;
  requestId?: string;
}
