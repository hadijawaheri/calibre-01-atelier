import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

const FIGURES = [
  { value: "۲۸٬۸۰۰", label: "ضربه در ساعت", note: "بالانس هشت بار در ثانیه از وسط عبور می‌کند." },
  {
    value: "۳۸",
    label: "ساعت ذخیرهٔ انرژی",
    note: "از یک فنر فولادی که کمی بیشتر از پنج دور پیچیده شده.",
  },
  {
    value: "۲۵",
    label: "یاقوت",
    note: "در محل چرخش محورها، تا اصطکاک و سایش تقریباً به صفر برسد.",
  },
] as const;

export function HomeIntro() {
  return (
    <section
      aria-labelledby="intro-title"
      className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-28 sm:px-6"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <p className="eyebrow">چرا ساعت مکانیکی؟</p>
          <h2
            id="intro-title"
            className="text-3xl leading-tight font-semibold text-balance sm:text-4xl"
          >
            وقتی گوشی ساعت دقیق‌تری دارد، چرا کسی برای یک ساعت مکانیکی هزینه می‌کند؟
          </h2>
        </div>
        <div className="flex flex-col gap-5 leading-8 text-muted-foreground">
          <p>
            چون یک ساعت مکانیکی کوچک‌ترین ماشین کاملی است که انسان روی بدنش حمل می‌کند. بدون باتری و
            بدون مدار، فقط با یک فنر و چند ده قطعهٔ فلزی که بعضی‌شان از دانهٔ برنج کوچک‌ترند، روزها
            و سال‌ها زمان را نگه می‌دارد.
          </p>
          <p>
            کرونوس برای همین ساخته شده: تا ببینید درون این ماشین چه می‌گذرد، بدانید هر برند از کجا و
            به دست چه کسانی شروع شد، و بفهمید چرا بعضی از این ساعت‌ها به قیمت یک خانه می‌رسند.
          </p>
        </div>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {FIGURES.map((figure) => (
          <div key={figure.label} className="flex flex-col gap-2 bg-background p-8">
            <dt className="order-2 text-sm font-medium">{figure.label}</dt>
            <dd className="order-1 font-display text-5xl text-gold">{figure.value}</dd>
            <dd className="order-3 text-sm leading-7 text-muted-foreground">{figure.note}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-2xl font-semibold">آزمایشگاه موومنت</h2>
          <p className="leading-8 text-muted-foreground">
            موومنت را بچرخانید، قطعه‌ها را از هم جدا کنید، روی هرکدام کلیک کنید و توضیحش را بخوانید.
            سرعت زمان را تا یک‌بیستم کم کنید تا حرکت لنگر و چرخ اسکیپمنت را ببینید.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={paths.labCalibre("automatic")}>
            ورود به آزمایشگاه
            <ArrowLeft data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
