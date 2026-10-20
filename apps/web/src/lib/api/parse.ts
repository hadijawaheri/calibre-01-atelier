import type { ApiErrorBody, ErrorCode } from "@kronos/contracts";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const error = body as Partial<ApiErrorBody> | null;
    throw new ApiError(
      res.status,
      error?.code ?? "INTERNAL",
      error?.message ?? "خطای غیرمنتظره‌ای رخ داد",
      error?.details,
    );
  }
  return body as T;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "خطای غیرمنتظره‌ای رخ داد";
}

export interface FieldIssue {
  path: string;
  message: string;
}

export function fieldIssues(error: unknown): FieldIssue[] {
  if (!(error instanceof ApiError) || !Array.isArray(error.details)) return [];
  return error.details.filter(
    (item): item is FieldIssue =>
      typeof item === "object" && item !== null && "path" in item && "message" in item,
  );
}
