import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "./",
    include: ["src/**/*.spec.ts", "test/**/*.e2e-spec.ts"],
    globalSetup: ["./test/global-setup.ts"],
    // Each e2e file boots its own Nest app against its own database
    fileParallelism: true,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
