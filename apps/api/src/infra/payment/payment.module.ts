import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { Env } from "../../config/env.js";
import { FakePaymentProvider } from "./fake-payment.provider.js";
import { PaymentProvider } from "./payment.provider.js";

@Global()
@Module({
  providers: [
    {
      provide: PaymentProvider,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>): PaymentProvider => {
        const provider = config.get("PAYMENT_PROVIDER", { infer: true });
        if (provider === "fake") return new FakePaymentProvider();
        throw new Error(`Payment provider "${provider}" is not implemented yet`);
      },
    },
  ],
  exports: [PaymentProvider],
})
export class PaymentModule {}
