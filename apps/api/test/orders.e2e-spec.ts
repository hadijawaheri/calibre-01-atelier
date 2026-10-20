import { ENGRAVING_PRICE } from "@kronos/contracts";
import type TestAgent from "supertest/lib/agent.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { productInput, shipping } from "./utils/fixtures.js";
import { createTestApp, type TestApp } from "./utils/test-app.js";

interface CreatedProduct {
  id: string;
  slug: string;
  price: number;
}

describe("orders (e2e)", () => {
  let t: TestApp;
  let admin: TestAgent;
  let buyer: TestAgent;
  let watch: CreatedProduct;
  let rare: CreatedProduct;

  const stockOf = async (slug: string): Promise<number> =>
    (await t.http().get(`/v1/products/${slug}`).expect(200)).body.data.stock as number;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await t.login("09360000001", "admin");
    buyer = await t.login("09360000002");
    watch = (await admin.post("/v1/admin/products").send(productInput({ stock: 5 })).expect(201))
      .body.data;
    rare = (
      await admin
        .post("/v1/admin/products")
        .send(productInput({ stock: 1, editionSize: 8, price: 70_000_000_000 }))
        .expect(201)
    ).body.data;
  });
  afterAll(async () => {
    await t.close();
  });

  const place = (agent: TestAgent, items: object[]) =>
    agent.post("/v1/orders").send({ items, shipping });

  it("requires a session", async () => {
    await t.http().post("/v1/orders").send({ items: [], shipping }).expect(401);
  });

  it("prices orders on the server and reserves stock", async () => {
    const res = await place(buyer, [
      { productId: watch.id, strapId: "steel", quantity: 2, engraving: "برای همیشه", unitPrice: 1 },
    ]).expect(201);

    const line = (watch.price + 900_000_000 + ENGRAVING_PRICE) * 2;
    expect(res.body.data).toMatchObject({
      status: "pending_payment",
      subtotal: line,
      total: line,
      items: [{ quantity: 2, strapName: "دستبند استیل", engravingPrice: ENGRAVING_PRICE }],
    });
    expect(res.body.data.number).toMatch(/^KR-\d{6}$/);
    expect(await stockOf(watch.slug)).toBe(3);
  });

  it("rejects an unknown strap", async () => {
    const res = await place(buyer, [{ productId: watch.id, strapId: "rubber", quantity: 1 }]).expect(
      400,
    );
    expect(res.body.code).toBe("VALIDATION_FAILED");
  });

  it("rolls back every reservation when one line is out of stock", async () => {
    const before = await stockOf(watch.slug);
    const res = await place(buyer, [
      { productId: watch.id, strapId: "alligator", quantity: 1 },
      { productId: rare.id, strapId: "alligator", quantity: 2 },
    ]).expect(409);
    expect(res.body.code).toBe("OUT_OF_STOCK");
    expect(await stockOf(watch.slug)).toBe(before);
    expect(await stockOf(rare.slug)).toBe(1);
  });

  it("sells the last piece to exactly one of two concurrent buyers", async () => {
    const other = await t.login("09360000003");
    const results = await Promise.all([
      place(buyer, [{ productId: rare.id, strapId: "alligator", quantity: 1 }]),
      place(other, [{ productId: rare.id, strapId: "alligator", quantity: 1 }]),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await stockOf(rare.slug)).toBe(0);
  });

  it("keeps orders private to their owner", async () => {
    const created = await place(buyer, [{ productId: watch.id, strapId: "alligator", quantity: 1 }]);
    const stranger = await t.login("09360000004");
    await stranger.get(`/v1/orders/${created.body.data.id}`).expect(404);
    const mine = await stranger.get("/v1/orders").expect(200);
    expect(mine.body.data).toHaveLength(0);

    const list = await buyer.get("/v1/orders").expect(200);
    expect(list.body.meta.totalItems).toBeGreaterThanOrEqual(2);
  });

  it("pays through the gateway, refuses mismatched authorities and is idempotent", async () => {
    const order = (await place(buyer, [{ productId: watch.id, strapId: "alligator", quantity: 1 }]))
      .body.data;
    const pay = await buyer.post(`/v1/orders/${order.id}/pay`).expect(200);
    const redirect = new URL(pay.body.data.redirectUrl);
    const authority = redirect.searchParams.get("authority");
    expect(redirect.pathname).toBe("/checkout/sandbox-gateway");
    expect(authority).toMatch(/^FAKE-/);

    const forged = await buyer
      .post("/v1/orders/payments/verify")
      .send({ orderId: order.id, authority: "FAKE-forged", status: "OK" })
      .expect(400);
    expect(forged.body.code).toBe("PAYMENT_FAILED");

    const failed = await buyer
      .post("/v1/orders/payments/verify")
      .send({ orderId: order.id, authority, status: "NOK" })
      .expect(400);
    expect(failed.body.code).toBe("PAYMENT_FAILED");

    const paid = await buyer
      .post("/v1/orders/payments/verify")
      .send({ orderId: order.id, authority, status: "OK" })
      .expect(200);
    expect(paid.body.data).toMatchObject({ status: "paid" });
    expect(paid.body.data.paymentRef).toBeTruthy();

    const again = await buyer
      .post("/v1/orders/payments/verify")
      .send({ orderId: order.id, authority, status: "OK" })
      .expect(200);
    expect(again.body.data.paidAt).toBe(paid.body.data.paidAt);

    await buyer.post(`/v1/orders/${order.id}/pay`).expect(409);
    await buyer.post(`/v1/orders/${order.id}/cancel`).expect(409);
  });

  it("returns stock when the buyer cancels an unpaid order", async () => {
    const before = await stockOf(watch.slug);
    const order = (await place(buyer, [{ productId: watch.id, strapId: "alligator", quantity: 1 }]))
      .body.data;
    expect(await stockOf(watch.slug)).toBe(before - 1);
    await buyer.post(`/v1/orders/${order.id}/cancel`).expect(200);
    expect(await stockOf(watch.slug)).toBe(before);
    // A second cancel must not return the stock twice
    await buyer.post(`/v1/orders/${order.id}/cancel`).expect(409);
    expect(await stockOf(watch.slug)).toBe(before);
  });

  it("releases stock held by orders whose payment window passed", async () => {
    const before = await stockOf(watch.slug);
    const order = (await place(buyer, [{ productId: watch.id, strapId: "alligator", quantity: 1 }]))
      .body.data;

    const { getModelToken } = await import("@nestjs/mongoose");
    const orderModel = t.app.get<import("mongoose").Model<unknown>>(getModelToken("Order"));
    await orderModel.updateOne({ _id: order.id }, { $set: { expiresAt: new Date(Date.now() - 1000) } });

    await buyer.post(`/v1/orders/${order.id}/pay`).expect(409);
    expect(await stockOf(watch.slug)).toBe(before);
    const detail = await buyer.get(`/v1/orders/${order.id}`).expect(200);
    expect(detail.body.data.status).toBe("cancelled");
  });

  it("lets an admin move a paid order forward but not backwards", async () => {
    const list = await admin.get("/v1/admin/orders?status=paid").expect(200);
    const paid = list.body.data[0];
    expect(paid).toBeTruthy();

    const back = await admin
      .patch(`/v1/admin/orders/${paid.id}/status`)
      .send({ status: "pending_payment" })
      .expect(409);
    expect(back.body.message).toContain("مجاز نیست");

    await admin.patch(`/v1/admin/orders/${paid.id}/status`).send({ status: "preparing" }).expect(200);
    const shipped = await admin
      .patch(`/v1/admin/orders/${paid.id}/status`)
      .send({ status: "shipped", trackingCode: "PST-889201" })
      .expect(200);
    expect(shipped.body.data).toMatchObject({ status: "shipped", trackingCode: "PST-889201" });

    await buyer.get("/v1/admin/orders").expect(403);
  });

  it("searches orders by number for admins", async () => {
    const any = (await admin.get("/v1/admin/orders").expect(200)).body.data[0];
    const res = await admin.get(`/v1/admin/orders?search=${any.number}`).expect(200);
    expect(res.body.data).toHaveLength(1);
  });
});
