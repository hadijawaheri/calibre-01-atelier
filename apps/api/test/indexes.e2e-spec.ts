import { randomUUID } from "node:crypto";
import { readdir } from "node:fs/promises";

import { getConnectionToken } from "@nestjs/mongoose";
import type { Connection } from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { TestApp } from "./utils/test-app.js";
import { createTestApp } from "./utils/test-app.js";

type IndexInfo = Record<string, unknown>;
type Migration = { up: (db: NonNullable<Connection["db"]>) => Promise<void> };

const migrationsDir = new URL("../migrations/", import.meta.url);

/** Every migration in name order, the order migrate-mongo applies them in. */
async function migrateUp(db: NonNullable<Connection["db"]>): Promise<void> {
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".js")).sort();
  for (const file of files) {
    const migration = (await import(new URL(file, migrationsDir).href)) as Migration;
    await migration.up(db);
  }
}

function shape(indexes: IndexInfo[]) {
  return indexes
    .map(({ key, unique, partialFilterExpression, expireAfterSeconds }) => ({
      key,
      unique: unique ?? false,
      partialFilterExpression,
      expireAfterSeconds,
    }))
    .sort((a, b) => JSON.stringify(a.key).localeCompare(JSON.stringify(b.key)));
}

// Production never builds indexes at boot, so the migration must create exactly what the schemas declare
describe("index migrations", () => {
  let t: TestApp;
  let connection: Connection;

  beforeAll(async () => {
    t = await createTestApp();
    connection = t.app.get<Connection>(getConnectionToken());
    await Promise.all(Object.values(connection.models).map((model) => model.syncIndexes()));
  });

  afterAll(async () => {
    await t.close();
  });

  it("creates every index the schemas declare", async () => {
    const migrated = connection.useDb(`migrated_${randomUUID().replaceAll("-", "")}`);
    await migrateUp(migrated.db!);
    try {
      for (const model of Object.values(connection.models)) {
        const name = model.collection.collectionName;
        const fromSchema = await model.collection.indexes();
        const fromMigration = await migrated.db!.collection(name).indexes();
        expect(shape(fromMigration), name).toEqual(shape(fromSchema));
      }
    } finally {
      await migrated.dropDatabase();
    }
  });
});
