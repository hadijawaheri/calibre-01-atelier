import { describe, expect, it, vi } from "vitest";

import { AppException } from "../../common/app-exception.js";
import { MelipayamakSmsProvider } from "./melipayamak-sms.provider.js";

const config = { apiKey: "key-12345678", otpBodyId: 42 };

describe("MelipayamakSmsProvider", () => {
  it("sends the code as the pattern's only argument", async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(Response.json({ recId: 4_003_920_112, status: "ارسال موفق بود" })),
    );
    await new MelipayamakSmsProvider(config, fetchMock).sendOtp("09121234567", "654321");

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://console.melipayamak.com/api/send/shared/key-12345678");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      bodyId: 42,
      to: "09121234567",
      args: ["654321"],
    });
  });

  it("throws a 503 when Melipayamak reports an error number", async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(Response.json({ recId: 11, status: "اعتبار کافی نیست" })),
    );
    const sending = new MelipayamakSmsProvider(config, fetchMock).sendOtp("09121234567", "654321");
    await expect(sending).rejects.toBeInstanceOf(AppException);
    await expect(sending).rejects.toMatchObject({ code: "SMS_UNAVAILABLE" });
  });

  it("throws a 503 on an HTTP error or a body that is not JSON", async () => {
    const fetchMock = vi.fn<typeof fetch>(() =>
      Promise.resolve(new Response("bad gateway", { status: 502 })),
    );
    await expect(
      new MelipayamakSmsProvider(config, fetchMock).sendOtp("09121234567", "654321"),
    ).rejects.toMatchObject({ code: "SMS_UNAVAILABLE" });
  });

  it("throws a 503 when the network fails", async () => {
    const fetchMock = vi.fn<typeof fetch>(() => Promise.reject(new TypeError("fetch failed")));
    await expect(
      new MelipayamakSmsProvider(config, fetchMock).sendOtp("09121234567", "654321"),
    ).rejects.toMatchObject({ code: "SMS_UNAVAILABLE" });
  });
});
