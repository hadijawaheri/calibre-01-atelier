import { Body, Controller, Get, HttpCode, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import type { ApiResponse, UserDto } from "@kronos/contracts";
import { COOKIE_NAMES } from "@kronos/contracts";
import type { Request, Response } from "express";

import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Public } from "../../common/decorators/public.decorator.js";
import type { AuthUser } from "../../common/types/auth.js";
import type { Env } from "../../config/env.js";
import { UsersService } from "../users/users.service.js";
import { clearSessionCookies, setSessionCookies } from "./auth.cookies.js";
import { AuthService } from "./auth.service.js";
import { RequestOtpDto, VerifyOtpDto } from "./dto/auth.dto.js";

function refreshCookie(req: Request): string | undefined {
  return (req.cookies as Record<string, string | undefined> | undefined)?.[COOKIE_NAMES.refresh];
}

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  private get secureCookies(): boolean {
    return this.config.get("NODE_ENV", { infer: true }) === "production";
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @Post("otp/request")
  @HttpCode(204)
  async requestOtp(@Body() dto: RequestOtpDto): Promise<void> {
    await this.authService.requestOtp(dto.mobile);
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post("otp/verify")
  @HttpCode(200)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<{ user: UserDto }>> {
    const { user, tokens } = await this.authService.verifyOtp(dto.mobile, dto.code);
    setSessionCookies(res, tokens, this.secureCookies);
    return { data: { user } };
  }

  @Get("me")
  async me(@CurrentUser() user: AuthUser): Promise<ApiResponse<{ user: UserDto }>> {
    return { data: { user: await this.usersService.getById(user.id) } };
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  @Post("refresh")
  @HttpCode(204)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    try {
      const tokens = await this.authService.refresh(refreshCookie(req));
      setSessionCookies(res, tokens, this.secureCookies);
    } catch (error) {
      clearSessionCookies(res, this.secureCookies);
      throw error;
    }
  }

  @Public()
  @Post("logout")
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.authService.logout(refreshCookie(req));
    clearSessionCookies(res, this.secureCookies);
  }
}
