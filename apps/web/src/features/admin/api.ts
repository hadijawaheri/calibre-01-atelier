import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  ProductDto,
  ProductInput,
  UpdateProductInput,
} from "@kronos/contracts";

import { api } from "@/lib/api/client";

export const adminProductsApi = {
  list: (query: Partial<PaginationQuery>) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
      if (value !== undefined && value !== "") search.set(key, String(value));
    return api<PaginatedResponse<ProductDto>>(`/admin/products?${search.toString()}`);
  },
  create: async (input: ProductInput) =>
    (await api<ApiResponse<ProductDto>>("/admin/products", { method: "POST", json: input })).data,
  update: async (id: string, input: UpdateProductInput) =>
    (await api<ApiResponse<ProductDto>>(`/admin/products/${id}`, { method: "PATCH", json: input }))
      .data,
  remove: (id: string) => api<void>(`/admin/products/${id}`, { method: "DELETE" }),
};
