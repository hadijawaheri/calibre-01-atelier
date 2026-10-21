import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  catalogCache,
  CatalogFilters,
  CatalogPagination,
  CatalogResults,
  CatalogToolbar,
  CatalogTransitionProvider,
  ClearFiltersButton,
  ProductGrid,
} from "@/features/products";
import { listProducts } from "@/features/products/api";

export const metadata: Metadata = {
  title: "ساعت‌ها",
  description:
    "کلکسیون کامل ساعت‌های مکانیکی آتلیه کرونوس: توربیون، کرونوگراف، هریتیج، غواصی و رسمی.",
};

export default async function WatchesPage({ searchParams }: PageProps<"/watches">) {
  const params = catalogCache.parse(await searchParams);
  const { data, meta } = await listProducts(params);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="کلکسیون"
        title="ساعت‌های آتلیه"
        description="هر مدل با موتور مکانیکی دست‌مونتاژ، ضمانت پنج‌ساله و ارسال بیمه‌شده."
      />
      <CatalogTransitionProvider>
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <CatalogFilters />
          <div className="flex flex-col gap-8">
            <CatalogToolbar total={meta.totalItems} />
            <CatalogResults>
              {data.length > 0 ? (
                <ProductGrid products={data} />
              ) : (
                <Empty className="border border-border py-16">
                  <EmptyHeader>
                    <EmptyTitle>ساعتی با این فیلترها نداریم</EmptyTitle>
                    <EmptyDescription>
                      چند فیلتر را بردارید یا جستجوی دیگری امتحان کنید.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <ClearFiltersButton />
                  </EmptyContent>
                </Empty>
              )}
            </CatalogResults>
            <CatalogPagination params={params} totalPages={meta.totalPages} />
          </div>
        </div>
      </CatalogTransitionProvider>
    </div>
  );
}
