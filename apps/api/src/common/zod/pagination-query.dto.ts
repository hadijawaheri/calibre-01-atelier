import { paginationQuerySchema } from "@kronos/contracts";

import { createZodDto } from "./create-zod-dto.js";

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
