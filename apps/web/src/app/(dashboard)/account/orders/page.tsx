import type { Metadata } from "next";

import { MyOrders } from "@/features/orders";
import { requireSession } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "سفارش‌های من" };

export default async function OrdersPage() {
  await requireSession(paths.orders);
  return <MyOrders />;
}
