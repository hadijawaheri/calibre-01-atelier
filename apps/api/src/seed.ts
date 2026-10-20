import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import { productInputSchema } from "@kronos/contracts";
import type { Model } from "mongoose";

import { AppModule } from "./app.module.js";
import { validateEnv } from "./config/env.js";
import { UsersService } from "./modules/users/users.service.js";
import type { ProductDocument } from "./modules/products/schemas/product.schema.js";
import { Product } from "./modules/products/schemas/product.schema.js";
import { CATALOG } from "./seed/catalog.js";

// Non-destructive: inserts missing watches by slug and never overwrites stock or edits
const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error", "warn"] });
const products = app.get<Model<ProductDocument>>(getModelToken(Product.name));

let inserted = 0;
for (const item of CATALOG) {
  const product = productInputSchema.parse(item);
  const result = await products.updateOne(
    { slug: product.slug },
    { $setOnInsert: product },
    { upsert: true },
  );
  inserted += result.upsertedCount;
}
console.log(`Catalog: ${inserted} inserted, ${CATALOG.length - inserted} already present`);

const adminMobile = validateEnv(process.env).SEED_ADMIN_MOBILE;
if (adminMobile) {
  await app.get(UsersService).setRoleByMobile(adminMobile, "admin");
  console.log(`Admin role granted to ${adminMobile.slice(0, 4)}***${adminMobile.slice(-2)}`);
}

await app.close();
