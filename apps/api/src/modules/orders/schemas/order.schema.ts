import type { OrderStatus, ShippingAddress } from "@kronos/contracts";
import { ORDER_STATUSES } from "@kronos/contracts";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
  slug: string;
  name: string;
  reference: string;
  image: string | null;
  strapId: string;
  strapName: string;
  unitPrice: number;
  strapPrice: number;
  engraving: string;
  engravingPrice: number;
  quantity: number;
  lineTotal: number;
}

@Schema({ timestamps: true })
export class Order {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  number!: string;

  @Prop({ type: String, enum: ORDER_STATUSES, required: true, default: "pending_payment" })
  status!: OrderStatus;

  @Prop({
    type: [
      {
        _id: false,
        productId: { type: Types.ObjectId, required: true },
        slug: { type: String, required: true },
        name: { type: String, required: true },
        reference: { type: String, required: true },
        image: { type: String, default: null },
        strapId: { type: String, required: true },
        strapName: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        strapPrice: { type: Number, required: true },
        engraving: { type: String, default: "" },
        engravingPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items!: OrderItem[];

  /** Rial, integer */
  @Prop({ type: Number, required: true })
  subtotal!: number;

  @Prop({ type: Number, required: true })
  shippingFee!: number;

  @Prop({ type: Number, required: true })
  total!: number;

  @Prop(
    raw({
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
    }),
  )
  shipping!: ShippingAddress;

  @Prop({ type: String, default: "" })
  note!: string;

  @Prop({ type: String, default: null })
  trackingCode!: string | null;

  @Prop({ type: String, default: null, index: true })
  paymentAuthority!: string | null;

  @Prop({ type: String, default: null })
  paymentRef!: string | null;

  /** Unpaid orders hold stock only until this moment */
  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Date, default: null })
  paidAt!: Date | null;

  @Prop({ type: Date, default: null })
  cancelledAt!: Date | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, expiresAt: 1 });
