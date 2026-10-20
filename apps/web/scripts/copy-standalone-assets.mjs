// `output: "standalone"` omits static assets; without them the page never hydrates
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, ".next/standalone/apps/web");

if (existsSync(target)) {
  cpSync(join(root, ".next/static"), join(target, ".next/static"), { recursive: true });
  cpSync(join(root, "public"), join(target, "public"), { recursive: true });
}
