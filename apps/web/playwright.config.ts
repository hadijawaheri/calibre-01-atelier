import { defineConfig, devices } from "@playwright/test";

/** Runs against a running web app on E2E_BASE_URL; `pnpm dev` (or the standalone build) is enough. */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // Every page runs a software-rendered WebGL scene; in parallel they starve each other of CPU
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:7782",
    locale: "fa-IR",
    trace: "retain-on-failure",
    launchOptions: {
      // Headless machines have no GPU; SwiftShader still gives the 3D scenes a real WebGL context
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
      ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
        : {}),
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
