import { COOKIE_NAMES } from "@kronos/contracts";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createTestApp, OTP_CODE, type TestApp } from "./utils/test-app.js";

function cookieValue(setCookie: string[] | string | undefined, name: string): string | undefined {
  const lines = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  const line = lines.find((entry) => entry.startsWith(`${name}=`));
  return line?.split(";")[0]?.slice(name.length + 1);
}

describe("auth (e2e)", () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(async () => {
    await t.close();
  });

  it("rejects an invalid mobile with a Persian field error", async () => {
    const res = await t.http().post("/v1/auth/otp/request").send({ mobile: "123" }).expect(400);
    expect(res.body).toMatchObject({
      code: "VALIDATION_FAILED",
      details: [{ path: "mobile", message: "شماره موبایل معتبر نیست" }],
    });
  });

  it("signs in with OTP sent to a mobile typed in Persian digits", async () => {
    const agent = supertest.agent(t.app.getHttpServer());
    await agent.post("/v1/auth/otp/request").send({ mobile: "۰۹۱۲۰۰۰۰۰۰۱" }).expect(204);

    const wrong = await agent
      .post("/v1/auth/otp/verify")
      .send({ mobile: "09120000001", code: "000000" })
      .expect(400);
    expect(wrong.body.code).toBe("OTP_INVALID");

    const ok = await agent
      .post("/v1/auth/otp/verify")
      .send({ mobile: "09120000001", code: OTP_CODE })
      .expect(200);
    expect(ok.body.data.user).toMatchObject({ mobile: "09120000001", role: "user" });
    const setCookie = ok.headers["set-cookie"] as unknown as string[];
    expect(setCookie.join(";")).toContain("HttpOnly");

    const me = await agent.get("/v1/auth/me").expect(200);
    expect(me.body.data.user.mobile).toBe("09120000001");
  });

  it("enforces the resend cooldown per mobile", async () => {
    await t.http().post("/v1/auth/otp/request").send({ mobile: "09120000002" }).expect(204);
    const res = await t
      .http()
      .post("/v1/auth/otp/request")
      .send({ mobile: "09120000002" })
      .expect(429);
    expect(res.body.code).toBe("RATE_LIMITED");
  });

  it("expires the code after five wrong attempts", async () => {
    const mobile = "09120000003";
    await t.http().post("/v1/auth/otp/request").send({ mobile }).expect(204);
    for (let i = 0; i < 5; i++) {
      await t.http().post("/v1/auth/otp/verify").send({ mobile, code: "000000" }).expect(400);
    }
    const res = await t
      .http()
      .post("/v1/auth/otp/verify")
      .send({ mobile, code: OTP_CODE })
      .expect(400);
    expect(res.body.code).toBe("OTP_EXPIRED");
  });

  it("returns 401 with a Persian message without a session", async () => {
    const res = await t.http().get("/v1/auth/me").expect(401);
    expect(res.body).toMatchObject({ code: "UNAUTHENTICATED", message: "لطفاً وارد حساب خود شوید" });
  });

  it("rotates refresh tokens and revokes the family on reuse after the grace window", async () => {
    const mobile = "09120000004";
    const agent = supertest.agent(t.app.getHttpServer());
    await agent.post("/v1/auth/otp/request").send({ mobile }).expect(204);
    const login = await agent.post("/v1/auth/otp/verify").send({ mobile, code: OTP_CODE });
    const oldRefresh = cookieValue(
      login.headers["set-cookie"] as unknown as string[],
      COOKIE_NAMES.refresh,
    );
    const first = await agent.post("/v1/auth/refresh").expect(204);
    const rotated = cookieValue(
      first.headers["set-cookie"] as unknown as string[],
      COOKIE_NAMES.refresh,
    );
    expect(rotated).toBeTruthy();
    expect(rotated).not.toBe(oldRefresh);

    // Simulate the grace window passing for the old token
    const { getModelToken } = await import("@nestjs/mongoose");
    const refreshModel = t.app.get<import("mongoose").Model<unknown>>(getModelToken("RefreshToken"));
    await refreshModel.updateMany(
      { revokedAt: { $ne: null } },
      { $set: { revokedAt: new Date(Date.now() - 60_000) } },
    );

    await t
      .http()
      .post("/v1/auth/refresh")
      .set("Cookie", `${COOKIE_NAMES.refresh}=${oldRefresh}`)
      .expect(401);
    // The legitimately rotated token died with its family
    await t
      .http()
      .post("/v1/auth/refresh")
      .set("Cookie", `${COOKIE_NAMES.refresh}=${rotated}`)
      .expect(401);
  });

  it("logs out and clears cookies", async () => {
    const agent = await t.login("09120000005");
    await agent.post("/v1/auth/logout").expect(204);
    await agent.get("/v1/auth/me").expect(401);
    await agent.post("/v1/auth/refresh").expect(401);
  });

  it("strips injected fields when updating the profile", async () => {
    const agent = await t.login("09120000006");
    const res = await agent
      .patch("/v1/users/me")
      .send({ firstName: "نیلوفر", lastName: "رضایی", role: "admin" })
      .expect(200);
    expect(res.body.data).toMatchObject({ firstName: "نیلوفر", role: "user" });
  });

  it("lets a soft-deleted mobile register again", async () => {
    const agent = await t.login("09120000007");
    const before = await agent.get("/v1/auth/me").expect(200);
    await agent.delete("/v1/users/me").expect(204);

    const again = await t.login("09120000007");
    const after = await again.get("/v1/auth/me").expect(200);
    expect(after.body.data.user.id).not.toBe(before.body.data.user.id);
  });

  it("answers unknown routes with the error envelope", async () => {
    const res = await t.http().get("/v1/nope").expect(404);
    expect(res.body).toMatchObject({ code: "NOT_FOUND", message: "مورد درخواستی یافت نشد" });
  });

  it("reports health", async () => {
    await t.http().get("/health/live").expect(200);
    const ready = await t.http().get("/health/ready").expect(200);
    expect(ready.body.status).toBe("ok");
  });
});
