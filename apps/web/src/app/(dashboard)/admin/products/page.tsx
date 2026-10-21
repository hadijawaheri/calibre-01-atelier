import type { Metadata } from "next";

import { AdminProducts } from "@/features/admin";
import { requireRole } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "مدیریت محصولات" };

export default async function AdminProductsPage() {
  await requireRole("admin", paths.adminProducts);
  return <AdminProducts />;
}
