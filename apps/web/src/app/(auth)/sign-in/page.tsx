import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { SignInForm } from "@/features/auth";

export const metadata: Metadata = { title: "ورود", robots: { index: false } };

export default function SignInPage() {
  return (
    <div className="flex justify-center px-4 py-20 studio-light">
      <Suspense fallback={<Skeleton className="h-80 w-full max-w-sm" />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
