import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  // Cleaning on watch start deletes the types the API compiler is reading in parallel during `pnpm dev`
  clean: !options.watch,
  sourcemap: true,
  target: "es2023",
}));
