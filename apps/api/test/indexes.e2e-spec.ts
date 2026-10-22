import { randomUUID } from "node:crypto";

import { getConnectionToken } from "@nestjs/mongoose";
import type { Connection } from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { up } from "../migrations/20261022000000-initial-indexes.js";
import type { TestApp } from "./utils/test-app.js";
import { createTestApp } from "./utils/test-app.js";

type IndexInfo = Record<string, unknown>;

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
    await up(migrated.db!);
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
