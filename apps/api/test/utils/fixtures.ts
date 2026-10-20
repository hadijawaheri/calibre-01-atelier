import type { ProductInput } from "@kronos/contracts";

let counter = 0;

export function productInput(overrides: Partial<ProductInput> = {}): ProductInput {
  counter += 1;
  return {
    slug: `test-watch-${counter}`,
    name: `ساعت آزمایشی ${counter}`,
    nameEn: `Test Watch ${counter}`,
    reference: `KR-T${counter}`,
    series: "heritage",
    tagline: "برای آزمون",
    description: "ساعتی برای آزمون‌های خودکار فروشگاه.",
    price: 10_000_000_000,
    stock: 5,
    editionSize: null,
    movement: {
      type: "automatic",
      calibre: "KR-T",
      frequencyVph: 28_800,
      jewels: 25,
      powerReserveHours: 70,
    },
    case: { material: "steel", diameterMm: 40, thicknessMm: 11, waterResistanceM: 100 },
    appearance: { dial: "#101418", accent: "#d4af37", layout: "three-hand" },
    straps: [
      { id: "alligator", name: "چرم تمساح مشکی", price: 0 },
      { id: "steel", name: "دستبند استیل", price: 900_000_000 },
    ],
    images: [],
    highlights: [],
    isFeatured: false,
    isPublished: true,
    ...overrides,
  };
}

export const shipping = {
  fullName: "آرش کاظمی",
  mobile: "09121234567",
  province: "تهران",
  city: "تهران",
  address: "خیابان ولیعصر، کوچه نهم، پلاک ۱۲",
  postalCode: "1234567890",
};
