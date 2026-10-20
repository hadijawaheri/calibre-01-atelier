import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { SmsProvider } from "./sms.provider.js";

/** Development only: prints the code to the log. env.ts forbids it in production. */
@Injectable()
export class ConsoleSmsProvider extends SmsProvider {
  constructor(private readonly logger: PinoLogger) {
    super();
  }

  sendOtp(mobile: string, code: string): Promise<void> {
    this.logger.info({ mobile: `${mobile.slice(0, 4)}***${mobile.slice(-2)}`, code }, "OTP (dev)");
    return Promise.resolve();
  }
}
