"use client";

import type { PageMeta } from "@kronos/contracts";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";

export function ListPager({ meta, onPage }: { meta: PageMeta; onPage: (page: number) => void }) {
  if (meta.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <Button
        variant="outline"
        size="sm"
        disabled={meta.page <= 1}
        onClick={() => onPage(meta.page - 1)}
      >
        <ChevronLeft data-icon="inline-start" className="rtl:rotate-180" />
        قبلی
      </Button>
      <span className="text-muted-foreground tabular-nums">
        صفحه‌ی {formatNumber(meta.page)} از {formatNumber(meta.totalPages)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPage(meta.page + 1)}
      >
        بعدی
        <ChevronRight data-icon="inline-end" className="rtl:rotate-180" />
      </Button>
    </div>
  );
}
