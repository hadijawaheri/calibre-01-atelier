export function HomeWrist() {
  return (
    <section
      data-stage="wrist"
      aria-labelledby="wrist-title"
      className="relative isolate flex h-[130dvh] flex-col items-center gap-6 overflow-hidden px-4 pt-[30dvh] text-center sm:px-8"
    >
      <h2 id="wrist-title" className="display">
        با نیروی مچ شما
      </h2>
      <p className="max-w-md leading-8 text-muted-foreground">
        روتور نیم‌دایره با هر تکان دست می‌چرخد و فنر اصلی را کوک می‌کند. تا وقتی ساعت را می‌بندید،
        هیچ باتری‌ای لازم نیست.
      </p>
      <p className="caps text-metal" dir="ltr">
        Powered by your wrist
      </p>
    </section>
  );
}
