import { describe, expect, it } from "vitest";

import { validateEnv } from "./env.js";

const base = {
  DATABASE_URL: "mongodb://127.0.0.1:27018/kronos?replicaSet=rs0",
  JWT_ACCESS_SECRET: "a".repeat(32),
  OTP_HMAC_SECRET: "b".repeat(32),
};

describe("validateEnv", () => {
  it("treats blank keys from .env.example as unset", () => {
    const env = validateEnv({ ...base, OTP_FIXED_CODE: "", SEED_ADMIN_MOBILE: "", PORT: "" });
    expect(env.OTP_FIXED_CODE).toBeUndefined();
    expect(env.SEED_ADMIN_MOBILE).toBeUndefined();
    expect(env.PORT).toBe(7781);
  });

  it("still rejects a malformed value", () => {
    expect(() => validateEnv({ ...base, SEED_ADMIN_MOBILE: "12345" })).toThrow();
  });

  it("still requires secrets left blank", () => {
    expect(() => validateEnv({ ...base, JWT_ACCESS_SECRET: "" })).toThrow();
  });

  it("needs a key and a pattern id for Melipayamak", () => {
    expect(() => validateEnv({ ...base, SMS_PROVIDER: "melipayamak" })).toThrow(/MELIPAYAMAK/);
    const env = validateEnv({
      ...base,
      SMS_PROVIDER: "melipayamak",
      MELIPAYAMAK_API_KEY: "key-12345678",
      MELIPAYAMAK_OTP_BODY_ID: "42",
    });
    expect(env.MELIPAYAMAK_OTP_BODY_ID).toBe(42);
  });

  it("allows Melipayamak in production", () => {
    const env = validateEnv({
      ...base,
      NODE_ENV: "production",
      SMS_PROVIDER: "melipayamak",
      MELIPAYAMAK_API_KEY: "key-12345678",
      MELIPAYAMAK_OTP_BODY_ID: "42",
    });
    expect(env.SMS_PROVIDER).toBe("melipayamak");
  });
});
