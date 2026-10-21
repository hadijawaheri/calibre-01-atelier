import type { OrderDto } from "@kronos/contracts";
import Link from "next/link";

import { formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

export function OrderItems({ order }: { order: OrderDto }) {
  return (
    <ul className="divide-y divide-border">
      {order.items.map((item, index) => (
        <li
          key={`${item.productId}-${index}`}
          className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <Link href={paths.watch(item.slug)} className="font-display text-lg hover:underline">
              {item.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              <span dir="ltr" className="font-mono">
                {item.reference}
              </span>{" "}
              · {item.strapName}
              {item.engraving && <> · حکاکی «{item.engraving}»</>} · {formatNumber(item.quantity)}{" "}
              عدد
            </span>
          </div>
          <span className="tabular-nums">{formatToman(item.lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}
