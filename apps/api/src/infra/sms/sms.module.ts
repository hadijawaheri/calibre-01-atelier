import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";

import type { Env } from "../../config/env.js";
import { ConsoleSmsProvider } from "./console-sms.provider.js";
import { DisabledSmsProvider } from "./disabled-sms.provider.js";
import { MelipayamakSmsProvider } from "./melipayamak-sms.provider.js";
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
        if (provider === "disabled") return new DisabledSmsProvider();
        const apiKey = config.get("MELIPAYAMAK_API_KEY", { infer: true });
        const otpBodyId = config.get("MELIPAYAMAK_OTP_BODY_ID", { infer: true });
        // env.ts already refuses to boot without both; this keeps the types honest
        if (!apiKey || !otpBodyId) {
          throw new Error("Melipayamak needs MELIPAYAMAK_API_KEY and MELIPAYAMAK_OTP_BODY_ID");
        }
        return new MelipayamakSmsProvider({ apiKey, otpBodyId });
      },
    },
  ],
  exports: [SmsProvider],
})
export class SmsModule {}
