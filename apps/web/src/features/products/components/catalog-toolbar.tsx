"use client";

import type { ProductSort } from "@kronos/contracts";
import { PRODUCT_SORTS } from "@kronos/contracts";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from "@/lib/format";

import { CatalogFiltersSheet } from "./catalog-filters";
import { useCatalogParams } from "./use-catalog-params";

const SORT_LABELS: Record<ProductSort, string> = {
  featured: "پیشنهاد آتلیه",
  newest: "جدیدترین",
  "price-asc": "ارزان‌ترین",
  "price-desc": "گران‌ترین",
};

const isSort = (value: string): value is ProductSort => (PRODUCT_SORTS as readonly string[]).includes(value);

export function CatalogToolbar({ total }: { total: number }) {
  const [params, setParams] = useCatalogParams();
  const [query, setQuery] = useState(params.q);

  // Debounced search; typing never triggers one request per keystroke
  useEffect(() => {
    if (query === params.q) return;
    const id = window.setTimeout(() => void setParams({ q: query || null, page: null }), 350);
    return () => window.clearTimeout(id);
  }, [query, params.q, setParams]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {formatNumber(total)} ساعت
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <CatalogFiltersSheet total={total} />
        <InputGroup className="w-full sm:w-64">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی نام یا رفرنس"
            aria-label="جستجو در ساعت‌ها"
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="پاک کردن جستجو" onClick={() => setQuery("")}>
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <Select
          value={params.sort}
          onValueChange={(value) => isSort(value) && void setParams({ sort: value, page: null })}
        >
          <SelectTrigger className="w-40" aria-label="مرتب‌سازی">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PRODUCT_SORTS.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {SORT_LABELS[sort]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
