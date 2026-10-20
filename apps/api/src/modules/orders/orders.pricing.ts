import { ENGRAVING_PRICE } from "@kronos/contracts";

export interface PricedLine {
  unitPrice: number;
  strapPrice: number;
  engravingPrice: number;
  quantity: number;
  lineTotal: number;
}

/** Prices always come from the database; the client only sends ids, strap and engraving. */
export function priceLine(
  unitPrice: number,
  strapPrice: number,
  engraving: string,
  quantity: number,
): PricedLine {
  const engravingPrice = engraving.length > 0 ? ENGRAVING_PRICE : 0;
  return {
    unitPrice,
    strapPrice,
    engravingPrice,
    quantity,
    lineTotal: (unitPrice + strapPrice + engravingPrice) * quantity,
  };
}

/** Insured courier delivery is complimentary for every order. */
export const SHIPPING_FEE = 0;
