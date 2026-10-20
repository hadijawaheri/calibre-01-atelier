import { COOKIE_NAMES } from "@kronos/contracts";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_ORIGIN = process.env.INTERNAL_API_URL ?? "http://localhost:7781";
const PROTECTED_PREFIXES = ["/account", "/checkout", "/admin"];

function isProtected(pathname: string): boolean {
  // The sandbox gateway stands in for an external bank page, which needs no session
  if (pathname.startsWith("/checkout/sandbox-gateway")) return false;
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function redirectToSignIn(request: NextRequest): NextResponse {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(url);
  response.cookies.delete(COOKIE_NAMES.access);
  response.cookies.delete(COOKIE_NAMES.refresh);
  return response;
}

// Server Components cannot set cookies, so an expired access token is rotated here
async function refreshAndContinue(request: NextRequest): Promise<NextResponse> {
  const res = await fetch(`${API_ORIGIN}/v1/auth/refresh`, {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  }).catch(() => null);
  if (!res?.ok) return redirectToSignIn(request);

  const setCookies = res.headers.getSetCookie();
  const jar = new Map(request.cookies.getAll().map((cookie) => [cookie.name, cookie.value]));
  for (const line of setCookies) {
    const pair = line.split(";")[0] ?? "";
    const index = pair.indexOf("=");
    jar.set(pair.slice(0, index).trim(), pair.slice(index + 1));
  }

  // The same request must see the fresh tokens, the browser gets them via Set-Cookie
  const headers = new Headers(request.headers);
  headers.set("cookie", [...jar].map(([name, value]) => `${name}=${value}`).join("; "));
  const response = NextResponse.next({ request: { headers } });
  for (const line of setCookies) response.headers.append("set-cookie", line);
  return response;
}

// Optimistic check only: real authorization lives in the API guards and the server-side DAL
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const hasAccess = request.cookies.has(COOKIE_NAMES.access);
  const hasRefresh = request.cookies.has(COOKIE_NAMES.refresh);

  if (isProtected(pathname)) {
    if (hasAccess) return NextResponse.next();
    if (hasRefresh) return refreshAndContinue(request);
    return redirectToSignIn(request);
  }

  if (pathname === "/sign-in" && (hasAccess || hasRefresh)) {
    const next = request.nextUrl.searchParams.get("next");
    const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
    return NextResponse.redirect(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
