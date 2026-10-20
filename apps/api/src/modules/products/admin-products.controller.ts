import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import type { ApiResponse, PaginatedResponse, ProductDto } from "@kronos/contracts";

import { ParseObjectIdPipe } from "../../common/database/object-id.pipe.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { PaginationQueryDto } from "../../common/zod/pagination-query.dto.js";
import { ProductInputDto, UpdateProductDto } from "./dto/product.dto.js";
import { ProductsService } from "./products.service.js";

@Roles("admin")
@Controller({ path: "admin/products", version: "1" })
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.listAll(query);
  }

  @Get(":id")
  async detail(@Param("id", ParseObjectIdPipe) id: string): Promise<ApiResponse<ProductDto>> {
    return { data: await this.productsService.getById(id) };
  }

  @Post()
  async create(@Body() dto: ProductInputDto): Promise<ApiResponse<ProductDto>> {
    return { data: await this.productsService.create(dto) };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ApiResponse<ProductDto>> {
    return { data: await this.productsService.update(id, dto) };
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id", ParseObjectIdPipe) id: string): Promise<void> {
    await this.productsService.softDelete(id);
  }
}
