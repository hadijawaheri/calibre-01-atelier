import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ProductsModule } from "../products/products.module.js";
import { AdminOrdersController } from "./admin-orders.controller.js";
import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./orders.service.js";
import { Counter, CounterSchema } from "./schemas/counter.schema.js";
import { Order, OrderSchema } from "./schemas/order.schema.js";

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
