import { z } from "zod";

const secret = z.string().min(32, "must be at least 32 characters");

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(7781),
    // Behind Caddy the API must not be reachable from outside the machine
    HOST: z.string().default("127.0.0.1"),
    DATABASE_URL: z.string().startsWith("mongodb"),
    JWT_ACCESS_SECRET: secret,
    OTP_HMAC_SECRET: secret,
    CORS_ORIGINS: z
      .string()
      .default("http://localhost:7782")
      .transform((value) => value.split(",").map((origin) => origin.trim())),
    // disabled: production before an SMS vendor exists; sign-in answers 503 SMS_UNAVAILABLE
    SMS_PROVIDER: z.enum(["console", "melipayamak", "disabled"]).default("console"),
    // melipayamak: API key from console.melipayamak.com and the id of an approved OTP pattern
    MELIPAYAMAK_API_KEY: z.string().min(8).optional(),
    MELIPAYAMAK_OTP_BODY_ID: z.coerce.number().int().positive().optional(),
    OTP_FIXED_CODE: z
      .string()
      .regex(/^\d{6}$/)
      .optional(),
    // Shared with the web app on Vercel; with it, rate limits follow the visitor's x-client-ip
    API_PROXY_SECRET: secret.optional(),
    THROTTLE_ENABLED: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    SEED_ADMIN_MOBILE: z
      .string()
      .regex(/^09\d{9}$/)
      .optional(),
  })
  .refine(
    (env) =>
      env.NODE_ENV !== "production" || (!env.OTP_FIXED_CODE && env.SMS_PROVIDER !== "console"),
    {
      message: "OTP_FIXED_CODE and the console SMS provider are forbidden in production",
    },
  )
  .refine(
    (env) =>
      env.SMS_PROVIDER !== "melipayamak" ||
      (env.MELIPAYAMAK_API_KEY !== undefined && env.MELIPAYAMAK_OTP_BODY_ID !== undefined),
    { message: "SMS_PROVIDER=melipayamak needs MELIPAYAMAK_API_KEY and MELIPAYAMAK_OTP_BODY_ID" },
  );

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  // `KEY=` copied from .env.example means "not set", not an empty value to validate
  const present = Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== ""));
  return envSchema.parse(present);
}
