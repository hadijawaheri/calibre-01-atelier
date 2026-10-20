import { createSerializer } from "nuqs/server";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatNumber } from "@/lib/format";
import { paths } from "@/lib/paths";

import type { CatalogParams } from "../search-params";
import { catalogParsers } from "../search-params";

const serialize = createSerializer(catalogParsers);

/** Pages to show: first, last and a window around the current one; null marks a gap. */
export function pageWindow(current: number, total: number): Array<number | null> {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index) => {
    const previous = sorted[index - 1];
    return previous !== undefined && page - previous > 1 ? [null, page] : [page];
  });
}

export function CatalogPagination({ params, totalPages }: { params: CatalogParams; totalPages: number }) {
  if (totalPages <= 1) return null;
  const current = Math.min(params.page, totalPages);
  const href = (page: number) => serialize(paths.watches, { ...params, page: page === 1 ? null : page });

  return (
    <Pagination>
      <PaginationContent>
        {current > 1 && (
          <PaginationItem>
            <PaginationPrevious href={href(current - 1)} />
          </PaginationItem>
        )}
        {pageWindow(current, totalPages).map((page, index) =>
          page === null ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={href(page)} isActive={page === current}>
                {formatNumber(page)}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {current < totalPages && (
          <PaginationItem>
            <PaginationNext href={href(current + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
