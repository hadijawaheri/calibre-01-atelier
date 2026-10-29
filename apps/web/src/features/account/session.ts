import type { ApiResponse, UserDto } from "@kronos/contracts";
import { useEffect, useSyncExternalStore } from "react";

import { apiFetch } from "./api-client";

/** undefined while the first check runs, null for a guest. */
export type Session = UserDto | null | undefined;

// The session cookies are httpOnly, so the page cannot see them. This readable marker says a sign-in
// happened here, which spares every guest a request (and a 401) on each page that shows reviews.
const MARKER = "kronos_signed_in";
const MARKER_MAX_AGE = 30 * 24 * 60 * 60;

function hasMarker(): boolean {
  return document.cookie.split("; ").some((entry) => entry === `${MARKER}=1`);
}

function setMarker(on: boolean) {
  document.cookie = `${MARKER}=${on ? "1" : ""}; path=/; max-age=${on ? MARKER_MAX_AGE : 0}; samesite=lax`;
}

let current: Session;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: Session) {
  current = next;
  if (next !== undefined) setMarker(next !== null);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Asks the API who is signed in; a failure of any kind reads as a guest. */
export function loadSession(): Promise<void> {
  if (!hasMarker()) {
    set(null);
    return Promise.resolve();
  }
  loading ??= apiFetch<ApiResponse<{ user: UserDto }>>("/auth/me")
    .then(({ data }) => set(data.user))
    .catch(() => set(null))
    .finally(() => {
      loading = null;
    });
  return loading;
}

export function setSessionUser(user: UserDto | null) {
  set(user);
}

export async function signOut(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
  set(null);
}

/** One session for every component on the page, checked once when the first of them mounts. */
export function useSession(): Session {
  const session = useSyncExternalStore(
    subscribe,
    () => current,
    () => undefined,
  );
  useEffect(() => {
    if (current === undefined) void loadSession();
  }, []);
  return session;
}
