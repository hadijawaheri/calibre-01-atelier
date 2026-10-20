import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import type { HealthCheckResult } from "@nestjs/terminus";
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";

import { Public } from "../common/decorators/public.decorator.js";

@Public()
@SkipThrottle()
@Controller({ path: "health", version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
  ) {}

  @Get("live")
  live(): { status: "ok" } {
    return { status: "ok" };
  }

  @Get("ready")
  @HealthCheck()
  ready(): Promise<HealthCheckResult> {
    return this.health.check([() => this.mongoose.pingCheck("mongo")]);
  }
}
