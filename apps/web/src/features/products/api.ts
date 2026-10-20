import "server-only";

import type { ApiResponse, PaginatedResponse, ProductDto, ProductSummaryDto } from "@kronos/contracts";
import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api/parse";
import { publicApi } from "@/lib/api/server";

import type { CatalogParams } from "./search-params";
import { toApiQuery } from "./search-params";

export function listProducts(params: CatalogParams): Promise<PaginatedResponse<ProductSummaryDto>> {
  return publicApi(`/products?${toApiQuery(params)}`);
}

export async function listFeaturedProducts(limit = 4): Promise<ProductSummaryDto[]> {
  const { data } = await publicApi<PaginatedResponse<ProductSummaryDto>>(
    `/products?sort=featured&limit=${limit}`,
  );
  return data;
}

export async function getProduct(slug: string): Promise<ProductDto> {
  try {
    const { data } = await publicApi<ApiResponse<ProductDto>>(`/products/${encodeURIComponent(slug)}`);
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function listRelatedProducts(slug: string): Promise<ProductSummaryDto[]> {
  const { data } = await publicApi<ApiResponse<ProductSummaryDto[]>>(
    `/products/${encodeURIComponent(slug)}/related`,
  );
  return data;
}

/** Every published slug, for the sitemap. */
export async function listAllSlugs(): Promise<string[]> {
  const { data } = await publicApi<PaginatedResponse<ProductSummaryDto>>(`/products?limit=48`, 3600);
  return data.map((product) => product.slug);
}
