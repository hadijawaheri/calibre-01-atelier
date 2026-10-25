import { Spec, SpecGrid } from "@/components/atlas";

import { StillMovement } from "./still-movement";

/* Two entries of the atlas, set like a museum label beside its object: what the movement is, then where
   its energy comes from. */
export function HomeStatement() {
  return (
    <div className="border-y border-border bg-secondary/50">
      <section
        data-stage="statement"
        aria-labelledby="statement-title"
        className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24"
      >
        <div className="flex flex-col gap-5">
          <h2 id="statement-title" className="display">
            فقط یک ساعت نیست.
          </h2>
          <p className="max-w-lg leading-8 text-muted-foreground">
            زیر هر صفحهٔ ساعت مکانیکی، ماشینی است که با دست مونتاژ شده: فنری که انرژی را نگه
            می‌دارد، چرخ‌هایی که آن را تقسیم می‌کنند و چرخی طلایی که آن را به ثانیه‌های برابر تبدیل
            می‌کند.
          </p>
        </div>
        <figure className="flex flex-col plate">
          <div className="px-6 py-10 sm:px-10">
            <StillMovement />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 border-t border-border px-4 py-3 text-sm">
            <span>موومنت اتوماتیک سوئیسی، از سمت پشت</span>
            <span className="shrink-0 caps whitespace-nowrap text-muted-foreground" dir="ltr">
              Fig. 1 · Caseback
            </span>
          </figcaption>
        </figure>
      </section>

      <section
        data-stage="wrist"
        aria-labelledby="wrist-title"
        className="mx-auto grid max-w-7xl items-start gap-10 border-t border-border px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24"
      >
        <div className="flex flex-col gap-5">
          <h2 id="wrist-title" className="display">
            با نیروی مچ شما
          </h2>
          <p className="max-w-lg leading-8 text-muted-foreground">
            روتور نیم‌دایره با هر تکان دست می‌چرخد و فنر اصلی را کوک می‌کند. تا وقتی ساعت را
            می‌بندید، هیچ باتری‌ای لازم نیست.
          </p>
        </div>
        <SpecGrid className="grid-cols-2 sm:grid-cols-3">
          <Spec label="منبع انرژی" value="فنر اصلی در بشکه" />
          <Spec label="کوک" value="خودکار دوطرفه و دستی" />
          <Spec label="ذخیرهٔ انرژی" value="حدود ۴۲ ساعت" />
          <Spec label="باتری" value="ندارد" />
          <Spec label="فرکانس" value="۴ هرتز" />
          <Spec label="Rotor" value="Bidirectional" latin />
        </SpecGrid>
      </section>
    </div>
  );
}
