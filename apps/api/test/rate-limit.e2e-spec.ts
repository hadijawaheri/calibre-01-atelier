import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createTestApp, type TestApp } from "./utils/test-app.js";

// Separate file: env is validated once per module graph, and this one needs the throttler on
describe("rate limit (e2e)", () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await createTestApp({ THROTTLE_ENABLED: "true" });
  });
  afterAll(async () => {
    await t.close();
  });

  it("limits OTP requests per IP to three a minute", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) {
      const res = await t
        .http()
        .post("/v1/auth/otp/request")
        .send({ mobile: `0913000000${i}` });
      statuses.push(res.status);
    }
    expect(statuses).toEqual([204, 204, 204, 429]);
  });
});
