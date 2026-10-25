import type { PhotoCredit, SourceLink } from "@/components/atlas";

import type { CadModel } from "./three/cad-model";

export type CalibreFamily = "automatic" | "ultra-thin" | "quartz" | "tourbillon";

export interface WatchExample {
  brand: string;
  model: string;
  /** The calibre inside, as the maker names it. */
  calibre: string;
  note: string;
}

export interface CalibreInfo {
  slug: string;
  family: CalibreFamily;
  name: string;
  /** The family in one word, for tabs and the header's category row. */
  shortName: string;
  /** The real calibre (or calibre family) the page describes. */
  reference: string;
  summary: string;
  /** How the mechanism works, one paragraph each. */
  howItWorks: string[];
  specs: { label: string; value: string }[];
  usedIn: WatchExample[];
  /** One line per row of the family comparison on the home page. */
  glance: { energy: string; accuracy: string; beat: string; signature: string };
  /** Whether a 3D model of this family is ready for the lab. */
  hasModel: boolean;
  /** The real movement's converted CAD file; without it the lab shows the procedural stand-in. */
  cad?: CadModel;
  /** A freely licensed photograph of a real movement of this family, credited under the plate. */
  photo?: { src: string; alt: string; caption: string; credit: PhotoCredit };
  /** The makers' pages and references the specs and examples were checked against. */
  sources: readonly SourceLink[];
}

