import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { CheckoutForm } from "@/features/orders";
import { requireSession } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "تسویه حساب" };

export default async function CheckoutPage() {
  const user = await requireSession(paths.checkout);
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
      <PageHeader
        title="تسویه حساب"
        description="نشانی تحویل را وارد کنید؛ پرداخت در درگاه بانکی انجام می‌شود."
      />
      <CheckoutForm user={user} />
    </div>
  );
}
