import type {
  PageMeta,
  PaginationQuery,
  ReviewDto,
  ReviewPageMeta,
  ReviewStatus,
} from "@kronos/contracts";
import { pageMeta } from "@kronos/contracts";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import type { UserDocument } from "../users/schemas/user.schema.js";
import { User } from "../users/schemas/user.schema.js";
import type { AdminReviewsQueryDto, ReviewInputDto } from "./dto/review.dto.js";
import { authorNameOf, toReviewDto } from "./reviews.mapper.js";
import type { ReviewDocument } from "./schemas/review.schema.js";
import { Review } from "./schemas/review.schema.js";

const NOT_FOUND = "نظری یافت نشد";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async listPublished(
    watchSlug: string,
    { page, limit }: PaginationQuery,
  ): Promise<{ items: ReviewDto[]; meta: ReviewPageMeta }> {
    const filter = { watchSlug, status: "published" as const };
    const [items, [stats]] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      // aggregate skips the soft-delete hook, so the filter names deletedAt itself
      this.reviewModel.aggregate<{ count: number; average: number }>([
        { $match: { ...filter, deletedAt: null } },
        { $group: { _id: null, count: { $sum: 1 }, average: { $avg: "$rating" } } },
      ]),
    ]);
    const count = stats?.count ?? 0;
    return {
      items: items.map(toReviewDto),
      meta: {
        ...pageMeta(page, limit, count),
        average: stats ? Math.round(stats.average * 10) / 10 : null,
      },
    };
  }

  async findMine(userId: string, watchSlug: string): Promise<ReviewDto | null> {
    const review = await this.reviewModel
      .findOne({ userId: new Types.ObjectId(userId), watchSlug })
      .lean();
    return review ? toReviewDto(review) : null;
  }

  /** Every write goes back to the moderation queue, so an approved review cannot be edited into spam. */
  async upsertMine(userId: string, watchSlug: string, input: ReviewInputDto): Promise<ReviewDto> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException("کاربر یافت نشد");
    const review = await this.reviewModel
      .findOneAndUpdate(
        { userId: user._id, watchSlug },
        {
          $set: {
            rating: input.rating,
            text: input.text,
            ownership: input.ownership,
            authorName: authorNameOf(user),
            status: "pending",
          },
        },
        { upsert: true, returnDocument: "after", runValidators: true },
      )
      .lean();
    return toReviewDto(review);
  }

  async deleteMine(userId: string, watchSlug: string): Promise<void> {
    const result = await this.reviewModel.updateOne(
      { userId: new Types.ObjectId(userId), watchSlug },
      { $set: { deletedAt: new Date() } },
    );
    if (result.matchedCount === 0) throw new NotFoundException(NOT_FOUND);
  }

  async listForModeration({
    page,
    limit,
    status,
  }: AdminReviewsQueryDto): Promise<{ items: ReviewDto[]; meta: PageMeta }> {
    const [items, total] = await Promise.all([
      // The oldest waiting review first, so nothing starves at the bottom of the queue
      this.reviewModel
        .find({ status })
        .sort({ createdAt: 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.reviewModel.countDocuments({ status }),
    ]);
    return { items: items.map(toReviewDto), meta: pageMeta(page, limit, total) };
  }

  async moderate(id: string, status: Exclude<ReviewStatus, "pending">): Promise<ReviewDto> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after" })
      .lean();
    if (!review) throw new NotFoundException(NOT_FOUND);
    return toReviewDto(review);
  }
}
