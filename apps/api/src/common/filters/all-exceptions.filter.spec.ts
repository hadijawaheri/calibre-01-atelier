import { HttpException, NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { AppException } from "../app-exception.js";
import { ZodValidationException } from "../zod/zod-validation.pipe.js";
import { toErrorBody } from "./all-exceptions.filter.js";

describe("toErrorBody", () => {
  it("maps validation issues to field details", () => {
    const result = z.object({ mobile: z.string().min(11, "کوتاه است") }).safeParse({ mobile: "1" });
    if (result.success) throw new Error("expected failure");
    expect(toErrorBody(new ZodValidationException(result.error), "r1")).toEqual({
      statusCode: 400,
      code: "VALIDATION_FAILED",
      message: "اطلاعات وارد شده معتبر نیست",
      details: [{ path: "mobile", message: "کوتاه است" }],
      requestId: "r1",
    });
  });

  it("keeps the explicit code of an AppException", () => {
    expect(toErrorBody(new AppException(409, "OUT_OF_STOCK", "تمام شد"))).toMatchObject({
      statusCode: 409,
      code: "OUT_OF_STOCK",
      message: "تمام شد",
    });
  });

  it("never leaks internal error details", () => {
    expect(toErrorBody(new Error("db password is hunter2"))).toEqual({
      statusCode: 500,
      code: "INTERNAL",
      message: "خطای غیرمنتظره‌ای رخ داد",
      requestId: undefined,
    });
    expect(toErrorBody(new HttpException("boom", 503)).message).toBe("خطای غیرمنتظره‌ای رخ داد");
  });

  it("translates Nest's English route-not-found message", () => {
    expect(toErrorBody(new NotFoundException("Cannot GET /x")).message).toBe("مورد درخواستی یافت نشد");
  });
});
