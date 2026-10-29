import type TestAgent from "supertest/lib/agent.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createTestApp, type TestApp } from "./utils/test-app.js";

const SLUG = "omega-speedmaster";
const TEXT = "روی مچ سبک است و کرونوگرافش هنوز بی‌نقص کار می‌کند.";

describe("reviews (e2e)", () => {
  let t: TestApp;
  // One admin session for the whole file: a second login would hit the OTP resend cooldown
  let admin: TestAgent;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await t.login("09121000099", "admin");
  });
  afterAll(async () => {
    await t.close();
  });

  it("lists nothing and no average for a watch without reviews", async () => {
    const res = await t.http().get(`/v1/watches/${SLUG}/reviews`).expect(200);
    expect(res.body).toEqual({
      data: [],
      meta: { page: 1, limit: 20, totalItems: 0, totalPages: 1, average: null },
    });
  });

  it("asks a guest to sign in before writing", async () => {
    const res = await t
      .http()
      .put(`/v1/watches/${SLUG}/reviews/mine`)
      .send({ rating: 5, text: TEXT })
      .expect(401);
    expect(res.body.code).toBe("UNAUTHENTICATED");
  });

  it("rejects a short text with a Persian field error", async () => {
    const agent = await t.login("09121000001");
    const res = await agent
      .put(`/v1/watches/${SLUG}/reviews/mine`)
      .send({ rating: 5, text: "عالی" })
      .expect(400);
    expect(res.body).toMatchObject({
      code: "VALIDATION_FAILED",
      details: [{ path: "text", message: "دست‌کم ۲۰ حرف بنویسید" }],
    });
  });

  it("answers a malformed slug with 404", async () => {
    await t.http().get("/v1/watches/Not_A_Slug/reviews").expect(404);
  });

  it("keeps a review out of the listing until an admin publishes it", async () => {
    const author = await t.login("09121000002");
    await author.patch("/v1/users/me").send({ firstName: "هادی", lastName: "جواهری" }).expect(200);

    const written = await author
      .put(`/v1/watches/${SLUG}/reviews/mine`)
      .send({ rating: 4, text: `  ${TEXT}  `, ownership: "owner" })
      .expect(200);
    expect(written.body.data).toMatchObject({
      watchSlug: SLUG,
      rating: 4,
      text: TEXT,
      ownership: "owner",
      authorName: "هادی ج.",
      status: "pending",
    });
    expect(JSON.stringify(written.body)).not.toContain("0912");

    const hidden = await t.http().get(`/v1/watches/${SLUG}/reviews`).expect(200);
    expect(hidden.body.data).toEqual([]);

    const mine = await author.get(`/v1/watches/${SLUG}/reviews/mine`).expect(200);
    expect(mine.body.data.id).toBe(written.body.data.id);

    // A normal account cannot reach the moderation queue
    await author.get("/v1/admin/reviews").expect(403);

    const queue = await admin.get("/v1/admin/reviews").expect(200);
    expect(queue.body.data.map((review: { id: string }) => review.id)).toContain(
      written.body.data.id,
    );
    await admin
      .patch(`/v1/admin/reviews/${written.body.data.id}`)
      .send({ status: "published" })
      .expect(200);

    const shown = await t.http().get(`/v1/watches/${SLUG}/reviews`).expect(200);
    expect(shown.body.data).toHaveLength(1);
    expect(shown.body.meta).toMatchObject({ totalItems: 1, average: 4 });

    // Editing sends it back for another look
    const edited = await author
      .put(`/v1/watches/${SLUG}/reviews/mine`)
      .send({ rating: 2, text: TEXT })
      .expect(200);
    expect(edited.body.data).toMatchObject({ id: written.body.data.id, status: "pending" });
    const again = await t.http().get(`/v1/watches/${SLUG}/reviews`).expect(200);
    expect(again.body.meta.totalItems).toBe(0);
  });

  it("averages the published ratings only, to one decimal", async () => {
    const slug = "rolex-submariner";
    const ratings = [5, 4, 4];
    for (const [index, rating] of ratings.entries()) {
      const agent = await t.login(`0912200000${index}`);
      const res = await agent
        .put(`/v1/watches/${slug}/reviews/mine`)
        .send({ rating, text: TEXT })
        .expect(200);
      await admin
        .patch(`/v1/admin/reviews/${res.body.data.id}`)
        .send({ status: "published" })
        .expect(200);
    }
    const rejected = await t.login("09122000009");
    const spam = await rejected
      .put(`/v1/watches/${slug}/reviews/mine`)
      .send({ rating: 1, text: TEXT })
      .expect(200);
    await admin
      .patch(`/v1/admin/reviews/${spam.body.data.id}`)
      .send({ status: "rejected" })
      .expect(200);

    const res = await t.http().get(`/v1/watches/${slug}/reviews?limit=2`).expect(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ totalItems: 3, totalPages: 2, average: 4.3 });
  });

  it("lets an author delete a review and write a new one", async () => {
    const slug = "seiko-5";
    const agent = await t.login("09123000001");
    await agent.put(`/v1/watches/${slug}/reviews/mine`).send({ rating: 3, text: TEXT }).expect(200);
    await agent.delete(`/v1/watches/${slug}/reviews/mine`).expect(204);
    const gone = await agent.get(`/v1/watches/${slug}/reviews/mine`).expect(200);
    expect(gone.body.data).toBeNull();
    await agent.delete(`/v1/watches/${slug}/reviews/mine`).expect(404);
    await agent.put(`/v1/watches/${slug}/reviews/mine`).send({ rating: 5, text: TEXT }).expect(200);
  });

  it("takes an account's reviews down when the account is deleted", async () => {
    const slug = "cartier-tank";
    const agent = await t.login("09124000001");
    const res = await agent
      .put(`/v1/watches/${slug}/reviews/mine`)
      .send({ rating: 5, text: TEXT })
      .expect(200);
    await admin
      .patch(`/v1/admin/reviews/${res.body.data.id}`)
      .send({ status: "published" })
      .expect(200);
    await agent.delete("/v1/users/me").expect(204);
    const list = await t.http().get(`/v1/watches/${slug}/reviews`).expect(200);
    expect(list.body.meta.totalItems).toBe(0);
  });

  it("answers moderation of an unknown review with 404", async () => {
    await admin
      .patch("/v1/admin/reviews/0123456789abcdef01234567")
      .send({ status: "published" })
      .expect(404);
    await admin
      .patch("/v1/admin/reviews/0123456789abcdef01234567")
      .send({ status: "pending" })
      .expect(400);
  });
});
