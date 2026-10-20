export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  /** Rial */
  amount: number;
  mobile: string;
  callbackUrl: string;
}

export interface PaymentStart {
  authority: string;
  redirectUrl: string;
}

export interface PaymentVerification {
  ok: boolean;
  /** Bank reference id shown on the receipt */
  refId: string | null;
}

export abstract class PaymentProvider {
  abstract start(request: PaymentRequest): Promise<PaymentStart>;
  abstract verify(authority: string, amount: number): Promise<PaymentVerification>;
}
