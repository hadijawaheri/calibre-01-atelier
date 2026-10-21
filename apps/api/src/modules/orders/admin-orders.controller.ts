import type { ApiResponse, OrderDto, PaginatedResponse } from "@kronos/contracts";
import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";

import { ParseObjectIdPipe } from "../../common/database/object-id.pipe.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { OrderListQueryDto, UpdateOrderStatusDto } from "./dto/order.dto.js";
import { OrdersService } from "./orders.service.js";

@Roles("admin")
@Controller({ path: "admin/orders", version: "1" })
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@Query() query: OrderListQueryDto): Promise<PaginatedResponse<OrderDto>> {
    return this.ordersService.listAll(query);
  }

  @Get(":id")
  async detail(@Param("id", ParseObjectIdPipe) id: string): Promise<ApiResponse<OrderDto>> {
    return { data: await this.ordersService.getById(id) };
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<ApiResponse<OrderDto>> {
    return { data: await this.ordersService.updateStatus(id, dto) };
  }
}
