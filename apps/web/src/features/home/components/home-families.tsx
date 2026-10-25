import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/atlas";
import { CALIBRES } from "@/features/movement";
import { paths } from "@/lib/paths";

const ROWS = [
  { key: "energy", label: "انرژی" },
  { key: "accuracy", label: "دقت" },
  { key: "beat", label: "تپش" },
  { key: "signature", label: "نشانه" },
] as const;

/* The atlas's database table: one row per family, the same four questions answered across. Phones get the
   same rows as stacked entries, since a five-column table does not fit a hand. */
export function HomeFamilies() {
  return (
    <section
      id="families"
      data-stage="families"
      aria-labelledby="families-title"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:py-28"
    >
      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="families-title" className="display">
          چهار خانوادهٔ موومنت
        </h2>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground">
          هر خانواده را باز کنید تا سازوکار، مشخصات و ساعت‌هایش را ببینید.
        </p>
      </div>

      <div className="hidden plate md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/60">
            <tr>
              <th scope="col" className="px-5 py-3 text-start label font-normal">
                خانواده
              </th>
              {ROWS.map((row) => (
                <th key={row.key} scope="col" className="px-5 py-3 text-start label font-normal">
                  {row.label}
                </th>
              ))}
              <th scope="col" className="px-5 py-3 text-start label font-normal">
                سه‌بعدی
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CALIBRES.map((calibre) => (
              <tr
                key={calibre.slug}
                className="align-top transition-colors duration-300 hover:bg-secondary/50"
              >
                <th scope="row" className="px-5 py-5 text-start font-normal">
                  <Link
                    href={paths.labCalibre(calibre.slug)}
                    className="font-display text-xl leading-snug underline-offset-4 hover:underline"
                  >
                    {calibre.name}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-muted-foreground" dir="ltr">
                    {calibre.reference}
                  </p>
                </th>
                {ROWS.map((row) => (
                  <td key={row.key} className="px-5 py-5 leading-7 text-foreground/85">
                    {calibre.glance[row.key]}
                  </td>
                ))}
                <td className="px-5 py-5">
                  <Tag tone={calibre.hasModel ? "ink" : "muted"}>
                    {calibre.hasModel ? "آماده" : "به‌زودی"}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-4 md:hidden">
        {CALIBRES.map((calibre) => (
          <li key={calibre.slug} className="plate">
            <Link href={paths.labCalibre(calibre.slug)} className="group flex flex-col">
              <span className="flex items-start justify-between gap-4 border-b border-border p-4">
                <span className="flex flex-col gap-1">
                  <span className="font-display text-xl">{calibre.name}</span>
                  <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                    {calibre.reference.split(" · ")[0]}
                  </span>
                </span>
                <ArrowLeft aria-hidden className="mt-1.5 size-4 shrink-0 text-muted-foreground" />
              </span>
              <dl className="grid grid-cols-2 gap-px bg-border">
                {ROWS.map((row) => (
                  <div key={row.key} className="flex flex-col gap-1 bg-card p-4">
                    <dt className="label">{row.label}</dt>
                    <dd className="text-sm leading-6">{calibre.glance[row.key]}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
