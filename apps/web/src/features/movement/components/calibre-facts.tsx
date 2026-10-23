import type { CalibreInfo } from "../calibres";

/* Long reading: one measure, generous leading, the steps counted because their order is the mechanism. */
export function CalibreHowItWorks({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-how`} className="flex flex-col gap-6">
      <h2
        id={`${calibre.slug}-how`}
        className="border-b hairline pb-4 text-xs text-muted-foreground"
      >
        چطور کار می‌کند
      </h2>
      <ol className="flex max-w-[65ch] flex-col gap-6">
        {calibre.howItWorks.map((paragraph, index) => (
          <li key={index} className="grid grid-cols-[1.5rem_1fr] gap-4 leading-8">
            <span className="text-xs leading-8 text-metal tabular-nums">
              {(index + 1).toLocaleString("fa-IR")}
            </span>
            <p className="text-foreground/85">{paragraph}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CalibreSpecs({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-specs`} className="flex flex-col gap-6">
      <h2
        id={`${calibre.slug}-specs`}
        className="border-b hairline pb-4 text-xs text-muted-foreground"
      >
        مشخصات
      </h2>
      <dl className="flex flex-col">
        {calibre.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-6 border-b border-border py-3 text-sm last:border-b-0"
          >
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd className="text-end">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CalibreUsedIn({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-used`} className="flex flex-col gap-6">
      <h2
        id={`${calibre.slug}-used`}
        className="border-b hairline pb-4 text-xs text-muted-foreground"
      >
        در کدام ساعت‌ها
      </h2>
      <ul className="flex flex-col">
        {calibre.usedIn.map((watch) => (
          <li
            key={`${watch.brand}-${watch.model}`}
            className="flex flex-col gap-2 border-b border-border py-4 first:pt-0 last:border-b-0"
          >
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="caps text-foreground" dir="ltr">
                {watch.brand} {watch.model}
              </span>
              <span className="text-xs text-muted-foreground">{watch.calibre}</span>
            </p>
            <p className="text-sm leading-7 text-muted-foreground">{watch.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
