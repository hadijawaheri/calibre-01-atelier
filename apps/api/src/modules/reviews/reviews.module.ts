import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "../users/schemas/user.schema.js";
import { AdminReviewsController, ReviewsController } from "./reviews.controller.js";
import { ReviewsService } from "./reviews.service.js";
import { Review, ReviewSchema } from "./schemas/review.schema.js";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReviewsController, AdminReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
