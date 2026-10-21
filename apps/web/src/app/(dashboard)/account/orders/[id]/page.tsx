import type { Metadata } from "next";

import { OrderActions, OrderDetail } from "@/features/orders";
import { getMyOrder } from "@/features/orders/server";
import { requireSession } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "جزئیات سفارش" };

export default async function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  await requireSession(paths.order(id));
  const order = await getMyOrder(id);
  return <OrderDetail order={order} actions={<OrderActions order={order} />} />;
}
