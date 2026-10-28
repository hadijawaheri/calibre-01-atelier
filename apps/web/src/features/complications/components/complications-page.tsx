import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader, SourceList, Spec, SpecGrid, Tag } from "@/components/atlas";
import { calibreBySlug } from "@/features/movement/calibres";
import { paths } from "@/lib/paths";

import { carriersOf } from "../carriers";
import type { Complication } from "../complications";
import { COMPLICATION_SOURCE, COMPLICATIONS } from "../complications";

const linkClass =
  "underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground";

function ComplicationArticle({
  complication,
  index,
}: {
  complication: Complication;
  index: number;
}) {
  const titleId = `${complication.slug}-title`;
  const { calibres, watches } = carriersOf(complication);
  const family = complication.labFamily ? calibreBySlug(complication.labFamily) : undefined;
  return (
    <article
      id={complication.slug}
      aria-labelledby={titleId}
      className="grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-14"
    >
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 border-b border-border pb-4">
          <p className="caps text-muted-foreground" dir="ltr">
            {`Fig. ${String(index + 1).padStart(2, "0")} · ${complication.latinName}`}
          </p>
          <h2 id={titleId} className="title">
            {complication.name}
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">{complication.summary}</p>
        </header>
        {complication.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="max-w-[68ch] leading-8 text-foreground/85">
            {paragraph}
          </p>
        ))}
      </div>

      <aside className="flex flex-col gap-8">
        <SpecGrid>
          {complication.specs.map((spec) => (
            <Spec key={spec.label} label={spec.label} value={spec.value} latin={spec.latin} />
          ))}
        </SpecGrid>

        <section aria-labelledby={`${complication.slug}-where`} className="flex flex-col gap-3">
          <h3 id={`${complication.slug}-where`} className="label">
            در کرونوس
          </h3>
          {calibres.length > 0 || watches.length > 0 || family ? (
            <ul className="flex flex-wrap gap-2">
              {watches.map((watch) => (
                <li key={watch.slug}>
                  <Link href={paths.watch(watch.slug)} className="group">
                    <Tag
                      tone="ink"
                      className="transition-colors duration-300 group-hover:text-metal-ink"
                    >
                      {watch.name}
                    </Tag>
                  </Link>
                </li>
              ))}
              {calibres.map((calibre) => (
                <li key={calibre.slug}>
                  <Link href={paths.calibre(calibre.slug)} className="group">
                    <Tag className="transition-colors duration-300 group-hover:text-foreground">
                      <bdi dir="ltr">{calibre.name}</bdi>
                    </Tag>
                  </Link>
                </li>
              ))}
              {family && (
                <li>
                  <Link
                    href={paths.labCalibre(family.slug)}
                    className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground ${linkClass}`}
                  >
                    {family.name} را سه‌بعدی ببینید
                    <ArrowLeft aria-hidden className="size-3.5" />
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              هنوز ساعتی با این کمپلیکیشن در کرونوس ثبت نشده است.
            </p>
          )}
        </section>

        <SourceList id={`${complication.slug}-sources`} sources={complication.sources} />
      </aside>
    </article>
  );
}

export function ComplicationsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="کمپلیکیشن‌ها"
        reference={`Complications · ${COMPLICATIONS.length} mechanisms`}
        intro={
          <>
            کمپلیکیشن هر کاری است که ساعت جز نشان دادن ساعت، دقیقه و ثانیه انجام می‌دهد. یک
            کرونوگراف ساده با تاریخ ممکن است تا ۲۵۰ قطعه داشته باشد و ساعت‌های بسیار پیچیده هزار
            قطعه یا بیشتر. از رایج‌ترین تا کمیاب‌ترین، با سازوکار و تاریخچه و منبع هر کدام.{" "}
            <a
              href={COMPLICATION_SOURCE.url}
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className={linkClass}
            >
              {COMPLICATION_SOURCE.label}
            </a>
          </>
        }
      >
        <nav aria-label="کمپلیکیشن‌ها" className="flex flex-wrap gap-2 pt-2">
          {COMPLICATIONS.map((complication) => (
            <a
              key={complication.slug}
              href={`#${complication.slug}`}
              className="border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {complication.name}
            </a>
          ))}
        </nav>
      </PageHeader>
      {COMPLICATIONS.map((complication, index) => (
        <ComplicationArticle key={complication.slug} complication={complication} index={index} />
      ))}
    </div>
  );
}
