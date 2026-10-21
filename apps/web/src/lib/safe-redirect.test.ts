import { describe, expect, it } from "vitest";

import { safeRedirect } from "./safe-redirect";

describe("safeRedirect", () => {
  it("keeps internal paths", () => {
    expect(safeRedirect("/account/orders?page=2")).toBe("/account/orders?page=2");
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "", null, undefined])(
    "falls back for %s",
    (next) => {
      expect(safeRedirect(next)).toBe("/account");
    },
  );
});
