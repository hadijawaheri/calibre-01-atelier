"use client";

import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";

import { ErrorState } from "@/components/shared/error-state";
import { ListPager } from "@/components/shared/list-pager";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import { useMyOrders } from "../queries";
import { OrderStatusBadge } from "./order-status-badge";

export function MyOrders() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const { data, isPending, isError, refetch } = useMyOrders({ page, limit: 10 });

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-20" />
        ))}
      </div>
    );
  }
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (data.data.length === 0) {
    return (
      <Empty className="border border-border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package />
          </EmptyMedia>
          <EmptyTitle>هنوز سفارشی ثبت نکرده‌اید</EmptyTitle>
          <EmptyDescription>
            سفارش‌های شما، از پرداخت تا تحویل، اینجا دیده می‌شوند.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={paths.watches}>دیدن کلکسیون</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y divide-border border border-border">
        {data.data.map((order) => (
          <li key={order.id}>
            <Link
              href={paths.order(order.id)}
              className="flex items-center gap-4 p-4 transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50"
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span dir="ltr" className="font-mono text-sm">
                    {order.number}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)} ·{" "}
                  {formatNumber(order.items.reduce((sum, item) => sum + item.quantity, 0))} ساعت
                </span>
              </div>
              <span className="text-sm tabular-nums">{formatToman(order.total)}</span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <ListPager meta={data.meta} onPage={(next) => void setPage(next)} />
    </div>
  );
}
