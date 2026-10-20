import type { ProductSummaryDto } from "@kronos/contracts";
import { CASE_MATERIAL_LABELS, COLLECTION_LABELS } from "@kronos/contracts";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatNumber, formatToman } from "@/lib/format";
import { paths } from "@/lib/paths";

import { ProductMedia } from "./product-media";

interface ProductCardProps {
  product: ProductSummaryDto;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const soldOut = product.stock === 0;
  return (
    <article className="group relative flex flex-col">
      <div className="studio-light bg-surface border-border relative overflow-hidden border transition-colors duration-500 group-hover:border-gold/40">
        <ProductMedia
          product={product}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <div className="absolute inset-x-3 top-3 flex justify-between gap-2">
          {product.editionSize ? (
            <Badge variant="outline" className="border-gold/40 text-gold bg-background/60 backdrop-blur">
              محدود به {formatNumber(product.editionSize)} عدد
            </Badge>
          ) : (
            <span />
          )}
          {soldOut && <Badge variant="secondary">ناموجود</Badge>}
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-4">
        <p className="eyebrow">{COLLECTION_LABELS[product.series]}</p>
        <h3 className="font-display text-xl leading-tight">
          <Link href={paths.watch(product.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="text-muted-foreground text-xs">
          {CASE_MATERIAL_LABELS[product.caseMaterial]} · {formatNumber(product.diameterMm)} میلی‌متر ·{" "}
          <span dir="ltr" className="font-mono">
            {product.calibre}
          </span>
        </p>
        <p className="mt-2 text-base tabular-nums">{formatToman(product.price)}</p>
      </div>
    </article>
  );
}
