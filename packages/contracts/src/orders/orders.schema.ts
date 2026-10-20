import { z } from "zod";

import { mobileSchema, postalCodeSchema } from "../common/iran";
import { paginationQuerySchema } from "../common/pagination";
import { ENGRAVING_MAX_LENGTH, MAX_QUANTITY_PER_ITEM } from "../products/products.schema";

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال‌شده",
  delivered: "تحویل‌شده",
  cancelled: "لغوشده",
};

/** Transitions an admin may apply; payment moves pending_payment → paid on its own. */
export const ADMIN_STATUS_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending_payment: ["cancelled"],
  paid: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const orderItemInputSchema = z.object({
  productId: z.string().regex(/^[a-f0-9]{24}$/, "شناسه محصول معتبر نیست"),
  strapId: z.string().regex(/^[a-z0-9-]{2,30}$/),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM, "حداکثر ۲ عدد از هر مدل"),
  engraving: z
    .string()
    .trim()
    .max(ENGRAVING_MAX_LENGTH, `حکاکی حداکثر ${ENGRAVING_MAX_LENGTH} حرف است`)
    .default(""),
});
export type OrderItemInput = z.input<typeof orderItemInputSchema>;

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(3, "نام و نام خانوادگی را کامل وارد کنید").max(80),
  mobile: mobileSchema,
  province: z.string().trim().min(2, "استان را وارد کنید").max(40),
  city: z.string().trim().min(2, "شهر را وارد کنید").max(40),
  address: z.string().trim().min(10, "نشانی را کامل‌تر بنویسید").max(300),
  postalCode: postalCodeSchema,
});
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type ShippingAddressInput = z.input<typeof shippingAddressSchema>;

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "سبد خرید خالی است").max(10),
  shipping: shippingAddressSchema,
  note: z.string().trim().max(500).default(""),
});
export type CreateOrderInput = z.input<typeof createOrderSchema>;

export const orderListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(ORDER_STATUSES).optional(),
});
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  trackingCode: z.string().trim().max(40).optional(),
});
export type UpdateOrderStatusInput = z.input<typeof updateOrderStatusSchema>;

export const verifyPaymentSchema = z.object({
  orderId: z.string().regex(/^[a-f0-9]{24}$/),
  authority: z.string().trim().min(6).max(64),
  status: z.enum(["OK", "NOK"]),
});
export type VerifyPaymentInput = z.input<typeof verifyPaymentSchema>;

export interface OrderItemDto {
  productId: string;
  slug: string;
  name: string;
  reference: string;
  image: string | null;
  strapName: string;
  unitPrice: number;
  strapPrice: number;
  engraving: string;
  engravingPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDto {
  id: string;
  number: string;
  status: OrderStatus;
  items: OrderItemDto[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shipping: ShippingAddress;
  note: string;
  trackingCode: string | null;
  paymentRef: string | null;
  createdAt: string;
  paidAt: string | null;
}

export interface StartPaymentDto {
  redirectUrl: string;
}
