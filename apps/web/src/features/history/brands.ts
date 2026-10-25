import type { PhotoCredit, SourceLink } from "@/components/atlas";

export interface BrandMilestone {
  title: string;
  text: string;
}

export interface BrandHistory {
  slug: string;
  name: string;
  latinName: string;
  tagline: string;
  founded: string;
  place: string;
  foundersLabel: "موسس" | "موسسان" | "موسس (شخصیت کلیدی)";
  founders: string;
  story: string;
  milestones: readonly BrandMilestone[];
  /* A freely licensed photograph of the brand's own watch or work, credited under the plate */
  image: { src: string; alt: string; caption: string; credit: PhotoCredit };
  /* Every fact above was checked against these pages; the brand's own site comes first */
  sources: readonly SourceLink[];
}

const CC_BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const CC_BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";

/* Kept in the order of the original write-up; the facts are corrected against the sources listed with each brand */
export const BRAND_HISTORIES: readonly BrandHistory[] = [
  {
    slug: "patek-philippe",
    name: "پتک فیلیپ",
    latinName: "Patek Philippe",
    tagline: "مهد ساعت‌های فوق‌پیچیده",
    founded: "۱ مه ۱۸۳۹ میلادی، با نام Patek, Czapek & Cie",
    place: "ژنو، سوئیس (کارخانه و مقر امروز از ۱۹۹۶: پلان-له-اوت، کانتون ژنو)",
    foundersLabel: "موسسان",
    founders:
      "آنتونی پاتک (Antoine Norbert de Patek، لهستانی‌تبار) و فرانسوا چاپک (Franciszek Czapek، ساعت‌ساز چک‌تبار). شراکت آن دو در آوریل ۱۸۴۵ پایان یافت و پاتک در ۱۵ مه ۱۸۴۵ با ژان آدرین فیلیپ (Jean Adrien Philippe، ساعت‌ساز فرانسوی) شرکت تازهٔ Patek & Cie را ساخت. نام Patek, Philippe & Cie از ۱ ژانویهٔ ۱۸۵۱ رسمی شد و ویرگول آن در ۲۰۰۹ حذف شد.",
    story:
      "پاتک در لهستان به دنیا آمد و در دههٔ ۱۸۳۰ در ژنو ساکن شد. او در نمایشگاه صنعتی پاریس در ۱۸۴۴ با فیلیپ و سازوکار تازه‌اش آشنا شد: کوک کردن و تنظیم ساعت با تاج، بدون کلید جداگانه. تا آن زمان بیشتر ساعت‌های جیبی با کلید فلزی کوچکی کوک می‌شدند. فیلیپ این سازوکار را در ۱۸۴۲ ساخته بود و در ۱۸۴۵ ثبت کرد. پاتک او را به ژنو دعوت کرد و شراکتی شکل گرفت که نام برند از آن آمده است.",
    milestones: [
      {
        title: "کوک و تنظیم با تاج (ثبت اختراع ۱۸۴۵)",
        text: "سازوکار بدون کلید فیلیپ در نمایشگاه صنعتی ۱۸۴۴ پاریس مدال برنز گرفت و در ۱۸۴۵ به ثبت رسید. ساعتی با همین سازوکار در نمایشگاه بزرگ ۱۸۵۱ لندن به ملکه ویکتوریا عرضه شد.",
      },
      {
        title: "اولین ساعت مچی (۱۸۶۸)",
        text: "در ۱۸۶۸ پتک فیلیپ برای کنتس کوسکوویچ مجارستانی یک ساعت مچی جواهرنشان ساخت که بیشتر به دستبند شبیه بود. پتک فیلیپ آن را اولین ساعت مچی خود می‌نامد و ویکی‌پدیا آن را اولین ساعت مچی سوئیس می‌داند.",
      },
      {
        title: "اولین تقویم دائمی مچی (۱۹۲۵)",
        text: "اولین ساعت مچی شناخته‌شده با تقویم دائمی را پتک فیلیپ در ۱۹۲۵ ساخت؛ این ساعت امروز در موزهٔ پتک فیلیپ در ژنو نگهداری می‌شود.",
      },
    ],
    image: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Patek_Philippe_p1070011.jpg/960px-Patek_Philippe_p1070011.jpg",
      alt: "ساعت جیبی طلای زرد پتک فیلیپ با درِ باز، در ویترین موزه",
      caption: "ساعت جیبی طلای پتک فیلیپ، هدیهٔ لیلند استنفورد به جین استنفورد، ۱ ژانویهٔ ۱۸۶۸",
      credit: {
        author: "David Monniaux",
        license: "CC BY-SA 3.0",
        licenseUrl: CC_BY_SA_3,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Patek_Philippe_p1070011.jpg",
      },
    },
    sources: [
      {
        label: "Patek Philippe · The Founders",
        url: "https://www.patek.com/en/manufacture/a-story-of-independence/the-founders",
      },
      {
        label: "Patek Philippe · Anchored in Geneva and Switzerland",
        url: "https://www.patek.com/en/manufacture/a-story-of-independence/anchored-in-geneva-and-switzerland",
      },
      {
        label: "Patek Philippe · The Patek Philippe Museum",
        url: "https://www.patek.com/en/museum/the-patek-philippe-museum",
      },
      { label: "Wikipedia · Patek Philippe", url: "https://en.wikipedia.org/wiki/Patek_Philippe" },
    ],
  },
  {
    slug: "rolex",
    name: "رولکس",
    latinName: "Rolex",
    tagline: "پادشاه مهندسی و بازاریابی کاربردی",
    founded: "۱۹۰۵ میلادی، با نام Wilsdorf & Davis",
    place:
      "لندن، انگلستان؛ در ۱۹۱۹ به ژنو منتقل شد، به‌خاطر مالیات سنگین پس از جنگ بر کالاهای لوکس وارداتی و عوارض صادرات طلا و نقرهٔ بدنه‌ها. Montres Rolex S.A. در ۱۹۲۰ در ژنو ثبت شد.",
    foundersLabel: "موسسان",
    founders:
      'هانس ویلسدورف (Hans Wilsdorf، کارآفرین ۲۴ سالهٔ آلمانی) و آلفرد دیویس (Alfred Davis، سرمایه‌گذار و فروشندهٔ بریتانیایی ساعت). شرکت آن‌ها ساعت سوئیسی به انگلستان وارد می‌کرد و ویلسدورف در ۱۹۰۸ نام "Rolex" را به ثبت رساند.',
    story:
      "در آغاز قرن بیستم ساعت مچی هنوز دقیق نبود و در برابر آب و گرد و غبار آسیب‌پذیر بود. ویلسدورف آینده را در ساعت مچی می‌دید و می‌خواست ساعتی بسازد که هم ظریف باشد و هم قابل اعتماد. رولکس اول روی دقت موومنت‌ها کار کرد: در ۱۹۱۰ یک ساعت رولکس اولین ساعت مچی جهان شد که گواهی دقت کرونومتری سوئیس را از مرکز رسمی سنجش ساعت در بیل گرفت.",
    milestones: [
      {
        title: "Rolex Oyster (۱۹۲۶)",
        text: "به گفتهٔ رولکس، اولین ساعت مچی ضدآب و ضد گرد و غبار، با قابی کاملاً آب‌بند که موومنت را محافظت می‌کرد؛ ویکی‌پدیا یادآوری می‌کند که این قاب را یک قاب‌ساز بیرونی برای رولکس ساخت. در ۱۹۲۷ مرسدس گلایتز، شناگر بریتانیایی، با یک اویستر که از گردنبندش آویخته بود در کانال مانش شنا کرد. شنا بیش از ۱۰ ساعت طول کشید و ساعت سالم و دقیق ماند.",
      },
      {
        title: "روتور Perpetual (۱۹۳۱)",
        text: "رولکس در ۱۹۳۱ سازوکار کوک خودکار با روتور نیم‌دایرهٔ آزاد (Perpetual) را اختراع و ثبت کرد که با حرکت طبیعی مچ دست، ساعت را پیوسته کوک می‌کند. رولکس آن را اولین سازوکار از این نوع می‌داند و امروز در قلب بیشتر ساعت‌های اتوماتیک همین اصل کار می‌کند.",
      },
    ],
    image: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Rolex_Oyster_del_1926%2C_il_primo_orologio_impermeabile_della_storia.jpg/960px-Rolex_Oyster_del_1926%2C_il_primo_orologio_impermeabile_della_storia.jpg",
      alt: "ساعت مچی رولکس اویستر با قاب هشت‌ضلعی، مدل ۱۹۲۶",
      caption: "رولکس اویستر ۱۹۲۶، اولین ساعت مچی ضدآب به روایت رولکس",
      credit: {
        author: "Clyde94",
        license: "CC BY-SA 4.0",
        licenseUrl: CC_BY_SA_4,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Rolex_Oyster_del_1926,_il_primo_orologio_impermeabile_della_storia.jpg",
      },
    },
    sources: [
      {
        label: "Rolex · History 1905–1919",
        url: "https://www.rolex.com/en-us/about-rolex/history/1905-1919",
      },
      {
        label: "Rolex · History 1926–1945",
        url: "https://www.rolex.com/en-us/about-rolex/history/1926-1945",
      },
      { label: "Wikipedia · Rolex", url: "https://en.wikipedia.org/wiki/Rolex" },
    ],
  },
  {
    slug: "frederique-constant",
    name: "فردریک کنستانت",
    latinName: "Frédérique Constant",
    tagline: "ساعت‌سازی کلاسیک با شعار «لوکس در دسترس»",
    founded: "۱۹۸۸ میلادی",
    place:
      "ژنو، سوئیس؛ کارگاه در ۱۹۹۷ به کاروژ، در ۲۰۰۰ به شن-بورگ و در ۲۰۰۶ به کارخانهٔ تازهٔ پلان-له-اوت (Plan-les-Ouates) رفت.",
    foundersLabel: "موسسان",
    founders:
      "پیتر استاس (Peter Stas) و همسرش آلتا استاس-باکس (Aletta Stas-Bax)، زوج کارآفرین هلندی. نام برند از پدربزرگ و مادربزرگِ پدر و مادرشان گرفته شده است: فردریک شراینر (Frédérique Schreiner) و کنستانت استاس (Constant Stas) که در ۱۹۰۴ کارگاه ساخت صفحهٔ ساعت راه انداخته بود.",
    story:
      "پیتر و آلتا استاس در ۱۹۸۸ طراحی مجموعهٔ ساعت خودشان را شروع کردند. هدف‌شان، به گفتهٔ خود برند، این بود که ساعت کلاسیک سوئیسی باکیفیت را با قیمتی معقول به دست علاقه‌مندان بیشتری برسانند تا لذت لوکس به عدهٔ محدودی منحصر نماند. برند به‌تدریج از مونتاژ موومنت‌های سوئیسی به ساخت موومنت‌های اختصاصی رسید و در ۲۰۱۶ به گروه ژاپنی سیتیزن پیوست.",
    milestones: [
      {
        title: "اولین مجموعه (۱۹۹۲)",
        text: "پس از چهار سال کار، مجموعهٔ «قرن هجدهم» (18th Century Collection) عرضه شد؛ ساعت‌هایی با موومنت سوئیسی که یک ساعت‌ساز ژنوی مونتاژشان می‌کرد.",
      },
      {
        title: "Heart Beat (۱۹۹۴)",
        text: "اولین ساعت Heart Beat با حفره‌ای در موقعیت ساعت ۱۲ روی صفحه عرضه شد تا قلب موومنت مکانیکی، یعنی نوسان چرخ بالانس، از رو دیده شود. این حفره بعدها نماد برند شد.",
      },
      {
        title: "کالیبر FC-910 (۲۰۰۴)",
        text: "اولین کالیبر مانوفکتور برند، که به گفتهٔ فردریک کنستانت کاملاً در خود شرکت طراحی و مونتاژ شد. به مناسبت این رویداد، حفرهٔ Heart Beat این بار در موقعیت ساعت ۶ قرار گرفت.",
      },
    ],
    image: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Frederique_Constant_escapement_wheel_in_Silicium.jpg/1280px-Frederique_Constant_escapement_wheel_in_Silicium.jpg",
      alt: "چرخ اسکیپمنت سیلیسیومی فردریک کنستانت، از نمای نزدیک",
      caption: "چرخ اسکیپمنت سیلیسیومی کالیبر Heart Beat FC-945",
      credit: {
        author: "zVisuel SA",
        license: "CC BY-SA 3.0",
        licenseUrl: CC_BY_SA_3,
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Frederique_Constant_escapement_wheel_in_Silicium.jpg",
      },
    },
    sources: [
      { label: "Frederique Constant · History", url: "https://frederiqueconstant.com/history/" },
      {
        label: "Wikipedia · Frédérique Constant",
        url: "https://en.wikipedia.org/wiki/Fr%C3%A9d%C3%A9rique_Constant",
      },
    ],
  },
  {
    slug: "swatch",
    name: "سواچ",
    latinName: "Swatch",
    tagline: "پاسخ سوئیس به بحران کوارتز",
    founded: "۱ مارس ۱۹۸۳ میلادی (معرفی اولین مجموعه در زوریخ)",
    place: "بیل/بین (Biel/Bienne)، سوئیس",
    foundersLabel: "موسسان",
    founders:
      "ارنست تومکه (Ernst Thomke، مدیرعامل وقت ETA) و تیم کوچکی از مهندسان به رهبری المار موک (Elmar Mock) و ژاک مولر (Jacques Müller). نیکلاس جی. هایک (Nicolas G. Hayek، کارآفرین لبنانی‌تبار) بعدها، در ۱۹۸۵، با گروهی از سرمایه‌گذاران سوئیسی سهام اکثریت گروه را به دست گرفت و آن را رهبری کرد.",
    story:
      'در دهه‌های ۱۹۷۰ و ۱۹۸۰، «بحران کوارتز» صنعت ساعت سوئیس را تکان داد: ساعت‌های کوارتز ارزان و دقیقِ باتری‌دار با ساعت‌سازان سنتی اروپا رقابت می‌کردند که بیشتر ساعت مکانیکی دستی می‌ساختند. سواچ در اوایل دههٔ ۱۹۸۰ در ETA به‌عنوان پاسخی به همین بحران طراحی شد: ساعت کوارتز سوئیسی ارزان با قاب پلاستیکی و فرایند تازهٔ جوش اولتراسونیک، که مثل یک اکسسوری مد فروخته می‌شد. نام Swatch کوتاه‌شدهٔ "second watch" (ساعت دوم) است. در همان ۱۹۸۳ دو گروه ورشکستهٔ ASUAG و SSIH ادغام شدند؛ گروه ادغام‌شده بعدها SMH نام گرفت و در ۱۹۹۸ به The Swatch Group تغییر نام داد.',
    milestones: [
      {
        title: "اولین مجموعه و Swatch GB101 (۱۹۸۳)",
        text: "اولین مجموعهٔ دوازده‌تایی سواچ در ۱ مارس ۱۹۸۳ در زوریخ معرفی شد و GB101 (Gent Black) یکی از همین اولین مدل‌ها بود. قیمت در آغاز بین ۳۹٫۹۰ تا ۴۹٫۹۰ فرانک سوئیس بود و در پاییز همان سال روی ۵۰ فرانک یکسان شد.",
      },
      {
        title: "یک گروه برای برندهای بزرگ",
        text: "امگا (از SSIH) و لونژین (از ASUAG) از اول در گروه ادغام‌شده بودند. برندهای دیگر بعدها خریده شدند: بلانپن در ۱۹۹۲ و برگه در ۱۹۹۹. امروز سواچ گروه صاحب برندهایی مثل امگا، برگه، بلانپن، لونژین، تیسو و همیلتون است.",
      },
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Swatch_GB101.jpg",
      alt: "ساعت مچی سواچ GB101 مشکی با بند پلاستیکی",
      caption: "سواچ GB101 (Gent Black)، از اولین مدل‌های ۱۹۸۳",
      credit: {
        author: "Luekk",
        license: "CC BY-SA 3.0",
        licenseUrl: CC_BY_SA_3,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Swatch_GB101.jpg",
      },
    },
    sources: [
      {
        label: "Swatch Group · History",
        url: "https://www.swatchgroup.com/en/swatch-group/swatch-group-history",
      },
      { label: "Wikipedia · Swatch", url: "https://en.wikipedia.org/wiki/Swatch" },
      {
        label: "Wikipedia · The Swatch Group",
        url: "https://en.wikipedia.org/wiki/The_Swatch_Group",
      },
    ],
  },
  {
    slug: "seiko",
    name: "سیکو",
    latinName: "Seiko",
    tagline: "کابوس مکانیک و پیشگام نوآوری شرق",
    founded: "۱۸۸۱ میلادی",
    place: "توکیو (محلهٔ گینزا)، ژاپن",
    foundersLabel: "موسس",
    founders:
      "کینتارو هاتوری (Kintaro Hattori، ۱۸۶۰–۱۹۳۴) که در ۲۱ سالگی فروشگاه فروش و تعمیر ساعت خودش را در گینزا باز کرد.",
    story:
      'هاتوری با فروشگاه کوچکی برای فروش و تعمیر ساعت به نام "K. Hattori" شروع کرد. یازده سال بعد، در ۱۸۹۲، کارخانه‌ای در محلهٔ امروزی سومیدای توکیو ساخت و اول ساعت دیواری تولید کرد. نامش را Seikosha گذاشت، یعنی «خانهٔ ساخت دقیق و ظریف». در زلزلهٔ بزرگ کانتو در ۱ سپتامبر ۱۹۲۳، کارخانه، فروشگاه و خانهٔ هاتوری همه در آتش سوخت؛ حدود ۱٬۵۰۰ ساعت امانتی مشتریان هم از بین رفت. هاتوری در نوامبر همان سال کار را دوباره راه انداخت و همهٔ ساعت‌های امانتی را رایگان با ساعت نو جایگزین کرد.',
    milestones: [
      {
        title: "ساعت جیبی Timekeeper (۱۸۹۵)",
        text: "اولین ساعت جیبی کارخانهٔ سیکوشا؛ قدمی که راه را برای اولین ساعت مچی ژاپن باز کرد.",
      },
      {
        title: "Laurel (۱۹۱۳)",
        text: "اولین ساعت مچی ساخت ژاپن. حدود یک‌پنجم اندازهٔ یک ساعت جیبی معمولی بود و ساختنش آن‌قدر سخت بود که روزی فقط حدود ۵۰ عدد تولید می‌شد. در ۱۹۲۴ اولین ساعتی که نام Seiko روی صفحه‌اش بود عرضه شد.",
      },
      {
        title: "Seiko Quartz Astron 35SQ (۲۵ دسامبر ۱۹۶۹)",
        text: "اولین ساعت مچی کوارتز جهان، با دقت ±۵ ثانیه در ماه؛ به گفتهٔ سیکو حدود صد برابر دقیق‌تر از یک ساعت مکانیکی معمولی. تنها ۱۰۰ عدد از آن در کریسمس ۱۹۶۹ در توکیو فروخته شد. سیکو بعدها حق اختراع‌های کلیدی‌اش، مثل رزوناتور کوارتز دیاپازونی، را در دسترس سازندگان دیگر گذاشت و همین به بحران کوارتز برای ساعت‌سازی مکانیکی دامن زد.",
      },
      {
        title: "Spring Drive (۱۹۹۹)",
        text: "در ۱۹۹۹ سیکو اولین ساعت Spring Drive را عرضه کرد: موومنتی که نیرویش از فنر اصلی مکانیکی می‌آید و سرعتش را یک تنظیم‌کنندهٔ کوارتزی مهار می‌کند.",
      },
    ],
    image: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Seiko_Astron.jpg/960px-Seiko_Astron.jpg",
      alt: "ساعت مچی کوارتز سیکو آسترون با قاب طلایی، ۱۹۶۹، در موزهٔ ساعت آلمان",
      caption: "سیکو کوارتز آسترون با کالیبر 35A، ۱۹۶۹ (موزهٔ ساعت آلمان)",
      credit: {
        author: "Deutsches Uhrenmuseum",
        license: "CC BY-SA 4.0",
        licenseUrl: CC_BY_SA_4,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Seiko_Astron.jpg",
      },
    },
    sources: [
      {
        label: "Seiko Watch Corporation · Our Heritage",
        url: "https://www.seikowatches.com/no-en/special/heritage",
      },
      {
        label: "Seiko · 100 Stories: History",
        url: "https://www.seikowatches.com/us-en/special/100stories/history/",
      },
      {
        label: "Seiko Group Corporation · History",
        url: "https://www.seiko.co.jp/en/group/history/",
      },
      {
        label: "Seiko · The Story of the 1969 Quartz Astron",
        url: "https://www.seikowatches.com/ca-en/products/astron/special/story_qa50th_1",
      },
    ],
  },
  {
    slug: "casio",
    name: "کاسیو",
    latinName: "Casio",
    tagline: "غول الکترونیک و مقاومت ابدی",
    founded: "آوریل ۱۹۴۶ میلادی (کارگاه Kashio Seisakujo)؛ شرکت Casio Computer در ژوئن ۱۹۵۷",
    place: "میتاکا، توکیو، ژاپن (ورود به بازار ساعت مچی: نوامبر ۱۹۷۴)",
    foundersLabel: "موسسان",
    founders:
      "تادائو کاشیو (Tadao Kashio) و سه برادر کوچک‌ترش، توشیو، کازو و یوکیو. پدرشان شیگرو کاشیو اولین رئیس Casio Computer شد.",
    story:
      "کاسیو اصلاً با ساعت شروع نکرد. تادائو کاشیو شاگرد تراشکار بود و در ۱۹۴۶ کارگاه کوچکی در میتاکا باز کرد که برای دیگران قطعهٔ میکروسکوپ و چرخ‌دنده می‌ساخت. یکی از اولین محصولات خودشان «پیپ یوبیوا» (yubiwa pipe) بود: انگشتری که سیگار را نگه می‌داشت تا در ژاپن کم‌بضاعت پس از جنگ بشود سیگار را تا ته کشید و هنگام کار دست‌ها آزاد بماند. این را توشیو اختراع کرد، تادائو با تراش ساخت و پدرشان فروخت. سود همین محصول خرج ساخت ماشین‌حساب شد. در ژوئن ۱۹۵۷ برادران ماشین‌حساب 14-A را عرضه کردند که با ۳۴۱ رله کار می‌کرد؛ کاسیو آن را اولین ماشین‌حساب جمع‌وجور تمام‌برقی جهان می‌نامد و انجمن پردازش اطلاعات ژاپن اولین ماشین‌حساب تجاری رله‌ای.",
    milestones: [
      {
        title: "Casiotron (۱۹۷۴)",
        text: "اولین ساعت مچی کاسیو (QW02) و به گفتهٔ کاسیو اولین ساعت دیجیتال جهان با تقویم خودکار که ماه‌های کوتاه و بلند را خودش تشخیص می‌داد. قیمتش ۵۸٬۰۰۰ ین بود، نزدیک به حقوق یک ماهِ یک فارغ‌التحصیل تازه‌کار دانشگاه در ژاپن آن سال.",
      },
      {
        title: "G-Shock DW-5000C (۱۹۸۳)",
        text: "مهندس کیکوئو ایبه (Kikuo Ibe) پس از آنکه ساعت مچی‌ای که هدیهٔ پدرش بود از دستش افتاد و شکست، در ۱۹۸۱ پیشنهاد ساعتی نشکن را داد با هدف «سه‌ده» (Triple 10): عمر باتری ۱۰ سال، مقاومت آب ۱۰ بار و سالم ماندن پس از سقوط از ارتفاع ۱۰ متر. او نمونه‌ها را از پنجرهٔ دستشویی طبقهٔ سوم پایین می‌انداخت. پس از دو سال و بیش از ۲۰۰ نمونه، راه‌حل ساختار «شناور» بود: ماژول داخلی فقط در چند نقطه به قاب تکیه می‌کند تا ضربه را جذب کند. DW-5000C در ۱۹۸۳ به بازار آمد.",
      },
    ],
    image: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/DW-5000.jpg/1280px-DW-5000.jpg",
      alt: "اولین کاسیو جی‌شاک، مدل DW-5000C مشکی و چهارگوش",
      caption: "اولین جی‌شاک، DW-5000C با ماژول ۲۴۰، ۱۹۸۳",
      credit: {
        author: "Stollenbaeck",
        license: "CC BY-SA 4.0",
        licenseUrl: CC_BY_SA_4,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:DW-5000.jpg",
      },
    },
    sources: [
      { label: "Casio · Company History", url: "https://world.casio.com/corporate/history/" },
      {
        label: "Casio · Watch History, the 1970s",
        url: "https://www.casio.com/intl/watches/Heritage/1970s/",
      },
      {
        label: "Nippon.com · Ibe Kikuo and the Development of the G-Shock",
        url: "https://www.nippon.com/en/japan-topics/g01192/",
      },
      {
        label: "Hodinkee · A Conversation With G-Shock Inventor Kikuo Ibe",
        url: "https://www.hodinkee.com/articles/worlds-rarest-g-shock-kikuo-ibe",
      },
      { label: "Wikipedia · Casio", url: "https://en.wikipedia.org/wiki/Casio" },
    ],
  },
];
