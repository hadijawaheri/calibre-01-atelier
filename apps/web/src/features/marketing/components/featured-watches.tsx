import type { ProductSummaryDto } from "@kronos/contracts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/features/products";
import { paths } from "@/lib/paths";

export function FeaturedWatches({ products }: { products: ProductSummaryDto[] | null }) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-24 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">برگزیده‌ی آتلیه</p>
          <h2 className="font-display text-4xl md:text-5xl">ساعت‌هایی که امسال ساختیم</h2>
        </div>
        <Button asChild variant="link" className="px-0 text-gold">
          <Link href={paths.watches}>
            همه‌ی ساعت‌ها
            <ArrowRight data-icon="inline-end" className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
      {products ? (
        <ProductGrid products={products.slice(0, 3)} />
      ) : (
        <Alert>
          <AlertTitle>کلکسیون در دسترس نیست</AlertTitle>
          <AlertDescription>
            فهرست ساعت‌ها بارگذاری نشد. چند لحظه بعد صفحه را تازه کنید.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
