import { execFileSync } from "node:child_process";

import { MongoMemoryReplSet } from "mongodb-memory-server";
import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    mongoUri: string;
  }
}

function systemMongod(): string | undefined {
  try {
    return execFileSync("which", ["mongod"], { encoding: "utf8" }).trim() || undefined;
  } catch {
    return undefined;
  }
}

// Offline machines use a local mongod; CI may let mongodb-memory-server download one
export default async function setup(project: TestProject): Promise<() => Promise<void>> {
  const binary = process.env.MONGOMS_SYSTEM_BINARY ?? systemMongod();
  if (binary) {
    process.env.MONGOMS_SYSTEM_BINARY = binary;
    process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK ??= "false";
  }
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  project.provide("mongoUri", replSet.getUri());
  return async () => {
    await replSet.stop();
  };
}
