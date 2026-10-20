"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatNumber } from "@/lib/format";
import { paths } from "@/lib/paths";

import { cartCount, cartTotal, useCart } from "../store";
import { useCartHydrated } from "../use-cart-hydrated";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const hydrated = useCartHydrated();
  const lines = useCart((state) => state.lines);
  const count = hydrated ? cartCount(lines) : 0;
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`سبد خرید، ${formatNumber(count)} کالا`}>
          <ShoppingBag />
          {count > 0 && (
            <span className="bg-gold text-gold-foreground absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums">
              {formatNumber(count)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">سبد خرید</SheetTitle>
          <SheetDescription>{count > 0 ? `${formatNumber(count)} ساعت در سبد شماست` : "سبد شما خالی است"}</SheetDescription>
        </SheetHeader>
        {lines.length === 0 || !hydrated ? (
          <Empty className="flex-1">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag />
              </EmptyMedia>
              <EmptyTitle>هنوز ساعتی انتخاب نکرده‌اید</EmptyTitle>
              <EmptyDescription>کلکسیون آتلیه را ببینید و ساعت مورد علاقه‌تان را به سبد اضافه کنید.</EmptyDescription>
            </EmptyHeader>
            <Button asChild variant="outline" onClick={close}>
              <Link href={paths.watches}>دیدن ساعت‌ها</Link>
            </Button>
          </Empty>
        ) : (
          <>
            <ul className="divide-border flex-1 divide-y overflow-y-auto px-4">
              {lines.map((line) => (
                <CartLineItem key={line.key} line={line} onNavigate={close} />
              ))}
            </ul>
            <SheetFooter className="border-border border-t">
              <CartSummary subtotal={cartTotal(lines)} />
              <Button asChild size="lg" onClick={close}>
                <Link href={paths.checkout}>ادامه‌ی خرید</Link>
              </Button>
              <Button asChild variant="ghost" onClick={close}>
                <Link href={paths.cart}>مشاهده‌ی سبد</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
