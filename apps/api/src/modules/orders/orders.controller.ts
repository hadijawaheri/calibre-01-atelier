import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import type { ApiResponse, OrderDto, PaginatedResponse, StartPaymentDto } from "@kronos/contracts";

import { ParseObjectIdPipe } from "../../common/database/object-id.pipe.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import type { AuthUser } from "../../common/types/auth.js";
import { CreateOrderDto, OrderListQueryDto, VerifyPaymentDto } from "./dto/order.dto.js";
import { OrdersService } from "./orders.service.js";

@Controller({ path: "orders", version: "1" })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrderDto,
  ): Promise<ApiResponse<OrderDto>> {
    return { data: await this.ordersService.create(user.id, dto) };
  }

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query() query: OrderListQueryDto,
  ): Promise<PaginatedResponse<OrderDto>> {
    return this.ordersService.listMine(user.id, query);
  }

  @Post("payments/verify")
  @HttpCode(200)
  async verifyPayment(
    @CurrentUser() user: AuthUser,
    @Body() dto: VerifyPaymentDto,
  ): Promise<ApiResponse<OrderDto>> {
    return { data: await this.ordersService.verifyPayment(user.id, dto) };
  }

  @Get(":id")
  async detail(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseObjectIdPipe) id: string,
  ): Promise<ApiResponse<OrderDto>> {
    return { data: await this.ordersService.getMine(user.id, id) };
  }

  @Post(":id/pay")
  @HttpCode(200)
  async pay(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseObjectIdPipe) id: string,
  ): Promise<ApiResponse<StartPaymentDto>> {
    return { data: await this.ordersService.startPayment(user.id, id) };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(
    @CurrentUser() user: AuthUser,
    @Param("id", ParseObjectIdPipe) id: string,
  ): Promise<ApiResponse<OrderDto>> {
    return { data: await this.ordersService.cancelMine(user.id, id) };
  }
}
