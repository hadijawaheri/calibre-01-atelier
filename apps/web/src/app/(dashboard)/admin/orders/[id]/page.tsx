import type { Metadata } from "next";

import { AdminOrderStatus } from "@/features/admin";
import { OrderDetail } from "@/features/orders";
import { getAdminOrder } from "@/features/orders/server";
import { requireRole } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "سفارش" };

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  await requireRole("admin", paths.adminOrder(id));
  const order = await getAdminOrder(id);
  return <OrderDetail order={order} actions={<AdminOrderStatus order={order} />} />;
}
