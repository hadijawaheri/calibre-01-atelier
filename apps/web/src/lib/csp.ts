// Next applies the nonce from the request's CSP header to its own inline scripts
export const NONCE_HEADER = "x-nonce";

// Report-only until a week of production traffic shows no violations (ADR 0013)
const REPORT_ONLY = true;
export const CSP_RESPONSE_HEADER = REPORT_ONLY
  ? "content-security-policy-report-only"
  : "content-security-policy";

export function createNonce(): string {
  return btoa(crypto.randomUUID());
}

export function buildCsp(nonce: string, isDev: boolean): string {
  const directives = [
    "default-src 'self'",
    // strict-dynamic lets the nonced Next runtime load its chunks; React refresh needs eval in dev
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // React, Radix and the 3D canvas write style attributes, which a nonce cannot cover
    "style-src 'self' 'unsafe-inline'",
    // Licensed photographs come from Wikimedia Commons, see next.config.ts
    "img-src 'self' data: blob: https://upload.wikimedia.org https://thumb.wikimedia.org",
    "font-src 'self' data:",
    // three.js loaders read blob: and data: URLs; dev also needs the HMR socket
    `connect-src 'self' blob: data:${isDev ? " ws:" : ""}`,
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Browsers ignore it in a report-only policy and log an error saying so
    ...(isDev || REPORT_ONLY ? [] : ["upgrade-insecure-requests"]),
  ];
  return directives.join("; ");
}
