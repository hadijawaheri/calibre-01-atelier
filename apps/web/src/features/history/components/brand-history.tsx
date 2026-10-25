import { FigurePlate, PageHeader, Spec, SpecGrid } from "@/components/atlas";

import type { BrandHistory } from "../brands";
import { BRAND_HISTORIES } from "../brands";

const plateNumber = (index: number) =>
  `Pl. ${String(index + 1).padStart(2, "0")} / ${String(BRAND_HISTORIES.length).padStart(2, "0")}`;

/* One brand as an atlas entry: the long read on the main column, the plate and the facts beside it. */
function BrandEntry({ brand, index }: { brand: BrandHistory; index: number }) {
  const titleId = `${brand.slug}-title`;
  return (
    <article
      id={brand.slug}
      aria-labelledby={titleId}
      className="grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-12 border-t border-border pt-14 first-of-type:border-t-0 first-of-type:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16"
    >
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-3">
          <h2 id={titleId} className="title">
            {brand.name}
          </h2>
          <p className="font-mono text-xs text-muted-foreground" dir="ltr">
            {brand.latinName}
          </p>
          <p className="text-lg leading-8 text-muted-foreground">{brand.tagline}</p>
        </header>

        <section aria-labelledby={`${brand.slug}-story`} className="flex flex-col gap-4">
          <h3 id={`${brand.slug}-story`} className="label">
            شرایط و انگیزه شروع
          </h3>
          <p className="max-w-[68ch] leading-8 text-foreground/85">{brand.story}</p>
        </section>

        <section aria-labelledby={`${brand.slug}-milestones`} className="flex flex-col gap-4">
          <h3 id={`${brand.slug}-milestones`} className="label">
            اولین ساعت شاخص
          </h3>
          <ol className="flex max-w-[68ch] flex-col gap-6">
            {brand.milestones.map((milestone, step) => (
              <li key={milestone.title} className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="grid size-7 place-items-center border border-border bg-card text-xs text-metal-ink tabular-nums">
                  {(step + 1).toLocaleString("fa-IR")}
                </span>
                <div className="flex flex-col gap-1">
                  <h4 className="font-display text-xl leading-8">{milestone.title}</h4>
                  <p className="leading-8 text-foreground/85">{milestone.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
        <FigurePlate
          src={brand.image.src}
          alt={brand.image.alt}
          caption={`موومنت کرونوس، نه ساعتی از ${brand.name}`}
          number={plateNumber(index)}
          sizes="(max-width: 1023px) 100vw, 26rem"
        />
        <SpecGrid className="grid-cols-1">
          <Spec label="سال تأسیس" value={brand.founded} />
          <Spec label="مکان" value={brand.place} />
          <Spec label={brand.foundersLabel} value={brand.founders} />
        </SpecGrid>
      </aside>
    </article>
  );
}

export function BrandHistoryPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="تاریخچهٔ برندهای ساعت"
        reference={`Watch houses · ${BRAND_HISTORIES.length} brands`}
        intro="شش نام، شش راه متفاوت به زمان: از ژنوی قرن نوزدهم تا کارخانه‌های توکیو. هر کدام کجا و چطور شروع شد و کدام ساعت نامش را ماندگار کرد."
      >
        <nav aria-label="برندها" className="flex flex-wrap gap-2 pt-2">
          {BRAND_HISTORIES.map((brand) => (
            <a
              key={brand.slug}
              href={`#${brand.slug}`}
              className="border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {brand.name}
            </a>
          ))}
        </nav>
      </PageHeader>
      {BRAND_HISTORIES.map((brand, index) => (
        <BrandEntry key={brand.slug} brand={brand} index={index} />
      ))}
    </div>
  );
}
