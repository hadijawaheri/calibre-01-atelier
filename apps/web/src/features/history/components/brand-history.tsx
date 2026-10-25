import Image from "next/image";

import type { BrandHistory } from "../brands";
import { BRAND_HISTORIES } from "../brands";

function BrandFacts({ brand }: { brand: BrandHistory }) {
  const facts = [
    { label: "سال تأسیس", value: brand.founded },
    { label: "مکان", value: brand.place },
    { label: brand.foundersLabel, value: brand.founders },
  ];
  return (
    <dl className="flex flex-col border-t hairline">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="grid gap-1 border-b border-border py-4 text-sm sm:grid-cols-[9rem_1fr] sm:gap-6"
        >
          <dt className="text-muted-foreground">{fact.label}</dt>
          <dd className="leading-7">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* One brand as a long read: the photograph and the facts side by side, then the story and its landmarks. */
function BrandEntry({ brand, index }: { brand: BrandHistory; index: number }) {
  const titleId = `${brand.slug}-title`;
  return (
    <article
      id={brand.slug}
      aria-labelledby={titleId}
      className="flex scroll-mt-24 flex-col gap-12"
    >
      <header className="flex flex-col gap-4">
        <span className="self-start caps text-metal-ink tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, "0")} / {String(BRAND_HISTORIES.length).padStart(2, "0")}
          {" · "}
          {brand.latinName}
        </span>
        <h2 id={titleId} className="font-display text-4xl leading-tight sm:text-5xl">
          {brand.name}
        </h2>
        <p className="text-lg text-muted-foreground">{brand.tagline}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <figure className="flex flex-col gap-3">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface">
            <Image
              src={brand.image.src}
              alt={brand.image.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 40rem"
              className="object-cover"
            />
          </div>
          <figcaption className="text-xs text-muted-foreground">
            تصویر: موومنت کرونوس، نه ساعتی از {brand.name}
          </figcaption>
        </figure>
        <BrandFacts brand={brand} />
      </div>

      <section aria-labelledby={`${brand.slug}-story`} className="flex flex-col gap-6">
        <h3
          id={`${brand.slug}-story`}
          className="border-b hairline pb-4 text-xs text-muted-foreground"
        >
          شرایط و انگیزه شروع
        </h3>
        <p className="max-w-[65ch] leading-8 text-foreground/85">{brand.story}</p>
      </section>

      <section aria-labelledby={`${brand.slug}-milestones`} className="flex flex-col gap-6">
        <h3
          id={`${brand.slug}-milestones`}
          className="border-b hairline pb-4 text-xs text-muted-foreground"
        >
          اولین ساعت شاخص
        </h3>
        <ol className="flex max-w-[65ch] flex-col gap-8">
          {brand.milestones.map((milestone, step) => (
            <li key={milestone.title} className="grid grid-cols-[1.5rem_1fr] gap-4">
              <span className="text-xs leading-8 text-metal-ink tabular-nums">
                {(step + 1).toLocaleString("fa-IR")}
              </span>
              <div className="flex flex-col gap-2">
                <h4 className="font-display text-xl leading-8">{milestone.title}</h4>
                <p className="leading-8 text-foreground/85">{milestone.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

export function BrandHistoryPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-24 px-4 pt-40 pb-32 sm:px-8">
      <header className="flex flex-col items-center gap-6 text-center">
        <h1 className="max-w-[22ch] display">تاریخچهٔ برندهای ساعت</h1>
        <p className="max-w-lg leading-8 text-muted-foreground">
          شش نام، شش راه متفاوت به زمان: از ژنوی قرن نوزدهم تا کارخانه‌های توکیو. هر کدام کجا و چطور
          شروع شد و کدام ساعت نامش را ماندگار کرد.
        </p>
        <nav aria-label="برندها" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {BRAND_HISTORIES.map((brand) => (
            <a
              key={brand.slug}
              href={`#${brand.slug}`}
              className="text-muted-foreground transition-colors duration-500 hover:text-foreground"
            >
              {brand.name}
            </a>
          ))}
        </nav>
      </header>
      {BRAND_HISTORIES.map((brand, index) => (
        <BrandEntry key={brand.slug} brand={brand} index={index} />
      ))}
    </div>
  );
}
