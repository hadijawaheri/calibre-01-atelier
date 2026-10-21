/* The text holds the top of the screen; the travelling movement tilts onto its edge below it, the way
   oryzo lifts its object under a headline and its answer. */
export function HomeStatement() {
  return (
    <section
      data-stage="statement"
      aria-labelledby="statement-title"
      className="mx-auto grid h-[130dvh] max-w-7xl content-start items-start gap-6 px-4 pt-[30dvh] sm:px-6 lg:grid-cols-[1fr_minmax(0,22rem)]"
    >
      <h2
        id="statement-title"
        className="max-w-[12ch] text-5xl leading-[1.15] font-black text-balance sm:text-7xl"
      >
        فقط یک ساعت نیست.
      </h2>
      <div className="flex flex-col gap-4 lg:justify-self-end">
        <p className="eyebrow">دویست قطعه، یک کار</p>
        <p className="leading-8 text-muted-foreground">
          زیر هر صفحهٔ ساعت مکانیکی، ماشینی است که با دست مونتاژ شده: فنری که انرژی را نگه می‌دارد،
          چرخ‌هایی که آن را تقسیم می‌کنند و چرخی طلایی که آن را به ثانیه‌های برابر تبدیل می‌کند.
        </p>
      </div>
    </section>
  );
}
