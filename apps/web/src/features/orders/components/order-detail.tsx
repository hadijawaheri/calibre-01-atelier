import type { OrderDto } from "@kronos/contracts";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartSummary } from "@/features/cart";
import { formatDateTime } from "@/lib/format";

import { OrderItems } from "./order-items";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderDetailProps {
  order: OrderDto;
  /** Customer or admin controls rendered beside the status */
  actions?: ReactNode;
}

export function OrderDetail({ order, actions }: OrderDetailProps) {
  const { shipping } = order;
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <Card className="rounded-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-3">
              <span dir="ltr" className="font-mono">
                {order.number}
              </span>
              <OrderStatusBadge status={order.status} />
            </CardTitle>
            <p className="text-xs text-muted-foreground">ثبت: {formatDateTime(order.createdAt)}</p>
          </div>
          {actions}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <OrderItems order={order} />
          <CartSummary subtotal={order.total} />
        </CardContent>
      </Card>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>تحویل</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ["تحویل‌گیرنده", shipping.fullName],
              [
                "موبایل",
                <span key="m" dir="ltr">
                  {shipping.mobile}
                </span>,
              ],
              ["نشانی", `${shipping.province}، ${shipping.city}، ${shipping.address}`],
              [
                "کد پستی",
                <span key="p" dir="ltr" className="font-mono">
                  {shipping.postalCode}
                </span>,
              ],
              ...(order.trackingCode
                ? [
                    [
                      "کد رهگیری مرسوله",
                      <span key="t" dir="ltr" className="font-mono">
                        {order.trackingCode}
                      </span>,
                    ],
                  ]
                : []),
              ...(order.paidAt ? [["پرداخت", formatDateTime(order.paidAt)]] : []),
              ...(order.note ? [["توضیح", order.note]] : []),
            ].map(([term, value]) => (
              <div key={String(term)} className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">{term}</dt>
                <dd className="leading-6">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
