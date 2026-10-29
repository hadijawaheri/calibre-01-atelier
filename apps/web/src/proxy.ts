import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CALIBRES } from "@/features/movement/calibres";
import { CALIBRE_ENTRIES } from "@/features/reference/calibres";
import { WATCHES } from "@/features/reference/watches";
import { buildCsp, createNonce, CSP_RESPONSE_HEADER, NONCE_HEADER } from "@/lib/csp";

// Pages render per request for the nonce, so a page's notFound() would arrive after the (site) loading shell
// had already sent a 200. Unknown slugs are answered here instead, as a real 404 (ADR 0013).
const KNOWN_SLUGS: Record<string, ReadonlySet<string>> = {
  lab: new Set(CALIBRES.map((calibre) => calibre.slug)),
  calibres: new Set(CALIBRE_ENTRIES.map((calibre) => calibre.slug)),
  watches: new Set(WATCHES.map((watch) => watch.slug)),
};

function isUnknownEntry(pathname: string): boolean {
  const [, section, slug, ...rest] = pathname.split("/");
  const known = section ? KNOWN_SLUGS[section] : undefined;
  return Boolean(known && slug && (rest.some(Boolean) || !known.has(decodeURIComponent(slug))));
}

export function proxy(request: NextRequest): NextResponse {
  const nonce = createNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === "development");
  // Next reads the nonce from the request's CSP header and adds it to its inline scripts
  const headers = new Headers(request.headers);
  headers.set(NONCE_HEADER, nonce);
  headers.set("content-security-policy", csp);

  // No route matches this path, so Next renders the root not-found page with a 404 status
  const response = isUnknownEntry(request.nextUrl.pathname)
    ? NextResponse.rewrite(new URL("/_unknown-entry", request.url), { request: { headers } })
    : NextResponse.next({ request: { headers } });
  response.headers.set(CSP_RESPONSE_HEADER, csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
