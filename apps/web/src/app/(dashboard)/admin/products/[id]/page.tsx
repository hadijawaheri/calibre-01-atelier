import type { Metadata } from "next";

import { ProductForm } from "@/features/admin";
import { getAdminProduct } from "@/features/admin/server";
import { requireRole } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "ویرایش محصول" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  await requireRole("admin", paths.adminProduct(id));
  return <ProductForm product={await getAdminProduct(id)} />;
}
