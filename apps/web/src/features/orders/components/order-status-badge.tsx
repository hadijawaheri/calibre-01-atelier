import type { OrderStatus } from "@kronos/contracts";
import { ORDER_STATUS_LABELS } from "@kronos/contracts";

import { Badge } from "@/components/ui/badge";

const VARIANTS: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending_payment: "outline",
  paid: "default",
  preparing: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANTS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
