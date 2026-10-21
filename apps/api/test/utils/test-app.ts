import { randomUUID } from "node:crypto";

import type { Role } from "@kronos/contracts";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import type TestAgent from "supertest/lib/agent.js";
import { inject } from "vitest";

export const OTP_CODE = "123456";

export interface TestApp {
  app: NestExpressApplication;
  http: () => TestAgent;
  login: (mobile: string, role?: Role) => Promise<TestAgent>;
  close: () => Promise<void>;
}

/** Boots the real AppModule against a fresh database on the shared replica set. */
export async function createTestApp(env: Record<string, string> = {}): Promise<TestApp> {
  const uri = new URL(inject("mongoUri"));
  uri.pathname = `/test_${randomUUID().replaceAll("-", "")}`;

  Object.assign(process.env, {
    NODE_ENV: "test",
    DATABASE_URL: uri.toString(),
    JWT_ACCESS_SECRET: "test-access-secret-test-access-secret-0000",
    OTP_HMAC_SECRET: "test-otp-secret-test-otp-secret-test-00000",
    OTP_FIXED_CODE: OTP_CODE,
    SMS_PROVIDER: "console",
    PAYMENT_PROVIDER: "fake",
    PUBLIC_WEB_URL: "http://localhost:7782",
    THROTTLE_ENABLED: "false",
    ...env,
  });

  // ConfigModule validates when the module is imported, so env must be set first
  const { AppModule } = await import("../../src/app.module.js");
  const { configureApp } = await import("../../src/configure-app.js");
  const { UsersService } = await import("../../src/modules/users/users.service.js");

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false });
  configureApp(app);
  await app.init();

  const http = () => supertest(app.getHttpServer());

  const login = async (mobile: string, role: Role = "user"): Promise<TestAgent> => {
    if (role !== "user") await app.get(UsersService).setRoleByMobile(mobile, role);
    const agent = supertest.agent(app.getHttpServer());
    await agent.post("/v1/auth/otp/request").send({ mobile }).expect(204);
    await agent.post("/v1/auth/otp/verify").send({ mobile, code: OTP_CODE }).expect(200);
    return agent;
  };

  return {
    app,
    http,
    login,
    close: async () => {
      const { getConnectionToken } = await import("@nestjs/mongoose");
      const connection = app.get<import("mongoose").Connection>(getConnectionToken());
      await connection.dropDatabase();
      await app.close();
    },
  };
}
