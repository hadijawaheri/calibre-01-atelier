import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { EntryPager, SourceList, Spec, SpecGrid, Tag, Trail } from "@/components/atlas";
import { JsonLd } from "@/components/layout/json-ld";
import { calibreBySlug } from "@/features/movement/calibres";
import { paths } from "@/lib/paths";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

import { brandBySlug } from "../brands";
import { calibreEntryBySlug } from "../calibres";
import { formatYear, KIND_LABELS, lead } from "../format";
import { contemporaries, neighbours, watchesOfBrand, watchesWithCalibre } from "../related";
import type { WatchEntry } from "../types";
import { watchBySlug, WATCHES } from "../watches";
import { WatchPhoto } from "./watch-photo";

const linkClass =
  "underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground";

function watchTrail(watch: WatchEntry) {
  return [
    { name: "خانه", path: paths.home },
    { name: "ساعت‌ها", path: paths.watches },
    { name: watch.name, path: paths.watch(watch.slug) },
  ];
}

export function watchMetadata(slug: string): Metadata {
  const watch = watchBySlug(slug);
  if (!watch) return {};
  const brand = brandBySlug(watch.brandSlug);
  return pageMetadata({
    title: `${watch.name} (${watch.latinName})`,
    description: `${watch.name}، ${formatYear(watch.year)}${brand ? `، ساخت ${brand.name}` : ""}: ${lead(watch.story)}`,
    path: paths.watch(watch.slug),
    type: "article",
    image: watch.photo && { url: watch.photo.src, alt: watch.photo.alt },
  });
}

/* A small card for a related model: year, name and the Latin name, the whole card one link. */
function WatchCard({ watch }: { watch: WatchEntry }) {
  return (
    <li>
      <Link
        href={paths.watch(watch.slug)}
        className="flex h-full flex-col gap-1 bg-card p-4 transition-colors duration-300 hover:bg-secondary"
      >
        <span className="font-mono text-xs text-metal-ink tabular-nums">
          {formatYear(watch.year)}
        </span>
        <span>{watch.name}</span>
        <span className="caps text-muted-foreground" dir="ltr">
          {watch.latinName}
        </span>
      </Link>
    </li>
  );
}

