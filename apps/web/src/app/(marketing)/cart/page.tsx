import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { CartView } from "@/features/cart";

export const metadata: Metadata = { title: "سبد خرید", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
      <PageHeader title="سبد خرید" />
      <CartView />
    </div>
  );
}
