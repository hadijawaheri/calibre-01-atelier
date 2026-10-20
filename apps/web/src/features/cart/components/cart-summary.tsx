import { Separator } from "@/components/ui/separator";
import { formatToman } from "@/lib/format";

export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <dl className="flex flex-col gap-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">جمع کالاها</dt>
        <dd className="tabular-nums">{formatToman(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">ارسال بیمه‌شده با پیک اختصاصی</dt>
        <dd className="text-success">رایگان</dd>
      </div>
      <Separator />
      <div className="flex justify-between text-base">
        <dt>مبلغ قابل پرداخت</dt>
        <dd className="font-medium tabular-nums">{formatToman(subtotal)}</dd>
      </div>
    </dl>
  );
}
