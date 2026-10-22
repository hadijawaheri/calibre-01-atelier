// Production runs with autoIndex off (app.module.ts), so every index the schemas declare is created here
const config = {
  mongodb: { url: process.env.DATABASE_URL },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "esm",
};

export default config;
