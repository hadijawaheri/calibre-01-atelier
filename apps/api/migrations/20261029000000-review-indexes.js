// Mirrors the indexes declared on the Review schema; test/indexes.e2e-spec.ts fails if the two drift apart.

/** @param {import("mongoose").mongo.Db} db */
export async function up(db) {
  const reviews = db.collection("reviews");
  await reviews.createIndex(
    { userId: 1, watchSlug: 1 },
    { unique: true, partialFilterExpression: { deletedAt: null } },
  );
  await reviews.createIndex({ watchSlug: 1, status: 1, createdAt: -1 });
  await reviews.createIndex({ status: 1, createdAt: 1 });
  await reviews.createIndex({ deletedAt: 1 });
}

/** @param {import("mongoose").mongo.Db} db */
export async function down(db) {
  await db.collection("reviews").dropIndexes();
}
