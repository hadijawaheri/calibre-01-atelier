import type { BrandEntry } from "./types";

const wiki = (title: string, label = title.replaceAll("_", " ")) => ({
  label: `Wikipedia · ${label}`,
  url: `https://en.wikipedia.org/wiki/${title}`,
});

/* Ordered by founding year. The six with a long read on the history page keep the facts checked there; the rest
   were checked against the pages listed with each house. */
export const BRANDS: readonly BrandEntry[] = [
  {
    slug: "blancpain",
    name: "بلانپن",
    latinName: "Blancpain",
    founded: 1735,
    place: "ویلره (Villeret)، سوئیس؛ مقر امروز: پودکس و لو براسو",
    founders: "ژان-ژاک بلانپن (Jehan-Jacques Blancpain)",
    owner: "سواچ گروپ، از ۱۹۹۲",
    summary:
      "قدیمی‌ترین نام ثبت‌شدهٔ ساعت در جهان. بیشتر با غواصی Fifty Fathoms (۱۹۵۳) و ساعت فوق‌پیچیدهٔ 1735 (۱۹۹۱، فقط ۳۰ عدد) شناخته می‌شود. در ۱۹۸۳ ژاک پیگه و ژان-کلود بیور نام برند را خریدند و تولید را به لو براسو در دره ژو بردند.",
    sources: [wiki("Blancpain")],
  },
  {
    slug: "vacheron-constantin",
    name: "واشرون کنستانتین",
    latinName: "Vacheron Constantin",
    founded: 1755,
    place: "ژنو، سوئیس؛ کارخانه‌ها در کانتون ژنو و دره ژو",
    owner: "گروه ریشمون، از ۱۹۹۶",
    summary:
      "قدیمی‌ترین کارخانهٔ ساعتی که از تأسیس تا امروز بی‌وقفه کار کرده است. ساعت جیبی Reference 57260 (۲۰۱۵) با ۵۷ کارکرد پیچیده‌ترین ساعت مکانیکی جهان شد و در ۲۰۲۴ ساعت جیبی Berkley با ۶۳ کارکرد این رکورد را شکست.",
    sources: [wiki("Vacheron_Constantin")],
  },
  {
    slug: "breguet",
    name: "برگه",
    latinName: "Breguet",
    founded: 1775,
    place: "پاریس، فرانسه؛ مقر امروز: لابه (L'Abbaye)، سوئیس",
    founders: "آبراهام-لویی برگه (Abraham-Louis Breguet)",
    owner: "سواچ گروپ، از ۱۹۹۹",
    summary:
      "خانهٔ مخترع توربیون (ثبت ۱۸۰۱). ویکی‌پدیا ساعت خودکوک Perpétuelle (۱۷۸۰) و ساعت مچی شمارهٔ ۲۶۳۹ برای کارولین بناپارت، ملکهٔ ناپل (۱۸۱۰) را هم به برگه نسبت می‌دهد.",
    sources: [
      {
        label: "Breguet · Patent granted for the Tourbillon (1801)",
        url: "https://www.breguet.com/en/breguet-house/1801-1823/patent-granted-completely-new-type-regulator-called-tourbillon",
      },
      wiki("Breguet_(brand)", "Breguet"),
    ],
  },
  {
    slug: "jaeger-lecoultre",
    name: "ژگر-لوکولتر",
    latinName: "Jaeger-LeCoultre",
    founded: 1833,
    place: "لو سانتیه (Le Sentier)، دره ژو، سوئیس",
    founders: "آنتوان لوکولتر (Antoine LeCoultre)",
    owner: "گروه ریشمون، از ۲۰۰۰",
    summary:
      "«ساعت‌ساز ساعت‌سازان»، با صدها اختراع و بیش از هزار موومنت. کالیبر 101 (۱۹۲۹) هنوز کوچک‌ترین موومنت مکانیکی جهان است و ساعت Reverso (۱۹۳۱) با قاب چرخان برای بازیکنان چوگان ساخته شد.",
    sources: [wiki("Jaeger-LeCoultre")],
  },
  {
    slug: "patek-philippe",
    name: "پتک فیلیپ",
    latinName: "Patek Philippe",
    founded: 1839,
    place: "ژنو، سوئیس",
    founders: "آنتونی پاتک و فرانسوا چاپک؛ از ۱۸۴۵ ژان آدرین فیلیپ",
    owner: "خانوادهٔ استرن، از ۱۹۳۲",
    summary:
      "آخرین کارخانهٔ مستقل و خانوادگی ساعت در ژنو. کالاتراوا (۱۹۳۲) و ناتیلوس (۱۹۷۶) دو ساعت شاخص آن‌اند.",
    historySlug: "patek-philippe",
    sources: [
      {
        label: "Patek Philippe · The Founders",
        url: "https://www.patek.com/en/manufacture/a-story-of-independence/the-founders",
      },
      wiki("Patek_Philippe", "Patek Philippe"),
    ],
  },
  {
    slug: "cartier",
    name: "کارتیه",
    latinName: "Cartier",
    founded: 1847,
    place: "پاریس، فرانسه",
    founders: "لویی-فرانسوا کارتیه (Louis-François Cartier)",
    owner: "گروه ریشمون؛ تا ۱۹۶۴ در دست خانوادهٔ کارتیه",
    summary:
      "جواهرساز پاریسی که ادوارد هفتم آن را «جواهرساز پادشاهان» نامید. ساعت Tank را لویی کارتیه در ۱۹۱۷ طراحی کرد.",
    sources: [wiki("Cartier_(brand)", "Cartier"), wiki("Cartier_Tank")],
  },
  {
    slug: "omega",
    name: "امگا",
    latinName: "Omega",
    founded: 1848,
    place: "لا شو-د-فون، سوئیس؛ مقر امروز: بیل/بین",
    founders: "لویی برانت (Louis Brandt)",
    owner: "سواچ گروپ",
    summary:
      "نام Omega از ۱۹۰۳ روی شرکت آمد. امگا از ۱۹۳۲ زمان‌سنج رسمی بازی‌های المپیک است و Speedmaster آن در مأموریت آپولو ۱۱ اولین ساعتی بود که روی ماه بسته شد.",
    sources: [wiki("Omega_SA", "Omega SA"), wiki("Omega_Speedmaster")],
  },
  {
    slug: "tag-heuer",
    name: "تگ هویر",
    latinName: "TAG Heuer",
    founded: 1860,
    place: "سنت-ایمیه (St-Imier)، سوئیس",
    founders: "ادوار هویر (Edouard Heuer)",
    owner: "LVMH، از ۱۹۹۹",
    summary:
      "هویر بیشتر با کرونوگراف‌هایش شناخته می‌شود و زمان‌سنج دستی (استاپ‌واچ) هم ساخته است. در ۱۹۸۵ گروه TAG (Techniques d'Avant Garde) سهام اکثریت را خرید و نام TAG Heuer از آنجا آمد.",
    sources: [
      {
        label: "TAG Heuer · Vintage Heuer Monaco",
        url: "https://www.tagheuer.com/us/en/vintage-collection/vintage-heuer-monaco.html",
      },
      wiki("TAG_Heuer"),
    ],
  },
  {
    slug: "zenith",
    name: "زنیت",
    latinName: "Zenith",
    founded: 1865,
    place: "لو لوکل (Le Locle)، کانتون نوشاتل، سوئیس",
    founders: "ژرژ فاور-ژاکو (Georges Favre-Jacot)",
    owner: "LVMH، از نوامبر ۱۹۹۹",
    summary:
      "از قدیمی‌ترین ساعت‌سازانی که بی‌وقفه کار کرده‌اند. کالیبر El Primero (۱۹۶۹) را ساخت و وقتی شرکت در بحران کوارتز ساخت آن را کنار گذاشت، ساعت‌سازی به نام شارل ورمو ابزارهای تولیدش را در زیرشیروانی کارخانه پنهان کرد.",
    sources: [wiki("Zenith_(watchmaker)", "Zenith")],
  },
  {
    slug: "audemars-piguet",
    name: "اودمار پیگه",
    latinName: "Audemars Piguet",
    founded: 1875,
    place: "لو براسو (Le Brassus)، دره ژو، سوئیس",
    founders: "ژول لویی اودمار و ادوارد اوگوست پیگه",
    owner: "مستقل و خانوادگی از روز تأسیس",
    summary:
      "نام Audemars Piguet & Cie از ۱۸۸۱ رسمی شد. اولین موومنت تکرارکنندهٔ دقیقه (۱۸۹۲) و اولین ساعت اسکلت (۱۹۳۴) از کارهای آن است، اما شهرتش بیش از همه از رویال اوک (۱۹۷۲) می‌آید.",
    sources: [
      {
        label: "Audemars Piguet Chronicles · Royal Oak 5402",
        url: "https://apchronicles.audemarspiguet.com/en/model/5402",
      },
      wiki("Audemars_Piguet"),
    ],
  },
  {
    slug: "seiko",
    name: "سیکو",
    latinName: "Seiko",
    founded: 1881,
    place: "توکیو (محلهٔ گینزا)، ژاپن",
    founders: "کینتارو هاتوری (Kintaro Hattori)",
    owner: "Seiko Group Corporation",
    summary:
      "سیکو و رولکس تنها دو شرکت ساعتی‌اند که همهٔ قطعه‌ها را خودشان طراحی و تولید می‌کنند. سیکو در ۱۹۶۹ اولین ساعت مچی کوارتز تجاری جهان را عرضه کرد.",
    historySlug: "seiko",
    sources: [
      {
        label: "Seiko · The Story of the 1969 Quartz Astron",
        url: "https://www.seikowatches.com/ca-en/products/astron/special/story_qa50th_1",
      },
      wiki("Seiko"),
    ],
  },
  {
    slug: "hamilton",
    name: "همیلتون",
    latinName: "Hamilton",
    founded: 1892,
    place: "لنکستر، پنسیلوانیا، آمریکا؛ تولید از ۱۹۶۹ در سوئیس",
    owner: "سواچ گروپ (فروش به SSIH در ۱۶ مه ۱۹۷۴)",
    summary:
      "ساعت‌ساز آمریکایی که در ۱۹۵۷ اولین ساعت مچی برقی جهان، Hamilton Electric 500، را عرضه کرد. در ۱۹۶۶ کارخانهٔ سوئیسی Buren را خرید و در ۱۹۶۹ تولید در آمریکا را تعطیل کرد.",
    sources: [
      {
        label: "Hamilton · History of Hamilton",
        url: "https://www.hamiltonwatch.com/en-us/company/hamilton-watches-history",
      },
      wiki("Hamilton_Watch_Company", "Hamilton Watch Company"),
    ],
  },
  {
    slug: "rolex",
    name: "رولکس",
    latinName: "Rolex",
    founded: 1905,
    place: "لندن، انگلستان؛ از ۱۹۱۹ ژنو، سوئیس",
    founders: "هانس ویلسدورف و آلفرد دیویس",
    summary:
      "در ۱۹۱۰ اولین ساعت مچی‌ای را ساخت که گواهی کرونومتری سوئیس گرفت، در ۱۹۲۶ قاب آب‌بند Oyster را عرضه کرد و در ۱۹۳۱ روتور Perpetual را ثبت کرد.",
    historySlug: "rolex",
    sources: [
      {
        label: "Rolex · History 1905–1919",
        url: "https://www.rolex.com/en-us/about-rolex/history/1905-1919",
      },
      wiki("Rolex"),
    ],
  },
  {
    slug: "casio",
    name: "کاسیو",
    latinName: "Casio",
    founded: 1946,
    place: "میتاکا، توکیو، ژاپن",
    founders: "تادائو کاشیو و برادرانش توشیو، کازو و یوکیو",
    summary:
      "کارگاه قطعه‌سازی که با ماشین‌حساب بزرگ شد و از ۱۹۷۴ ساعت مچی ساخت. جی‌شاک DW-5000C (۱۹۸۳) نشکن‌ترین نام آن است.",
    historySlug: "casio",
    sources: [
      { label: "Casio · Company History", url: "https://world.casio.com/corporate/history/" },
      wiki("G-Shock"),
    ],
  },
  {
    slug: "swatch",
    name: "سواچ",
    latinName: "Swatch",
    founded: 1983,
    place: "بیل/بین، سوئیس",
    founders: "ارنست تومکه، المار موک و ژاک مولر در ETA",
    owner: "سواچ گروپ",
    summary:
      "ساعت کوارتز ارزان سوئیسی با قاب پلاستیکی که در ۱ مارس ۱۹۸۳ در زوریخ معرفی شد؛ پاسخ سوئیس به بحران کوارتز.",
    historySlug: "swatch",
    sources: [
      {
        label: "Swatch Group · History",
        url: "https://www.swatchgroup.com/en/swatch-group/swatch-group-history",
      },
      wiki("Swatch"),
    ],
  },
  {
    slug: "frederique-constant",
    name: "فردریک کنستانت",
    latinName: "Frédérique Constant",
    founded: 1988,
    place: "ژنو، سوئیس؛ از ۲۰۰۶ پلان-له-اوت",
    founders: "پیتر استاس و آلتا استاس-باکس",
    owner: "گروه سیتیزن، از ۲۰۱۶",
    summary:
      "برندی جوان با شعار «لوکس در دسترس» که از مونتاژ موومنت‌های سوئیسی به ساخت موومنت‌های اختصاصی رسید.",
    historySlug: "frederique-constant",
    sources: [
      { label: "Frederique Constant · History", url: "https://frederiqueconstant.com/history/" },
      wiki("Fr%C3%A9d%C3%A9rique_Constant", "Frédérique Constant"),
    ],
  },
];

export const brandBySlug = (slug: string) => BRANDS.find((brand) => brand.slug === slug);
