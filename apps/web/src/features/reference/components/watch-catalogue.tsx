import Link from "next/link";

import { FigurePlate, PageHeader, SourceList, Spec, SpecGrid } from "@/components/atlas";
import { paths } from "@/lib/paths";

import { brandBySlug } from "../brands";
import { calibreEntryBySlug } from "../calibres";
import { formatYear, plateNumber } from "../format";
import type { WatchEntry } from "../types";
import { WATCHES } from "../watches";

const linkClass =
  "underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground";

/* One model as an atlas entry: the plate beside it, or an honest empty mat when no free photo exists. */
function WatchArticle({ watch, index }: { watch: WatchEntry; index: number }) {
  const titleId = `${watch.slug}-title`;
  const brand = brandBySlug(watch.brandSlug);
  const calibre = watch.calibreSlug ? calibreEntryBySlug(watch.calibreSlug) : undefined;
  return (
    <article
      id={watch.slug}
      aria-labelledby={titleId}
      className="grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-10 border-t border-border pt-12 first-of-type:border-t-0 first-of-type:pt-0 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14"
    >
      <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
        {watch.photo ? (
          <FigurePlate
            src={watch.photo.src}
            alt={watch.photo.alt}
            caption={watch.photo.caption}
            number={plateNumber(index)}
            credit={watch.photo.credit}
            aspect="aspect-[4/5]"
            sizes="(max-width: 1023px) 100vw, 22rem"
          />
        ) : (
          <div className="grid aspect-[4/5] place-items-center border border-dashed border-border bg-secondary/50 p-8 text-center">
            <p className="max-w-[24ch] text-sm leading-7 text-muted-foreground">
              عکسی با مجوز آزاد از این مدل پیدا نشد. عکس‌های سایت سازنده حق نشر دارند و اینجا
              نیامده‌اند.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-border pb-4">
          <p className="font-mono text-sm text-metal-ink tabular-nums">{formatYear(watch.year)}</p>
          <h2 id={titleId} className="title">
            {watch.name}
          </h2>
          <p className="caps text-muted-foreground" dir="ltr">
            {watch.latinName}
          </p>
          {brand && (
            <p className="text-sm text-muted-foreground">
              ساخت{" "}
              <Link href={`${paths.brands}#${brand.slug}`} className={linkClass}>
                {brand.name}
              </Link>
            </p>
          )}
        </header>

        <p className="max-w-[68ch] leading-8 text-foreground/85">{watch.story}</p>

        <SpecGrid className="sm:grid-cols-2">
          <Spec label="سال معرفی" value={formatYear(watch.year)} />
          {watch.specs.map((spec) => (
            <Spec key={spec.label} label={spec.label} value={spec.value} latin={spec.latin} />
          ))}
        </SpecGrid>

        {calibre && (
          <p className="text-sm leading-7 text-muted-foreground">
            مشخصات موومنت:{" "}
            <Link href={`${paths.calibres}#${calibre.slug}`} className={linkClass} dir="ltr">
              {calibre.name}
            </Link>
          </p>
        )}

        <SourceList id={`${watch.slug}-sources`} sources={watch.sources} />
      </div>
    </article>
  );
}

export function WatchCataloguePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="ساعت‌های ماندگار"
        reference={`Reference watches · ${WATCHES.length} models`}
        intro="ساعت‌هایی که هر کدام چیزی را برای اولین بار ممکن کردند، به ترتیب سال معرفی: از تانک کارتیه تا اولین جی‌شاک. مشخصات هر مدل از منابعی آمده که زیرش فهرست شده‌اند."
      >
        <nav aria-label="ساعت‌ها" className="flex flex-wrap gap-2 pt-2">
          {WATCHES.map((watch) => (
            <a
              key={watch.slug}
              href={`#${watch.slug}`}
              className="flex items-baseline gap-2 border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <span className="font-mono text-xs tabular-nums">{formatYear(watch.year)}</span>
              {watch.name}
            </a>
          ))}
        </nav>
      </PageHeader>
      {WATCHES.map((watch, index) => (
        <WatchArticle key={watch.slug} watch={watch} index={index} />
      ))}
    </div>
  );
}
