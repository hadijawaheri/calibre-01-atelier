import "server-only";

import type { ApiResponse, ProductDto } from "@kronos/contracts";
import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api/parse";
import { serverApi } from "@/lib/api/server";

export async function getAdminProduct(id: string): Promise<ProductDto> {
  try {
    return (await serverApi<ApiResponse<ProductDto>>(`/admin/products/${encodeURIComponent(id)}`))
      .data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
}
