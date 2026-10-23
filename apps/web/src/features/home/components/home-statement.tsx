import { StillMovement } from "./still-movement";

/* The text holds the top of the screen; the travelling movement tilts onto its edge below it, the way
   oryzo lifts its object under a headline and its answer. */
export function HomeStatement() {
  return (
    <section
      data-stage="statement"
      aria-labelledby="statement-title"
      className="mx-auto grid h-[130dvh] max-w-7xl content-start items-end gap-8 px-4 pt-[28dvh] sm:px-8 lg:grid-cols-[1fr_minmax(0,20rem)]"
    >
      <h2 id="statement-title" className="max-w-[12ch] display">
        فقط یک ساعت نیست.
      </h2>
      <p className="max-w-xs leading-8 text-muted-foreground lg:justify-self-end">
        زیر هر صفحهٔ ساعت مکانیکی، ماشینی است که با دست مونتاژ شده: فنری که انرژی را نگه می‌دارد،
        چرخ‌هایی که آن را تقسیم می‌کنند و چرخی طلایی که آن را به ثانیه‌های برابر تبدیل می‌کند.
      </p>
      <StillMovement className="mt-[12dvh] w-[min(80vw,36rem)] justify-self-center lg:col-span-2" />
    </section>
  );
}
