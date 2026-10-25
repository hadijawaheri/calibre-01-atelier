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
});
