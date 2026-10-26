import type { CalibreEntry } from "./types";

const wiki = (title: string, label = title.replaceAll("_", " ")) => ({
  label: `Wikipedia · ${label}`,
  url: `https://en.wikipedia.org/wiki/${title}`,
});

/* Ordered by the year each calibre was introduced. A figure is only filled in when a listed source gives it;
   the comparison table shows a dash where the sources are silent. */
export const CALIBRE_ENTRIES: readonly CalibreEntry[] = [
  {
    slug: "omega-321",
    name: "Omega 321",
    maker: "امگا، بر پایهٔ Lemania 2310",
    kind: "chronograph",
    type: "کرونوگراف کوک دستی با چرخ ستونی",
    year: 1946,
    frequency: "۱۸٬۰۰۰ ضربه در ساعت (۲٫۵ هرتز)",
    powerReserve: "۴۴ ساعت",
    jewels: "۱۷",
    diameter: "۲۷ میلی‌متر",
    height: "۶٫۷۴ میلی‌متر",
    note: "آلبر پیگه در لمانیا آن را در ۱۹۴۶ طراحی کرد. اولین موومنت امگا اسپیدمستر (۱۹۵۷) بود و در ساعت‌هایی کار می‌کرد که در اولین راه‌پیمایی فضایی آمریکا و روی ماه بسته شدند. آخرین 321 در ۱۹۶۸ ساخته شد و امگا در ۲۰۱۹ آن را از نو به تولید برگرداند.",
    sources: [
      {
        label: "Swatch Group · Omega reintroduces the Calibre 321",
        url: "https://www.swatchgroup.com/en/services/archive/2019/omega-reintroduces-iconic-calibre-321",
      },
      wiki("Omega_Speedmaster"),
      { label: "OTTUHR · Omega 321", url: "https://ottuhr.com/index/omega/calibers/omega-321/" },
    ],
  },
  {
    slug: "zenith-el-primero-400",
    name: "Zenith El Primero 400",
    maker: "زنیت",
    kind: "chronograph",
    type: "کرونوگراف اتوماتیک یکپارچه، پرفرکانس",
    year: 1969,
    frequency: "۳۶٬۰۰۰ ضربه در ساعت (۵ هرتز)",
    powerReserve: "۵۰ ساعت",
    jewels: "۳۱",
    note: "نسخهٔ اول با نام 3019 PHC در ۱۰ ژانویهٔ ۱۹۶۹ رونمایی شد: اولین کرونوگراف اتوماتیک پرفرکانس. ۲۷۸ قطعه دارد و با ده ضربه در ثانیه، دهم ثانیه را هم می‌شمارد.",
    sources: [
      wiki("Zenith_(watchmaker)", "Zenith"),
      {
        label: "WatchBase · Zenith El Primero 400",
        url: "https://watchbase.com/zenith/caliber/el-primero-400",
      },
    ],
  },
  {
    slug: "heuer-calibre-11",
    name: "Heuer Calibre 11 (Chronomatic)",
    maker: "هویر، برایتلینگ، همیلتون-بورن و دوبوا-دپرا",
    kind: "chronograph",
    type: "کرونوگراف اتوماتیک با میکرو‌روتور",
    year: 1969,
    note: "حاصل «پروژهٔ ۹۹»، همکاری چهار شرکت برای ساختن یک کرونوگراف اتوماتیک. ویکی‌پدیا آن را اولین کرونوگراف اتوماتیک با میکرو‌روتور می‌داند. تاج در سمت چپ قرار گرفت تا نشان دهد ساعت دیگر کوک دستی نمی‌خواهد.",
    sources: [
      {
        label: "Revolution · A Brief History of the TAG Heuer Monaco",
        url: "https://revolutionwatch.com/brief-history-tag-heuer-monaco/",
      },
      {
        label: "Monochrome · The Complete History of the Monaco",
        url: "https://monochrome-watches.com/complete-history-tag-heuer-monaco-chronograph/",
      },
      wiki("TAG_Heuer_Monaco"),
    ],
  },
  {
    slug: "seiko-35a",
    name: "Seiko 35A",
    maker: "سیکو",
    kind: "quartz",
    type: "کوارتز عقربه‌ای",
    year: 1969,
    frequency: "کریستال ۸٬۱۹۲ هرتز",
    note: "اولین موومنت ساعت مچی کوارتز، در سیکو کوارتز آسترون. یک نوسانگر کوارتز، یک مدار مجتمع ترکیبی و یک موتور پله‌ای بسیار کوچک داشت. به گفتهٔ سیکو دقتش ±۵ ثانیه در ماه بود و باتری‌اش دست‌کم یک سال کار می‌کرد.",
    family: "quartz",
    photo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Seiko_35A.jpg",
      alt: "موومنت کوارتز سیکو 35A با کریستال، مدار و موتور پله‌ای",
      caption: "کالیبر 35A، شمارهٔ ۰۰۲۳۴، ۱۹۶۹ (موزهٔ ساعت آلمان)",
      credit: {
        author: "Museumsfoto",
        license: "CC BY 3.0 de",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/de/deed.en",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Seiko_35A.jpg",
      },
    },
    sources: [
      {
        label: "Seiko · The Story of the 1969 Quartz Astron",
        url: "https://www.seikowatches.com/ca-en/products/astron/special/story_qa50th_1",
      },
      {
        label: "Wikimedia Commons · Seiko 35A (Deutsches Uhrenmuseum)",
        url: "https://commons.wikimedia.org/wiki/File:Seiko_35A.jpg",
      },
    ],
  },
  {
    slug: "ap-2121",
    name: "Audemars Piguet 2121",
    maker: "اودمار پیگه، بر پایهٔ JLC 920",
    kind: "automatic",
    type: "اتوماتیک فوق‌باریک با تاریخ، بدون ثانیه‌شمار",
    year: 1970,
    frequency: "۱۹٬۸۰۰ ضربه در ساعت",
    height: "۳٫۰۵ میلی‌متر",
    note: "پایهٔ آن، کالیبر 2120، از ۱۹۶۷ و حاصل همکاری اودمار پیگه، لوکولتر و واشرون کنستانتین بود. روتورش روی غلتک‌های ریز یاقوتی در حاشیه می‌چرخد تا محور مرکزی بار کمتری بکشد. از ۱۹۷۲ در اولین رویال اوک کار کرد و پایان ۲۰۲۱ جایش را به 7121 داد.",
    family: "ultra-thin",
    photo: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Calibro_Audemars_Piguet_2121_con_rotore_personalizzato_e_numerato_per_i_20_anni_dalla_nascita_del_Royal_Oak._Montato_sulla_ref._14802_del_1992..jpg/960px-Calibro_Audemars_Piguet_2121_con_rotore_personalizzato_e_numerato_per_i_20_anni_dalla_nascita_del_Royal_Oak._Montato_sulla_ref._14802_del_1992..jpg",
      alt: "کالیبر اودمار پیگه 2121 از پشت قاب، با روتور طلایی حکاکی‌شده",
      caption: "کالیبر 2121 با روتور ویژهٔ بیستمین سال رویال اوک، در مرجع 14802 (۱۹۹۲)",
      credit: {
        author: "EMore98",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Calibro_Audemars_Piguet_2121_con_rotore_personalizzato_e_numerato_per_i_20_anni_dalla_nascita_del_Royal_Oak._Montato_sulla_ref._14802_del_1992..jpg",
      },
    },
    sources: [
      {
        label: "Audemars Piguet Chronicles · Calibre 2121",
        url: "https://apchronicles.audemarspiguet.com/en/calibre/2121",
      },
      {
        label: "Monochrome · The Royal Oak Jumbo and calibre 2121",
        url: "https://monochrome-watches.com/complete-history-of-the-audemars-piguet-royal-oak-jumbo-series-5402-14802-15002-15202-16202-review/",
      },
    ],
  },
  {
    slug: "valjoux-7750",
    name: "Valjoux 7750",
    maker: "والژو (امروز ETA، سواچ گروپ)",
    kind: "chronograph",
    type: "کرونوگراف اتوماتیک با بادامک، روز و تاریخ",
    year: 1974,
    frequency: "۲۸٬۸۰۰ ضربه در ساعت (۴ هرتز)",
    powerReserve: "حدود ۴۸ ساعت",
    jewels: "۲۵",
    diameter: "۳۰ میلی‌متر",
    height: "۷٫۹ میلی‌متر",
    note: "ادمون کپ، مهندس ۲۴ ساله، آن را در اوج بحران کوارتز طراحی کرد تا کرونوگراف اتوماتیکی ارزان‌تر از رقبای چرخ‌ستونی بسازد. به جای چرخ ستونی، بادامک و اهرم دارد. نخستین نمونه‌ها در ۱۹۷۳ به مشتریان رسیدند و معرفی رسمی در ۱۹۷۴ بود.",
    photo: {
      src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Breitling_rotor_Valjoux_7750.jpg/960px-Breitling_rotor_Valjoux_7750.jpg",
      alt: "روتور اتوماتیک برایتلینگ روی موومنت والژو 7750",
      caption: "روتور برایتلینگ برای موومنت Valjoux 7750",
      credit: {
        author: "Zenith El Primero",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Breitling_rotor_Valjoux_7750.jpg",
      },
    },
    sources: [
      {
        label: "Monochrome · The Legendary Valjoux 7750",
        url: "https://monochrome-watches.com/valjoux-7750-chronograph-history-50-years-technical-explanation-evolution-clones-in-depth-review/",
      },
      {
        label: "Caliber Corner · ETA/Valjoux 7750",
        url: "https://calibercorner.com/eta-valjoux-caliber-7750/",
      },
      {
        label: "Watch-Wiki · Valjoux 7750",
        url: "https://www.watch-wiki.net/doku.php?id=valjoux_7750",
      },
    ],
  },
  {
    slug: "patek-240",
    name: "Patek Philippe 240",
    maker: "پتک فیلیپ",
    kind: "automatic",
    type: "اتوماتیک فوق‌باریک با میکرو‌روتور",
    year: 1977,
    frequency: "۲۱٬۶۰۰ ضربه در ساعت (۳ هرتز)",
    powerReserve: "دست‌کم ۴۸ ساعت",
    jewels: "۲۷",
    height: "۲٫۵۳ میلی‌متر",
    note: "میکرو‌روتور طلای ۲۲ عیار در دل صفحهٔ موومنت فرو رفته است تا ارتفاع از ۲٫۵۳ میلی‌متر بالاتر نرود. پایهٔ ده‌ها نسخه با تقویم، ساعت جهانی و فاز ماه است.",
    family: "ultra-thin",
    sources: [
      {
        label: "Patek Philippe · Caliber 240",
        url: "https://www.patek.com/en/collection/movements/240",
      },
      { label: "Grail Watch Wiki · PP 240", url: "https://wiki.grail-watch.com/index.php/PP_240" },
    ],
  },
  {
    slug: "eta-2824-2",
    name: "ETA 2824-2",
    maker: "ETA (سواچ گروپ)",
    kind: "automatic",
    type: "اتوماتیک با ثانیه‌شمار مرکزی و تاریخ",
    year: 1982,
    frequency: "۲۸٬۸۰۰ ضربه در ساعت (۴ هرتز)",
    powerReserve: "حدود ۴۲ ساعت",
    jewels: "۲۵",
    diameter: "۲۵٫۶ میلی‌متر",
    height: "۴٫۶ میلی‌متر",
    note: "نسخهٔ دوم ETA 2824 که خودش از ۱۹۷۱ تولید می‌شد. پرکاربردترین موومنت اتوماتیک سوئیسی دوران معاصر و همان موومنتی که آزمایشگاه سه‌بعدی کرونوس بازش می‌کند.",
    family: "automatic",
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
        label: "Watch-Wiki · ETA 2824-2",
        url: "https://www.watch-wiki.net/doku.php?id=eta_2824-2",
      },
    ],
  },
  {
    slug: "sellita-sw200-1",
    name: "Sellita SW200-1",
    maker: "سلیتا",
    kind: "automatic",
    type: "اتوماتیک با ثانیه‌شمار مرکزی و تاریخ",
    year: 2008,
    frequency: "۲۸٬۸۰۰ ضربه در ساعت (۴ هرتز)",
    powerReserve: "حدود ۴۱ ساعت",
    jewels: "۲۶",
    note: "سلیتا SW200 را وقتی ساخت که ETA از اوایل دههٔ ۲۰۰۰ فروش موومنت به برندهای بیرون از سواچ گروپ را محدود کرد. نسخهٔ بازنگری‌شدهٔ SW200-1 در ۲۰۰۸ آمد و با ETA 2824-2 هم‌اندازه است.",
    family: "automatic",
    sources: [
      {
        label: "Sellita · Catalogue 2024 (SW200-1)",
        url: "https://www.sellita.ch/images/documents/Catalogue2024_ENG.pdf",
      },
      {
        label: "Time+Tide · Everything you need to know about Sellita",
        url: "https://timeandtidewatches.com/sellita-history-movements-watch-education/",
      },
      {
        label: "Aquastar · Sellita SW200-1 vs ETA 2824-2",
        url: "https://aquastar.ch/stories/sellita-sw200-1-vs-eta-2824/",
      },
    ],
  },
  {
    slug: "seiko-nh35a",
    name: "Seiko NH35A",
    maker: "Seiko Instruments (SII)",
    kind: "automatic",
    type: "اتوماتیک با ثانیه‌شمار مرکزی، تاریخ و توقف ثانیه",
    year: 2011,
    frequency: "۲۱٬۶۰۰ ضربه در ساعت (۳ هرتز)",
    powerReserve: "۴۱ ساعت",
    jewels: "۲۴",
    diameter: "۲۷٫۴ میلی‌متر",
    height: "۵٫۳۲ میلی‌متر",
    note: "موومنت رایج بسیاری از ساعت‌های اتوماتیک مقرون‌به‌صرفه. با سازوکار «اهرم جادویی» (Magic Lever) سیکو در هر دو جهت کوک می‌شود. دقت اسمی ‎−۲۰ تا ‎+۴۰ ثانیه در روز است. نسخهٔ 4R35 همین موومنت با نام سیکو است.",
    family: "automatic",
    sources: [
      {
        label: "Caliber Corner · Seiko NH35A",
        url: "https://calibercorner.com/seiko-caliber-nh35a/",
      },
      {
        label: "Ralle · Seiko NH35 history",
        url: "https://rallewatches.com/blogs/news/seiko-nh35-history-features-and-interesting-facts",
      },
    ],
  },
  {
    slug: "rolex-3235",
    name: "Rolex 3235",
    maker: "رولکس",
    kind: "automatic",
    type: "اتوماتیک با ثانیه‌شمار مرکزی و تاریخ",
    year: 2015,
    frequency: "۲۸٬۸۰۰ ضربه در ساعت (۴ هرتز)",
    powerReserve: "حدود ۷۰ ساعت",
    diameter: "۲۸٫۵ میلی‌متر",
    note: "جانشین کالیبر 3135. اسکیپمنت Chronergy که رولکس ثبت کرده و فنر موئی آبی Parachrom ذخیرهٔ انرژی را به حدود ۷۰ ساعت رساندند. امروز در سابمرینر دیت کار می‌کند.",
    family: "automatic",
    sources: [
      {
        label: "Caliber Corner · Rolex 3235",
        url: "https://calibercorner.com/rolex-caliber-3235/",
      },
      {
        label: "Bob's Watches · Rolex Caliber 3135 vs. 3235",
        url: "https://www.bobswatches.com/rolex-blog/resources/rolex-caliber-3135-vs-caliber-3235.html",
      },
      wiki("Rolex_Submariner"),
    ],
  },
  {
    slug: "heuer-02",
    name: "TAG Heuer Heuer 02",
    maker: "تگ هویر",
    kind: "chronograph",
    type: "کرونوگراف اتوماتیک با چرخ ستونی و کلاچ عمودی",
    year: 2016,
    powerReserve: "۸۰ ساعت",
    note: "کرونوگراف اختصاصی تگ هویر که ذخیرهٔ انرژی را از ۵۰ ساعتِ Heuer 01 به ۸۰ ساعت رساند. نسخهٔ توربیونی آن، Heuer 02T، در صفحهٔ توربیون آزمایشگاه آمده است.",
    sources: [
      {
        label: "Caliber Corner · TAG Heuer Heuer 02",
        url: "https://calibercorner.com/tag-heuer-caliber-heuer-02/",
      },
      {
        label: "WatchProSite · TAG Heuer's move to the Calibre Heuer-02",
        url: "https://www.watchprosite.com/tag-heuer/-the-rest-of-the-story--tag-heuer-s-move-to-the-calibre-heuer-02/737.1188421.9555361/",
      },
    ],
  },
  {
    slug: "piaget-430p",
    name: "Piaget 430P",
    maker: "پیاژه",
    kind: "manual",
    type: "کوک دستی فوق‌باریک",
    powerReserve: "حدود ۴۳ ساعت",
    diameter: "۲۰٫۵ میلی‌متر",
    height: "۲٫۱ میلی‌متر",
    note: "قلب ساعت‌های Altiplano؛ پیاژه پیشگام موومنت‌های فوق‌باریک است.",
    family: "ultra-thin",
    sources: [
      {
        label: "Piaget · 430P Ultra-Thin Mechanical Movement",
        url: "https://www.piaget.com/us-en/movement/430p-ultra-thin-mechanical-movement",
      },
    ],
  },
  {
    slug: "omega-3861",
    name: "Omega 3861",
    maker: "امگا",
    kind: "chronograph",
    type: "کرونوگراف کوک دستی با اسکیپمنت Co-Axial",
    frequency: "۲۱٬۶۰۰ ضربه در ساعت (۳ هرتز)",
    powerReserve: "۵۰ ساعت",
    jewels: "۲۶",
    diameter: "۲۷ میلی‌متر",
    note: "نوادهٔ 321 و 861 با گواهی Master Chronometer از مؤسسهٔ سنجش سوئیس (METAS). از ۲۰۲۱ جای 1861 را در اسپیدمستر مون‌واچ پروفشنال گرفت.",
    sources: [
      {
        label: "Omega · Speedmaster Moonwatch Professional",
        url: "https://www.omegawatches.com/en-us/watch-omega-speedmaster-moonwatch-professional-co-axial-master-chronometer-chronograph-42-mm-31030425001001",
      },
      {
        label: "Caliber Corner · Omega 3861",
        url: "https://calibercorner.com/omega-caliber-3861/",
      },
      {
        label: "SJX · Speedmaster Moonwatch 3861 review",
        url: "https://watchesbysjx.com/2021/08/omega-speedmaster-moonwatch-3861-co-axial-chronograph-review.html",
      },
    ],
  },
];

export const calibreEntryBySlug = (slug: string) =>
  CALIBRE_ENTRIES.find((calibre) => calibre.slug === slug);
