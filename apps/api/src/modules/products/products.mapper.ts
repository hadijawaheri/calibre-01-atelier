import type { ProductDto, ProductSummaryDto } from "@kronos/contracts";

import type { Product } from "./schemas/product.schema.js";

export function toProductDto(product: Product): ProductDto {
  return {
    id: product._id.toString(),
    slug: product.slug,
    name: product.name,
    nameEn: product.nameEn,
    reference: product.reference,
    series: product.series,
    tagline: product.tagline,
    description: product.description,
    price: product.price,
    stock: product.stock,
    editionSize: product.editionSize,
    movement: { ...product.movement },
    case: { ...product.case },
    appearance: { ...product.appearance },
    straps: product.straps.map(({ id, name, price }) => ({ id, name, price })),
    images: [...product.images],
    highlights: [...product.highlights],
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function toProductSummaryDto(product: Product): ProductSummaryDto {
  return {
    id: product._id.toString(),
    slug: product.slug,
    name: product.name,
    nameEn: product.nameEn,
    reference: product.reference,
    series: product.series,
    tagline: product.tagline,
    price: product.price,
    stock: product.stock,
    editionSize: product.editionSize,
    appearance: { ...product.appearance },
    images: [...product.images],
    isFeatured: product.isFeatured,
    calibre: product.movement.calibre,
    caseMaterial: product.case.material,
    diameterMm: product.case.diameterMm,
  };
}
