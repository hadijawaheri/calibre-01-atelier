import type { SourceLink } from "@/components/atlas";
import type { CalibreFamily } from "@/features/movement/calibres";
import type { CalibreKind, ReferenceSpec } from "@/features/reference/types";

export interface Complication {
  slug: string;
  name: string;
  latinName: string;
  /** One line under the name: what the complication does for the wearer. */
  summary: string;
  /** How it works and where it came from, one paragraph each. */
  body: readonly string[];
  specs: readonly ReferenceSpec[];
  /** Calibres of the register that carry it, matched by their kind. */
  calibreKind?: CalibreKind;
  /** The lab family that shows it in 3D. */
  labFamily?: CalibreFamily;
  sources: readonly SourceLink[];
}

const wiki = (title: string, label = title.replaceAll("_", " ")) => ({
  label: `Wikipedia · ${label}`,
  url: `https://en.wikipedia.org/wiki/${title}`,
});

export const COMPLICATION_SOURCE = wiki("Complication_(horology)");

/* Ordered from the most common on a wrist to the rarest. Every date and figure is one a listed source states;
   where sources disagree on a first (as they do for the earliest wristwatch tourbillon) no year is given. */
export const COMPLICATIONS: readonly Complication[] = [
  {
    slug: "chronograph",
    name: "کرونوگراف",
    latinName: "Chronograph",
    summary: "یک کرنومتر داخل ساعت: با یک دکمه شروع می‌کند، با دکمهٔ دیگر می‌ایستد و صفر می‌شود.",
    body: [
      "کرونوگراف یک سازوکار زمان‌سنجی جدا از عقربه‌های ساعت دارد که به چرخ‌دندهٔ اصلی وصل و از آن جدا می‌شود. عقربهٔ ثانیهٔ کرونوگراف معمولاً در مرکز صفحه است و شمارنده‌های کوچک، دقیقه‌ها و ساعت‌های سپری‌شده را نگه می‌دارند.",
      "لویی مواینه اولین کرونوگراف را در ۱۸۱۶ برای رصد اجرام آسمانی ساخت. نیکولا ماتیو ریوسک در ۱۸۲۱ به خواست لویی هجدهم اولین کرونوگرافی را ساخت که به بازار رسید. در ۱۹۶۹ هویر، برایتلینگ، همیلتون و دوبوا-دپرا با هم کرونوگراف اتوماتیک ساختند و زنیت هم ال پریمرو را معرفی کرد.",
      "دو گونهٔ مشهور آن، فلای‌بک (پایین‌تر در همین صفحه) و راترپانت هستند. راترپانت یا کرونوگراف دوبل دو عقربهٔ ثانیه دارد که یکی را می‌شود جدا نگه داشت و دوباره راه انداخت.",
    ],
    specs: [
      { label: "اختراع", value: "لویی مواینه، ۱۸۱۶" },
      { label: "اولین کرونوگراف فروخته‌شده", value: "نیکولا ماتیو ریوسک، ۱۸۲۱" },
      { label: "اولین کرونوگراف‌های اتوماتیک", value: "۱۹۶۹" },
    ],
    calibreKind: "chronograph",
    sources: [wiki("Chronograph")],
  },
  {
    slug: "flyback",
    name: "کرونوگراف فلای‌بک",
    latinName: "Flyback chronograph",
    summary: "با یک فشار، کرونوگراف در حال کار صفر می‌شود و بی‌درنگ دوباره راه می‌افتد.",
    body: [
      "در کرونوگراف معمولی برای زمان‌گیری بعدی باید سه بار دکمه زد: یک بار برای ایستادن، یک بار برای صفر کردن و یک بار برای شروع دوباره. در فلای‌بک همهٔ این کارها با یک فشار انجام می‌شود.",
      "این سازوکار برای خلبان‌ها ساخته شد. با سرعت هواپیماها، هر ثانیه‌ای که صرف سه بار فشار دادن می‌شد یعنی پرواز بیشتر در مسیر نادرست؛ فلای‌بک زمان‌گیری پشت‌سرهم بخش‌های یک پرواز را دقیق‌تر کرد. لونژین حق اختراع آن را در ۱۲ ژوئن ۱۹۳۵ ثبت کرد و در ۱۶ ژوئن ۱۹۳۶ تأیید شد.",
    ],
    specs: [
      { label: "حق اختراع", value: "لونژین، ثبت ۱۹۳۵ و تأیید ۱۹۳۶" },
      { label: "کاربرد نخست", value: "زمان‌گیری بخش‌های پرواز" },
    ],
    sources: [wiki("Flyback_chronograph")],
  },
  {
    slug: "moon-phase",
    name: "فاز ماه",
    latinName: "Moon phase",
    summary: "قرص ماه پشت پنجره‌ای کوچک روی صفحه، همراه آسمان، کامل و هلال می‌شود.",
    body: [
      "ماه قمری تقریباً ۲۹٫۵ روز است و دو برابرش ۵۹ روز. ساده‌ترین نمایشگر فاز ماه دیسکی با ۵۹ دندانه و دو تصویر ماه است که هر روز یک دندانه جلو می‌رود؛ چنین دیسکی حدود هر دو سال و نیم یک روز از آسمان عقب می‌ماند و باید دستی تنظیم شود.",
      "ساعت‌های گران‌تر با چرخ‌دنده‌های دقیق‌تر کار می‌کنند. به نوشتهٔ جک فورستر، استاندارد صنعت ساعت‌های لوکس سال‌هاست دست‌کم یک روز خطا در ۱۲۲ سال است.",
    ],
    specs: [
      { label: "دیسک ساده", value: "۵۹ دندانه، دو ماه، یک دندانه در روز" },
      { label: "خطای دیسک ساده", value: "یک روز در حدود دو سال و نیم" },
      { label: "نسخهٔ دقیق", value: "دست‌کم یک روز در ۱۲۲ سال" },
    ],
    sources: [
      {
        label: "Jack Forster · Who's Up For A REALLY Accurate Moonphase?",
        url: "https://jackforster.substack.com/p/challenge-to-watchmakers-whos-up",
      },
    ],
  },
  {
    slug: "world-time",
    name: "ساعت جهانی",
    latinName: "World time",
    summary: "ساعت همهٔ ۲۴ منطقهٔ زمانی دنیا با یک نگاه، بی آنکه عقربه‌ای جابه‌جا شود.",
    body: [
      "لویی کوتیه، ساعت‌ساز اهل کاروژ کنار ژنو، پس از آنکه در پی رکود بزرگ کارش را از دست داد، در کارگاه خانگی‌اش این سازوکار را در ۱۹۳۱ کامل کرد: یک حلقهٔ ثابت با نام شهرهای جهان، یک حلقهٔ ۲۴ساعته که می‌چرخد، و یک جفت عقربهٔ معمولی در مرکز.",
      "ساعت هر شهر را روی حلقهٔ ۲۴ساعته روبه‌روی نام آن شهر می‌خوانید. ماژول کوتیه را برندهایی چون پتک فیلیپ، واشرون کنستانتین، رولکس و آگاسیز به کار بردند.",
    ],
    specs: [
      { label: "سازنده", value: "لویی کوتیه، ۱۹۳۱" },
      { label: "اجزا", value: "حلقهٔ ثابت شهرها، حلقهٔ چرخان ۲۴ساعته" },
    ],
    sources: [
      {
        label: "SJX Watches · In Depth: Louis Cottier's Legacy",
        url: "https://watchesbysjx.com/2026/08/louis-cottier-profile.html",
      },
    ],
  },
  {
    slug: "perpetual-calendar",
    name: "تقویم دائمی",
    latinName: "Perpetual calendar",
    summary: "تاریخی که ماه‌های ۳۰ و ۳۱روزه، فوریهٔ ۲۸روزه و سال کبیسه را خودش می‌شناسد.",
    body: [
      "تقویم دائمی فقط ماه‌های ۳۰ و ۳۱روزه را نمی‌شناسد؛ فوریهٔ ۲۸روزه و ۲۹روزهٔ سال‌های کبیسه را هم می‌داند. قلب بیشتر تقویم‌های دائمی امروزی بادامکی ۴۸ماهه است که یک چرخهٔ چهارساله را نشان می‌دهد و در همین مدت یک دور کامل می‌زند.",
      "اگر ساعت از کار نیفتد، تاریخ آن فقط یک بار به تنظیم دستی نیاز دارد: سال ۲۱۰۰، که تقویم میلادی استثنائاً آن را کبیسه حساب نمی‌کند. توماس ماج، ساعت‌ساز انگلیسی، حدود ۱۷۶۲ اولین تقویم دائمی را در یک ساعت جیبی ساخت. پتک فیلیپ مرجع 97975 که در ۱۹۲۵ ساخته شد، اولین ساعت مچی با تقویم دائمی شناخته می‌شود و مرجع 1526 در ۱۹۴۱ اولین تقویم دائمی مچی بود که سری‌سازی شد.",
    ],
    specs: [
      { label: "اولین ساعت جیبی", value: "توماس ماج، حدود ۱۷۶۲" },
      { label: "اولین ساعت مچی", value: "پتک فیلیپ 97975، ۱۹۲۵" },
      { label: "تنظیم دستی بعدی", value: "سال ۲۱۰۰" },
    ],
    sources: [
      {
        label: "Swisswatches Magazine · What Is a Perpetual Calendar Watch?",
        url: "https://swisswatches-magazine.com/what-is-a-perpetual-calendar-watch/",
      },
    ],
  },
  {
    slug: "tourbillon",
    name: "توربیون",
    latinName: "Tourbillon",
    summary: "بالانس و اسکیپمنت در قفسه‌ای که دور خودش می‌چرخد تا اثر جاذبه میانگین شود.",
    body: [
      "وقتی ساعت جیبی در جیب عمودی می‌ایستد، جاذبه نظم بالانس را به هم می‌زند. توربیون کل اسکیپمنت و بالانس را در قفسه‌ای می‌گذارد که در فاصله‌های منظم ۳۶۰ درجه می‌چرخد تا این خطاها میانگین شوند. اگر قفسه دقیقاً دقیقه‌ای یک دور بزند، می‌تواند جای عقربهٔ ثانیه هم کار کند.",
      "ایده از جان آرنولد، ساعت‌ساز انگلیسی، بود و دوستش آبراهام لویی برگه آن را پرورد و در ۲۶ ژوئن ۱۸۰۱ به نام خود ثبت کرد. توربیون تا میانهٔ قرن بیستم به ساعت مچی نرسید و نمونه‌های اول، از جمله کار پتک فیلیپ، لیپ و امگا، بسیار کم ساخته شدند.",
    ],
    specs: [
      { label: "ایده", value: "جان آرنولد" },
      { label: "حق اختراع", value: "آبراهام لویی برگه، ۲۶ ژوئن ۱۸۰۱" },
      { label: "در ساعت مچی", value: "از میانهٔ قرن بیستم" },
    ],
    labFamily: "tourbillon",
    sources: [wiki("Tourbillon")],
  },
  {
    slug: "minute-repeater",
    name: "ریپیتر دقیقه‌شمار",
    latinName: "Minute repeater",
    summary: "با کشیدن یک اهرم، ساعت زمان را با صدای چکش روی سیم‌های کوک‌شده می‌نوازد.",
    body: [
      "ریپیترها پیش از رواج روشنایی مصنوعی ساخته شدند تا بشود در تاریکی ساعت را فهمید، و نابینایان هم از آن‌ها استفاده می‌کردند. ادوارد بارلو، کشیش و مخترع انگلیسی، ساعت دیواری زنگ‌دار را در ۱۶۷۶ اختراع کرد و او و دنیل کوئر هر دو اختراع ساعت جیبی زنگ‌دار را کمی پیش از ۱۷۰۰ به خود نسبت دادند.",
      "ریپیتر دقیقه‌شمار اول ساعت‌ها را با صدای بم می‌زند، بعد ربع‌ها را با دو صدای «دینگ-دانگ» و در آخر دقیقه‌های پس از آخرین ربع را با صدای زیر. چون سه گانگ در یک موومنت جا نمی‌شود، تقریباً همهٔ ریپیترها دو گانگ دارند که دو سر یک سیم‌اند، و صدای سوم از زدن پشت‌سرهم هر دو ساخته می‌شود.",
    ],
    specs: [
      { label: "اولین ساعت زنگ‌دار", value: "ادوارد بارلو، ۱۶۷۶" },
      { label: "ترتیب صداها", value: "ساعت بم، ربع دوصدایی، دقیقه زیر" },
      { label: "صدا", value: "چکش‌های کوچک روی دو گانگ سیمی" },
    ],
    sources: [wiki("Repeater_(horology)")],
  },
];

export const complicationBySlug = (slug: string) =>
  COMPLICATIONS.find((complication) => complication.slug === slug);
