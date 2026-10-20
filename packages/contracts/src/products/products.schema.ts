import { z } from "zod";

import { paginationQuerySchema } from "../common/pagination";

export const COLLECTIONS = ["tourbillon", "chronograph", "heritage", "diver", "dress"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export const COLLECTION_LABELS: Record<Collection, string> = {
  tourbillon: "توربیون",
  chronograph: "کرونوگراف",
  heritage: "هریتیج",
  diver: "غواصی",
  dress: "رسمی",
};

export const CASE_MATERIALS = ["titanium", "steel", "rose-gold", "yellow-gold", "platinum"] as const;
export type CaseMaterial = (typeof CASE_MATERIALS)[number];

export const CASE_MATERIAL_LABELS: Record<CaseMaterial, string> = {
  titanium: "تیتانیوم",
  steel: "استیل",
  "rose-gold": "طلای رز",
  "yellow-gold": "طلای زرد",
  platinum: "پلاتین",
};

export const MOVEMENT_TYPES = ["automatic", "manual"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  automatic: "اتوماتیک",
  manual: "کوکی دستی",
};

export const DIAL_LAYOUTS = ["three-hand", "chronograph", "tourbillon", "skeleton"] as const;
export type DialLayout = (typeof DIAL_LAYOUTS)[number];

export const PRODUCT_SORTS = ["featured", "newest", "price-asc", "price-desc"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

/** Rial. Hand engraving on the caseback is a flat fee. */
export const ENGRAVING_PRICE = 120_000_000;
export const ENGRAVING_MAX_LENGTH = 24;
export const MAX_QUANTITY_PER_ITEM = 2;

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "رنگ باید به شکل #RRGGBB باشد");
const rial = z.number().int("مبلغ باید عدد صحیح ریال باشد").min(0);

export const strapOptionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{2,30}$/),
  name: z.string().trim().min(2).max(60),
  price: rial,
});
export type StrapOption = z.infer<typeof strapOptionSchema>;

export const productInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "اسلاگ فقط حروف کوچک انگلیسی، عدد و خط تیره"),
  name: z.string().trim().min(2).max(80),
  nameEn: z.string().trim().min(2).max(80),
  reference: z.string().trim().min(2).max(30),
  series: z.enum(COLLECTIONS),
  tagline: z.string().trim().max(140),
  description: z.string().trim().min(10).max(4000),
  price: rial.min(1, "قیمت را وارد کنید"),
  stock: z.number().int().min(0),
  editionSize: z.number().int().positive().nullable(),
  movement: z.object({
    type: z.enum(MOVEMENT_TYPES),
    calibre: z.string().trim().min(2).max(40),
    frequencyVph: z.number().int().min(14_400).max(72_000),
    jewels: z.number().int().min(1).max(120),
    powerReserveHours: z.number().int().min(24).max(1000),
  }),
  case: z.object({
    material: z.enum(CASE_MATERIALS),
    diameterMm: z.number().min(28).max(50),
    thicknessMm: z.number().min(5).max(20),
    waterResistanceM: z.number().int().min(0).max(3000),
  }),
  appearance: z.object({
    dial: hexColor,
    accent: hexColor,
    layout: z.enum(DIAL_LAYOUTS),
  }),
  straps: z.array(strapOptionSchema).min(1).max(6),
  images: z.array(z.string().regex(/^\/[\w\-/.]+$/)).max(8),
  highlights: z.array(z.string().trim().min(2).max(120)).max(6),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});
export type ProductInput = z.input<typeof productInputSchema>;

export const updateProductSchema = productInputSchema.partial();
export type UpdateProductInput = z.input<typeof updateProductSchema>;

const csvEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.array(z.enum(values))])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional();

export const productListQuerySchema = paginationQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(48).default(12),
  collection: csvEnum(COLLECTIONS),
  material: csvEnum(CASE_MATERIALS),
  movement: csvEnum(MOVEMENT_TYPES),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  inStock: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  sort: z.enum(PRODUCT_SORTS).default("featured"),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductListQueryInput = z.input<typeof productListQuerySchema>;

export interface ProductDto extends z.infer<typeof productInputSchema> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductSummaryDto = Pick<
  ProductDto,
  | "id"
  | "slug"
  | "name"
  | "nameEn"
  | "reference"
  | "series"
  | "tagline"
  | "price"
  | "stock"
  | "editionSize"
  | "appearance"
  | "images"
  | "isFeatured"
> & {
  calibre: string;
  caseMaterial: CaseMaterial;
  diameterMm: number;
};
