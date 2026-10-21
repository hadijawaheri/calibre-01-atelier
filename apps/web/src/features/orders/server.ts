import "server-only";

import type { ApiResponse, OrderDto } from "@kronos/contracts";
import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api/parse";
import { serverApi } from "@/lib/api/server";

async function orNotFound<T>(request: Promise<T>): Promise<T> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function getMyOrder(id: string): Promise<OrderDto> {
  return (await orNotFound(serverApi<ApiResponse<OrderDto>>(`/orders/${encodeURIComponent(id)}`)))
    .data;
}

export async function getAdminOrder(id: string): Promise<OrderDto> {
  return (
    await orNotFound(serverApi<ApiResponse<OrderDto>>(`/admin/orders/${encodeURIComponent(id)}`))
  ).data;
}
