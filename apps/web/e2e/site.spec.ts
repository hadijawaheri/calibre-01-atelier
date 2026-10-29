import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/** Fails the test on any uncaught error or console error the page produced. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
  ).toEqual([]);
}

test.setTimeout(60_000);

const emptyReviews = {
  data: [],
  meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1, average: null },
};

const reader = {
  id: "u1",
  mobile: "09120000001",
  firstName: "مریم",
  lastName: "کاظمی",
  email: null,
  role: "user",
  createdAt: "2026-10-01T08:00:00.000Z",
};

function review(id: string, rating: number, status = "published") {
  return {
    id,
    watchSlug: "omega-speedmaster",
    rating,
    text: "روی مچ سبک است و کرونوگرافش هنوز بی‌نقص کار می‌کند.",
    ownership: "owner",
    authorName: "مریم ک.",
    status,
    createdAt: "2026-10-20T08:00:00.000Z",
    updatedAt: "2026-10-20T08:00:00.000Z",
  };
}

// Credited photos come from Wikimedia Commons; a local stand-in keeps the suite independent of the network
test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/(upload|thumb)\.wikimedia\.org\//, (route) =>
    route.fulfill({
      path: "public/media/movement-photos/balance-detail.webp",
      contentType: "image/webp",
    }),
  );
  // No API runs beside the e2e build; a watch with no reviews is the default answer
  await page.route("**/api/**", (route) =>
    route.request().method() === "GET" &&
    /\/api\/watches\/[^/]+\/reviews\?/.test(route.request().url())
      ? route.fulfill({ json: emptyReviews })
      : route.fulfill({ status: 404, json: { statusCode: 404, code: "NOT_FOUND", message: "x" } }),
  );
});

/** Jumps straight to a point of the page; the home page's own inertial scrolling would glide there. */
async function jumpTo(page: Page, selector: string, at: "top" | "end") {
  await page.evaluate(
    ([selector, at]) => {
      const section = document.querySelector<HTMLElement>(selector!)!;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: at === "top" ? top : top + section.offsetHeight - window.innerHeight,
        behavior: "instant",
      });
    },
    [selector, at],
  );
}

test("home tells the movement's story and leads to the lab", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "موومنت واقعی، در حال کار" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "فقط یک ساعت نیست." })).toBeAttached();
  await expect(page.getByRole("heading", { level: 2, name: "با نیروی مچ شما" })).toBeAttached();
  await expect(page.locator("canvas").first()).toBeAttached();
  await expectAccessible(page);

  await jumpTo(page, '[data-stage="finale"]', "end");
  const finale = page.getByRole("region", { name: "دو رو، یک قلب" });
  const enter = finale.getByRole("link", { name: "ورود به آزمایشگاه" });
  await expect(enter).toBeInViewport({ timeout: 20_000 });
  await enter.click();
  await expect(page).toHaveURL(/\/lab\/automatic$/, { timeout: 15_000 });
  expect(errors).toEqual([]);
});

test("the strip of photographs slides past as you scroll", async ({ page }) => {
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "قطعه‌به‌قطعه" });
  await expect(gallery.getByRole("img", { name: /از سمت پشت/ })).toBeAttached();
  const last = gallery.getByText("دوباره، یک ماشین");
  await expect(last).not.toBeInViewport();
  await jumpTo(page, '[data-stage="gallery"]', "end");
  await expect(last).toBeInViewport({ timeout: 20_000 });
});

test("the home page compares the four families and links each to the lab", async ({ page }) => {
  await page.goto("/");
  const families = page.getByRole("region", { name: "چهار خانوادهٔ موومنت" });
  await expect(families.getByRole("link")).toHaveCount(4);
  await jumpTo(page, '[data-stage="families"]', "top");
  await families.getByRole("link", { name: /کوارتز/ }).click();
  await expect(page).toHaveURL(/\/lab\/quartz$/, { timeout: 15_000 });
});

