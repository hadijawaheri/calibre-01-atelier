import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  EntryPager,
  FigurePlate,
  SourceList,
  Spec,
  SpecGrid,
  Tag,
  Trail,
} from "@/components/atlas";
import { JsonLd } from "@/components/layout/json-ld";
import { calibreBySlug } from "@/features/movement/calibres";
import { paths } from "@/lib/paths";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

import { CALIBRE_ENTRIES, calibreEntryBySlug } from "../calibres";
import { formatYear, KIND_LABELS, lead } from "../format";
import { calibresOfKind, neighbours, watchesWithCalibre } from "../related";
import { calibreSpecs } from "../specs";
import type { CalibreEntry } from "../types";

const linkClass =
  "underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground";

function calibreTrail(calibre: CalibreEntry) {
  return [
    { name: "خانه", path: paths.home },
    { name: "کالیبرها", path: paths.calibres },
    { name: calibre.name, path: paths.calibre(calibre.slug) },
  ];
}

export function calibreEntryMetadata(slug: string): Metadata {
  const calibre = calibreEntryBySlug(slug);
  if (!calibre) return {};
  return pageMetadata({
    title: `کالیبر ${calibre.name}`,
    description: `${calibre.name}، ${calibre.type}${calibre.year ? `، ${formatYear(calibre.year)}` : ""}: ${lead(calibre.note)}`,
    path: paths.calibre(calibre.slug),
    type: "article",
    image: calibre.photo && { url: calibre.photo.src, alt: calibre.photo.alt },
  });
}

/** One calibre on its own page: its figures, the watches that use it, and its kin in the register. */
export function CalibreEntryPage({ slug }: { slug: string }) {
  const calibre = calibreEntryBySlug(slug);
  if (!calibre) notFound();

  const family = calibre.family ? calibreBySlug(calibre.family) : undefined;
  const watches = watchesWithCalibre(calibre.slug);
  const kin = calibresOfKind(calibre);
  const { previous, next } = neighbours(CALIBRE_ENTRIES, calibre.slug);
  const trail = calibreTrail(calibre);

  return (
    <article
      aria-labelledby="calibre-title"
      className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 sm:px-6 lg:py-14"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: calibre.name,
          description: lead(calibre.note),
          inLanguage: "fa",
          url: absoluteUrl(paths.calibre(calibre.slug)),
          ...(calibre.photo && { image: calibre.photo.src }),
          about: { "@type": "Thing", name: calibre.name },
          citation: calibre.sources.map((source) => source.url),
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <JsonLd data={breadcrumbJsonLd(trail)} />

      <div className="flex flex-col gap-8">
        <Trail trail={trail} />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-3 border-b border-border pb-6">
              <p className="label">{KIND_LABELS[calibre.kind]}</p>
              <h1 id="calibre-title" className="display">
                <bdi dir="ltr">{calibre.name}</bdi>
              </h1>
              <p className="text-muted-foreground">{calibre.type}</p>
            </header>
            <p className="max-w-[68ch] text-lg leading-9 text-foreground/85">{calibre.note}</p>
            <SpecGrid className="sm:grid-cols-2 sm:[&>:last-child:nth-child(odd)]:col-span-2">
              {calibreSpecs(calibre).map((spec) => (
                <Spec key={spec.label} label={spec.label} value={spec.value} />
              ))}
            </SpecGrid>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link
                href={`${paths.compare}?calibres=${calibre.slug}`}
                className={`inline-flex items-center gap-1.5 ${linkClass}`}
              >
                مقایسه با کالیبری دیگر
                <ArrowLeft aria-hidden className="size-3.5" />
              </Link>
              {family && (
                <Link
                  href={paths.labCalibre(family.slug)}
                  className={`inline-flex items-center gap-1.5 ${linkClass}`}
                >
                  خانوادهٔ {family.shortName} در آزمایشگاه
                  <ArrowLeft aria-hidden className="size-3.5" />
                </Link>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            {calibre.photo && (
              <FigurePlate
                src={calibre.photo.src}
                alt={calibre.photo.alt}
                caption={calibre.photo.caption}
                credit={calibre.photo.credit}
                sizes="(max-width: 1023px) 100vw, 26rem"
                priority
              />
            )}
            <SourceList id="calibre-sources" sources={calibre.sources} />
          </aside>
        </div>
      </div>

      <section aria-labelledby="watches-title" className="flex flex-col gap-4">
        <h2 id="watches-title" className="border-b border-border pb-3 font-display text-2xl">
          ساعت‌هایی که با این کالیبر کار می‌کنند
        </h2>
        {watches.length > 0 ? (
          <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {watches.map((watch) => (
              <li key={watch.slug}>
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
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            هنوز ساعتی با این کالیبر در کرونوس ثبت نشده است.
          </p>
        )}
      </section>

      {kin.length > 0 && (
        <section aria-labelledby="kin-title" className="flex flex-col gap-4">
          <h2 id="kin-title" className="border-b border-border pb-3 font-display text-2xl">
            کالیبرهای {KIND_LABELS[calibre.kind]} دیگر
          </h2>
          <ul className="flex flex-wrap gap-2">
            {kin.map((other) => (
              <li key={other.slug}>
                <Link href={paths.calibre(other.slug)} className="group">
                  <Tag className="transition-colors duration-300 group-hover:text-foreground">
                    <bdi dir="ltr">{other.name}</bdi>
                  </Tag>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <EntryPager
        label="کالیبر قبلی و بعدی"
        previous={previous && { href: paths.calibre(previous.slug), label: previous.name }}
        next={next && { href: paths.calibre(next.slug), label: next.name }}
      />
    </article>
  );
}
