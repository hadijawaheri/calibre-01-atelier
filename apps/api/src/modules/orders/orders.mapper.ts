import type { OrderDto } from "@kronos/contracts";

import type { Order } from "./schemas/order.schema.js";

export function toOrderDto(order: Order): OrderDto {
  return {
    id: order._id.toString(),
    number: order.number,
    status: order.status,
    items: order.items.map((item) => ({
      productId: item.productId.toString(),
      slug: item.slug,
      name: item.name,
      reference: item.reference,
      image: item.image,
      strapName: item.strapName,
      unitPrice: item.unitPrice,
      strapPrice: item.strapPrice,
      engraving: item.engraving,
      engravingPrice: item.engravingPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    shipping: { ...order.shipping },
    note: order.note,
    trackingCode: order.trackingCode,
    paymentRef: order.paymentRef,
    createdAt: order.createdAt.toISOString(),
    paidAt: order.paidAt?.toISOString() ?? null,
  };
}
