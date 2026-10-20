/**
 * Reference calibre for the hero animation: Zenith El Primero 400 (1969), one of the first
 * automatic integrated chronographs and the archetypal high-beat (5 Hz) movement.
 * The drawing is an artistic interpretation, not a technical reproduction.
 */
export const REFERENCE_CALIBRE = {
  name: "Zenith El Primero 400",
  year: 1969,
  frequencyVph: 36_000,
  frequencyHz: 5,
  beatsPerSecond: 10,
  jewels: 31,
  powerReserveHours: 50,
  components: 278,
  diameterMm: 30,
  thicknessMm: 6.6,
} as const;

export type LayerId = "case" | "plate" | "train" | "regulator" | "bridges" | "rotor" | "caseback";

export interface LayerSpec {
  id: LayerId;
  /** 0 = farthest from the viewer */
  depth: number;
  title: string;
  /** Pin position inside the 800×800 drawing */
  pin: { x: number; y: number } | null;
  fact: string;
  detail: string;
}

export const LAYERS: readonly LayerSpec[] = [
  {
    id: "case",
    depth: 0,
    title: "قاب",
    pin: null,
    fact: "۴۱ میلی‌متر",
    detail: "قاب میانی که موتور ۳۰ میلی‌متری در آن می‌نشیند.",
  },
  {
    id: "plate",
    depth: 1,
    title: "صفحه‌ی اصلی",
    pin: { x: 470, y: 690 },
    fact: "پرلاژ دستی",
    detail: "صفحه‌ی پایه با نقش دایره‌های هم‌پوشان پرلاژ که یکی‌یکی با دست زده می‌شوند.",
  },
  {
    id: "train",
    depth: 2,
    title: "چرخ‌دنده‌ها",
    pin: { x: 515, y: 455 },
    fact: "۲۷۸ قطعه",
    detail:
      "انرژی فنر از مخزن به چرخ مرکزی، سوم، چهارم و چرخ گریز می‌رسد. کل موتور الگو از ۲۷۸ قطعه ساخته شده است.",
  },
  {
    id: "regulator",
    depth: 3,
    title: "بالانس و چرخ ستونی",
    pin: { x: 250, y: 560 },
    fact: "۳۶٬۰۰۰ ضربان در ساعت",
    detail:
      "بالانس پنج بار در ثانیه نوسان می‌کند؛ یعنی ده ضربه‌ی تیک‌تاک در هر ثانیه. همین بسامد بالا، اندازه‌گیری یک‌دهم ثانیه را ممکن کرده است. چرخ ستونی آبی، استارت، توقف و صفر کردن کرونوگراف را فرمان می‌دهد.",
  },
  {
    id: "bridges",
    depth: 4,
    title: "پل‌ها و یاقوت‌ها",
    pin: { x: 585, y: 285 },
    fact: "۳۱ یاقوت",
    detail:
      "پل‌ها با نوارهای موجی ژنو تزئین شده‌اند و محور هر چرخ روی یاقوت مصنوعی می‌چرخد تا اصطکاک به حداقل برسد.",
  },
  {
    id: "rotor",
    depth: 5,
    title: "روتور",
    pin: { x: 400, y: 215 },
    fact: "۵۰ ساعت ذخیره‌ی انرژی",
    detail:
      "وزنه‌ی نوسانی با هر حرکت مچ، فنر اصلی را کوک می‌کند و ذخیره‌ای دست‌کم پنجاه ساعته فراهم می‌آورد.",
  },
  {
    id: "caseback",
    depth: 6,
    title: "درِ پشت",
    pin: null,
    fact: "پیچی، ۱۰ بار",
    detail: "درِ پشت پیچی با واشر، که برای دیدن موتور باز می‌شود.",
  },
] as const;

/** Visual layout of the drawing, in the 800×800 coordinate space. */
export const GEOMETRY = {
  center: { x: 400, y: 400 },
  movementRadius: 300,
  barrel: { x: 400, y: 232 },
  third: { x: 515, y: 455 },
  fourth: { x: 470, y: 560 },
  escape: { x: 372, y: 612 },
  pallet: { x: 316, y: 596 },
  balance: { x: 250, y: 560 },
  columnWheel: { x: 585, y: 285 },
  coupling: { x: 632, y: 380 },
  minuteCounter: { x: 520, y: 318 },
} as const;
