"use client";

import { MAX_QUANTITY_PER_ITEM } from "@kronos/contracts";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProductMedia } from "@/features/products";
import { formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import type { CartLine } from "../store";
import { linePrice, useCart } from "../store";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);

  return (
    <li className="flex gap-4 py-5">
      <div className="studio-light bg-surface border-border size-24 shrink-0 border">
        <ProductMedia
          product={{ name: line.name, images: line.image ? [line.image] : [], appearance: line.appearance, caseMaterial: line.caseMaterial }}
          sizes="96px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={paths.watch(line.slug)} onClick={onNavigate} className="font-display truncate text-lg hover:underline">
          {line.name}
        </Link>
        <p className="text-muted-foreground font-mono text-xs" dir="ltr">
          {line.reference}
        </p>
        <p className="text-muted-foreground text-xs">بند: {line.strapName}</p>
        {line.engraving && (
          <p className="text-muted-foreground text-xs">
            حکاکی: <span className="text-foreground">«{line.engraving}»</span>
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="border-border flex items-center border" role="group" aria-label={`تعداد ${line.name}`}>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="کم کردن"
              disabled={line.quantity <= 1}
              onClick={() => setQuantity(line.key, line.quantity - 1)}
            >
              <Minus />
            </Button>
            <output className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {formatNumber(line.quantity)}
            </output>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="افزودن"
              disabled={line.quantity >= MAX_QUANTITY_PER_ITEM}
              onClick={() => setQuantity(line.key, line.quantity + 1)}
            >
              <Plus />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm tabular-nums">{formatToman(linePrice(line))}</span>
            <Button variant="ghost" size="icon-sm" aria-label={`حذف ${line.name}`} onClick={() => remove(line.key)}>
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
