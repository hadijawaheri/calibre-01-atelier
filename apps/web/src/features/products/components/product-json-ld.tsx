import type { ProductDto } from "@kronos/contracts";

import { paths } from "@/lib/paths";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function ProductJsonLd({ product }: { product: ProductDto }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    alternateName: product.nameEn,
    sku: product.reference,
    description: product.description,
    brand: { "@type": "Brand", name: SITE_NAME },
    image: product.images.map((src) => new URL(src, SITE_URL).toString()),
    offers: {
      "@type": "Offer",
      url: new URL(paths.watch(product.slug), SITE_URL).toString(),
      priceCurrency: "IRR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
  };
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so a product text can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
