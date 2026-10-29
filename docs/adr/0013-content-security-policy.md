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
- Zod 4 probes for eval support with `Function("")`; the providers set `z.config({ jitless: true })` so it never
  asks. `upgrade-insecure-requests` is added only once the policy is enforced, since browsers reject it in a
  report-only policy. Both would otherwise log console errors, which the e2e suite fails on.
- Rendering per request also means the `(site)` loading shell is streamed with a 200 before a page can call
  `notFound()`. `src/proxy.ts` therefore checks `/lab`, `/calibres` and `/watches` slugs against the same data the
  pages use and rewrites unknown ones to an unmatched path, which Next answers with the root 404 page.
