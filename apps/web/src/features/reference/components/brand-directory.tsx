import Link from "next/link";

import { PageHeader, SourceList, Tag } from "@/components/atlas";
import { paths } from "@/lib/paths";

import { BRANDS } from "../brands";
import { formatYear } from "../format";
import type { BrandEntry } from "../types";
import { WATCHES } from "../watches";

function BrandRow({ brand }: { brand: BrandEntry }) {
  const titleId = `${brand.slug}-title`;
  const watches = WATCHES.filter((watch) => watch.brandSlug === brand.slug);
  const facts = [
    { label: "مکان", value: brand.place },
    brand.founders && { label: "موسس", value: brand.founders },
    brand.owner && { label: "مالک امروز", value: brand.owner },
  ].filter((fact) => !!fact);
  return (
    <li>
      <article
        id={brand.slug}
        aria-labelledby={titleId}
        className="grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_minmax(0,19rem)] lg:gap-10"
      >
        <header className="flex flex-col gap-1.5">
          <p className="font-mono text-sm text-metal-ink tabular-nums">
            {formatYear(brand.founded)}
          </p>
          <h2 id={titleId} className="font-display text-[1.75rem] leading-snug">
            {brand.name}
          </h2>
          <p className="caps text-muted-foreground" dir="ltr">
            {brand.latinName}
          </p>
        </header>

        <div className="flex flex-col gap-5">
          <p className="max-w-[62ch] leading-8 text-foreground/85">{brand.summary}</p>
          {(watches.length > 0 || brand.historySlug) && (
            <ul aria-label={`پیوندهای ${brand.name}`} className="flex flex-wrap gap-2">
              {watches.map((watch) => (
                <li key={watch.slug}>
                  <Link href={`${paths.watches}#${watch.slug}`} className="group">
                    <Tag className="transition-colors duration-300 group-hover:text-foreground">
                      {watch.name}
                    </Tag>
                  </Link>
                </li>
              ))}
              {brand.historySlug && (
                <li>
                  <Link href={`${paths.history}#${brand.historySlug}`} className="group">
                    <Tag
                      tone="ink"
                      className="transition-colors duration-300 group-hover:text-metal-ink"
                    >
                      تاریخچهٔ کامل
                    </Tag>
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <dl className="flex flex-col divide-y divide-border border-y border-border text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-0.5 py-2">
                <dt className="label">{fact.label}</dt>
                <dd className="leading-7">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <SourceList id={`${brand.slug}-sources`} sources={brand.sources} />
        </div>
      </article>
    </li>
  );
}

export function BrandDirectoryPage() {
  const first = BRANDS[0]?.founded ?? 0;
  const last = BRANDS.at(-1)?.founded ?? 0;
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="برندهای ساعت"
        reference={`Watch houses · ${BRANDS.length} brands · ${first}–${last}`}
        intro={`از کارگاه ویلره در ${formatYear(first)} تا ژنوی ${formatYear(last)}: هر خانه کی و کجا شروع شد، چه کسی آن را ساخت، امروز مال کیست و کدام ساعتش را در این دانشنامه می‌بینید.`}
      />
      <ul className="divide-y divide-border plate">
        {BRANDS.map((brand) => (
          <BrandRow key={brand.slug} brand={brand} />
        ))}
      </ul>
    </div>
  );
}
