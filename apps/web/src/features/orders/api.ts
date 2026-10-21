import type {
  ApiResponse,
  CreateOrderInput,
  OrderDto,
  OrderListQuery,
  PaginatedResponse,
  StartPaymentDto,
  VerifyPaymentInput,
} from "@kronos/contracts";

import { api } from "@/lib/api/client";

const toSearch = (query: Partial<OrderListQuery>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (value !== undefined && value !== "") search.set(key, String(value));
  return search.toString();
};

export const ordersApi = {
  list: (query: Partial<OrderListQuery>) =>
    api<PaginatedResponse<OrderDto>>(`/orders?${toSearch(query)}`),
  create: async (input: CreateOrderInput) =>
    (await api<ApiResponse<OrderDto>>("/orders", { method: "POST", json: input })).data,
  pay: async (id: string) =>
    (await api<ApiResponse<StartPaymentDto>>(`/orders/${id}/pay`, { method: "POST" })).data,
  cancel: async (id: string) =>
    (await api<ApiResponse<OrderDto>>(`/orders/${id}/cancel`, { method: "POST" })).data,
  verify: async (input: VerifyPaymentInput) =>
    (await api<ApiResponse<OrderDto>>("/orders/payments/verify", { method: "POST", json: input }))
      .data,
};

export const adminOrdersApi = {
  list: (query: Partial<OrderListQuery>) =>
    api<PaginatedResponse<OrderDto>>(`/admin/orders?${toSearch(query)}`),
  updateStatus: async (id: string, input: { status: OrderDto["status"]; trackingCode?: string }) =>
    (
      await api<ApiResponse<OrderDto>>(`/admin/orders/${id}/status`, {
        method: "PATCH",
        json: input,
      })
    ).data,
};
