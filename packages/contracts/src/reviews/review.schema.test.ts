import { describe, expect, it } from "vitest";

import { adminReviewsQuerySchema, reviewInputSchema, watchSlugSchema } from "./review.schema";

const text = "یک ساعت خوش‌دست که هر روز به مچ می‌رود.";

describe("reviewInputSchema", () => {
  it("trims the text and defaults ownership to null", () => {
    expect(reviewInputSchema.parse({ rating: 4, text: `  ${text}  ` })).toEqual({
      rating: 4,
      text,
      ownership: null,
    });
  });

  it.each([0, 6, 3.5, "4"])("rejects the rating %s", (rating) => {
    expect(reviewInputSchema.safeParse({ rating, text }).success).toBe(false);
  });

  it("rejects a text shorter than twenty letters once trimmed", () => {
    const result = reviewInputSchema.safeParse({ rating: 5, text: "  عالی است  " });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown ownership", () => {
    expect(reviewInputSchema.safeParse({ rating: 5, text, ownership: "x" }).success).toBe(false);
  });
});

describe("watchSlugSchema", () => {
  it.each(["omega-speedmaster", "rolex-gmt-master-1675"])("accepts %s", (slug) => {
    expect(watchSlugSchema.parse(slug)).toBe(slug);
  });
  it.each(["Omega", "-omega", "omega--x", "a/b", ""])("rejects %s", (slug) => {
    expect(watchSlugSchema.safeParse(slug).success).toBe(false);
  });
});

describe("adminReviewsQuerySchema", () => {
  it("lists the pending queue by default", () => {
    expect(adminReviewsQuerySchema.parse({})).toMatchObject({ status: "pending", page: 1 });
  });
});
