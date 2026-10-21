import { describe, expect, it } from "vitest";

import { pageWindow } from "./components/catalog-pagination";
import { catalogCache, toApiQuery } from "./search-params";

describe("catalog search params", () => {
  it("turns URL lists into repeated API keys", () => {
    const params = catalogCache.parse({
      collection: "tourbillon,chronograph",
      inStock: "true",
      q: " primo ",
    });
    const query = new URLSearchParams(toApiQuery(params));
    expect(query.getAll("collection")).toEqual(["tourbillon", "chronograph"]);
    expect(query.get("inStock")).toBe("true");
    expect(query.get("search")).toBe("primo");
    expect(query.get("sort")).toBe("featured");
  });

  it("drops unknown enum values instead of sending them to the API", () => {
    const params = catalogCache.parse({ collection: "unknown", sort: "cheapest" });
    expect(params.collection).toEqual([]);
    expect(params.sort).toBe("featured");
  });
});

describe("pageWindow", () => {
  it("shows the edges and a window around the current page", () => {
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
  });
});
