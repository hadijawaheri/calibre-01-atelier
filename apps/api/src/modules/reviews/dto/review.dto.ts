import {
  adminReviewsQuerySchema,
  reviewInputSchema,
  reviewModerationSchema,
} from "@kronos/contracts";

import { createZodDto } from "../../../common/zod/create-zod-dto.js";

export class ReviewInputDto extends createZodDto(reviewInputSchema) {}
export class ReviewModerationDto extends createZodDto(reviewModerationSchema) {}
export class AdminReviewsQueryDto extends createZodDto(adminReviewsQuerySchema) {}
