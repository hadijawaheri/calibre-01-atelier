import type { CaseMaterial, ProductSummaryDto } from "@kronos/contracts";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { WatchRender } from "./watch-render";

interface ProductMediaProps {
  product: Pick<ProductSummaryDto, "name" | "images" | "appearance"> & { caseMaterial: CaseMaterial };
  /** Index into `images`; falls back to the procedural render when missing */
  index?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProductMedia({ product, index = 0, sizes, priority, className }: ProductMediaProps) {
  const src = product.images[index];
  return (
    <div className={cn("relative aspect-square", className)}>
      {src ? (
        <Image
          src={src}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain drop-shadow-2xl"
        />
      ) : (
        <WatchRender
          dial={product.appearance.dial}
          accent={product.appearance.accent}
          layout={product.appearance.layout}
          material={product.caseMaterial}
          label={product.name}
          className="p-[6%]"
        />
      )}
    </div>
  );
}
