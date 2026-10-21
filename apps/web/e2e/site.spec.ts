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

test("home tells the movement's story and leads to the lab", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "قلبی که بی‌وقفه می‌تپد" }),
  ).toBeVisible();
  await expect(page.locator("canvas").first()).toBeVisible();
  await expectAccessible(page);

  // Jump to the last chapter while the stage is still pinned; the site's own smooth scrolling would glide there
  const story = page.getByRole("region", { name: "داستان یک موومنت" });
  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>("section[aria-label]")!;
    window.scrollTo({
      top: section.offsetTop + section.scrollHeight - window.innerHeight,
      behavior: "instant",
    });
  });
  const enter = story.getByRole("link", { name: "ورود به آزمایشگاه" });
  // Software WebGL on CI renders few frames a second, and the chapter follows the scroll on the next frame
  await expect(enter).toBeInViewport({ timeout: 20_000 });
  await expect(
    story.locator("article").filter({ has: page.getByRole("link", { name: "ورود به آزمایشگاه" }) }),
  ).toHaveCSS("opacity", "1", { timeout: 20_000 });
  await enter.click();
  await expect(page).toHaveURL(/\/lab\/automatic$/, { timeout: 15_000 });
  expect(errors).toEqual([]);
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