export const CALIBRES: readonly CalibreInfo[] = [
  {
    slug: "automatic",
    family: "automatic",
    name: "اتوماتیک استاندارد سوئیسی",
    shortName: "اتوماتیک",
    reference: "ETA 2824-2 / Sellita SW200",
    summary:
      "مشهورترین، قابل‌اعتمادترین و پرکاربردترین موومنت اتوماتیک سوئیسی در دوران معاصر: کوک خودکار با روتور، ثانیه‌شمار مرکزی و فرکانس ۴ هرتز. همان چیزی که در قلب صدها مدل ساعت سوئیسی می‌تپد.",
    howItWorks: [
      "روتور نیم‌دایره با حرکت مچ می‌چرخد. چرخ‌های معکوس‌کننده حرکت دو طرفهٔ آن را یک‌طرفه می‌کنند و از راه چرخ ضامن، فنر اصلی داخل بشکه را کوک می‌کنند.",
      "فنر اصلی انرژی را آرام پس می‌دهد. قطار چرخ‌دنده‌ها این حرکت کند و پرقدرت را قدم‌به‌قدم سریع‌تر می‌کند تا به چرخ اسکیپمنت برسد.",
      "لنگر، چرخ اسکیپمنت را قفل و هشت بار در ثانیه نیم دندانه رها می‌کند و در هر ضربه هُل کوچکی به چرخ بالانس می‌دهد. نوسان منظم بالانس و فنر موئی، ریتم زمان را می‌سازد.",
    ],
    specs: [
      { label: "فرکانس", value: "۲۸٬۸۰۰ ضربه در ساعت (۴ هرتز)" },
      { label: "ذخیرهٔ انرژی", value: "حدود ۴۲ ساعت (ETA)؛ حدود ۴۱ ساعت (SW200-1)" },
      { label: "قطر", value: "۲۵٫۶ میلی‌متر" },
      { label: "ضخامت", value: "۴٫۶ میلی‌متر" },
      { label: "یاقوت", value: "۲۵ عدد (ETA)؛ ۲۶ عدد (SW200-1)" },
      { label: "اسکیپمنت", value: "لنگری سوئیسی، چرخ ۱۵ دندانه" },
      { label: "کوک", value: "خودکار دوطرفه و دستی" },
    ],
    usedIn: [
      {
        brand: "Tissot",
        model: "Le Locle / Visodate",
        calibre: "ETA 2824 · Powermatic 80",
        note: "Powermatic 80 نسخهٔ بازطراحی‌شدهٔ همین خانواده با ذخیرهٔ انرژی ۸۰ ساعته است.",
      },
      {
        brand: "Hamilton",
        model: "Khaki Field Auto",
        calibre: "H-10 (از خانوادهٔ ۲۸۲۴)",
        note: "ساعت نظامی نمادین همیلتون روی همین معماری ساخته شده و ذخیرهٔ انرژی‌اش به ۸۰ ساعت رسیده است.",
      },
      {
        brand: "Oris",
        model: "Aquis Date",
        calibre: "Oris 733 (بر پایهٔ SW200-1)",
        note: "غواصی محبوب اوریس سال‌ها با این کالیبر عرضه شد.",
      },
      {
        brand: "Tudor",
        model: "Heritage Black Bay",
        calibre: "ETA 2824 تغییریافته",
        note: "در نسل اول، پیش از کالیبرهای اختصاصی تودور، نسخهٔ رگوله‌شدهٔ ۲۸۲۴ در آن کار می‌کرد.",
      },
    ],
    glance: {
      energy: "فنر، کوک با حرکت مچ",
      accuracy: "حدود ±۱۲ ثانیه در روز؛ نسخهٔ کرونومتر ‎−۴ تا ‎+۶",
      beat: "۸ ضربه در ثانیه",
      signature: "روتور نیم‌دایره",
    },
    hasModel: true,
    photo: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/ETA-2824-A2-WP-de.JPG/1280px-ETA-2824-A2-WP-de.JPG",
      alt: "پشت باز یک ساعت اتوماتیک با کالیبر ETA 2824-2 و روتور نیم‌دایره",
      caption: "کالیبر ETA 2824-2 در یک ساعت Atlantic Worldmaster، از پشت",
      credit: {
        author: "Jpr",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:ETA-2824-A2-WP-de.JPG",
      },
    },
    sources: [
      { label: "ETA SA · Calibre 2824-2", url: "https://portal.eta.ch/fr/2824-2-2824-2-3.html" },
      {
        label: "Sellita · Catalogue 2024 (SW200-1)",
        url: "https://www.sellita.ch/images/documents/Catalogue2024_ENG.pdf",
      },
      {
        label: "Hamilton · Khaki Field Auto (H-10)",
        url: "https://www.hamiltonwatch.com/en-us/h70455533-khaki-field-auto.html",
      },
    ],
  },
  {
    slug: "ultra-thin",
    family: "ultra-thin",
    name: "مکانیکی فوق‌باریک",
    shortName: "فوق‌باریک",
    reference: "Piaget 430P · JLC 849 · AP 2121 · BVL 138",
    summary:
      "شاهکار مهندسی ظرافت: موومنت‌هایی با ارتفاع حدود ۲ تا ۳ میلی‌متر، گاهی نازک‌تر از یک سکه. هر قطعه نازک‌تر، هر چرخ کم‌ارتفاع‌تر و هر پل ظریف‌تر از یک موومنت معمولی است.",
    howItWorks: [
      "برای کم کردن ارتفاع، قطعه‌هایی که در موومنت معمولی روی هم قرار می‌گیرند کنار هم چیده می‌شوند. بشکه، قطار چرخ‌دنده و بالانس تقریباً در یک سطح کار می‌کنند.",
      "بیشتر موومنت‌های فوق‌باریک کوک دستی‌اند، چون روتور معمولی چند میلی‌متر به ارتفاع اضافه می‌کند. نسخه‌های اتوماتیک از میکرو‌روتورِ فرورفته در صفحه یا روتور حاشیه‌ای استفاده می‌کنند.",
      "قطعه‌های نازک‌تر انعطاف بیشتری دارند و تحمل خطا کمتر است؛ برای همین تنظیم و مونتاژ این موومنت‌ها از سخت‌ترین کارهای ساعت‌سازی است.",
    ],
    specs: [
      { label: "ضخامت", value: "حدود ۱٫۸ تا ۳ میلی‌متر" },
      { label: "کوک", value: "اغلب دستی؛ اتوماتیک با میکرو‌روتور یا روتور حاشیه‌ای" },
      { label: "فرکانس رایج", value: "۲۱٬۶۰۰ ضربه در ساعت (۳ هرتز)" },
    ],
    usedIn: [
      {
        brand: "Piaget",
        model: "Altiplano",
        calibre: "9P · 430P",
        note: "پیاژه پیشگام این حوزه است؛ کالیبر کوک دستی 430P با قطر ۲۰٫۵ میلی‌متر فقط ۲٫۱ میلی‌متر ضخامت دارد و حدود ۴۳ ساعت ذخیرهٔ انرژی.",
      },
      {
        brand: "Jaeger-LeCoultre",
        model: "Master Ultra Thin",
        calibre: "849",
        note: "با حدود ۱٫۸۵ میلی‌متر، از باریک‌ترین موومنت‌های کلاسیک لوکس دنیا.",
      },
      {
        brand: "Audemars Piguet",
        model: 'Royal Oak "Jumbo"',
        calibre: "2121",
        note: "اتوماتیک با ضخامت ۳٫۰۵ میلی‌متر که از ۱۹۷۲ در اولین رویال اوک کار می‌کرد؛ به گفتهٔ اودمار پیگه باریک‌ترین موومنت اتوماتیک با روتور مرکزی و تاریخ. پایان ۲۰۲۱ بازنشسته شد و کالیبر 7121 جایش را گرفت.",
      },
      {
        brand: "Bvlgari",
        model: "Octo Finissimo Automatic",
        calibre: "BVL 138",
        note: "۲٫۲۳ میلی‌متر با میکرو‌روتور پلاتینی؛ در زمان عرضه در ۲۰۱۷ باریک‌ترین موومنت اتوماتیک بازار بود.",
      },
    ],
    glance: {
      energy: "فنر، اغلب کوک دستی",
      accuracy: "چند ثانیه در روز، در حد موومنت‌های ممتاز",
      beat: "معمولاً ۶ ضربه در ثانیه",
      signature: "ضخامتی نزدیک به یک سکه",
    },
    hasModel: false,
    sources: [
      {
        label: "Piaget · 430P Ultra-Thin Mechanical Movement",
        url: "https://www.piaget.com/us-en/movement/430p-ultra-thin-mechanical-movement",
      },
      {
        label: "Audemars Piguet Chronicles · Calibre 2121",
        url: "https://apchronicles.audemarspiguet.com/en/calibre/2121",
      },
      {
        label: 'Audemars Piguet · Royal Oak "Jumbo"',
        url: "https://www.audemarspiguet.com/us/en/watch/royal-oak-jumbo",
      },
      {
        label: "Quill & Pad · Master Ultra Thin vs. Altiplano (calibre 849)",
        url: "https://quillandpad.com/2019/02/04/ultra-thin-head-to-head-jaeger-lecoultre-master-ultra-thin-vs-piaget-altiplano/",
      },
      {
        label: "Grail Watch Reference · BVL 138",
        url: "https://reference.grail-watch.com/movement/bvl-138/",
      },
    ],
  },
  {
    slug: "quartz",
    family: "quartz",
    name: "کوارتز",
    shortName: "کوارتز",
    reference: "Ronda 515 · ETA F06 · Seiko 9F",
    summary:
      "یک کریستال کوارتز، یک مدار الکترونیکی و یک موتور پله‌ای کوچک. دقتی که هیچ موومنت مکانیکی معمولی به آن نمی‌رسد، با قطعه‌هایی که می‌شود در کف دست شمرد.",
    howItWorks: [
      "باتری به کریستال کوارتزی که به شکل دیاپازون تراش خورده ولتاژ می‌دهد. کوارتز خاصیت پیزوالکتریک دارد و دقیقاً ۳۲٬۷۶۸ بار در ثانیه می‌لرزد.",
      "این عدد برابر ۲ به توان ۱۵ است؛ مدار با ۱۵ بار نصف کردن متوالی، از آن دقیقاً یک پالس در ثانیه می‌سازد.",
      "هر پالس سیم‌پیچ مسی موتور پله‌ای (موتور لاوه) را مغناطیسی می‌کند و آهنربای کوچک روتور نیم دور می‌چرخد. چند چرخ‌دنده این گام‌ها را به حرکت عقربه‌ها می‌رسانند؛ برای همین عقربهٔ ثانیه پرش‌وار جلو می‌رود.",
    ],
    specs: [
      { label: "فرکانس کریستال", value: "۳۲٬۷۶۸ هرتز" },
      { label: "دقت معمول", value: "حدود ±۱۵ ثانیه در ماه" },
      { label: "کوارتز پردقت (HAQ)", value: "تا ±۱۰ ثانیه در سال" },
      { label: "منبع انرژی", value: "باتری اکسید نقره یا خازن شارژ نوری" },
    ],
    usedIn: [
      {
        brand: "Tissot",
        model: "PRX Quartz",
        calibre: "ETA F06",
        note: "کوارتز سوئیسی روزمره در یکی از پرفروش‌ترین ساعت‌های امروز.",
      },
      {
        brand: "TAG Heuer",
        model: "Formula 1",
        calibre: "کالیبرهای کوارتز روندا",
        note: "ساعت اسپرت سوئیسی با موومنت کوارتز ساخت روندا.",
      },
      {
        brand: "Grand Seiko",
        model: "9F Quartz",
        calibre: "9F",
        note: "کوارتز پردقت با موتور دوپالسی و جبران حرارتی؛ خطای کمتر از ۱۰ ثانیه در سال.",
      },
      {
        brand: "Citizen",
        model: "Promaster Eco-Drive",
        calibre: "Eco-Drive",
        note: "صفحه‌ای زیر صفحهٔ ساعت نور را به برق تبدیل می‌کند و باتری تعویض نمی‌خواهد.",
      },
    ],
    glance: {
      energy: "باتری یا نور",
      accuracy: "حدود ±۱۵ ثانیه در ماه؛ کوارتز پردقت ±۱۰ در سال",
      beat: "یک گام در ثانیه",
      signature: "کریستال ۳۲٬۷۶۸ هرتزی",
    },
    hasModel: false,
    photo: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Armbanduhr_Rueckseite.jpg/1280px-Armbanduhr_Rueckseite.jpg",
      alt: "پشت باز یک ساعت کوارتز ارزان: باتری سکه‌ای، کریستال کوارتز، مدار و سیم‌پیچ موتور پله‌ای",
      caption: "موومنت کوارتز ISA K63: باتری، کریستال، مدار شمارنده و سیم‌پیچ موتور",
      credit: {
        author: "Garitzko",
        license: "Public domain",
        licenseUrl: "https://commons.wikimedia.org/wiki/File:Armbanduhr_Rueckseite.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Armbanduhr_Rueckseite.jpg",
      },
    },
    sources: [
      {
        label: "Grand Seiko · Quartz movements (9F)",
        url: "https://www.grand-seiko.com/us-en/collections/movement/quartz",
      },
      {
        label: "Seiko · The Story of the 1969 Quartz Astron",
        url: "https://www.seikowatches.com/ca-en/products/astron/special/story_qa50th_1",
      },
    ],
  },
  {
    slug: "tourbillon",
    family: "tourbillon",
    name: "توربیون",
    shortName: "توربیون",
    reference: "Breguet · JLC Gyrotourbillon · Heuer 02T",
    summary:
      "کل مجموعهٔ بالانس، فنر موئی، لنگر و چرخ اسکیپمنت داخل یک قفسهٔ چرخان قرار می‌گیرد تا اثر جاذبهٔ زمین بر دقت ساعت میانگین‌گیری و خنثی شود.",
    howItWorks: [
      "وقتی ساعت عمودی است، جاذبه مرکز ثقل بالانس را کمی می‌کشد و بسته به جهت ساعت، آن را جلو یا عقب می‌اندازد.",
      "در توربیون، قفسهٔ حامل اسکیپمنت و بالانس معمولاً هر یک دقیقه یک دور کامل می‌زند. خطاها در همهٔ جهت‌ها تکرار می‌شوند و همدیگر را خنثی می‌کنند.",
      "چرخ اسکیپمنت دور یک چرخ ثابت می‌گردد و با همین حرکت کل قفسه را می‌چرخاند. آبراهام لویی برگه حق اختراع این سازوکار را در ۲۶ ژوئن ۱۸۰۱ (۷ مسیدور سال نهم در تقویم جمهوری فرانسه) گرفت.",
    ],
    specs: [
      { label: "اختراع", value: "آبراهام لویی برگه، ثبت در ۲۶ ژوئن ۱۸۰۱" },
      { label: "سرعت قفسه", value: "معمولاً یک دور در دقیقه" },
      { label: "انواع", value: "تک‌محوره، پرنده، چندمحوره" },
    ],
    usedIn: [
      {
        brand: "Breguet",
        model: "Classique Tourbillon",
        calibre: "کالیبرهای توربیون برگه",
        note: "برند مخترع توربیون، همچنان اصیل‌ترین توربیون‌ها را می‌سازد.",
      },
      {
        brand: "Jaeger-LeCoultre",
        model: "Master Gyrotourbillon",
        calibre: "Gyrotourbillon",
        note: "توربیون چندمحوره که قفسه‌اش به‌صورت کروی می‌چرخد.",
      },
      {
        brand: "TAG Heuer",
        model: "Carrera Heuer 02T",
        calibre: "Heuer 02T",
        note: "کرونوگراف توربیون با گواهی COSC و قیمتی رقابتی‌تر از همتایانش.",
      },
      {
        brand: "Audemars Piguet",
        model: "Royal Oak Tourbillon",
        calibre: "توربیون AP",
        note: "قاب اسپرت رویال اوک با قفسهٔ توربیون باز در موقعیت ساعت ۶.",
      },
    ],
    glance: {
      energy: "فنر، دستی یا اتوماتیک",
      accuracy: "در حد کرونومتر؛ برتری در وضعیت عمودی",
      beat: "معمولاً ۶ تا ۸ ضربه در ثانیه",
      signature: "قفسهٔ چرخان",
    },
    hasModel: false,
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/85/Tourbillon.jpg",
      alt: "نمای ماکروی قفسهٔ توربیون با چرخ بالانس و پل‌های ظریف",
      caption: "قفسهٔ توربیون ساختهٔ فرانک یوتسی، از نزدیک",
      credit: {
        author: "Simon Schaller",
        license: "Public domain",
        licenseUrl: "https://commons.wikimedia.org/wiki/File:Tourbillon.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tourbillon.jpg",
      },
    },
    sources: [
      {
        label: "Breguet · Patent granted for the Tourbillon (1801)",
        url: "https://www.breguet.com/en/breguet-house/1801-1823/patent-granted-completely-new-type-regulator-called-tourbillon",
      },
      {
        label: "TAG Heuer · Carrera Chronograph Tourbillon (Heuer 02T COSC)",
        url: "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-carrera/45-mm-calibre-heuer02t-cosc/CAR5A8Y.FC6377.html",
      },
    ],
  },
];

export const calibreBySlug = (slug: string) => CALIBRES.find((calibre) => calibre.slug === slug);
