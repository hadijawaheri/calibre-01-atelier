import type { Metadata } from "next";

import { ProductForm } from "@/features/admin";
import { requireRole } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "محصول تازه" };

export default async function NewProductPage() {
  await requireRole("admin", paths.adminNewProduct);
  return <ProductForm />;
}
