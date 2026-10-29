import type { ApiResponse, PaginatedResponse, ReviewDto, ReviewPageMeta } from "@kronos/contracts";
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { ParseObjectIdPipe } from "../../common/database/object-id.pipe.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Public } from "../../common/decorators/public.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import type { AuthUser } from "../../common/types/auth.js";
import { PaginationQueryDto } from "../../common/zod/pagination-query.dto.js";
import { AdminReviewsQueryDto, ReviewInputDto, ReviewModerationDto } from "./dto/review.dto.js";
import { ReviewsService } from "./reviews.service.js";
import { ParseWatchSlugPipe } from "./watch-slug.pipe.js";

@Controller({ path: "watches/:slug/reviews", version: "1" })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get()
  async list(
    @Param("slug", ParseWatchSlugPipe) slug: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<ReviewDto> & { meta: ReviewPageMeta }> {
    const { items, meta } = await this.reviewsService.listPublished(slug, query);
    return { data: items, meta };
  }

  @Get("mine")
  async mine(
    @CurrentUser() user: AuthUser,
    @Param("slug", ParseWatchSlugPipe) slug: string,
  ): Promise<ApiResponse<ReviewDto | null>> {
    return { data: await this.reviewsService.findMine(user.id, slug) };
  }

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Put("mine")
  async upsertMine(
    @CurrentUser() user: AuthUser,
    @Param("slug", ParseWatchSlugPipe) slug: string,
    @Body() dto: ReviewInputDto,
  ): Promise<ApiResponse<ReviewDto>> {
    return { data: await this.reviewsService.upsertMine(user.id, slug, dto) };
  }

  @Delete("mine")
  @HttpCode(204)
  async deleteMine(
    @CurrentUser() user: AuthUser,
    @Param("slug", ParseWatchSlugPipe) slug: string,
  ): Promise<void> {
    await this.reviewsService.deleteMine(user.id, slug);
  }
}

@Roles("admin")
@Controller({ path: "admin/reviews", version: "1" })
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async list(@Query() query: AdminReviewsQueryDto): Promise<PaginatedResponse<ReviewDto>> {
    const { items, meta } = await this.reviewsService.listForModeration(query);
    return { data: items, meta };
  }

  @Patch(":id")
  async moderate(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: ReviewModerationDto,
  ): Promise<ApiResponse<ReviewDto>> {
    return { data: await this.reviewsService.moderate(id, dto.status) };
  }
}
