import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { buildCsp, createNonce, CSP_RESPONSE_HEADER, NONCE_HEADER } from "@/lib/csp";

export function proxy(request: NextRequest): NextResponse {
  const nonce = createNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === "development");
  // Next reads the nonce from the request's CSP header and adds it to its inline scripts
  const headers = new Headers(request.headers);
  headers.set(NONCE_HEADER, nonce);
  headers.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set(CSP_RESPONSE_HEADER, csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
