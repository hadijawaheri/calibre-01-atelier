import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against a live stack (API with OTP_FIXED_CODE=123456, PAYMENT_PROVIDER=fake, seeded catalog)
 * on E2E_BASE_URL. `pnpm dev` from the repo root is enough locally.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:7782",
    locale: "fa-IR",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
