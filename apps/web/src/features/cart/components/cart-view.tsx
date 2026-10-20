"use client";

import { ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/lib/paths";

import { cartTotal, useCart } from "../store";
import { useCartHydrated } from "../use-cart-hydrated";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const hydrated = useCartHydrated();
  const lines = useCart((state) => state.lines);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <Empty className="border-border border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingBag />
          </EmptyMedia>
          <EmptyTitle>سبد خرید خالی است</EmptyTitle>
          <EmptyDescription>هر ساعت آتلیه با جعبه‌ی چوب گردو، گواهی اصالت و ضمانت پنج‌ساله ارسال می‌شود.</EmptyDescription>
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
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="divide-border border-border divide-y border-y">
        {lines.map((line) => (
          <CartLineItem key={line.key} line={line} />
        ))}
      </ul>
      <Card className="rounded-none lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle>خلاصه‌ی سفارش</CardTitle>
        </CardHeader>
        <CardContent>
          <CartSummary subtotal={cartTotal(lines)} />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
          <Button asChild size="lg">
            <Link href={paths.checkout}>ادامه و ثبت نشانی</Link>
          </Button>
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <ShieldCheck className="text-gold size-4" />
            قیمت نهایی هنگام ثبت سفارش از انبار آتلیه تأیید می‌شود.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
