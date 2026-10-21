"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ShippingAddressInput, UserDto } from "@kronos/contracts";
import { shippingAddressSchema } from "@kronos/contracts";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CartSummary, cartTotal, useCart, useCartHydrated } from "@/features/cart";
import { fieldIssues, getErrorMessage } from "@/lib/api/parse";
import { formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import { useCreateOrder, usePayOrder } from "../queries";

type ShippingField = keyof ShippingAddressInput;

const FIELDS: Array<{
  name: ShippingField;
  label: string;
  autoComplete: string;
  ltr?: boolean;
  inputMode?: "numeric" | "tel";
  wide?: boolean;
  multiline?: boolean;
}> = [
  { name: "fullName", label: "نام و نام خانوادگی تحویل‌گیرنده", autoComplete: "name", wide: true },
  { name: "mobile", label: "شماره موبایل", autoComplete: "tel", ltr: true, inputMode: "tel" },
  {
    name: "postalCode",
    label: "کد پستی ۱۰ رقمی",
    autoComplete: "postal-code",
    ltr: true,
    inputMode: "numeric",
  },
  { name: "province", label: "استان", autoComplete: "address-level1" },
  { name: "city", label: "شهر", autoComplete: "address-level2" },
  {
    name: "address",
    label: "نشانی کامل",
    autoComplete: "street-address",
    wide: true,
    multiline: true,
  },
];

export function CheckoutForm({ user }: { user: UserDto }) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCart((state) => state.lines);
  const clear = useCart((state) => state.clear);
  const createOrder = useCreateOrder();
  const payOrder = usePayOrder();
  const [note, setNote] = useState("");

  const form = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
      mobile: user.mobile,
      province: "",
      city: "",
      address: "",
      postalCode: "",
    },
  });

  const busy = createOrder.isPending || payOrder.isPending || payOrder.isSuccess;

  const onSubmit = form.handleSubmit(async (shipping) => {
    try {
      const order = await createOrder.mutateAsync({
        shipping,
        note,
        items: lines.map((line) => ({
          productId: line.productId,
          strapId: line.strapId,
          quantity: line.quantity,
          engraving: line.engraving,
        })),
      });
      // Stock is now reserved for this order; the cart has done its job
      clear();
      payOrder.mutate(order.id, {
        onError: (error) => {
          toast.error(getErrorMessage(error));
          router.push(paths.order(order.id));
        },
      });
    } catch (error) {
      const issues = fieldIssues(error).filter((issue) => issue.path.startsWith("shipping."));
      for (const issue of issues) {
        form.setError(issue.path.replace("shipping.", "") as ShippingField, {
          message: issue.message,
        });
      }
      toast.error(getErrorMessage(error));
    }
  });

  if (!hydrated) return <Skeleton className="h-96" />;

  if (lines.length === 0 && !busy) {
    return (
      <Empty className="border border-border py-16">
        <EmptyHeader>
          <EmptyTitle>سبد خرید خالی است</EmptyTitle>
          <EmptyDescription>برای ثبت سفارش، اول ساعتی به سبد اضافه کنید.</EmptyDescription>
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
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]"
    >
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>نشانی تحویل</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-6 sm:grid-cols-2">
            {FIELDS.map(({ name, label, autoComplete, ltr, inputMode, wide, multiline }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={wide ? "sm:col-span-2" : undefined}
                  >
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    {multiline ? (
                      <Textarea
                        {...field}
                        id={name}
                        autoComplete={autoComplete}
                        rows={3}
                        aria-invalid={fieldState.invalid}
                      />
                    ) : (
                      <Input
                        {...field}
                        id={name}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        dir={ltr ? "ltr" : undefined}
                        className={ltr ? "text-start" : undefined}
                        aria-invalid={fieldState.invalid}
                      />
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="note">توضیح برای آتلیه (اختیاری)</FieldLabel>
              <Textarea
                id="note"
                value={note}
                maxLength={500}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="rounded-none lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle>سفارش شما</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ul className="flex flex-col gap-2 text-sm">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4">
                <span className="truncate">
                  {line.name}
                  {line.quantity > 1 && (
                    <span className="text-muted-foreground"> × {formatNumber(line.quantity)}</span>
                  )}
                </span>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {formatToman((line.unitPrice + line.strapPrice) * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <CartSummary subtotal={cartTotal(lines)} />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? (
              <Spinner data-icon="inline-start" aria-label="در حال انتقال" />
            ) : (
              <Lock data-icon="inline-start" />
            )}
            ثبت سفارش و پرداخت
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            موجودی تا ۳۰ دقیقه برای شما رزرو می‌شود. پرداخت در درگاه امن بانکی انجام می‌شود.
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
