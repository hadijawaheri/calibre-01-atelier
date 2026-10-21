"use client";

import type { OrderStatus } from "@kronos/contracts";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@kronos/contracts";
import { Search } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { ListPager } from "@/components/shared/list-pager";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge, useAdminOrders } from "@/features/orders";
import { formatDateTime, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

const ALL = "all";

export function AdminOrders() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    status: parseAsStringLiteral(ORDER_STATUSES),
    q: parseAsString.withDefault(""),
  });
  const [search, setSearch] = useState(params.q);
  const { data, isPending, isError, refetch } = useAdminOrders({
    page: params.page,
    limit: 20,
    status: params.status ?? undefined,
    search: params.q || undefined,
  });

  useEffect(() => {
    if (search === params.q) return;
    const id = window.setTimeout(() => void setParams({ q: search || null, page: null }), 350);
    return () => window.clearTimeout(id);
  }, [search, params.q, setParams]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="شماره سفارش، موبایل یا نام"
            aria-label="جستجوی سفارش"
          />
        </InputGroup>
        <Select
          value={params.status ?? ALL}
          onValueChange={(value) =>
            void setParams({ status: value === ALL ? null : (value as OrderStatus), page: null })
          }
        >
          <SelectTrigger className="sm:w-48" aria-label="وضعیت سفارش">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL}>همه‌ی وضعیت‌ها</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <Skeleton className="h-72" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : data.data.length === 0 ? (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyTitle>سفارشی پیدا نشد</EmptyTitle>
            <EmptyDescription>فیلتر یا جستجو را تغییر دهید.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="hidden border border-border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شماره</TableHead>
                  <TableHead>مشتری</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((order) => (
                  <TableRow key={order.id} className="relative">
                    <TableCell>
                      <Link
                        href={paths.adminOrder(order.id)}
                        dir="ltr"
                        className="font-mono after:absolute after:inset-0"
                      >
                        {order.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{order.shipping.fullName}</span>
                        <span dir="ltr" className="text-end text-xs text-muted-foreground">
                          {order.shipping.mobile}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatToman(order.total)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {data.data.map((order) => (
              <li key={order.id}>
                <Link
                  href={paths.adminOrder(order.id)}
                  className="flex flex-col gap-2 border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <span dir="ltr" className="font-mono text-sm">
                      {order.number}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-sm">{order.shipping.fullName}</span>
                  <span className="flex justify-between text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                    <span className="text-foreground tabular-nums">{formatToman(order.total)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ListPager meta={data.meta} onPage={(page) => void setParams({ page })} />
        </>
      )}
    </div>
  );
}
