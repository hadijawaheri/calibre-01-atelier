import { FigurePlate, SourceList, Spec, SpecGrid } from "@/components/atlas";

import type { CalibreInfo } from "../calibres";

/* Long reading: one measure, generous leading, the steps counted because their order is the mechanism. */
export function CalibreHowItWorks({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-how`} className="flex flex-col gap-6">
      <h2 id={`${calibre.slug}-how`} className="border-b border-border pb-4 title">
        چطور کار می‌کند
      </h2>
      <ol className="flex max-w-[68ch] flex-col gap-6">
        {calibre.howItWorks.map((paragraph, index) => (
          <li key={index} className="grid grid-cols-[2rem_1fr] gap-4 leading-8">
            <span className="grid size-7 place-items-center border border-border bg-card text-xs text-metal-ink tabular-nums">
              {(index + 1).toLocaleString("fa-IR")}
            </span>
            <p className="text-foreground/85">{paragraph}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CalibreSpecs({ calibre, columns = 2 }: { calibre: CalibreInfo; columns?: 1 | 2 }) {
  return (
    <section aria-labelledby={`${calibre.slug}-specs`} className="flex flex-col gap-4">
      <h2 id={`${calibre.slug}-specs`} className="label">
        مشخصات
      </h2>
      <SpecGrid
        className={
          columns === 2 ? "grid-cols-2 [&>:last-child:nth-child(odd)]:col-span-2" : "grid-cols-1"
        }
      >
        {calibre.specs.map((spec) => (
          <Spec key={spec.label} label={spec.label} value={spec.value} />
        ))}
      </SpecGrid>
    </section>
  );
}

/* The atlas's cross-reference: the real watches that carry this family of calibre. */
export function CalibreUsedIn({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-used`} className="flex flex-col gap-4">
      <h2 id={`${calibre.slug}-used`} className="label">
        در کدام ساعت‌ها
      </h2>
      <ul className="divide-y divide-border plate">
        {calibre.usedIn.map((watch) => (
          <li key={`${watch.brand}-${watch.model}`} className="flex flex-col gap-1.5 p-4">
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-display text-lg" dir="ltr">
                {watch.brand} {watch.model}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{watch.calibre}</span>
            </p>
            <p className="text-sm leading-7 text-muted-foreground">{watch.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* A real movement of the family, photographed by someone else and credited under the plate. */
export function CalibrePhoto({ calibre }: { calibre: CalibreInfo }) {
  if (!calibre.photo) return null;
  return (
    <FigurePlate
      src={calibre.photo.src}
      alt={calibre.photo.alt}
      caption={calibre.photo.caption}
      credit={calibre.photo.credit}
      sizes="(max-width: 1023px) 100vw, 26rem"
    />
  );
}

export function CalibreSources({ calibre }: { calibre: CalibreInfo }) {
  return <SourceList id={`${calibre.slug}-sources`} sources={calibre.sources} />;
}
