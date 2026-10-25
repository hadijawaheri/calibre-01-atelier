// Mirrors the indexes declared on the Mongoose schemas; test/indexes.e2e-spec.ts fails if the two drift apart.
// createIndex is a no-op when an identical index exists, so databases that ran with autoIndex are safe.

/** @param {import("mongoose").mongo.Db} db */
export async function up(db) {
  const users = db.collection("users");
  await users.createIndex(
    { mobile: 1 },
    { unique: true, partialFilterExpression: { deletedAt: null } },
  );
  await users.createIndex({ deletedAt: 1 });

  const otps = db.collection("otps");
  await otps.createIndex({ mobile: 1 }, { unique: true });
  await otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 600 });

  const refreshTokens = db.collection("refreshtokens");
  await refreshTokens.createIndex({ userId: 1 });
  await refreshTokens.createIndex({ familyId: 1 });
  await refreshTokens.createIndex({ tokenHash: 1 }, { unique: true });
  await refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

/** @param {import("mongoose").mongo.Db} db */
export async function down(db) {
  await db.collection("users").dropIndexes();
  await db.collection("otps").dropIndexes();
  await db.collection("refreshtokens").dropIndexes();
}
