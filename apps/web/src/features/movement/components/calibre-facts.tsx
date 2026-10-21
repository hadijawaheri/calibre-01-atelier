import type { CalibreInfo } from "../calibres";

export function CalibreHowItWorks({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-how`} className="flex flex-col gap-3">
      <h2 id={`${calibre.slug}-how`} className="text-sm font-semibold">
        چطور کار می‌کند
      </h2>
      <ol className="flex flex-col gap-3">
        {calibre.howItWorks.map((paragraph, index) => (
          <li key={index} className="flex gap-3 text-sm leading-7 text-muted-foreground">
            <span className="font-mono text-xs leading-7 text-gold">
              {(index + 1).toLocaleString("fa-IR")}
            </span>
            <p>{paragraph}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CalibreSpecs({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-specs`} className="flex flex-col gap-3">
      <h2 id={`${calibre.slug}-specs`} className="text-sm font-semibold">
        مشخصات
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {calibre.specs.map((spec) => (
          <div key={spec.label} className="contents">
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CalibreUsedIn({ calibre }: { calibre: CalibreInfo }) {
  return (
    <section aria-labelledby={`${calibre.slug}-used`} className="flex flex-col gap-3">
      <h2 id={`${calibre.slug}-used`} className="text-sm font-semibold">
        در کدام ساعت‌ها
      </h2>
      <ul className="flex flex-col divide-y divide-border">
        {calibre.usedIn.map((watch) => (
          <li
            key={`${watch.brand}-${watch.model}`}
            className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
          >
            <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-medium" dir="ltr">
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
