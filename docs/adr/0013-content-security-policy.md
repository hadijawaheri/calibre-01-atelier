# 0013. Content-Security-Policy with a per-request nonce

Status: accepted

- `src/proxy.ts` sends a Content-Security-Policy built in `src/lib/csp.ts` on every page: scripts run only with this
  request's nonce (`'strict-dynamic'` lets the nonced Next runtime load its chunks), plus the `blob:` and `data:` URLs
  the three.js loaders need and the Wikimedia Commons hosts the licensed photographs come from. The same policy is
  used by FlySmart and Farsh (ruflo-hq issue #5).
- It ships as `Content-Security-Policy-Report-Only`, because the site is live and the 3D lab, the film and the
  timegrapher worklet have not run under a CSP before. Once a week of production shows no violations in the browser
  console, `CSP_RESPONSE_HEADER` becomes `content-security-policy`.
- The root layout reads the nonce with `headers()`, so every page renders per request instead of at build time. That
  is the cost of a nonce; the pages stay fast because the data is bundled, and `dynamicParams = false` still 404s
  unknown slugs (ADR 0012).
- One report is expected and harmless: Zod 4 probes for JIT support with `Function("")` inside a `try`, falls back
  when the CSP refuses it, and the browser logs the refusal.
