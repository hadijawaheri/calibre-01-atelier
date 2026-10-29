import type { ApiErrorBody } from "@kronos/contracts";

const FALLBACK_MESSAGE = "ارتباط با کرونوس برقرار نشد؛ کمی بعد دوباره تلاش کنید";

/** An API failure with the Persian message the API wrote for people, safe to show as is. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: ApiErrorBody,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

async function send(path: string, init: RequestInit): Promise<Response> {
  return fetch(`/api${path}`, {
    ...init,
    credentials: "same-origin",
    headers: init.body ? { "content-type": "application/json", ...init.headers } : init.headers,
  });
}

// Routes that start or end a session; renewing the session first would make no sense for them
const NO_RENEWAL = ["/auth/otp/", "/auth/refresh", "/auth/logout"];

let refreshing: Promise<boolean> | null = null;

// The access cookie lives fifteen minutes; several requests that expire together share one refresh
function refreshSession(): Promise<boolean> {
  refreshing ??= send("/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/** Calls `/api/*` on this origin, renews an expired session once, and unwraps the JSON body. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await send(path, init);
    const renewable = !NO_RENEWAL.some((prefix) => path.startsWith(prefix));
    if (res.status === 401 && renewable && (await refreshSession())) {
      res = await send(path, init);
    }
  } catch (e: unknown) {
    throw new ApiError(0, FALLBACK_MESSAGE, undefined, { cause: e });
  }
  if (res.status === 204) return undefined as T;
  const body: unknown = await res.json().catch(() => undefined);
  if (!res.ok) {
    const error = body as ApiErrorBody | undefined;
    throw new ApiError(res.status, error?.message ?? FALLBACK_MESSAGE, error);
  }
  return body as T;
}

export function jsonBody(value: unknown): Pick<RequestInit, "body"> {
  return { body: JSON.stringify(value) };
}
