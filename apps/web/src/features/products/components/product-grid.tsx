import type { ProductSummaryDto } from "@kronos/contracts";

import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: ProductSummaryDto[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id} className="has-focus-visible:ring-ring/50 has-focus-visible:ring-4">
          <ProductCard product={product} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
