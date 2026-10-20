import { describe, expect, it } from "vitest";

import { productListQuerySchema } from "../products/products.schema";
import { createOrderSchema } from "./orders.schema";

const shipping = {
  fullName: "آرش کاظمی",
  mobile: "۰۹۱۲۱۲۳۴۵۶۷",
  province: "تهران",
  city: "تهران",
  address: "خیابان ولیعصر، کوچه نهم، پلاک ۱۲",
  postalCode: "1234567890",
};

describe("createOrderSchema", () => {
  it("normalizes digits and defaults engraving and note", () => {
    const parsed = createOrderSchema.parse({
      items: [{ productId: "a".repeat(24), strapId: "alligator", quantity: 1 }],
      shipping,
    });
    expect(parsed.shipping.mobile).toBe("09121234567");
    expect(parsed.items[0]?.engraving).toBe("");
    expect(parsed.note).toBe("");
  });

  it("strips unknown fields such as a client-sent price", () => {
    const parsed = createOrderSchema.parse({
      items: [{ productId: "b".repeat(24), strapId: "steel", quantity: 1, unitPrice: 1 }],
      shipping,
      total: 1,
    });
    expect(parsed).not.toHaveProperty("total");
    expect(parsed.items[0]).not.toHaveProperty("unitPrice");
  });

  it("rejects an empty cart and excessive quantity", () => {
    expect(createOrderSchema.safeParse({ items: [], shipping }).success).toBe(false);
    expect(
      createOrderSchema.safeParse({
        items: [{ productId: "c".repeat(24), strapId: "steel", quantity: 5 }],
        shipping,
      }).success,
    ).toBe(false);
  });

  it("rejects an engraving longer than 24 characters", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: "c".repeat(24), strapId: "steel", quantity: 1, engraving: "x".repeat(25) }],
      shipping,
    });
    expect(result.success).toBe(false);
  });
});

describe("productListQuerySchema", () => {
  it("coerces query strings and wraps single enum values", () => {
    const parsed = productListQuerySchema.parse({
      page: "2",
      collection: "tourbillon",
      material: ["steel", "titanium"],
      inStock: "true",
    });
    expect(parsed).toMatchObject({
      page: 2,
      limit: 12,
      collection: ["tourbillon"],
      material: ["steel", "titanium"],
      inStock: true,
      sort: "featured",
    });
  });

  it("rejects unknown collections", () => {
    expect(productListQuerySchema.safeParse({ collection: "smart" }).success).toBe(false);
  });
});
