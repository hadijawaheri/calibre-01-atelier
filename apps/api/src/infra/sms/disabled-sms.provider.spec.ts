import { describe, expect, it } from "vitest";

import { DisabledSmsProvider } from "./disabled-sms.provider.js";

describe("DisabledSmsProvider", () => {
  it("refuses to send a code with a 503", async () => {
    await expect(new DisabledSmsProvider().sendOtp()).rejects.toMatchObject({
      code: "SMS_UNAVAILABLE",
    });
  });
});
