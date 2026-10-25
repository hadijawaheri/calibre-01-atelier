import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { validateEnv } from "./config/env.js";
import { UsersService } from "./modules/users/users.service.js";

// Non-destructive: only grants the admin role to SEED_ADMIN_MOBILE, creating the account if it is missing
const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error", "warn"] });

const adminMobile = validateEnv(process.env).SEED_ADMIN_MOBILE;
if (adminMobile) {
  await app.get(UsersService).setRoleByMobile(adminMobile, "admin");
  console.log(`Admin role granted to ${adminMobile.slice(0, 4)}***${adminMobile.slice(-2)}`);
} else {
  console.log("SEED_ADMIN_MOBILE is not set; nothing to seed");
}

await app.close();