test("the film frames are served", async ({ request }) => {
  for (const path of ["/media/movement-film/lg/001.webp", "/media/movement-film/sm/240.webp"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
});

test("the lab lists the four movement families", async ({ page }) => {
  await page.goto("/lab");
  for (const name of ["اتوماتیک استاندارد سوئیسی", "مکانیکی فوق‌باریک", "کوارتز", "توربیون"]) {
    await expect(page.getByRole("heading", { level: 2, name: new RegExp(name) })).toBeVisible();
  }
  await expectAccessible(page);
});

test("the history page tells six brands' stories and is linked from the menu", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/lab");
  // On phones the same links sit in the menu sheet, so the header's copy is only checked for its target
  await expect(page.locator('header a[href="/history"]')).toBeAttached();
  await page.goto("/history");
  await expect(
    page.getByRole("heading", { level: 1, name: "تاریخچهٔ برندهای ساعت" }),
  ).toBeVisible();
  for (const name of ["پتک فیلیپ", "رولکس", "فردریک کنستانت", "سواچ", "سیکو", "کاسیو"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeAttached();
  }
  const rolex = page.getByRole("article", { name: "رولکس" });
  await expect(rolex.getByRole("img")).toBeAttached();
  // Each photo names its author and licence, and each entry lists the sources its facts were checked against
  await expect(rolex.getByRole("link", { name: "CC BY-SA 4.0" })).toBeAttached();
  await expect(rolex.getByRole("heading", { name: "منابع" })).toBeAttached();
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("the brands page lists the houses by founding year and leads to their watches", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator('header a[href="/brands"]')).toBeAttached();
  await page.goto("/brands");
  await expect(page.getByRole("heading", { level: 1, name: "برندهای ساعت" })).toBeVisible();
  const houses = page.getByRole("heading", { level: 2 });
  await expect(houses.first()).toHaveText("بلانپن");
  await expect(houses).toHaveCount(16);
  const omega = page.getByRole("article", { name: "امگا" });
  await expect(omega.getByRole("heading", { name: "منابع" })).toBeAttached();
  await omega.getByRole("link", { name: "امگا اسپیدمستر" }).click();
  await expect(page).toHaveURL(/\/watches\/omega-speedmaster$/);
  await expect(page.getByRole("heading", { level: 1, name: "امگا اسپیدمستر" })).toBeVisible();
  await page.goto("/brands");
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("the watches page credits each photo and shows an empty mat where none is free", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/watches");
  await expect(page.getByRole("heading", { level: 1, name: "ساعت‌های ماندگار" })).toBeVisible();
  const submariner = page.getByRole("article", { name: "رولکس سابمرینر" });
  await expect(submariner.getByRole("img")).toBeAttached();
  await expect(submariner.getByRole("link", { name: "CC BY-SA 4.0" })).toBeAttached();
  await expect(submariner.getByText("6204 / 6205")).toBeVisible();
  const nautilus = page.getByRole("article", { name: "پتک فیلیپ ناتیلوس" });
  await expect(nautilus.getByRole("img")).toHaveCount(0);
  await expect(nautilus.getByText("عکسی با مجوز آزاد از این مدل پیدا نشد")).toBeVisible();
  await submariner.getByRole("link", { name: "Rolex 3235" }).click();
  await expect(page).toHaveURL(/\/calibres\/rolex-3235$/);
  await page.goto("/watches");
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("the calibres page compares the movements and leads into the lab", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/calibres");
  await expect(page.getByRole("heading", { level: 1, name: "کالیبرها" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "ETA 2824-2" })).toBeAttached();
  const eta = page.getByRole("article", { name: "ETA 2824-2" });
  await expect(eta.getByText("۲۵٫۶ میلی‌متر")).toBeVisible();
  await expectAccessible(page);
  await eta.getByRole("link", { name: /در آزمایشگاه/ }).click();
  await expect(page).toHaveURL(/\/lab\/automatic$/, { timeout: 15_000 });
  expect(errors).toEqual([]);
});

test("the automatic movement can be explored part by part", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/lab/automatic");
  await expect(
    page.getByRole("heading", { level: 1, name: "اتوماتیک استاندارد سوئیسی" }),
  ).toBeVisible();
  await expect(page.locator("canvas").first()).toBeVisible();

  const parts = page.getByRole("navigation", { name: "فهرست قطعه‌ها" });
  await parts.getByRole("button", { name: /چرخ بالانس/ }).click();
  await expect(parts.getByRole("button", { name: /چرخ بالانس/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("heading", { level: 2, name: "چرخ بالانس" })).toBeVisible();
  // Balance sits under its cock: picking it lifts the covers
  await expect(page.getByRole("switch", { name: "برداشتن پل‌ها و روتور" })).toBeChecked();

  const show = page.getByRole("button", { name: "نمایش باز و بسته شدن" });
  await show.click();
  await expect(page.getByRole("button", { name: "توقف نمایش" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "توقف نمایش" }).click();

  const slider = page.getByRole("slider", { name: "میزان جدا شدن قطعه‌ها" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.getByText("100٪")).toBeVisible();

  await page.getByRole("radio", { name: "توقف" }).click();
  await expect(page.getByRole("radio", { name: "توقف" })).toHaveAttribute("aria-checked", "true");

  await page.getByRole("button", { name: "بازگشت به حالت اول" }).click();
  await expect(page.getByText("0٪")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "یک قطعه انتخاب کنید" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "در کدام ساعت‌ها" })).toBeVisible();
  await expect(page.getByText("Hamilton Khaki Field Auto")).toBeVisible();
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("a family without its real model yet shows its facts, not a made-up model", async ({
  page,
}) => {
  await page.goto("/lab/quartz");
  await expect(page.getByRole("heading", { level: 1, name: "کوارتز" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("مدل سه‌بعدی واقعی در راه است");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByText("Grand Seiko 9F Quartz")).toBeVisible();
  await expectAccessible(page);
});

test("unknown calibres are a 404", async ({ page }) => {
  const response = await page.goto("/lab/no-such-calibre");
  expect(response?.status()).toBe(404);
});

test("the hero opens on the headline, with no movement in it", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "موومنت واقعی، در حال کار" }),
  ).toBeVisible();
  await expect(page.locator('[data-stage="hero"] img')).toHaveCount(0);
  await expectAccessible(page);
});

test("the lab starts with the movement stopped for visitors who prefer less motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lab/automatic");
  await expect(page.getByRole("radio", { name: "توقف" })).toHaveAttribute("aria-checked", "true");
});

test("calibre pages describe themselves to search engines and link previews", async ({ page }) => {
  await page.goto("/lab/quartz");
  const jsonLd = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}",
  ) as { "@type"?: string; headline?: string };
  expect(jsonLd).toMatchObject({ "@type": "TechArticle", headline: "کوارتز" });
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/lab\/quartz$/);
});

