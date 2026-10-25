import { Tag } from "@/components/atlas";

interface Feature {
  stage: string;
  title: string;
  body: string;
  chips: string[];
}

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

/* Four short entries in one ruled sheet, as the atlas sets its explainers: the gaps are the rules. */
export function HomeFeatures() {
  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:py-28"
    >
      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="features-title" className="title">
          موومنت، از نزدیک
        </h2>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground">
          چهار چیز که در یک موومنت اتوماتیک سوئیسی باید دید.
        </p>
      </div>
      <div className="grid gap-px border border-border bg-border md:grid-cols-2">
        {FEATURES.map((feature) => (
          <article
            key={feature.stage}
            data-stage={feature.stage}
            aria-labelledby={`${feature.stage}-title`}
            className="flex flex-col gap-4 bg-card p-6 sm:p-8"
          >
            <h3
              id={`${feature.stage}-title`}
              className="font-display text-2xl leading-snug sm:text-[1.75rem]"
            >
              {feature.title}
            </h3>
            <p className="max-w-[60ch] leading-8 text-muted-foreground">{feature.body}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-2">
              {feature.chips.map((chip) => (
                <li key={chip}>
                  <Tag latin={/^[A-Z]/.test(chip)}>{chip}</Tag>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
