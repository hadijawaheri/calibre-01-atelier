import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const OTP = process.env.E2E_OTP ?? "123456";

test.describe("storefront", () => {
  for (const path of ["/", "/watches", "/watches/primo-36000-chronograph", "/sign-in"]) {
    test(`${path} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        // The movement is decorative 3D art with its own text alternative
        .exclude("[role=img]")
        .analyze();
      const serious = violations.filter(
        (item) => item.impact === "serious" || item.impact === "critical",
      );
      expect(serious.map((item) => `${item.id}: ${item.nodes.length}`)).toEqual([]);
    });
  }

  test("filters the catalogue through the URL", async ({ page }) => {
    await page.goto("/watches");
    const openSheet = page.getByRole("button", { name: /^فیلترها/ });
    // Small screens keep the filters in a sheet; large screens show them beside the list
    const inSheet = await openSheet.isVisible();
    const scope = inSheet ? page.getByRole("dialog") : page.getByRole("complementary");
    if (inSheet) await openSheet.click();
    await scope.getByRole("checkbox", { name: "کرونوگراف" }).check();
    await expect(page).toHaveURL(/collection=chronograph/);
    if (inSheet) await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { level: 3 }).first()).toContainText("پریمو");
  });
});

test("a customer buys a watch from sign-in to paid order", async ({ page }, testInfo) => {
  const mobile = `0912${String(Date.now()).slice(-7)}`;
  test.skip(testInfo.project.name === "mobile", "One full purchase per run keeps stock stable");

  await page.goto("/watches/primo-36000-chronograph");
  await page.getByRole("radio", { name: /کائوچو/ }).check();
  await page.getByRole("button", { name: "افزودن به سبد" }).click();
  await expect(page.getByRole("button", { name: /سبد خرید، ۱ کالا/ })).toBeVisible();

  await page.goto("/checkout");
  await expect(page).toHaveURL(/sign-in\?next=%2Fcheckout/);
  await page.getByLabel("شماره موبایل").fill(mobile);
  await page.getByRole("button", { name: "دریافت کد تأیید" }).click();
  await page.getByLabel("کد ۶ رقمی").fill(OTP);
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel("نام و نام خانوادگی تحویل‌گیرنده").fill("آرش کمانگیر");
  await page.getByLabel("کد پستی ۱۰ رقمی").fill("1234567890");
  await page.getByLabel("استان").fill("تهران");
  await page.getByLabel("شهر").fill("تهران");
  await page.getByLabel("نشانی کامل").fill("خیابان فرشته، کوچه‌ی یاس، پلاک ۱۲");
  await page.getByRole("button", { name: "ثبت سفارش و پرداخت" }).click();

  await expect(page).toHaveURL(/sandbox-gateway/);
  await page.getByRole("button", { name: "پرداخت موفق" }).click();
  await expect(page.getByText("سفارش شما ثبت شد")).toBeVisible();

  await page.getByRole("link", { name: "جزئیات سفارش" }).click();
  await expect(page.getByText("پرداخت‌شده")).toBeVisible();
  await expect(page.getByText("کائوچوی پارچه‌نما", { exact: false })).toBeVisible();
});
