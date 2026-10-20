import { updateProfileSchema } from "@kronos/contracts";

import { createZodDto } from "../../../common/zod/create-zod-dto.js";

export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
