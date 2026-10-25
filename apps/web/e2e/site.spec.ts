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
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
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
