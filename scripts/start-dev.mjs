// One command for a local preview: embedded Mongo replica set + seed + API + web. No Docker or external DB.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "apps/api");
const envFile = path.join(apiDir, ".env");
const dataDir = path.join(root, ".data/mongo");

const apiRequire = createRequire(path.join(apiDir, "package.json"));
const { MongoMemoryReplSet } = apiRequire("mongodb-memory-server");

console.log("[1/4] Preparing apps/api/.env ...");
// Fill only blank keys so values the developer set by hand survive
const defaults = {
  JWT_ACCESS_SECRET: () => randomBytes(48).toString("base64"),
  OTP_HMAC_SECRET: () => randomBytes(48).toString("base64"),
  OTP_FIXED_CODE: () => "123456",
  SEED_ADMIN_MOBILE: () => "09120000000",
};
let envText = readFileSync(
  existsSync(envFile) ? envFile : path.join(apiDir, ".env.example"),
  "utf8",
);
for (const [key, make] of Object.entries(defaults)) {
  const line = new RegExp(`^${key}=\\s*$`, "m");
  if (line.test(envText)) envText = envText.replace(line, `${key}=${make()}`);
  else if (!new RegExp(`^${key}=`, "m").test(envText)) envText += `\n${key}=${make()}\n`;
}
writeFileSync(envFile, envText);

console.log("[2/4] Starting embedded MongoDB replica set (first run downloads MongoDB once) ...");
mkdirSync(dataDir, { recursive: true });
// A fixed dbPath keeps orders and admin edits between runs
const replSet = await MongoMemoryReplSet.create({
  replSet: { count: 1, name: "rs0", storageEngine: "wiredTiger" },
  // First start on Windows can exceed the 30 s default while Defender scans the new data files
  instanceOpts: [{ port: 27018, ip: "127.0.0.1", dbPath: dataDir, launchTimeout: 180_000 }],
}).catch((error) => {
  console.error("Could not start MongoDB on 127.0.0.1:27018:", error);
  console.error("Is another MongoDB holding the port? Windows: Get-Process mongod | Stop-Process");
  process.exit(1);
});
// Environment wins over --env-file, so the API always talks to this embedded database
const childEnv = { ...process.env, DATABASE_URL: replSet.getUri("kronos") };
console.log("      MongoDB ready:", childEnv.DATABASE_URL);

console.log("[3/4] Seeding the catalogue ...");
// Async on purpose: blocking the event loop stops us draining mongod's log pipe and mongod stalls
const seedCode = await new Promise((resolve) => {
  spawn(process.execPath, ["--env-file=.env", "dist/seed.js"], {
    cwd: apiDir,
    env: childEnv,
    stdio: "inherit",
  }).on("exit", resolve);
});
if (seedCode !== 0) {
  await replSet.stop({ doCleanup: false });
  process.exit(seedCode ?? 1);
}

console.log("[4/4] Starting API (http://localhost:7781) and web (http://localhost:7782) ...");
const api = spawn(process.execPath, ["--env-file=.env", "dist/main.js"], {
  cwd: apiDir,
  env: childEnv,
  stdio: "inherit",
});
const web = spawn(
  process.execPath,
  [path.join(root, "apps/web/node_modules/next/dist/bin/next"), "dev", "-p", "7782"],
  {
    cwd: path.join(root, "apps/web"),
    stdio: "inherit",
  },
);

console.log(
  "\n  Open http://localhost:7782  ·  sign-in code: 123456  ·  admin mobile: 09120000000\n",
);

let stopping = false;
const stop = async () => {
  if (stopping) return;
  stopping = true;
  api.kill();
  web.kill();
  await replSet.stop({ doCleanup: false }).catch(() => {});
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
api.on("exit", (code) => {
  if (!stopping) {
    console.error(`API exited with code ${code}`);
    void stop();
  }
});
