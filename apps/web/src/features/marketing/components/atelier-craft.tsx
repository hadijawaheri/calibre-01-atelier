import { formatNumber } from "@/lib/format";

const STEPS = [
  {
    title: "تراش و پرداخت",
    body: "پل‌ها با نوارهای ژنو و صفحه‌ی اصلی با پرلاژ دستی پرداخت می‌شوند؛ هر پل حدود شش ساعت کار دست دارد.",
  },
  {
    title: "مونتاژ به دست یک نفر",
    body: "یک ساعت‌ساز همه‌ی قطعات یک موتور را مونتاژ می‌کند و نامش را پشت پل بالانس حک می‌کند.",
  },
  {
    title: "تنظیم در شش وضعیت",
    body: "هر موتور سه هفته در شش وضعیت و سه دما آزمایش می‌شود تا خطای روزانه کمتر از چهار ثانیه بماند.",
  },
];

export function AtelierCraft() {
  return (
    <section id="atelier" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">آتلیه</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            سیصد ساعت کار دست برای هر ساعت
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4 bg-background p-8">
              <span className="font-display text-5xl text-gold">{formatNumber(index + 1)}</span>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