test("the light theme follows the system and the header toggle switches it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/lab/quartz");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/\bdark\b/);
  await expectAccessible(page);

  await page.getByRole("button", { name: "تم تیره" }).click();
  await expect(html).toHaveClass(/\bdark\b/);
  await page.reload();
  await expect(html).toHaveClass(/\bdark\b/);
  await page.getByRole("button", { name: "تم روشن" }).click();
  await expect(html).not.toHaveClass(/\bdark\b/);
});

// The other tests run in Playwright's default light scheme; this one checks contrast in the dark theme
test("the home page reads well in the dark theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await expectAccessible(page);
});

test("a watch has its own page with the calibre inside and the watches around it", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/watches");
  await page.getByRole("link", { name: "صفحهٔ کامل امگا اسپیدمستر" }).click();
  await expect(page).toHaveURL(/\/watches\/omega-speedmaster$/);
  await expect(page.getByRole("heading", { level: 1, name: "امگا اسپیدمستر" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "مسیر صفحه" })).toContainText("ساعت‌ها");
  await expect(page.getByRole("heading", { level: 2, name: "قلب ساعت" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "هم‌دوره‌ها" })).toBeVisible();
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = jsonLd.map((text) => (JSON.parse(text) as { "@type": string })["@type"]);
  expect(types).toEqual(expect.arrayContaining(["TechArticle", "BreadcrumbList"]));
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/watches\/omega-speedmaster$/,
  );
  await expectAccessible(page);
  await page.getByRole("link", { name: "Omega 321" }).click();
  await expect(page).toHaveURL(/\/calibres\/omega-321$/);
  expect(errors).toEqual([]);
});

