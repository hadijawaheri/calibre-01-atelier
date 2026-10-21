"use client";

import type { ProductDto } from "@kronos/contracts";
import { ENGRAVING_MAX_LENGTH, ENGRAVING_PRICE } from "@kronos/contracts";
import { Check, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import { useCart } from "../store";

export function PurchasePanel({ product }: { product: ProductDto }) {
  const router = useRouter();
  const id = useId();
  const add = useCart((state) => state.add);
  const [strapId, setStrapId] = useState(product.straps[0]?.id ?? "");
  const [engrave, setEngrave] = useState(false);
  const [engraving, setEngraving] = useState("");

  const strap = product.straps.find((item) => item.id === strapId) ?? product.straps[0];
  const text = engrave ? engraving.trim() : "";
  const total = product.price + (strap?.price ?? 0) + (text ? ENGRAVING_PRICE : 0);
  const soldOut = product.stock === 0;

  const addToCart = () => {
    if (!strap) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      reference: product.reference,
      image: product.images[0] ?? null,
      appearance: product.appearance,
      caseMaterial: product.case.material,
      strapId: strap.id,
      strapName: strap.name,
      unitPrice: product.price,
      strapPrice: strap.price,
      engraving: text,
    });
    toast.success(`${product.name} به سبد اضافه شد`, {
      action: { label: "تسویه حساب", onClick: () => router.push(paths.checkout) },
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <FieldSet>
        <FieldLegend variant="label">بند</FieldLegend>
        <RadioGroup value={strapId} onValueChange={setStrapId}>
          {product.straps.map((option) => (
            <FieldLabel key={option.id} htmlFor={`${id}-${option.id}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{option.name}</FieldTitle>
                  <FieldDescription>
                    {option.price > 0 ? `+ ${formatToman(option.price)}` : "بدون هزینه‌ی اضافه"}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={option.id}
                  id={`${id}-${option.id}`}
                  aria-label={option.name}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>

      <FieldSet>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={`${id}-engrave`}>
              <PenLine className="size-4 text-gold" />
              حکاکی دستی پشت قاب
            </FieldLabel>
            <FieldDescription>
              {formatToman(ENGRAVING_PRICE)}، با قلم فولادی و به دست استادکار حکاک
            </FieldDescription>
          </FieldContent>
          <Switch id={`${id}-engrave`} checked={engrave} onCheckedChange={setEngrave} />
        </Field>
        {engrave && (
          <Field>
            <FieldLabel htmlFor={`${id}-text`} className="sr-only">
              متن حکاکی
            </FieldLabel>
            <Input
              id={`${id}-text`}
              value={engraving}
              maxLength={ENGRAVING_MAX_LENGTH}
              onChange={(event) => setEngraving(event.target.value)}
              placeholder="مثلاً: برای آرش، ۱۴۰۴"
              autoComplete="off"
            />
            <FieldDescription className="tabular-nums">
              {formatNumber(engraving.length)} از {formatNumber(ENGRAVING_MAX_LENGTH)} حرف
            </FieldDescription>
          </Field>
        )}
      </FieldSet>

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">مبلغ نهایی</span>
          <span className="font-display text-3xl tabular-nums">{formatToman(total)}</span>
        </div>
        <Button
          size="lg"
          className="h-12 text-base"
          disabled={soldOut || !strap}
          onClick={addToCart}
        >
          {soldOut ? "ناموجود" : "افزودن به سبد"}
        </Button>
        <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
          {[
            "ضمانت بین‌المللی پنج‌ساله و گواهی اصالت امضاشده",
            "ارسال بیمه‌شده و رایگان با پیک اختصاصی در سراسر ایران",
            product.stock > 0 && product.stock <= 5
              ? `تنها ${formatNumber(product.stock)} عدد در انبار آتلیه`
              : "تحویل در جعبه‌ی چوب گردو با کیت نگهداری",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="size-3.5 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
