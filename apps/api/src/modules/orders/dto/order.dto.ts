import {
  createOrderSchema,
  orderListQuerySchema,
  updateOrderStatusSchema,
  verifyPaymentSchema,
} from "@kronos/contracts";

import { createZodDto } from "../../../common/zod/create-zod-dto.js";

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
export class OrderListQueryDto extends createZodDto(orderListQuerySchema) {}
export class UpdateOrderStatusDto extends createZodDto(updateOrderStatusSchema) {}
export class VerifyPaymentDto extends createZodDto(verifyPaymentSchema) {}
