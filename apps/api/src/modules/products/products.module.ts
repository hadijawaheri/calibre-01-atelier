import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AdminProductsController } from "./admin-products.controller.js";
import { ProductsController } from "./products.controller.js";
import { ProductsService } from "./products.service.js";
import { Product, ProductSchema } from "./schemas/product.schema.js";

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
