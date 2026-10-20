import type { ProductDto } from "@kronos/contracts";
import { CASE_MATERIAL_LABELS, MOVEMENT_TYPE_LABELS } from "@kronos/contracts";

import { formatNumber } from "@/lib/format";

export function ProductSpecs({ product }: { product: ProductDto }) {
  const { movement, case: watchCase } = product;
  const rows: Array<[string, React.ReactNode]> = [
    ["رفرنس", <span key="ref" dir="ltr" className="font-mono">{product.reference}</span>],
    ["کالیبر", <span key="cal" dir="ltr" className="font-mono">{movement.calibre}</span>],
    ["نوع موتور", MOVEMENT_TYPE_LABELS[movement.type]],
    ["بسامد", `${formatNumber(movement.frequencyVph)} ضربان در ساعت (${formatNumber(movement.frequencyVph / 7200)} هرتز)`],
    ["یاقوت", `${formatNumber(movement.jewels)} عدد`],
    ["ذخیره‌ی انرژی", `${formatNumber(movement.powerReserveHours)} ساعت`],
    ["جنس قاب", CASE_MATERIAL_LABELS[watchCase.material]],
    ["قطر و ضخامت", `${formatNumber(watchCase.diameterMm)} × ${formatNumber(watchCase.thicknessMm)} میلی‌متر`],
    ["ضد آب", watchCase.waterResistanceM > 0 ? `تا ${formatNumber(watchCase.waterResistanceM)} متر` : "ندارد"],
    ["تیراژ", product.editionSize ? `سری محدود ${formatNumber(product.editionSize)} عددی` : "تولید پیوسته"],
  ];

  return (
    <dl className="divide-border border-border grid divide-y border-y text-sm">
      {rows.map(([term, value]) => (
        <div key={term} className="grid grid-cols-[9rem_1fr] gap-4 py-3">
          <dt className="text-muted-foreground">{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
