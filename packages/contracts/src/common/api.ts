export interface PageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}

export const COOKIE_NAMES = {
  access: "access_token",
  refresh: "refresh_token",
} as const;