test("a calibre has its own page that lists the watches using it", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/calibres/omega-321");
  await expect(page.getByRole("heading", { level: 1, name: "Omega 321" })).toBeVisible();
  const watches = page.getByRole("region", { name: "ساعت‌هایی که با این کالیبر کار می‌کنند" });
  await expect(watches.getByRole("link", { name: /امگا اسپیدمستر/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "کالیبر قبلی و بعدی" })).toBeVisible();
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("unknown watches and calibres are a 404", async ({ page }) => {
  expect((await page.goto("/watches/no-such-watch"))?.status()).toBe(404);
  expect((await page.goto("/calibres/no-such-calibre"))?.status()).toBe(404);
});

test("the header search opens every result on the search page", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/brands");
  // Phones and desktops each get their own copy of the field; only one is shown
  await page.locator('input[role="combobox"]:visible').fill("۱۹۶۹");
  await expect(page.getByRole("option", { name: /هویر موناکو/ })).toBeVisible();
  await page.getByRole("option", { name: /همهٔ .* نتیجه برای/ }).click();
  await expect(page).toHaveURL(/\/search\?q=/);
  await expect(page.getByRole("heading", { level: 2, name: "ساعت‌ها" })).toBeVisible();
  await page.getByRole("link", { name: /کالیبرها \(/ }).click();
  await expect(page).toHaveURL(/group=calibre/);
  await expect(page.getByRole("heading", { level: 2, name: "ساعت‌ها" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Seiko 35A/ })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("two watches can be compared side by side, and only their differences shown", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/watches/rolex-submariner");
  await page.getByRole("link", { name: "مقایسه با ساعتی دیگر" }).click();
  await expect(page).toHaveURL(/\/compare\?watches=rolex-submariner$/);
  await expect(page.getByText("یک ساعت دیگر انتخاب کنید")).toBeVisible();
  await page.getByLabel("ساعت دوم").selectOption("omega-speedmaster");
  await expect(page).toHaveURL(/watches=rolex-submariner,omega-speedmaster$/);
  const table = page.getByRole("table", { name: "مقایسهٔ ساعت‌ها" });
  await expect(table.getByRole("row", { name: /کالیبر/ }).first()).toContainText("Rolex 3235");
  await expect(table.getByRole("row", { name: /کالیبر/ }).first()).toContainText("Omega 321");
  await expectAccessible(page);
  await page.getByRole("switch", { name: "فقط تفاوت‌ها" }).click();
  await expect(table.getByRole("rowheader", { name: "برند" })).toBeVisible();
  // The second slot can be cleared again
  await page.getByLabel("ساعت دوم").selectOption("");
  await expect(page).toHaveURL(/watches=rolex-submariner$/);
  await page
    .getByRole("navigation", { name: "نوع مقایسه" })
    .getByRole("link", { name: "کالیبرها" })
    .click();
  await expect(page.getByLabel("کالیبر اول")).toBeVisible();
  expect(errors).toEqual([]);
});

test("the complications page explains each one and links the watches that carry it", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator('header a[href="/complications"]')).toBeAttached();
  await page.goto("/complications");
  await expect(page.getByRole("heading", { level: 1, name: "کمپلیکیشن‌ها" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(7);
  const chronograph = page.getByRole("article", { name: "کرونوگراف", exact: true });
  await expect(chronograph.getByRole("heading", { name: "منابع" })).toBeAttached();
  await chronograph.getByRole("link", { name: "امگا اسپیدمستر" }).click();
  await expect(page).toHaveURL(/\/watches\/omega-speedmaster$/);
  await page.goto("/complications");
  await expectAccessible(page);
  await page
    .getByRole("article", { name: "توربیون" })
    .getByRole("link", { name: /سه‌بعدی ببینید/ })
    .click();
  await expect(page).toHaveURL(/\/lab\/tourbillon$/, { timeout: 15_000 });
  expect(errors).toEqual([]);
});

test("the sitemap lists every watch and calibre page", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/watches/omega-speedmaster</loc>");
  expect(xml).toContain("/calibres/eta-2824-2</loc>");
  expect(xml).toContain("/complications</loc>");
  expect(xml).not.toContain("/search</loc>");
});

test("a watch page shows readers' reviews and asks a guest to sign in to write one", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.route(/\/api\/watches\/omega-speedmaster\/reviews\?/, (route) =>
    route.fulfill({
      json: {
        data: [review("r1", 5), review("r2", 4)],
        meta: { page: 1, limit: 10, totalItems: 3, totalPages: 1, average: 4.3 },
      },
    }),
  );
  await page.goto("/watches/omega-speedmaster");
  const section = page.getByRole("region", { name: "نظر خوانندگان" });
  await expect(section.getByText("۴٫۳", { exact: true })).toBeVisible();
  await expect(section.getByText("از ۳ نظر")).toBeVisible();
  await expect(section.getByRole("listitem")).toHaveCount(2);
  await expect(section.getByText("این ساعت را دارم").first()).toBeVisible();
  await expect(section.getByRole("button", { name: "ورود و نوشتن نظر" })).toBeVisible();
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("a reader signs in by code, writes a review and sees it waiting for approval", async ({
  page,
}) => {
  let saved: unknown;
  await page.route("**/api/auth/otp/request", (route) => route.fulfill({ status: 204 }));
  await page.route("**/api/auth/otp/verify", (route) =>
    route.fulfill({ json: { data: { user: reader } } }),
  );
  await page.route("**/api/watches/omega-speedmaster/reviews/mine", (route) => {
    if (route.request().method() === "PUT") {
      saved = route.request().postDataJSON();
      return route.fulfill({ json: { data: review("mine", 4, "pending") } });
    }
    return route.fulfill({ json: { data: null } });
  });

  await page.goto("/watches/omega-speedmaster");
  const section = page.getByRole("region", { name: "نظر خوانندگان" });
  await expect(
    section.getByText("هنوز نظری برای این ساعت منتشر نشده است.", { exact: false }),
  ).toBeVisible();
  await section.getByRole("button", { name: "ورود و نوشتن نظر" }).click();

  const dialog = page.getByRole("dialog", { name: "ورود به کرونوس" });
  await dialog.getByLabel("شمارهٔ موبایل").fill("۰۹۱۲۰۰۰۰۰۰۱");
  await dialog.getByRole("button", { name: "فرستادن کد" }).click();
  await dialog.getByLabel("کد ۶ رقمی").fill("123456");
  await dialog.getByRole("button", { name: "ورود" }).click();
  await expect(dialog).toBeHidden();

  await section.getByRole("button", { name: "ثبت نظر" }).click();
  await expect(section.getByText("امتیاز از ۱ تا ۵ است")).toBeVisible();
  await expect(section.getByText("دست‌کم ۲۰ حرف بنویسید")).toBeVisible();

  await section.getByRole("radio", { name: "۴ از ۵" }).click();
  await section.getByLabel("این ساعت را دارم").check();
  await section.getByLabel("نظر شما").fill("روی مچ سبک است و کرونوگرافش هنوز بی‌نقص کار می‌کند.");
  await section.getByRole("button", { name: "ثبت نظر" }).click();

  await expect(section.getByText("در انتظار تأیید")).toBeVisible();
  expect(saved).toEqual({
    rating: 4,
    ownership: "owner",
    text: "روی مچ سبک است و کرونوگرافش هنوز بی‌نقص کار می‌کند.",
  });
});

test("an admin publishes a waiting review from the moderation desk", async ({ page, context }) => {
  await context.addCookies([
    { name: "kronos_signed_in", value: "1", url: "http://127.0.0.1:7782" },
    { name: "kronos_signed_in", value: "1", url: "http://localhost:7782" },
  ]);
  let moderated: unknown;
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ json: { data: { user: { ...reader, role: "admin" } } } }),
  );
  await page.route(/\/api\/admin\/reviews\?/, (route) =>
    route.fulfill({
      json: {
        data: [review("r9", 2, "pending")],
        meta: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
      },
    }),
  );
  await page.route("**/api/admin/reviews/r9", (route) => {
    moderated = route.request().postDataJSON();
    return route.fulfill({ json: { data: review("r9", 2, "published") } });
  });

  await page.goto("/admin/reviews");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "امگا اسپیدمستر" })).toBeVisible();
  await page.getByRole("button", { name: "انتشار" }).click();
  await expect(page.getByText("نظری در این فهرست نیست.")).toBeVisible();
  expect(moderated).toEqual({ status: "published" });
});

