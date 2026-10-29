import type { ReviewOwnership, ReviewStatus } from "@kronos/contracts";
import { REVIEW_OWNERSHIPS, REVIEW_STATUSES } from "@kronos/contracts";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

import { softDeletePlugin } from "../../../common/database/soft-delete.plugin.js";

@Schema({ timestamps: true })
export class Review {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  watchSlug!: string;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ type: String, required: true, trim: true })
  text!: string;

  @Prop({ type: String, enum: REVIEW_OWNERSHIPS, default: null })
  ownership!: ReviewOwnership | null;

  // A snapshot taken on each write, so a public listing never has to read the users collection
  @Prop({ type: String, required: true })
  authorName!: string;

  @Prop({ type: String, enum: REVIEW_STATUSES, default: "pending" })
  status!: ReviewStatus;

  createdAt!: Date;
  updatedAt!: Date;

  // Added by softDeletePlugin
  deletedAt?: Date | null;
}

export type ReviewDocument = HydratedDocument<Review>;
export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.plugin(softDeletePlugin);
// One live review per person per watch; deleting it frees the slot for a new one
ReviewSchema.index(
  { userId: 1, watchSlug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
// The public listing and its average: published reviews of one watch, newest first
ReviewSchema.index({ watchSlug: 1, status: 1, createdAt: -1 });
// The moderation queue
ReviewSchema.index({ status: 1, createdAt: 1 });
