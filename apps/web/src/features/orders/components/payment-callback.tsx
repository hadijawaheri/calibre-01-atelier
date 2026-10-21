"use client";

import type { OrderDto } from "@kronos/contracts";
import { CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api/parse";
import { formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import { usePayOrder, useVerifyPayment } from "../queries";

function Paid({ order }: { order: OrderDto }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-success">
          <CircleCheck />
        </EmptyMedia>
        <EmptyTitle className="font-display text-3xl font-normal">سفارش شما ثبت شد</EmptyTitle>
        <EmptyDescription>
          سفارش{" "}
          <span dir="ltr" className="font-mono">
            {order.number}
          </span>{" "}
          به مبلغ {formatToman(order.total)} پرداخت شد.
          {order.paymentRef && (
            <>
              {" "}
              کد پیگیری بانک:{" "}
              <span dir="ltr" className="font-mono">
                {order.paymentRef}
              </span>
            </>
          )}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button asChild>
          <Link href={paths.order(order.id)}>جزئیات سفارش</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={paths.watches}>ادامه‌ی گشت‌وگذار</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function PaymentCallback() {
  const params = useSearchParams();
  const verify = useVerifyPayment();
  const pay = usePayOrder();
  const started = useRef(false);
  const orderId = params.get("orderId") ?? "";
  const authority = params.get("authority") ?? "";
  const status = params.get("status") === "OK" ? "OK" : "NOK";

  useEffect(() => {
    // Strict Mode mounts twice in development; the API is idempotent but one call is enough
    if (started.current || !orderId || !authority) return;
    started.current = true;
    verify.mutate({ orderId, authority, status });
  }, [orderId, authority, status, verify]);

  if (verify.isSuccess) return <Paid order={verify.data} />;

  if (verify.isError || !orderId || !authority) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="text-destructive">
            <CircleX />
          </EmptyMedia>
          <EmptyTitle className="font-display text-3xl font-normal">پرداخت تکمیل نشد</EmptyTitle>
          <EmptyDescription>
            {verify.isError ? getErrorMessage(verify.error) : "اطلاعات بازگشت از درگاه ناقص است."}{" "}
            اگر مبلغی از حساب شما کم شده، تا ۷۲ ساعت به حساب برمی‌گردد.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          {orderId && (
            <Button disabled={pay.isPending || pay.isSuccess} onClick={() => pay.mutate(orderId)}>
              {pay.isPending && <Spinner data-icon="inline-start" aria-label="در حال انتقال" />}
              تلاش دوباره برای پرداخت
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href={paths.orders}>سفارش‌های من</Link>
          </Button>
        </EmptyContent>
        {pay.isError && <p className="text-sm text-destructive">{getErrorMessage(pay.error)}</p>}
      </Empty>
    );
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner aria-label="در حال بررسی پرداخت" />
        </EmptyMedia>
        <EmptyTitle>در حال تأیید پرداخت با بانک…</EmptyTitle>
        <EmptyDescription>لطفاً این صفحه را نبندید.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
