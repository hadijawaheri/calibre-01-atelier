import { Controller, Get, Param, Query } from "@nestjs/common";
import type {
  ApiResponse,
  PaginatedResponse,
  ProductDto,
  ProductSummaryDto,
} from "@kronos/contracts";

import { Public } from "../../common/decorators/public.decorator.js";
import { ProductListQueryDto } from "./dto/product.dto.js";
import { ProductsService } from "./products.service.js";

@Public()
@Controller({ path: "products", version: "1" })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() query: ProductListQueryDto): Promise<PaginatedResponse<ProductSummaryDto>> {
    return this.productsService.listPublished(query);
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string): Promise<ApiResponse<ProductDto>> {
    return { data: await this.productsService.getPublishedBySlug(slug) };
  }

  @Get(":slug/related")
  async related(@Param("slug") slug: string): Promise<ApiResponse<ProductSummaryDto[]>> {
    return { data: await this.productsService.listRelated(slug) };
  }
}
