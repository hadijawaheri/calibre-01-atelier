"use client";

import type { ProductDto } from "@kronos/contracts";
import { COLLECTION_LABELS } from "@kronos/contracts";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/shared/error-state";
import { ListPager } from "@/components/shared/list-pager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/api/parse";
import { formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import { useAdminProducts, useDeleteProduct } from "../queries";

function DeleteProduct({ product }: { product: ProductDto }) {
  const remove = useDeleteProduct();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`حذف ${product.name}`}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>«{product.name}» حذف شود؟</AlertDialogTitle>
          <AlertDialogDescription>
            محصول از فروشگاه برداشته می‌شود. سفارش‌های قبلی آن دست‌نخورده می‌مانند.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>انصراف</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              remove.mutate(product.id, {
                onSuccess: () => toast.success("محصول حذف شد"),
                onError: (error) => toast.error(getErrorMessage(error)),
              })
            }
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StatusBadges({ product }: { product: ProductDto }) {
  return (
    <div className="flex flex-wrap gap-1">
      {!product.isPublished && <Badge variant="secondary">پیش‌نویس</Badge>}
      {product.isFeatured && <Badge variant="outline">برگزیده</Badge>}
      {product.stock === 0 && <Badge variant="destructive">ناموجود</Badge>}
    </div>
  );
}

export function AdminProducts() {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    q: parseAsString.withDefault(""),
  });
  const [search, setSearch] = useState(params.q);
  const { data, isPending, isError, refetch } = useAdminProducts({
    page: params.page,
    limit: 20,
    search: params.q || undefined,
  });

  useEffect(() => {
    if (search === params.q) return;
    const id = window.setTimeout(() => void setParams({ q: search || null, page: null }), 350);
    return () => window.clearTimeout(id);
  }, [search, params.q, setParams]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="نام یا رفرنس"
            aria-label="جستجوی محصول"
          />
        </InputGroup>
        <Button asChild>
          <Link href={paths.adminNewProduct}>
            <Plus data-icon="inline-start" />
            محصول تازه
          </Link>
        </Button>
      </div>

      {isPending ? (
        <Skeleton className="h-72" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : data.data.length === 0 ? (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyTitle>محصولی پیدا نشد</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="hidden border border-border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام</TableHead>
                  <TableHead>کلکسیون</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>موجودی</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>
                    <span className="sr-only">عملیات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span
                          dir="ltr"
                          className="text-end font-mono text-xs text-muted-foreground"
                        >
                          {product.reference}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{COLLECTION_LABELS[product.series]}</TableCell>
                    <TableCell className="tabular-nums">{formatToman(product.price)}</TableCell>
                    <TableCell className="tabular-nums">{formatNumber(product.stock)}</TableCell>
                    <TableCell>
                      <StatusBadges product={product} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={paths.adminProduct(product.id)}
                            aria-label={`ویرایش ${product.name}`}
                          >
                            <Pencil />
                          </Link>
                        </Button>
                        <DeleteProduct product={product} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {data.data.map((product) => (
              <li
                key={product.id}
                className="flex items-start justify-between gap-3 border border-border p-4"
              >
                <Link href={paths.adminProduct(product.id)} className="flex flex-col gap-1">
                  <span>{product.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatToman(product.price)} · موجودی {formatNumber(product.stock)}
                  </span>
                  <StatusBadges product={product} />
                </Link>
                <DeleteProduct product={product} />
              </li>
            ))}
          </ul>
          <ListPager meta={data.meta} onPage={(page) => void setParams({ page })} />
        </>
      )}
    </div>
  );
}
