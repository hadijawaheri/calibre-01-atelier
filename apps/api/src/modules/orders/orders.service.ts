import type {
  OrderDto,
  OrderListQuery,
  OrderStatus,
  PaginatedResponse,
  StartPaymentDto,
} from "@kronos/contracts";
import { ADMIN_STATUS_TRANSITIONS, ORDER_STATUS_LABELS, pageMeta } from "@kronos/contracts";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import type { ClientSession, Connection, QueryFilter } from "mongoose";
import { Model, Types } from "mongoose";

import { AppException } from "../../common/app-exception.js";
import type { Env } from "../../config/env.js";
import { PaymentProvider } from "../../infra/payment/payment.provider.js";
import type { ProductDocument } from "../products/schemas/product.schema.js";
import { Product } from "../products/schemas/product.schema.js";
import type { CreateOrderDto, UpdateOrderStatusDto, VerifyPaymentDto } from "./dto/order.dto.js";
import { toOrderDto } from "./orders.mapper.js";
import { priceLine, SHIPPING_FEE } from "./orders.pricing.js";
import type { CounterDocument } from "./schemas/counter.schema.js";
import { Counter } from "./schemas/counter.schema.js";
import type { Order, OrderDocument, OrderItem } from "./schemas/order.schema.js";
import { Order as OrderModel } from "./schemas/order.schema.js";

/** Unpaid orders hold limited-edition stock for this long. */
export const PAYMENT_WINDOW_MS = 30 * 60 * 1000;
const ORDER_NUMBER_START = 240_000;

