export function HomeWrist() {
  return (
    <section
      data-stage="wrist"
      aria-labelledby="wrist-title"
      className="relative isolate flex h-[130dvh] flex-col items-center gap-6 overflow-hidden px-4 pt-[32dvh] text-center sm:px-6"
    >
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70 warm-glow" />
      <p className="font-mono text-[11px] text-muted-foreground uppercase" dir="ltr">
        Powered by your wrist
      </p>
      <h2
        id="wrist-title"
        className="text-6xl leading-[1.1] font-black text-balance sm:text-8xl lg:text-[8rem]"
      >
        با نیروی مچ شما
      </h2>
      <p className="max-w-xl leading-8 text-muted-foreground">
        روتور نیم‌دایره با هر تکان دست می‌چرخد و فنر اصلی را کوک می‌کند. تا وقتی ساعت را می‌بندید،
        هیچ باتری‌ای لازم نیست؛ انرژی‌اش از خود شماست.
      </p>
    </section>
  );
}
