import { Gem, PenLine, ShieldCheck, Truck } from "lucide-react";

const SERVICES = [
  {
    icon: ShieldCheck,
    title: "ضمانت پنج‌ساله",
    body: "ضمانت بین‌المللی موتور و قاب، همراه گواهی اصالت با امضای ساعت‌ساز.",
  },
  {
    icon: Gem,
    title: "سرویس دوره‌ای",
    body: "سرویس کامل موتور هر پنج سال در کارگاه آتلیه، با قطعات اصلی.",
  },
  {
    icon: PenLine,
    title: "حکاکی اختصاصی",
    body: "متن دلخواه شما با قلم فولادی و به دست استادکار حکاک، پشت قاب.",
  },
  {
    icon: Truck,
    title: "تحویل بیمه‌شده",
    body: "ارسال رایگان با پیک اختصاصی و بیمه‌ی کامل در سراسر ایران.",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col gap-3">
            <Icon className="size-6 text-gold" aria-hidden />
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