function Related({
  id,
  title,
  watches,
  children,
}: {
  id: string;
  title: string;
  watches: readonly WatchEntry[];
  children?: ReactNode;
}) {
  if (watches.length === 0 && !children) return null;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="border-b border-border pb-3 font-display text-2xl">
        {title}
      </h2>
      {watches.length > 0 && (
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {watches.map((watch) => (
            <WatchCard key={watch.slug} watch={watch} />
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}

/** One model on its own page: the plate, its facts, the calibre inside, and the watches around it. */
export function WatchPage({ slug }: { slug: string }) {
  const watch = watchBySlug(slug);
  if (!watch) notFound();

  const brand = brandBySlug(watch.brandSlug);
  const calibre = watch.calibreSlug ? calibreEntryBySlug(watch.calibreSlug) : undefined;
  const family = calibre?.family ? calibreBySlug(calibre.family) : undefined;
  const sameCalibre = calibre
    ? watchesWithCalibre(calibre.slug).filter((other) => other.slug !== watch.slug)
    : [];
  const sameHouse = watchesOfBrand(watch.brandSlug).filter((other) => other.slug !== watch.slug);
  const { previous, next } = neighbours(WATCHES, watch.slug);
  const trail = watchTrail(watch);

  const calibreSpecs = calibre
    ? [
        { label: "نوع", value: calibre.type },
        calibre.frequency && { label: "فرکانس", value: calibre.frequency },
        calibre.powerReserve && { label: "ذخیرهٔ انرژی", value: calibre.powerReserve },
        calibre.jewels && { label: "یاقوت", value: calibre.jewels },
      ].filter((spec) => !!spec)
    : [];

  return (
    <article
      aria-labelledby="watch-title"
      className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 sm:px-6 lg:py-14"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: watch.name,
          alternativeHeadline: watch.latinName,
          description: lead(watch.story),
          inLanguage: "fa",
          url: absoluteUrl(paths.watch(watch.slug)),
          ...(watch.photo && { image: watch.photo.src }),
          about: {
            "@type": "Thing",
            name: watch.latinName,
            ...(brand && { description: `${brand.latinName}, ${watch.year}` }),
          },
          citation: watch.sources.map((source) => source.url),
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <JsonLd data={breadcrumbJsonLd(trail)} />

      <div className="flex flex-col gap-8">
        <Trail trail={trail} />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <WatchPhoto watch={watch} sizes="(max-width: 1023px) 100vw, 26rem" priority />
          </div>

          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-3 border-b border-border pb-6">
              <p className="font-mono text-sm text-metal-ink tabular-nums">
                {formatYear(watch.year)}
              </p>
              <h1 id="watch-title" className="display">
                {watch.name}
              </h1>
              <p className="caps text-muted-foreground" dir="ltr">
                {watch.latinName}
              </p>
              {brand && (
                <p className="text-sm text-muted-foreground">
                  ساخت{" "}
                  <Link href={paths.brand(brand.slug)} className={linkClass}>
                    {brand.name}
                  </Link>
                  ، {brand.place}
                </p>
              )}
            </header>

            <p className="max-w-[68ch] text-lg leading-9 text-foreground/85">{watch.story}</p>

            <SpecGrid className="sm:grid-cols-2 sm:[&>:last-child:nth-child(odd)]:col-span-2">
              <Spec label="سال معرفی" value={formatYear(watch.year)} />
              {watch.specs.map((spec) => (
                <Spec key={spec.label} label={spec.label} value={spec.value} latin={spec.latin} />
              ))}
            </SpecGrid>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link
                href={`${paths.compare}?watches=${watch.slug}`}
                className={`inline-flex items-center gap-1.5 ${linkClass}`}
              >
                مقایسه با ساعتی دیگر
                <ArrowLeft aria-hidden className="size-3.5" />
              </Link>
            </div>

            <SourceList id="watch-sources" sources={watch.sources} />
          </div>
        </div>
      </div>

      {calibre && (
        <section aria-labelledby="heart-title" className="flex flex-col gap-4">
          <h2 id="heart-title" className="border-b border-border pb-3 font-display text-2xl">
            قلب ساعت
          </h2>
          <div className="grid gap-8 p-5 plate sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-4">
              <p className="label">{KIND_LABELS[calibre.kind]}</p>
              <Link
                href={paths.calibre(calibre.slug)}
                className="self-start title transition-colors duration-300 hover:text-metal-ink"
              >
                <bdi dir="ltr">{calibre.name}</bdi>
              </Link>
              <p className="max-w-[60ch] text-sm leading-7 text-muted-foreground">
                {calibre.maker}
              </p>
              <SpecGrid className="sm:grid-cols-2 sm:[&>:last-child:nth-child(odd)]:col-span-2">
                {calibreSpecs.map((spec) => (
                  <Spec key={spec.label} label={spec.label} value={spec.value} />
                ))}
              </SpecGrid>
            </div>
            <div className="flex flex-col gap-4">
              <p className="label">ساعت‌های دیگر با همین کالیبر در کرونوس</p>
              {sameCalibre.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {sameCalibre.map((other) => (
                    <li key={other.slug}>
                      <Link href={paths.watch(other.slug)} className="group">
                        <Tag className="transition-colors duration-300 group-hover:text-foreground">
                          {other.name}
                        </Tag>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">
                  هنوز ساعت دیگری با این کالیبر ثبت نشده است.
                </p>
              )}
              {family && (
                <Link
                  href={paths.labCalibre(family.slug)}
                  className={`inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground ${linkClass}`}
                >
                  خانوادهٔ {family.shortName} در آزمایشگاه
                  <ArrowLeft aria-hidden className="size-3.5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {brand && (
        <Related id="house-title" title={`دیگر ساعت‌های ${brand.name}`} watches={sameHouse}>
          {sameHouse.length === 0 && (
            <p className="text-sm leading-7 text-muted-foreground">
              این تنها ساعت {brand.name} در کرونوس است.{" "}
              <Link href={paths.brand(brand.slug)} className={linkClass}>
                دربارهٔ {brand.name}
              </Link>
            </p>
          )}
        </Related>
      )}

      <Related id="era-title" title="هم‌دوره‌ها" watches={contemporaries(watch)} />

      <EntryPager
        label="ساعت قبلی و بعدی"
        previous={previous && { href: paths.watch(previous.slug), label: previous.name }}
        next={next && { href: paths.watch(next.slug), label: next.name }}
      />
    </article>
  );
}
