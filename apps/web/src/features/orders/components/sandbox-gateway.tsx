"use client";

import { CreditCard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

/** Stand-in for the bank page in development; the API never issues these links in production. */
export function SandboxGateway() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const authority = params.get("authority");
  const amount = Number(params.get("amount") ?? 0);

  if (!orderId || !authority) {
    return (
      <Alert variant="destructive">
        <AlertTitle>اطلاعات تراکنش ناقص است</AlertTitle>
        <AlertDescription>این صفحه فقط از مسیر پرداخت سفارش باز می‌شود.</AlertDescription>
      </Alert>
    );
  }

  const finish = (status: "OK" | "NOK") => {
    const search = new URLSearchParams({ orderId, authority, status });
    router.replace(`${paths.checkoutCallback}?${search.toString()}`);
  };

  return (
    <Card className="w-full max-w-md rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="size-5 text-gold" />
          درگاه آزمایشی
        </CardTitle>
        <CardDescription>محیط توسعه: هیچ پولی جابه‌جا نمی‌شود.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">مبلغ</span>
        <span className="font-display text-4xl tabular-nums">{formatToman(amount)}</span>
        <span dir="ltr" className="truncate text-start font-mono text-xs text-muted-foreground">
          {authority}
        </span>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button className="flex-1" onClick={() => finish("OK")}>
          پرداخت موفق
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => finish("NOK")}>
          انصراف
        </Button>
      </CardFooter>
    </Card>
  );
}
