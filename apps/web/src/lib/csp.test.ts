import { describe, expect, it } from "vitest";

import { buildCsp, createNonce, CSP_RESPONSE_HEADER } from "./csp";

describe("buildCsp", () => {
  it("allows only scripts carrying this request's nonce", () => {
    const csp = buildCsp("abc", false);
    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("allows eval and the HMR socket only in development", () => {
    const csp = buildCsp("abc", true);
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("ws:");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });

  it("leaves out upgrade-insecure-requests while the policy is report-only", () => {
    expect(CSP_RESPONSE_HEADER).toBe("content-security-policy-report-only");
    expect(buildCsp("abc", false)).not.toContain("upgrade-insecure-requests");
  });

  it("keeps the Wikimedia photographs and the 3D blob URLs working", () => {
    const csp = buildCsp("abc", false);
    expect(csp).toContain("https://upload.wikimedia.org");
    expect(csp).toContain("worker-src 'self' blob:");
  });
});

describe("createNonce", () => {
  it("returns a new value for every request", () => {
    expect(createNonce()).not.toBe(createNonce());
  });
});
