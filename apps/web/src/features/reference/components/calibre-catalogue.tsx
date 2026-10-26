import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { FigurePlate, PageHeader, SourceList, Spec, SpecGrid, Tag } from "@/components/atlas";
import { calibreBySlug } from "@/features/movement/calibres";
import { paths } from "@/lib/paths";

import { CALIBRE_ENTRIES } from "../calibres";
import { formatYear } from "../format";
import type { CalibreEntry } from "../types";
import { WATCHES } from "../watches";

const MISSING = "—";

const COLUMNS = [
  { key: "frequency", label: "فرکانس" },
  { key: "powerReserve", label: "ذخیرهٔ انرژی" },
  { key: "jewels", label: "یاقوت" },
  { key: "diameter", label: "قطر" },
  { key: "height", label: "ارتفاع" },
] as const;

const linkClass =
  "underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground";

/* The comparison table: the same figures across every calibre, a dash wherever no source gives one. Phones skip
   it, since each entry below carries the same figures. */
function CalibreTable() {
  return (
    <div className="hidden overflow-x-auto plate md:block">
      <table className="w-full text-sm">
        <caption className="sr-only">مقایسهٔ کالیبرها</caption>
        <thead className="border-b border-border bg-secondary/60">
          <tr>
            <th scope="col" className="px-4 py-3 text-start label font-normal">
              کالیبر
            </th>
            <th scope="col" className="px-4 py-3 text-start label font-normal">
              سال
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3 text-start label font-normal">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {CALIBRE_ENTRIES.map((calibre) => (
            <tr
              key={calibre.slug}
              className="align-top transition-colors duration-300 hover:bg-secondary/50"
            >
              <th scope="row" className="px-4 py-4 text-start font-normal">
                <a
                  href={`#${calibre.slug}`}
                  className="font-mono underline-offset-4 hover:underline"
                  dir="ltr"
                >
                  {calibre.name}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">{calibre.type}</p>
              </th>
              <td className="px-4 py-4 tabular-nums">
                {calibre.year ? formatYear(calibre.year) : MISSING}
              </td>
              {COLUMNS.map((column) => (
                <td key={column.key} className="px-4 py-4 leading-6 text-foreground/85">
                  {calibre[column.key] ?? MISSING}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalibreArticle({ calibre }: { calibre: CalibreEntry }) {
  const titleId = `${calibre.slug}-title`;
  const family = calibre.family ? calibreBySlug(calibre.family) : undefined;
  const watches = WATCHES.filter((watch) => watch.calibreSlug === calibre.slug);
  const specs = [
    { label: "سازنده", value: calibre.maker },
    { label: "نوع", value: calibre.type },
    calibre.year && { label: "سال معرفی", value: formatYear(calibre.year) },
    ...COLUMNS.map((column) => {
      const value = calibre[column.key];
      return value && { label: column.label, value };
    }),
  ].filter((spec) => !!spec);
  return (
    <article
      id={calibre.slug}
      aria-labelledby={titleId}
      className="grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-14"
    >
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-border pb-4">
          <h2 id={titleId} className="title">
            <bdi dir="ltr">{calibre.name}</bdi>
          </h2>
          <p className="text-sm text-muted-foreground">{calibre.type}</p>
        </header>
        <p className="max-w-[68ch] leading-8 text-foreground/85">{calibre.note}</p>
        <SpecGrid className="sm:grid-cols-2">
          {specs.map((spec) => (
            <Spec key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </SpecGrid>
        {(watches.length > 0 || family) && (
          <div className="flex flex-wrap items-center gap-2">
            {watches.map((watch) => (
              <Link key={watch.slug} href={`${paths.watches}#${watch.slug}`} className="group">
                <Tag className="transition-colors duration-300 group-hover:text-foreground">
                  {watch.name}
                </Tag>
              </Link>
            ))}
            {family && (
              <Link
                href={paths.labCalibre(family.slug)}
                className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground ${linkClass}`}
              >
                خانوادهٔ {family.shortName} در آزمایشگاه
                <ArrowLeft aria-hidden className="size-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>

      <aside className="flex flex-col gap-8">
        {calibre.photo && (
          <FigurePlate
            src={calibre.photo.src}
            alt={calibre.photo.alt}
            caption={calibre.photo.caption}
            credit={calibre.photo.credit}
            sizes="(max-width: 1023px) 100vw, 24rem"
          />
        )}
        <SourceList id={`${calibre.slug}-sources`} sources={calibre.sources} />
      </aside>
    </article>
  );
}

export function CalibreCataloguePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="کالیبرها"
        reference={`Calibre register · ${CALIBRE_ENTRIES.length} movements`}
        intro="موومنت‌هایی که پشت ساعت‌های این دانشنامه کار می‌کنند، به ترتیب سال معرفی: فرکانس، ذخیرهٔ انرژی، یاقوت و اندازه. هر جا منبعی عددی نداده، خانهٔ آن خالی مانده است."
      />
      <CalibreTable />
      {CALIBRE_ENTRIES.map((calibre) => (
        <CalibreArticle key={calibre.slug} calibre={calibre} />
      ))}
    </div>
  );
}
