import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";

import type { Env } from "../../config/env.js";
import { ConsoleSmsProvider } from "./console-sms.provider.js";
import { SmsProvider } from "./sms.provider.js";

@Global()
@Module({
  providers: [
    {
      provide: SmsProvider,
      inject: [ConfigService, PinoLogger],
      useFactory: (config: ConfigService<Env, true>, logger: PinoLogger): SmsProvider => {
        const provider = config.get("SMS_PROVIDER", { infer: true });
        if (provider === "console") return new ConsoleSmsProvider(logger);
        // Fail at boot instead of silently falling back to the console provider
        throw new Error(`SMS provider "${provider}" is not implemented yet`);
      },
    },
  ],
  exports: [SmsProvider],
})
export class SmsModule {}
