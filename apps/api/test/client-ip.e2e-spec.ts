import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { CLIENT_IP_HEADER, PROXY_SECRET_HEADER } from "../src/common/http/client-ip.js";
import { createTestApp, type TestApp } from "./utils/test-app.js";

const SECRET = "e2e-proxy-secret-that-is-long-enough-12345";

// Separate file: env is validated once per module graph, and this one needs the throttler and the secret
describe("rate limit behind the web app's proxy (e2e)", () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await createTestApp({ THROTTLE_ENABLED: "true", API_PROXY_SECRET: SECRET });
  });
  afterAll(async () => {
    await t.close();
  });

  async function otp(mobile: string, headers: Record<string, string>): Promise<number> {
    const res = await t.http().post("/v1/auth/otp/request").set(headers).send({ mobile });
    return res.status;
  }

  it("counts each visitor the web app vouches for separately", async () => {
    const first = { [CLIENT_IP_HEADER]: "5.160.0.1", [PROXY_SECRET_HEADER]: SECRET };
    const second = { [CLIENT_IP_HEADER]: "5.160.0.2", [PROXY_SECRET_HEADER]: SECRET };
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) statuses.push(await otp(`0913000010${i}`, first));
    expect(statuses).toEqual([204, 204, 204, 429]);
    expect(await otp("09130000110", second)).toBe(204);
  });

  it("does not let a caller without the secret pick its own address", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) {
      statuses.push(await otp(`0913000020${i}`, { [CLIENT_IP_HEADER]: `9.9.9.${i}` }));
    }
    expect(statuses).toEqual([204, 204, 204, 429]);
  });
});
