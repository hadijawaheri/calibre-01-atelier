import { COLLECTION_LABELS } from "@kronos/contracts";
import type { Metadata } from "next";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PurchasePanel } from "@/features/cart";
import { ProductGallery, ProductGrid, ProductJsonLd, ProductSpecs } from "@/features/products";
import { getProduct, listRelatedProducts } from "@/features/products/api";
import { paths } from "@/lib/paths";

export async function generateMetadata({
  params,
}: PageProps<"/watches/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return {
    title: product.name,
    description: product.tagline || product.description.slice(0, 150),
    alternates: { canonical: paths.watch(product.slug) },
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function WatchPage({ params }: PageProps<"/watches/[slug]">) {
  const { slug } = await params;
  const [product, related] = await Promise.all([
    getProduct(slug),
    listRelatedProducts(slug).catch(() => []),
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 py-8 sm:px-6">
      <ProductJsonLd product={product} />
      <div className="flex flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={paths.watches}>ساعت‌ها</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`${paths.watches}?collection=${product.series}`}>
                  {COLLECTION_LABELS[product.series]}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery product={product} />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">{COLLECTION_LABELS[product.series]}</p>
              <h1 className="font-display text-4xl leading-tight md:text-5xl">{product.name}</h1>
              <p dir="ltr" className="text-end font-mono text-sm text-muted-foreground">
                {product.nameEn} · {product.reference}
              </p>
              {product.tagline && <p className="text-lg leading-8">{product.tagline}</p>}
            </div>
            <PurchasePanel product={product} />
          </div>
        </div>
      </div>

      <section className="grid gap-12 lg:grid-cols-2" aria-labelledby="story">
        <div className="flex flex-col gap-6">
          <h2 id="story" className="font-display text-3xl">
            درباره‌ی این ساعت
          </h2>
          <p className="leading-8 text-muted-foreground">{product.description}</p>
          {product.highlights.length > 0 && (
            <ul className="flex flex-col gap-3">
              {product.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-3xl">مشخصات فنی</h2>
          <ProductSpecs product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="flex flex-col gap-10" aria-labelledby="related">
          <h2 id="related" className="font-display text-3xl">
            از همین خانواده
          </h2>
          <ProductGrid products={related.slice(0, 3)} />
        </section>
      )}
    </div>
  );
}
