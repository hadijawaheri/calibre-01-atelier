import type { ReferencePhoto, WatchEntry } from "./types";

const CC = (version: "2.0" | "3.0" | "4.0") => ({
  license: `CC BY-SA ${version}`,
  licenseUrl: `https://creativecommons.org/licenses/by-sa/${version}/`,
});

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

const wiki = (title: string, label = title.replaceAll("_", " ")) => ({
  label: `Wikipedia · ${label}`,
  url: `https://en.wikipedia.org/wiki/${title}`,
});

/* Thumbnails are the sizes the Commons API returned for these files; the licence of each was read from the
   same API response. */
const photo = (
  src: string,
  alt: string,
  caption: string,
  author: string,
  license: { license: string; licenseUrl: string },
  file: string,
): ReferencePhoto => ({
  src,
  alt,
  caption,
  credit: { author, ...license, sourceUrl: commons(file) },
});

/* Ordered by the year each model was introduced. Only facts a listed source states are kept; a spec the
   sources did not agree on (such as the first Fifty Fathoms' diameter) is left out rather than guessed. */
export const WATCHES: readonly WatchEntry[] = [
  {
    slug: "cartier-tank",
    brandSlug: "cartier",
    name: "کارتیه تانک",
    latinName: "Cartier Tank",
    year: 1917,
    specs: [
      { label: "طراح", value: "لویی کارتیه" },
      { label: "عرضه", value: "معرفی ۱۹۱۸؛ تولید کامل از ۱۹۱۹ با شش عدد" },
      { label: "نوع", value: "ساعت رسمی (dress)، صفحهٔ عقربه‌ای" },
      {
        label: "نسخه‌های بعدی",
        value: "Tank Louis ۱۹۲۲، Tank Américaine ۱۹۸۹، Tank Française ۱۹۹۶",
      },
    ],
    story:
      "لویی کارتیه شکل این ساعت را از تانک‌های تازهٔ رنو گرفت که در جبههٔ غربی جنگ جهانی اول به کار می‌رفتند. نمونهٔ اول را به ژنرال جان پرشینگ، فرماندهٔ نیروهای آمریکایی، هدیه داد. در ۲۰۱۷، صدمین سال، نسخه‌ای با موومنت اتوماتیک هم عرضه شد.",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Cartier_Tank.jpg/960px-Cartier_Tank.jpg",
      "ساعت مچی کارتیه تانک با قاب مستطیلی",
      "کارتیه تانک، مدل Must de Cartier",
      "Guy Sie",
      CC("2.0"),
      "Cartier_Tank.jpg",
    ),
    sources: [wiki("Cartier_Tank")],
  },
  {
    slug: "rolex-oyster",
    brandSlug: "rolex",
    name: "رولکس اویستر",
    latinName: "Rolex Oyster",
    year: 1926,
    specs: [
      { label: "نوآوری", value: "قاب کاملاً آب‌بند و ضد گرد و غبار" },
      { label: "آزمون مشهور", value: "شنای مرسدس گلایتز در کانال مانش، ۱۹۲۷" },
    ],
    story:
      "به گفتهٔ رولکس اولین ساعت مچی ضدآب. ویکی‌پدیا یادآوری می‌کند که قاب را یک قاب‌ساز بیرونی برای رولکس ساخت. در ۱۹۲۷ مرسدس گلایتز با اویستری که از گردنبندش آویخته بود بیش از ۱۰ ساعت در مانش شنا کرد و ساعت سالم ماند.",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Rolex_Oyster_del_1926%2C_il_primo_orologio_impermeabile_della_storia.jpg/960px-Rolex_Oyster_del_1926%2C_il_primo_orologio_impermeabile_della_storia.jpg",
      "ساعت مچی رولکس اویستر با قاب هشت‌ضلعی، مدل ۱۹۲۶",
      "رولکس اویستر ۱۹۲۶",
      "Clyde94",
      CC("4.0"),
      "Rolex_Oyster_del_1926,_il_primo_orologio_impermeabile_della_storia.jpg",
    ),
    sources: [
      {
        label: "Rolex · History 1926–1945",
        url: "https://www.rolex.com/en-us/about-rolex/history/1926-1945",
      },
      wiki("Rolex"),
    ],
  },
  {
    slug: "jaeger-lecoultre-reverso",
    brandSlug: "jaeger-lecoultre",
    name: "ژگر-لوکولتر روِرسو",
    latinName: "Jaeger-LeCoultre Reverso",
    year: 1931,
    specs: [
      { label: "سفارش‌دهنده", value: "سزار دو تره (César de Trey)، فروشندهٔ ساعت" },
      { label: "مهندس قاب", value: "رنه-آلفرد شووو (René-Alfred Chauvot)" },
      { label: "نوآوری", value: "قابی که در پایه‌اش می‌چرخد و شیشه را رو به مچ پنهان می‌کند" },
    ],
    story:
      "گروهی از بازیکنان چوگان از سزار دو تره ساعتی خواستند که ضربه‌های بازی را تاب بیاورد. دو تره نامه‌ای به ژاک-داوید لوکولتر نوشت و رنه-آلفرد شووو، مهندس فرانسوی همکار لوکولتر، قاب چرخانی طراحی کرد که هنوز همان است. نام Reverso از لاتین به معنی «برمی‌گردم» است.",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Jaeger-LeCoultre-Reverso.jpg/960px-Jaeger-LeCoultre-Reverso.jpg",
      "ساعت مچی مستطیلی ژگر-لوکولتر روِرسو دوفیس",
      "ژگر-لوکولتر روِرسو Duoface، کوک دستی",
      "Tiberido",
      CC("4.0"),
      "Jaeger-LeCoultre-Reverso.jpg",
    ),
    sources: [wiki("Jaeger-LeCoultre")],
  },
  {
    slug: "blancpain-fifty-fathoms",
    brandSlug: "blancpain",
    name: "بلانپن فیفتی فدامز",
    latinName: "Blancpain Fifty Fathoms",
    year: 1953,
    specs: [
      {
        label: "همکاری",
        value: "غواصان رزمی نیروی دریایی فرانسه، به رهبری باب مالوبیه و کلود ریفو",
      },
      { label: "مقاومت آب", value: "۵۰ فاتوم، یعنی ۹۴٫۵ متر" },
      { label: "در خدمت", value: "از ۱۹۵۸ ساعت سازمانی غواصان رزمی نیروی دریایی آمریکا" },
    ],
    story:
      "فیفتی فدامز با غواصان رزمی فرانسه طراحی شد و ژاک کوستو هم آن را به دست می‌بست. اینکه اولین ساعت غواصی مدرن باشد محل بحث است: رولکس سابمرینر هم در ۱۹۵۳ به تولید رسید.",
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Calibro_automatico_Adolf_Schild_1361_N_montato_su_un_Blancpain_Fifty_Fathoms_vintage.jpg",
      "موومنت اتوماتیک داخل قاب باز یک فیفتی فدامز قدیمی",
      "کالیبر اتوماتیک A. Schild 1361 N در یک فیفتی فدامز قدیمی",
      "EMore98",
      CC("4.0"),
      "Calibro_automatico_Adolf_Schild_1361_N_montato_su_un_Blancpain_Fifty_Fathoms_vintage.jpg",
    ),
    sources: [wiki("Blancpain"), wiki("Rolex_Submariner")],
  },
  {
    slug: "rolex-submariner",
    brandSlug: "rolex",
    name: "رولکس سابمرینر",
    latinName: "Rolex Submariner",
    year: 1953,
    specs: [
      { label: "اولین مرجع‌ها", value: "6204 / 6205", latin: true },
      { label: "موومنت اول", value: "A260", latin: true },
      { label: "قطر قاب", value: "۳۷ میلی‌متر" },
      { label: "مقاومت آب", value: "۱۰۰ متر در آغاز؛ امروز ۳۰۰ متر" },
    ],
    story:
      "سابمرینر در ۱۹۵۳ به تولید رسید و در ۱۹۵۴ در نمایشگاه بازل به نمایش درآمد؛ اولین ساعتی که تا ۱۰۰ متر ضدآب بود. امروز سابمرینر با کالیبر 3230 و سابمرینر دیت با کالیبر 3235 کار می‌کنند.",
    calibreSlug: "rolex-3235",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Il_primo_Rolex_Submariner_del_1953.jpg/960px-Il_primo_Rolex_Submariner_del_1953.jpg",
      "رولکس سابمرینر قدیمی با عقربه‌های مدادی و حلقهٔ چرخان",
      "رولکس سابمرینر مرجع 6204، ۱۹۵۳",
      "Clyde94",
      CC("4.0"),
      "Il_primo_Rolex_Submariner_del_1953.jpg",
    ),
    sources: [wiki("Rolex_Submariner")],
  },
  {
    slug: "omega-speedmaster",
    brandSlug: "omega",
    name: "امگا اسپیدمستر",
    latinName: "Omega Speedmaster",
    year: 1957,
    specs: [
      { label: "اولین مرجع", value: "CK 2915", latin: true },
      { label: "موومنت اول", value: "Omega 321، کوک دستی" },
      { label: "تأیید ناسا", value: "مارس ۱۹۶۵" },
      { label: "موومنت امروز", value: "Omega 3861، قطر قاب ۴۲ میلی‌متر" },
    ],
    story:
      "والتر شیرا در ۱۹۶۲ اولین کسی بود که اسپیدمستر را به فضا برد. ناسا پس از آزمون‌هایی که در مارس ۱۹۶۵ تمام شد آن را برگزید؛ در اولین راه‌پیمایی فضایی آمریکا (جمینای ۴) بسته شد و در آپولو ۱۱ اولین ساعتی بود که روی ماه رفت. کالیبر 321 در ۱۹۶۸ جایش را به 861 داد.",
    calibreSlug: "omega-321",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Vintage_Omega_Speedmaster_%22Pre-moon%22.jpg/960px-Vintage_Omega_Speedmaster_%22Pre-moon%22.jpg",
      "کرونوگراف امگا اسپیدمستر قدیمی با بند فلزی",
      "امگا اسپیدمستر مرجع 145.012-67",
      "Shane Lin",
      CC("2.0"),
      "Vintage_Omega_Speedmaster_%22Pre-moon%22.jpg",
    ),
    sources: [
      {
        label: "Swatch Group · Omega reintroduces the Calibre 321",
        url: "https://www.swatchgroup.com/en/services/archive/2019/omega-reintroduces-iconic-calibre-321",
      },
      wiki("Omega_Speedmaster"),
    ],
  },
  {
    slug: "hamilton-ventura",
    brandSlug: "hamilton",
    name: "همیلتون ونچورا",
    latinName: "Hamilton Ventura",
    year: 1957,
    specs: [
      { label: "موومنت", value: "Hamilton Electric 500، باتری‌دار" },
      { label: "طراح قاب", value: "ریچارد آربیب (Richard Arbib)" },
      { label: "معرفی", value: "۳ ژانویهٔ ۱۹۵۷، نیویورک" },
    ],
    story:
      "اولین ساعت برقی جهان: به جای فنر اصلی، یک باتری و سیم‌پیچ الکترومغناطیسی بالانس را به نوسان درمی‌آورد. قاب نامتقارنش هم به همان اندازه تازه بود. الویس پریسلی آن را می‌بست و در فیلم «هاوایی آبی» هم به دست داشت.",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Ventura_1957.jpg/960px-Ventura_1957.jpg",
      "ساعت مچی همیلتون ونچورا با قاب نامتقارن",
      "همیلتون ونچورا ۱۹۵۷",
      "Hamiltonwatches",
      CC("3.0"),
      "Ventura_1957.jpg",
    ),
    sources: [
      {
        label: "Hamilton · History of Hamilton",
        url: "https://www.hamiltonwatch.com/en-us/company/hamilton-watches-history",
      },
      {
        label: "À la Clinique Horlogère · Hamilton 500",
        url: "https://www.cliniquehorlogere.ch/en/archive/electric-watchmaking/hamilton-500-electric.html",
      },
      wiki("Hamilton_Watch_Company", "Hamilton Watch Company"),
    ],
  },
  {
    slug: "zenith-el-primero-a384",
    brandSlug: "zenith",
    name: "زنیت ال پریمرو A384",
    latinName: "Zenith El Primero A384",
    year: 1969,
    specs: [
      { label: "موومنت", value: "El Primero 3019 PHC", latin: true },
      { label: "فرکانس", value: "۳۶٬۰۰۰ ضربه در ساعت (۵ هرتز)" },
      { label: "هم‌خانواده‌ها", value: "A385 و A386، همان سال" },
    ],
    story:
      "زنیت کالیبر ال پریمرو را در ۱۰ ژانویهٔ ۱۹۶۹ رونمایی کرد: اولین کرونوگراف اتوماتیک پرفرکانس. A384 با قاب بشکه‌ای اولین ساعت ال پریمرو بود که در آگهی‌های زنیت (مارس ۱۹۶۹) آمد.",
    calibreSlug: "zenith-el-primero-400",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Zenith_El_Primero_A_384.jpg/960px-Zenith_El_Primero_A_384.jpg",
      "کرونوگراف زنیت ال پریمرو A384 با قاب بشکه‌ای",
      "زنیت ال پریمرو A384",
      "EMore98",
      CC("4.0"),
      "Zenith_El_Primero_A_384.jpg",
    ),
    sources: [
      wiki("Zenith_(watchmaker)", "Zenith"),
      {
        label: "Monochrome · The History of the Zenith El Primero",
        url: "https://monochrome-watches.com/in-depth-the-history-of-the-zenith-el-primero-high-frequency-automatic-chronograph/",
      },
      {
        label: "Time and Watches · The history of the Zenith El Primero",
        url: "https://www.timeandwatches.com/p/the-history-of-zenith-el-primero.html",
      },
    ],
  },
  {
    slug: "heuer-monaco",
    brandSlug: "tag-heuer",
    name: "هویر موناکو",
    latinName: "Heuer Monaco",
    year: 1969,
    specs: [
      { label: "مرجع", value: "1133", latin: true },
      { label: "موومنت", value: "Calibre 11 (Chronomatic)، اتوماتیک" },
      { label: "قاب", value: "فولاد، ۳۹ میلی‌متر، تاج در سمت چپ" },
      { label: "رونمایی", value: "۳ مارس ۱۹۶۹، هم‌زمان در ژنو و نیویورک" },
    ],
    story:
      "اولین کرونوگراف ضدآب با قاب مربعی، به نام گرندپری موناکو. استیو مک‌کوئین آن را در فیلم «لمان» (۱۹۷۱) به دست بست و نامش برای همیشه به او گره خورد. تولیدش در میانهٔ دههٔ ۱۹۷۰ متوقف شد و در ۱۹۹۸ دوباره برگشت.",
    calibreSlug: "heuer-calibre-11",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/TAG_Heuer_Monaco_40th_Anniversary_re-edition.JPG/960px-TAG_Heuer_Monaco_40th_Anniversary_re-edition.JPG",
      "کرونوگراف تگ هویر موناکو با قاب مربعی",
      "بازسازی چهلمین سال موناکو با Calibre 11، ۲۰۰۹",
      "Ferengi",
      CC("3.0"),
      "TAG_Heuer_Monaco_40th_Anniversary_re-edition.JPG",
    ),
    sources: [
      {
        label: "TAG Heuer · Vintage Heuer Monaco",
        url: "https://www.tagheuer.com/us/en/vintage-collection/vintage-heuer-monaco.html",
      },
      {
        label: "Monochrome · The Complete History of the Monaco",
        url: "https://monochrome-watches.com/complete-history-tag-heuer-monaco-chronograph/",
      },
      wiki("TAG_Heuer_Monaco"),
    ],
  },
  {
    slug: "seiko-quartz-astron",
    brandSlug: "seiko",
    name: "سیکو کوارتز آسترون",
    latinName: "Seiko Quartz Astron 35SQ",
    year: 1969,
    specs: [
      { label: "عرضه", value: "۲۵ دسامبر ۱۹۶۹، توکیو" },
      { label: "موومنت", value: "Seiko 35A، کوارتز" },
      { label: "دقت", value: "±۵ ثانیه در ماه" },
      { label: "تعداد فروش اول", value: "۱۰۰ عدد" },
    ],
    story:
      "اولین ساعت مچی کوارتز جهان و آغاز «بحران کوارتز». سیکو بعدها حق اختراع‌های کلیدی‌اش را در دسترس سازندگان دیگر گذاشت و ساعت کوارتز در چند سال ارزان و همه‌گیر شد.",
    calibreSlug: "seiko-35a",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Seiko_Astron.jpg/960px-Seiko_Astron.jpg",
      "ساعت مچی کوارتز سیکو آسترون با قاب طلایی، ۱۹۶۹، در موزهٔ ساعت آلمان",
      "سیکو کوارتز آسترون، ۱۹۶۹ (موزهٔ ساعت آلمان)",
      "Deutsches Uhrenmuseum",
      CC("4.0"),
      "Seiko_Astron.jpg",
    ),
    sources: [
      {
        label: "Seiko · The Story of the 1969 Quartz Astron",
        url: "https://www.seikowatches.com/ca-en/products/astron/special/story_qa50th_1",
      },
      wiki("Quartz_crisis"),
    ],
  },
  {
    slug: "audemars-piguet-royal-oak",
    brandSlug: "audemars-piguet",
    name: "اودمار پیگه رویال اوک",
    latinName: "Audemars Piguet Royal Oak 5402",
    year: 1972,
    specs: [
      { label: "مرجع", value: "5402ST", latin: true },
      { label: "طراح", value: "ژرالد جنتا (Gérald Genta)" },
      { label: "قاب", value: "فولاد، ۳۹ میلی‌متر، ضدآب تا ۱۰۰ متر" },
      { label: "موومنت", value: "Calibre 2121، اتوماتیک" },
      { label: "تولید", value: "۶٬۰۵۰ عدد، ۱۹۷۲ تا ۲۰۰۲" },
    ],
    story:
      "ژرالد جنتا آن را در یک شب طراحی کرد و پس از دو سال کار، در نمایشگاه بازل ۱۹۷۲ و در میانهٔ بحران کوارتز رونمایی شد. ساعتی فولادی با بند یکپارچه به قیمت ساعت‌های طلا؛ آن را اولین ساعت اسپرت لوکس جهان می‌دانند. قرار بود ۱٬۰۰۰ عدد ساخته شود.",
    calibreSlug: "ap-2121",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Audemars_Piguet_Royal_Oak_ref._15202.jpg/960px-Audemars_Piguet_Royal_Oak_ref._15202.jpg",
      "اودمار پیگه رویال اوک با حلقهٔ هشت‌ضلعی پیچ‌دار و صفحهٔ آبی",
      "رویال اوک مرجع 15202، جانشین ۳۹ میلی‌متری 5402",
      "OpaleHorse",
      CC("4.0"),
      "Audemars_Piguet_Royal_Oak_ref._15202.jpg",
    ),
    sources: [
      {
        label: "Audemars Piguet Chronicles · Royal Oak 5402",
        url: "https://apchronicles.audemarspiguet.com/en/model/5402",
      },
      wiki("Audemars_Piguet"),
    ],
  },
  {
    slug: "patek-philippe-nautilus",
    brandSlug: "patek-philippe",
    name: "پتک فیلیپ ناتیلوس",
    latinName: "Patek Philippe Nautilus 3700",
    year: 1976,
    specs: [
      { label: "مرجع", value: "3700/1A", latin: true },
      { label: "طراح", value: "ژرالد جنتا" },
      { label: "قاب", value: "فولاد، ۴۲ میلی‌متر، ضدآب تا ۱۲۰ متر" },
    ],
    story:
      "پتک فیلیپ ناتیلوس را در بحران کوارتز عرضه کرد تا توجه‌ها را به ساعت مکانیکی ممتاز سوئیسی برگرداند. اندازهٔ بزرگ ۴۲ میلی‌متری‌اش لقب «جامبو» را برایش آورد. اولین ساعت‌ها در ۱۹۷۷ از کارخانه بیرون آمدند.",
    sources: [
      wiki("Patek_Philippe", "Patek Philippe"),
      {
        label: "Monochrome · History of the Nautilus, Part 1",
        url: "https://monochrome-watches.com/history-patek-philippe-nautilus-part-1-nautilus-3700/",
      },
      {
        label: "Collectability · The Unlikely Icon",
        url: "https://collectability.com/learn/the-unlikely-icon-how-the-patek-philippe-nautilus-went-from-zero-to-hero/",
      },
    ],
  },
  {
    slug: "casio-g-shock-dw-5000c",
    brandSlug: "casio",
    name: "کاسیو جی‌شاک DW-5000C",
    latinName: "Casio G-Shock DW-5000C",
    year: 1983,
    specs: [
      { label: "طراح", value: "کیکوئو ایبه (Kikuo Ibe)" },
      { label: "هدف طراحی", value: "باتری ۱۰ ساله، ضدآب ۱۰ بار، سالم پس از سقوط ۱۰ متری" },
      { label: "موومنت", value: "ماژول کوارتز دیجیتال ۲۴۰" },
    ],
    story:
      "ایبه پس از دو سال و بیش از ۲۰۰ نمونه به ساختار «شناور» رسید: ماژول داخلی فقط در چند نقطه به قاب تکیه می‌کند و ضربه را جذب می‌کند. نمونه‌ها را از پنجرهٔ طبقهٔ سوم پایین می‌انداخت.",
    photo: photo(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/DW-5000.jpg/1280px-DW-5000.jpg",
      "اولین کاسیو جی‌شاک، مدل DW-5000C مشکی و چهارگوش",
      "اولین جی‌شاک، DW-5000C، ۱۹۸۳",
      "Stollenbaeck",
      CC("4.0"),
      "DW-5000.jpg",
    ),
    sources: [
      {
        label: "Nippon.com · Ibe Kikuo and the Development of the G-Shock",
        url: "https://www.nippon.com/en/japan-topics/g01192/",
      },
      {
        label: "Hodinkee · A Conversation With G-Shock Inventor Kikuo Ibe",
        url: "https://www.hodinkee.com/articles/worlds-rarest-g-shock-kikuo-ibe",
      },
      wiki("G-Shock"),
    ],
  },
  {
    slug: "swatch-gb101",
    brandSlug: "swatch",
    name: "سواچ GB101",
    latinName: "Swatch GB101 (Gent Black)",
    year: 1983,
    specs: [
      { label: "معرفی", value: "۱ مارس ۱۹۸۳، زوریخ" },
      { label: "قیمت اول", value: "۳۹٫۹۰ تا ۴۹٫۹۰ فرانک؛ پاییز ۱۹۸۳ یکسان ۵۰ فرانک" },
      { label: "قاب", value: "پلاستیک، با جوش اولتراسونیک" },
    ],
    story:
      "یکی از دوازده مدل اولین مجموعهٔ سواچ؛ کوارتز سوئیسی ارزانی که مثل اکسسوری مد فروخته می‌شد. نام Swatch کوتاه‌شدهٔ «second watch» (ساعت دوم) است.",
    photo: photo(
      "https://upload.wikimedia.org/wikipedia/commons/d/d8/Swatch_GB101.jpg",
      "ساعت مچی سواچ GB101 مشکی با بند پلاستیکی",
      "سواچ GB101، از اولین مدل‌های ۱۹۸۳",
      "Luekk",
      CC("3.0"),
      "Swatch_GB101.jpg",
    ),
    sources: [
      {
        label: "Swatch Group · History",
        url: "https://www.swatchgroup.com/en/swatch-group/swatch-group-history",
      },
      wiki("Swatch"),
    ],
  },
];

export const watchBySlug = (slug: string) => WATCHES.find((watch) => watch.slug === slug);
