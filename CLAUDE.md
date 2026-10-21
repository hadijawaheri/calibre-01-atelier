# Kronos — Agent Rules

Source of truth: PROJECT_BLUEPRINT_SHADCN.md (the project blueprint). This file is the short, always-loaded subset.

## Commands

- `pnpm dev` | `pnpm typecheck` | `pnpm lint` | `pnpm test` | `pnpm build` | `pnpm seed`
- MongoDB must be a replica set (orders reserve stock in transactions): `docker compose -f infra/docker-compose.yml up -d`
- API e2e tests start an in-memory Mongo replica set. Offline, point them at a local binary:
  `MONGOMS_SYSTEM_BINARY=$(which mongod) MONGOMS_SYSTEM_BINARY_VERSION_CHECK=false pnpm test`
- Web e2e: `pnpm build && pnpm seed`, run the API and `node .next/standalone/apps/web/server.js`, then `pnpm --filter @kronos/web test:e2e` (needs apps/api/.env with OTP_FIXED_CODE=123456 and PAYMENT_PROVIDER=fake)
- Use pnpm only. The lockfile is committed. TypeScript and ESLint are pinned in the pnpm catalog on purpose.

## Architecture

- apps/api (NestJS :7781, ESM, relative imports with `.js`), apps/web (Next :7782), packages/contracts (Zod, shared).
- Request/response shapes live ONLY in packages/contracts. Never redefine them in an app.
- API envelope: `{ data }` | `{ data, meta }` | `ApiErrorBody`. Never return raw documents; use mappers.
- The browser only talks to `/api/*` on the web origin (Next rewrite). Tokens are httpOnly cookies.
- The site is a watch reference (no shop, see ADR 0005). The API is kept for accounts and community features.
- 3D lives in `apps/web/src/features/movement/three`, loaded client-only. Real movements come from CAD via
  `apps/web/scripts/step-to-glb.mjs`; never ship a hand-drawn model as a real calibre.

## Code

- TS strict, no `any`, `catch (e: unknown)`. kebab-case files, named exports, no `I` prefix.
- Mongoose `@Prop` always gets an explicit `type`; values used in decorators are value imports, but CJS-only names
  that ESM cannot import by name (like mongoose `Connection`) must be `import type`.
- Comments explain WHY only. Imports are sorted by ESLint.
- `page.tsx` = routing only. `"use client"` only on leaves. Each feature exposes one `index.ts`; server fetchers live in `api.ts` / `server.ts`.

## UI (shadcn, RTL)

- Semantic tokens only. No raw colors, no `dark:` overrides, no `space-x/y`. Physical materials in the SVG artwork are the one exception.
- Logical classes only (ms/me/ps/pe/start/end); ESLint rejects physical ones. Directional icons: `rtl:rotate-180`.
- No letter-spacing on Persian text: it breaks the joins.
- Forms: FieldGroup + Field + Controller (RHF + Zod). LTR fields: `dir="ltr"` + `text-start`.
- The shadcn registry was unreachable when the project was built; components were pulled from the shadcn GitHub repo and converted with `pnpm dlx shadcn@latest migrate rtl`.

## Done means

typecheck + lint + tests actually run and green, loading/empty/error states handled, ADR for new decisions.
