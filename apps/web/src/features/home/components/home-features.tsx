interface Feature {
  stage: string;
  number: string;
  label: string;
  title: string;
  body: string;
  chips: string[];
}

/* Each feature holds the screen while the movement beside it shows what the words describe. */
const FEATURES: readonly Feature[] = [
  {
    stage: "feature-heart",
    number: "۰۱",
    label: "The heart",
    title: "هشت ضربه در هر ثانیه",
    body: "چرخ بالانس طلایی ۲۸٬۸۰۰ بار در ساعت از وسط عبور می‌کند. روتور نیم‌دایره با هر حرکت مچ فنر اصلی را کوک می‌کند تا ساعت، از دست که باز شد، یک روز و نیم دیگر هم کار کند.",
    chips: ["بدون باتری", "۲۵ یاقوت", "۳۸ ساعت ذخیرهٔ انرژی"],
  },
  {
    stage: "feature-sides",
    number: "۰۲",
    label: "Two faces",
    title: "پشتش برای صاحبش، رویش برای همه",
    body: "زیر صفحهٔ ساعت دنیای دیگری است: حلقهٔ تاریخ ۱ تا ۳۱ و چرخ‌های کوچکی که عقربه‌ها را می‌گردانند. هر نیمه‌شب، یک دندانه تاریخ را یک روز جلو می‌برد.",
    chips: ["حلقهٔ تاریخ", "چرخ‌های زیر صفحه", "میل کوک"],
  },
  {
    stage: "feature-accuracy",
    number: "۰۳",
    label: "Chronometer",
    title: "دقتی که آزمایش می‌شود",
    body: "عنوان کرونومتر را مؤسسهٔ COSC می‌دهد: موومنت پانزده روز، در پنج وضعیت و سه دمای مختلف آزمایش می‌شود و خطای روزانهٔ میانگینش باید بین ۴ ثانیه عقب و ۶ ثانیه جلو بماند.",
    chips: ["COSC", "۵ وضعیت", "۳ دما"],
  },
  {
    stage: "feature-finish",
    number: "۰۴",
    label: "Finissage",
    title: "زیبایی‌ای که فقط صاحبش می‌بیند",
    body: "نوارهای کوت دو ژنو روی پل‌ها، دایره‌های پرلاژ روی صفحه، پیچ‌های آبی‌شده در حرارت و لبه‌هایی که با دست پخ و صیقل می‌خورند. هیچ‌کدام دقت را بیشتر نمی‌کنند؛ فقط نشان می‌دهند کسی وقت گذاشته است.",
    chips: ["کوت دو ژنو", "پرلاژ", "پیچ آبی", "پخ‌زنی دستی"],
  },
];

export function HomeFeatures() {
  return (
    <section aria-label="ویژگی‌ها" className="mx-auto max-w-7xl px-4 sm:px-6">
      {FEATURES.map((feature) => (
        <article
          key={feature.stage}
          data-stage={feature.stage}
          aria-labelledby={`${feature.stage}-title`}
          className="flex min-h-dvh items-center py-24 max-lg:items-end max-lg:pt-[52vh]"
        >
          <div className="flex max-w-xl flex-col gap-6 border-t border-border pt-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-6xl text-gold">{feature.number}</span>
              <span className="font-mono text-[11px] text-muted-foreground uppercase" dir="ltr">
                {feature.label}
              </span>
            </div>
            <h2
              id={`${feature.stage}-title`}
              className="text-3xl leading-tight font-semibold text-balance sm:text-5xl"
            >
              {feature.title}
            </h2>
            <p className="leading-8 text-muted-foreground">{feature.body}</p>
            <ul className="flex flex-wrap gap-2">
              {feature.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}
