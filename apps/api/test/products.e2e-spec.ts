import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type TestAgent from "supertest/lib/agent.js";

import { productInput } from "./utils/fixtures.js";
import { createTestApp, type TestApp } from "./utils/test-app.js";

describe("products (e2e)", () => {
  let t: TestApp;
  let admin: TestAgent;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await t.login("09350000001", "admin");
    const products = [
      productInput({ slug: "alpha-tourbillon", series: "tourbillon", price: 90_000_000_000, isFeatured: true }),
      productInput({ slug: "beta-diver", series: "diver", price: 30_000_000_000, stock: 0 }),
      productInput({
        slug: "gamma-dress",
        series: "dress",
        price: 50_000_000_000,
        case: { material: "rose-gold", diameterMm: 38, thicknessMm: 7, waterResistanceM: 30 },
      }),
      productInput({ slug: "hidden-draft", isPublished: false }),
    ];
    for (const product of products) {
      await admin.post("/v1/admin/products").send(product).expect(201);
    }
  });
  afterAll(async () => {
    await t.close();
  });

  it("lists only published watches with pagination meta", async () => {
    const res = await t.http().get("/v1/products").expect(200);
    expect(res.body.meta).toEqual({ page: 1, limit: 12, totalItems: 3, totalPages: 1 });
    expect(res.body.data[0].slug).toBe("alpha-tourbillon");
    expect(res.body.data.map((p: { slug: string }) => p.slug)).not.toContain("hidden-draft");
    expect(res.body.data[0]).not.toHaveProperty("description");
  });

  it("filters by collection, material, stock and price, and sorts", async () => {
    const byCollection = await t.http().get("/v1/products?collection=diver&collection=dress");
    expect(byCollection.body.data).toHaveLength(2);

    const byMaterial = await t.http().get("/v1/products?material=rose-gold");
    expect(byMaterial.body.data.map((p: { slug: string }) => p.slug)).toEqual(["gamma-dress"]);

    const inStock = await t.http().get("/v1/products?inStock=true");
    expect(inStock.body.meta.totalItems).toBe(2);

    const priced = await t.http().get("/v1/products?minPrice=40000000000&sort=price-asc");
    expect(priced.body.data.map((p: { slug: string }) => p.slug)).toEqual([
      "gamma-dress",
      "alpha-tourbillon",
    ]);
  });

  it("treats search input as literal text, not a regex", async () => {
    const res = await t.http().get("/v1/products?search=.*").expect(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("rejects an unknown filter value", async () => {
    const res = await t.http().get("/v1/products?collection=smartwatch").expect(400);
    expect(res.body.code).toBe("VALIDATION_FAILED");
  });

  it("serves detail and related watches, hiding drafts", async () => {
    const detail = await t.http().get("/v1/products/gamma-dress").expect(200);
    expect(detail.body.data).toMatchObject({ slug: "gamma-dress", series: "dress" });
    await t.http().get("/v1/products/hidden-draft").expect(404);

    const related = await t.http().get("/v1/products/gamma-dress/related").expect(200);
    expect(related.body.data).toHaveLength(2);
  });

  it("blocks admin endpoints for guests and customers", async () => {
    await t.http().get("/v1/admin/products").expect(401);
    const customer = await t.login("09350000002");
    const res = await customer.post("/v1/admin/products").send(productInput()).expect(403);
    expect(res.body.code).toBe("FORBIDDEN");
  });

  it("lets an admin update, reject duplicate slugs and soft-delete", async () => {
    const list = await admin.get("/v1/admin/products?limit=50").expect(200);
    expect(list.body.meta.totalItems).toBe(4);
    const draft = list.body.data.find((p: { slug: string }) => p.slug === "hidden-draft");

    await admin.patch(`/v1/admin/products/${draft.id}`).send({ isPublished: true }).expect(200);
    await t.http().get("/v1/products/hidden-draft").expect(200);

    const duplicate = await admin
      .post("/v1/admin/products")
      .send(productInput({ slug: "hidden-draft" }))
      .expect(409);
    expect(duplicate.body.code).toBe("CONFLICT");

    await admin.delete(`/v1/admin/products/${draft.id}`).expect(204);
    await t.http().get("/v1/products/hidden-draft").expect(404);
    await admin.get(`/v1/admin/products/${draft.id}`).expect(404);
    await admin.get("/v1/admin/products/not-an-id").expect(404);
  });

  it("rejects a float price", async () => {
    const res = await admin
      .post("/v1/admin/products")
      .send(productInput({ price: 10.5 }))
      .expect(400);
    expect(res.body.code).toBe("VALIDATION_FAILED");
  });
});
