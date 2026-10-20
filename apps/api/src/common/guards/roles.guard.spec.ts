import type { ExecutionContext } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Role } from "@kronos/contracts";
import { describe, expect, it } from "vitest";

import { RolesGuard } from "./roles.guard.js";

function context(role: Role | undefined): ExecutionContext {
  return {
    getHandler: () => () => undefined,
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => ({ user: role ? { id: "1", role } : undefined }) }),
  } as unknown as ExecutionContext;
}

function guardFor(roles: Role[] | undefined): RolesGuard {
  const reflector = new Reflector();
  reflector.getAllAndOverride = () => roles as never;
  return new RolesGuard(reflector);
}

describe("RolesGuard", () => {
  it("allows routes without @Roles", () => {
    expect(guardFor(undefined).canActivate(context("user"))).toBe(true);
  });

  it("allows a matching role", () => {
    expect(guardFor(["admin"]).canActivate(context("admin"))).toBe(true);
  });

  it("forbids other roles and anonymous requests", () => {
    expect(() => guardFor(["admin"]).canActivate(context("user"))).toThrow(ForbiddenException);
    expect(() => guardFor(["admin"]).canActivate(context(undefined))).toThrow(ForbiddenException);
  });
});
