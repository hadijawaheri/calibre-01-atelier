"use client";

import type { PaginationQuery, ProductInput, UpdateProductInput } from "@kronos/contracts";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { refreshCatalog } from "./actions";
import { adminProductsApi } from "./api";

export const adminProductKeys = {
  all: ["admin-products"] as const,
  list: (query: Partial<PaginationQuery>) => [...adminProductKeys.all, "list", query] as const,
};

export function useAdminProducts(query: Partial<PaginationQuery>) {
  return useQuery({
    queryKey: adminProductKeys.list(query),
    queryFn: () => adminProductsApi.list(query),
    placeholderData: keepPreviousData,
  });
}

function useCatalogMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
        refreshCatalog(),
      ]);
    },
  });
}

export const useCreateProduct = () =>
  useCatalogMutation((input: ProductInput) => adminProductsApi.create(input));

export const useUpdateProduct = () =>
  useCatalogMutation(({ id, input }: { id: string; input: UpdateProductInput }) =>
    adminProductsApi.update(id, input),
  );

export const useDeleteProduct = () =>
  useCatalogMutation((id: string) => adminProductsApi.remove(id));
