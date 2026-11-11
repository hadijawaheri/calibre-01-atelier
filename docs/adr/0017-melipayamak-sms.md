# 0017 · Melipayamak for sign-in codes

Date: 2026-11-10 · Status: accepted

- **Why:** sign-in is by SMS code only, and production runs with `SMS_PROVIDER=disabled`, so nobody can sign in or write a review. Farsh and FlySmart already send through Melipayamak; Kronos uses the same account.
- **What:** `MelipayamakSmsProvider` posts to `console.melipayamak.com/api/send/shared/<key>` with an approved "خدماتی" pattern (`MELIPAYAMAK_OTP_BODY_ID`) whose only argument is the code. Patterns skip the operator's ad filter and the "لغو۱۱" footer. Melipayamak answers 200 even on failure, so a `recId` below 1000 counts as an error; any failure, timeout (5 s) or network error becomes a Persian 503 `SMS_UNAVAILABLE`, and the code and full mobile number are never logged.
- **Off by default:** it runs only when `SMS_PROVIDER=melipayamak` is set; `env.ts` refuses to boot without the key and the pattern id. The server keeps `SMS_PROVIDER=disabled` until Hadi turns it on.
- **Same shape as Farsh** (`apps/api/src/infra/sms/melipayamak-sms.provider.ts` there), adapted to Kronos's `sendOtp` interface.
