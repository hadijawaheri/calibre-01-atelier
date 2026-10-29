import { PageHeader } from "@/components/atlas";

import { TimegrapherTool } from "./timegrapher-tool";

const TIPS = [
  "در اتاقی ساکت، پشت ساعت را به میکروفون گوشی یا لپ‌تاپ بچسبانید؛ میکروفون گوشی معمولاً پایین آن است.",
  "چند ثانیه صبر کنید تا خوانش اول بیاید و بعد ساعت را تکان ندهید؛ هر جابه‌جایی صدای تازه‌ای می‌سازد.",
  "دقت ساعت با وضعیت آن تغییر می‌کند. صفحه رو به بالا و تاج رو به پایین را جدا بسنجید.",
  "این ابزار با میکروفون معمولی کار می‌کند، نه با حسگر پیزوی تایم‌گرافر واقعی. خوانش را تخمینی بدانید و دامنهٔ نوسان را اندازه نمی‌گیرد.",
];

export function TimegrapherPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="تایم‌گرافر"
        reference="Timegrapher · microphone"
        intro="تایم‌گرافر صدای تیک و تاک را با یک ساعت دقیق مقایسه می‌کند: ساعت روزی چند ثانیه جلو یا عقب می‌رود و تیک و تاکش چقدر هم‌فاصله‌اند. این یکی با میکروفون دستگاه خودتان کار می‌کند."
      />
      <TimegrapherTool />
      <section aria-labelledby="timegrapher-tips" className="flex flex-col gap-4">
        <h2 id="timegrapher-tips" className="border-b border-border pb-3 font-display text-2xl">
          برای خوانش بهتر
        </h2>
        <ol className="flex list-[persian] flex-col gap-2 ps-5 leading-8 text-foreground/85">
          {TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
