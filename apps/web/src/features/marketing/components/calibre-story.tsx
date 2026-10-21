import { REFERENCE_CALIBRE } from "@/features/movement";
import { formatNumber } from "@/lib/format";

const FACTS = [
  {
    value: formatNumber(REFERENCE_CALIBRE.frequencyVph),
    unit: "ضربان در ساعت",
    note: "۵ هرتز؛ دو برابر بیشتر ساعت‌های رایج",
  },
  {
    value: formatNumber(REFERENCE_CALIBRE.jewels),
    unit: "یاقوت",
    note: "یاتاقان‌های مصنوعی برای کمترین اصطکاک",
  },
  {
    value: `${formatNumber(REFERENCE_CALIBRE.powerReserveHours)}+`,
    unit: "ساعت ذخیره",
    note: "با یک بار کوک کامل",
  },
  {
    value: formatNumber(REFERENCE_CALIBRE.components),
    unit: "قطعه",
    note: "در قطر ۳۰ و ضخامت ۶٫۶ میلی‌متر",
  },
];

export function CalibreStory() {
  return (
    <section id="calibre" className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">موومنت مرجع</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            از سال ۱۹۶۹، <span dir="ltr">El Primero</span>
          </h2>
          <div className="flex flex-col gap-4 leading-8 text-muted-foreground">
            <p>
              انیمیشن بالای صفحه از کالیبر {REFERENCE_CALIBRE.name} الهام گرفته؛ یکی از نخستین
              کرونوگراف‌های اتوماتیک یکپارچه‌ی جهان که در ۱۹۶۹ معرفی شد و هنوز هم با بسامد ۳۶٬۰۰۰
              ضربان، معیار ساعت‌های پرضربان است.
            </p>
            <p>
              در ۱۹۷۵، وقتی بحران کوارتز کارخانه را به توقف تولید موتورهای مکانیکی واداشت، ساعت‌سازی
              به نام شارل ورمو نقشه‌ها، قالب‌ها و ابزارهای این کالیبر را مخفیانه در اتاقک زیر
              شیروانی پنهان کرد. چند سال بعد همان ابزارها بودند که تولید را دوباره ممکن کردند.
            </p>
            <p>
              کالیبر{" "}
              <span dir="ltr" className="font-mono">
                KR-P36
              </span>{" "}
              آتلیه همان معماری را دنبال می‌کند: چرخ ستونی، کلاچ افقی و بالانسی که ده بار در ثانیه
              نوسان می‌کند.
            </p>
          </div>
          <p className="border-s-2 border-gold/40 ps-4 text-xs leading-6 text-muted-foreground">
            کرونوس برندی ساختگی است. طرح موومنت تفسیری هنری است، نه نقشه‌ی فنی، و این فروشگاه هیچ
            وابستگی یا همکاری‌ای با Zenith ندارد.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px self-center overflow-hidden border border-border bg-border">
          {FACTS.map((fact) => (
            <div key={fact.unit} className="flex flex-col gap-2 bg-background p-6 md:p-8">
              <dt className="order-2 text-sm text-muted-foreground">{fact.unit}</dt>
              <dd className="order-1 font-display text-4xl text-gold tabular-nums md:text-5xl">
                {fact.value}
              </dd>
              <dd className="order-3 text-xs leading-5 text-muted-foreground">{fact.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
