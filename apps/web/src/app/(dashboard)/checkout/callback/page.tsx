import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { PaymentCallback } from "@/features/orders";
import { requireSession } from "@/lib/auth/dal";
import { paths } from "@/lib/paths";

export const metadata: Metadata = { title: "نتیجه‌ی پرداخت" };

export default async function PaymentCallbackPage() {
  await requireSession(paths.checkoutCallback);
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Suspense fallback={<Spinner className="mx-auto" />}>
        <PaymentCallback />
      </Suspense>
    </div>
  );
}
