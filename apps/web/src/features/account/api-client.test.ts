import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiFetch } from "./api-client";

function json(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiFetch", () => {
  it("renews an expired session once and repeats the request", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(json(401, { message: "expired" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json(200, { data: 1 }));
    vi.stubGlobal("fetch", fetch);

    await expect(apiFetch("/watches/x/reviews/mine")).resolves.toEqual({ data: 1 });
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      "/api/watches/x/reviews/mine",
      "/api/auth/refresh",
      "/api/watches/x/reviews/mine",
    ]);
  });

  it("passes the API's Persian message through when renewal fails", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(json(401, { message: "لطفاً وارد حساب خود شوید" }))
      .mockResolvedValueOnce(json(401, {}))
      .mockResolvedValueOnce(json(401, { message: "لطفاً وارد حساب خود شوید" }));
    vi.stubGlobal("fetch", fetch);

    const error = await apiFetch("/users/me").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401, message: "لطفاً وارد حساب خود شوید" });
  });

  it("never renews before signing in", async () => {
    const fetch = vi.fn().mockResolvedValue(json(401, { message: "x" }));
    vi.stubGlobal("fetch", fetch);
    await expect(apiFetch("/auth/otp/verify", { method: "POST" })).rejects.toBeInstanceOf(ApiError);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("turns a network failure into a readable error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(apiFetch("/watches/x/reviews")).rejects.toMatchObject({ status: 0 });
  });
});