const notFound = () => new NotFoundException("سفارش یافت نشد");

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderModel.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Counter.name) private readonly counterModel: Model<CounterDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly payments: PaymentProvider,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderDto> {
    await this.releaseExpired();

    const order = await this.connection.transaction(async (session) => {
      const items: OrderItem[] = [];
      for (const input of dto.items) {
        const product = await this.productModel
          .findOne({ _id: input.productId, isPublished: true })
          .session(session)
          .lean();
        if (!product)
          throw new AppException(404, "NOT_FOUND", "یکی از ساعت‌های سبد دیگر موجود نیست");

        const strap = product.straps.find((option) => option.id === input.strapId);
        if (!strap) throw new BadRequestException(`بند انتخاب‌شده برای ${product.name} معتبر نیست`);

        // Conditional decrement: the transaction aborts if another buyer took the last piece
        const reserved = await this.productModel.updateOne(
          { _id: product._id, stock: { $gte: input.quantity } },
          { $inc: { stock: -input.quantity } },
          { session },
        );
        if (reserved.modifiedCount === 0) {
          throw new AppException(409, "OUT_OF_STOCK", `موجودی ${product.name} کافی نیست`);
        }

        items.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          reference: product.reference,
          image: product.images[0] ?? null,
          strapId: strap.id,
          strapName: strap.name,
          engraving: input.engraving,
          ...priceLine(product.price, strap.price, input.engraving, input.quantity),
        });
      }

      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const now = Date.now();
      const [created] = await this.orderModel.create(
        [
          {
            userId: new Types.ObjectId(userId),
            number: await this.nextNumber(session),
            status: "pending_payment",
            items,
            subtotal,
            shippingFee: SHIPPING_FEE,
            total: subtotal + SHIPPING_FEE,
            shipping: dto.shipping,
            note: dto.note,
            expiresAt: new Date(now + PAYMENT_WINDOW_MS),
          },
        ],
        { session },
      );
      if (!created) throw new Error("Order was not created");
      return created.toObject();
    });

    return toOrderDto(order);
  }

  async listMine(userId: string, query: OrderListQuery): Promise<PaginatedResponse<OrderDto>> {
    const filter: QueryFilter<Order> = { userId: new Types.ObjectId(userId) };
    if (query.status) filter.status = query.status;
    return this.paginate(filter, query);
  }

  async getMine(userId: string, id: string): Promise<OrderDto> {
    const order = await this.orderModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .lean();
    if (!order) throw notFound();
    return toOrderDto(order);
  }

  async startPayment(userId: string, id: string): Promise<StartPaymentDto> {
    const order = await this.orderModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .lean();
    if (!order) throw notFound();
    if (order.status !== "pending_payment") {
      throw new AppException(409, "CONFLICT", "این سفارش در انتظار پرداخت نیست");
    }
    if (order.expiresAt.getTime() < Date.now()) {
      await this.cancel(order._id, ["pending_payment"]);
      throw new AppException(409, "CONFLICT", "مهلت پرداخت این سفارش تمام شده است");
    }

    const callbackUrl = new URL(
      "/checkout/callback",
      this.config.get("PUBLIC_WEB_URL", { infer: true }),
    );
    const { authority, redirectUrl } = await this.payments.start({
      orderId: order._id.toString(),
      orderNumber: order.number,
      amount: order.total,
      mobile: order.shipping.mobile,
      callbackUrl: callbackUrl.toString(),
    });
    await this.orderModel.updateOne(
      { _id: order._id, status: "pending_payment" },
      { $set: { paymentAuthority: authority } },
    );
    return { redirectUrl };
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto): Promise<OrderDto> {
    const order = await this.orderModel
      .findOne({ _id: dto.orderId, userId: new Types.ObjectId(userId) })
      .lean();
    if (!order) throw notFound();
    // The gateway may redirect twice (refresh, back button): a paid order stays paid
    if (order.status !== "pending_payment") return toOrderDto(order);
    if (!order.paymentAuthority || order.paymentAuthority !== dto.authority) {
      throw new AppException(400, "PAYMENT_FAILED", "اطلاعات تراکنش با سفارش همخوانی ندارد");
    }
    if (dto.status !== "OK") {
      throw new AppException(400, "PAYMENT_FAILED", "پرداخت انجام نشد؛ می‌توانید دوباره تلاش کنید");
    }

    const verification = await this.payments.verify(dto.authority, order.total);
    if (!verification.ok) {
      throw new AppException(400, "PAYMENT_FAILED", "پرداخت توسط بانک تأیید نشد");
    }

    const paid = await this.orderModel
      .findOneAndUpdate(
        { _id: order._id, status: "pending_payment", paymentAuthority: dto.authority },
        { $set: { status: "paid", paidAt: new Date(), paymentRef: verification.refId } },
        { returnDocument: "after" },
      )
      .lean();
    const current = paid ?? (await this.orderModel.findById(order._id).lean());
    if (!current) throw notFound();
    return toOrderDto(current);
  }

  async cancelMine(userId: string, id: string): Promise<OrderDto> {
    const order = await this.orderModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .lean();
    if (!order) throw notFound();
    const cancelled = await this.cancel(order._id, ["pending_payment"]);
    if (!cancelled) throw new AppException(409, "CONFLICT", "فقط سفارش پرداخت‌نشده قابل لغو است");
    return toOrderDto(cancelled);
  }

  async listAll(query: OrderListQuery): Promise<PaginatedResponse<OrderDto>> {
    const filter: QueryFilter<Order> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [
        { number: pattern },
        { "shipping.mobile": pattern },
        { "shipping.fullName": pattern },
      ];
    }
    return this.paginate(filter, query);
  }

  async getById(id: string): Promise<OrderDto> {
    const order = await this.orderModel.findById(id).lean();
    if (!order) throw notFound();
    return toOrderDto(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderDto> {
    const order = await this.orderModel.findById(id).lean();
    if (!order) throw notFound();

    const allowed = ADMIN_STATUS_TRANSITIONS[order.status];
    if (!allowed.includes(dto.status)) {
      throw new AppException(
        409,
        "CONFLICT",
        `تغییر وضعیت از «${ORDER_STATUS_LABELS[order.status]}» به «${ORDER_STATUS_LABELS[dto.status]}» مجاز نیست`,
      );
    }

    if (dto.status === "cancelled") {
      const cancelled = await this.cancel(order._id, [order.status]);
      if (!cancelled) throw new AppException(409, "CONFLICT", "وضعیت سفارش هم‌زمان تغییر کرده است");
      return toOrderDto(cancelled);
    }

    const updated = await this.orderModel
      .findOneAndUpdate(
        { _id: order._id, status: order.status },
        {
          $set: {
            status: dto.status,
            ...(dto.trackingCode !== undefined && { trackingCode: dto.trackingCode || null }),
          },
        },
        { returnDocument: "after" },
      )
      .lean();
    if (!updated) throw new AppException(409, "CONFLICT", "وضعیت سفارش هم‌زمان تغییر کرده است");
    return toOrderDto(updated);
  }

  /** Cancels unpaid orders whose payment window passed and returns their stock. */
  async releaseExpired(now = new Date()): Promise<number> {
    const expired = await this.orderModel
      .find({ status: "pending_payment", expiresAt: { $lt: now } }, { _id: 1 })
      .limit(100)
      .lean();
    let released = 0;
    for (const { _id } of expired) {
      if (await this.cancel(_id, ["pending_payment"])) released += 1;
    }
    return released;
  }

  /** Atomic: only the caller that flips the status returns the stock. */
  private async cancel(id: Types.ObjectId, from: OrderStatus[]): Promise<Order | null> {
    return this.connection.transaction(async (session) => {
      const order = await this.orderModel
        .findOneAndUpdate(
          { _id: id, status: { $in: from } },
          { $set: { status: "cancelled", cancelledAt: new Date() } },
          { returnDocument: "after", session },
        )
        .lean();
      if (!order) return null;
      for (const item of order.items) {
        await this.productModel.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session },
        );
      }
      return order;
    });
  }

  private async nextNumber(session: ClientSession): Promise<string> {
    const counter = await this.counterModel
      .findOneAndUpdate(
        { _id: "order" },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: "after", session },
      )
      .lean();
    return `KR-${ORDER_NUMBER_START + (counter?.seq ?? 0)}`;
  }

  private async paginate(
    filter: QueryFilter<Order>,
    query: OrderListQuery,
  ): Promise<PaginatedResponse<OrderDto>> {
    const [items, totalItems] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean(),
      this.orderModel.countDocuments(filter),
    ]);
    return { data: items.map(toOrderDto), meta: pageMeta(query.page, query.limit, totalItems) };
  }
}
