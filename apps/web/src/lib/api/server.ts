import "server-only";

import { cookies } from "next/headers";

import { env } from "../env";
import { parseResponse } from "./parse";

/** Personal data: forwards the session cookies and never caches. */
export async function serverApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${env.INTERNAL_API_URL}/v1${path}`, {
    ...init,
    headers: { cookie: cookieHeader, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

/** Public catalogue data: no cookies, shared cache revalidated in the background. */
export async function publicApi<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${env.INTERNAL_API_URL}/v1${path}`, {
    next: { revalidate, tags: ["catalog"] },
  });
  return parseResponse<T>(res);
}
