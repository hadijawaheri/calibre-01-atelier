import { StillMovement } from "./still-movement";

interface Feature {
  stage: string;
  title: string;
  body: string;
  chips: string[];
}

/* Each feature holds the screen while the movement beside it shows what the words describe. */
const FEATURES: readonly Feature[] = [
  {
    stage: "feature-heart",
    title: "هشت ضربه در هر ثانیه",
    body: "چرخ بالانس طلایی ۲۸٬۸۰۰ بار در ساعت از وسط عبور می‌کند. روتور نیم‌دایره با هر حرکت مچ فنر اصلی را کوک می‌کند تا ساعت، از دست که باز شد، یک روز و نیم دیگر هم کار کند.",
    chips: ["بدون باتری", "۲۵ یاقوت", "۳۸ ساعت ذخیرهٔ انرژی"],
  },
  {
    stage: "feature-sides",
    title: "پشتش برای صاحبش، رویش برای همه",
    body: "زیر صفحهٔ ساعت دنیای دیگری است: حلقهٔ تاریخ ۱ تا ۳۱ و چرخ‌های کوچکی که عقربه‌ها را می‌گردانند. هر نیمه‌شب، یک دندانه تاریخ را یک روز جلو می‌برد.",
    chips: ["حلقهٔ تاریخ", "چرخ‌های زیر صفحه", "میل کوک"],
  },
  {
    stage: "feature-accuracy",
    title: "دقتی که آزمایش می‌شود",
    body: "عنوان کرونومتر را مؤسسهٔ COSC می‌دهد: موومنت پانزده روز، در پنج وضعیت و سه دمای مختلف آزمایش می‌شود و خطای روزانهٔ میانگینش باید بین ۴ ثانیه عقب و ۶ ثانیه جلو بماند.",
    chips: ["COSC", "۵ وضعیت", "۳ دما"],
  },
  {
    stage: "feature-finish",
    title: "زیبایی‌ای که فقط صاحبش می‌بیند",
    body: "نوارهای کوت دو ژنو روی پل‌ها، دایره‌های پرلاژ روی صفحه، پیچ‌های آبی‌شده در حرارت و لبه‌هایی که با دست پخ و صیقل می‌خورند. هیچ‌کدام دقت را بیشتر نمی‌کنند؛ فقط نشان می‌دهند کسی وقت گذاشته است.",
    chips: ["کوت دو ژنو", "پرلاژ", "پیچ آبی", "پخ‌زنی دستی"],
  },
];

export function HomeFeatures() {
  return (
    <section aria-label="ویژگی‌ها" className="mx-auto max-w-7xl px-4 sm:px-8">
      {FEATURES.map((feature) => (
        <article
          key={feature.stage}
          data-stage={feature.stage}
          aria-labelledby={`${feature.stage}-title`}
          className="flex min-h-dvh items-center justify-between gap-12 py-24 max-lg:flex-col-reverse max-lg:items-start max-lg:justify-end max-lg:pt-[52vh] [html:not([data-flight=on])_&]:max-lg:pt-24"
        >
          <div className="flex max-w-lg flex-col gap-6">
            <h2 id={`${feature.stage}-title`} className="display">
              {feature.title}
            </h2>
            <p className="leading-8 text-muted-foreground">{feature.body}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t hairline pt-5 text-xs text-foreground/80">
              {feature.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
          <StillMovement
            side={
              feature.stage === "feature-heart" || feature.stage === "feature-finish"
                ? "caseback"
                : "dial"
            }
            className="w-[min(90vw,36rem)] max-lg:self-center"
          />
        </article>
      ))}
    </section>
  );
}
