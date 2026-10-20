import { productInputSchema, productListQuerySchema, updateProductSchema } from "@kronos/contracts";

import { createZodDto } from "../../../common/zod/create-zod-dto.js";

export class ProductInputDto extends createZodDto(productInputSchema) {}
export class UpdateProductDto extends createZodDto(updateProductSchema) {}
export class ProductListQueryDto extends createZodDto(productListQuerySchema) {}
