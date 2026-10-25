# 0007. Light and dark themes, and where the web app departs from the blueprint

Status: accepted

The owner re-sent the blueprint and asked for everything to follow it. An audit against it found these gaps, now
closed:

- Production indexes come from versioned `migrate-mongo` migrations (`apps/api/migrations`), run by
  `scripts/deploy.sh` before the reload. An e2e test fails if a migration and the schemas declare different indexes.
- The shop's API modules (products, orders, payment), their contracts, seed data and tests are removed, as ADR 0005
  decided for the site. The API no longer refuses to boot in production for want of a payment gateway, and the
  extended query parser, which only the catalogue filters needed, is gone.
- Deleting an account revokes every refresh family and clears the cookies.
- The lab respects reduced motion, the stage placeholder is a `Skeleton`, `page.tsx` files only route, the `(site)`
  group has its own `loading.tsx` and `error.tsx` inside the shell, calibre pages carry JSON-LD and the site an
  Open Graph image, and env is read through validated modules.
- Caddy caches `/media/*` (film frames and photographs) for a week; the names are not hashed, so not `immutable`.
- The RTL lint rule also checks template literals.

Both themes, as the blueprint asks: the system preference decides until the visitor uses the toggle in the header.
The site was briefly dark only; the owner asked for the ivory theme back. The studio shadow under the photographed
movement is themed too, soft on ivory and deep on obsidian.

Deliberate departures that stay:

- **No signed-in web app yet.** The blueprint's `lib/api`, `lib/auth/dal.ts`, `proxy.ts`, sign-in and dashboard
  routes, TanStack Query, RHF, nuqs and MSW come back with the community features (reviews, have/had/want lists).
  Adding them now would ship code no page uses.
- **Sentry** waits for the first production deploy, as the blueprint's own "not run yet" list says.
