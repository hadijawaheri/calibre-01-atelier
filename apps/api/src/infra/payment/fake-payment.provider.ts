import { randomBytes } from "node:crypto";

import { Injectable } from "@nestjs/common";

import type {
  PaymentRequest,
  PaymentStart,
  PaymentVerification,
} from "./payment.provider.js";
import { PaymentProvider } from "./payment.provider.js";

/**
 * Development gateway: the web app renders a sandbox page that returns to the callback.
 * Authorities starting with "FAKE-" verify successfully. env.ts forbids it in production.
 */
@Injectable()
export class FakePaymentProvider extends PaymentProvider {
  start(request: PaymentRequest): Promise<PaymentStart> {
    const authority = `FAKE-${randomBytes(12).toString("hex")}`;
    const url = new URL(request.callbackUrl);
    url.pathname = "/checkout/sandbox-gateway";
    url.searchParams.set("orderId", request.orderId);
    url.searchParams.set("authority", authority);
    url.searchParams.set("amount", String(request.amount));
    return Promise.resolve({ authority, redirectUrl: url.toString() });
  }

  verify(authority: string): Promise<PaymentVerification> {
    const ok = authority.startsWith("FAKE-");
    return Promise.resolve({ ok, refId: ok ? String(Date.now()).slice(-10) : null });
  }
}