test("the timegrapher reads a watch through the microphone", async ({ page, request }) => {
  const errors = watchErrors(page);
  const response = await request.get("/tools/timegrapher");
  expect(response.headers()["permissions-policy"]).toContain("microphone=(self)");
  const home = await request.get("/");
  expect(home.headers()["permissions-policy"]).toContain("microphone=()");

  // A stand-in microphone: a watch at 21,600 bph, ticking into a looped two-second recording
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext();
      const seconds = 2;
      const buffer = context.createBuffer(1, seconds * context.sampleRate, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let beat = 0; beat < seconds * 6; beat++) {
        const at = Math.round((beat / 6) * context.sampleRate);
        for (let i = 0; i < 0.004 * context.sampleRate; i++) {
          const t = i / context.sampleRate;
          data[at + i] = 0.6 * Math.exp(-t / 0.0008) * Math.sin(2 * Math.PI * 4000 * t);
        }
      }
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const destination = context.createMediaStreamDestination();
      source.connect(destination);
      source.start();
      await context.resume();
      return destination.stream;
    };
  });

  await page.goto("/tools/timegrapher");
  await expect(page.getByRole("heading", { level: 1, name: "تایم‌گرافر" })).toBeVisible();
  await page.getByRole("button", { name: "شروع گوش دادن" }).click();
  await expect(page.getByText("۲۱٬۶۰۰")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "توقف" })).toBeVisible();
  await expectAccessible(page);
  await page.getByRole("button", { name: "توقف" }).click();
  await expect(page.getByRole("button", { name: "شروع گوش دادن" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("the timegrapher explains a refused microphone", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () =>
      Promise.reject(new DOMException("refused", "NotAllowedError"));
  });
  await page.goto("/tools/timegrapher");
  await page.getByRole("button", { name: "شروع گوش دادن" }).click();
  await expect(page.getByRole("status")).toContainText("اجازهٔ میکروفون داده نشد");
});
