"use client";

import type { OrderDto, OrderListQuery } from "@kronos/contracts";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminOrdersApi, ordersApi } from "./api";

export const orderKeys = {
  all: ["orders"] as const,
  list: (query: Partial<OrderListQuery>) => [...orderKeys.all, "list", query] as const,
  admin: (query: Partial<OrderListQuery>) => [...orderKeys.all, "admin", query] as const,
};

export function useMyOrders(query: Partial<OrderListQuery>) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => ordersApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrders(query: Partial<OrderListQuery>) {
  return useQuery({
    queryKey: orderKeys.admin(query),
    queryFn: () => adminOrdersApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useCreateOrder() {
  return useMutation({ mutationFn: ordersApi.create });
}

/** Starts payment and leaves the site for the gateway. */
export function usePayOrder() {
  return useMutation({
    mutationFn: ordersApi.pay,
    onSuccess: ({ redirectUrl }) => window.location.assign(redirectUrl),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.cancel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.verify,
    onSettled: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      status: OrderDto["status"];
      trackingCode?: string;
    }) => adminOrdersApi.updateStatus(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
