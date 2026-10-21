import type { Metadata } from "next";

import { AdminOrders } from "@/features/admin";
import { requireRole } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "مدیریت سفارش‌ها" };

export default async function AdminOrdersPage() {
  await requireRole("admin", paths.adminOrders);
  return <AdminOrders />;
}
