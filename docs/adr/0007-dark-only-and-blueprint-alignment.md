# 0007. Dark only, and where the web app departs from the blueprint

Status: accepted

The owner re-sent the blueprint and asked for everything to follow it. An audit against it found these gaps, now
closed:

- Production indexes come from versioned `migrate-mongo` migrations (`apps/api/migrations`), run by
  `scripts/deploy.sh` before the reload. The first migration covers the account collections (users, OTPs,
  refresh tokens).
- Deleting an account revokes every refresh family and clears the cookies.
- The lab respects reduced motion, the stage placeholder is a `Skeleton`, `page.tsx` files only route, the `(site)`
  group has its own `loading.tsx` and `error.tsx` inside the shell, calibre pages carry JSON-LD and the site an
  Open Graph image, and env is read through validated modules.
- Caddy caches `/media/*` (film frames and photographs) for a week; the names are not hashed, so not `immutable`.
- The RTL lint rule also checks template literals.

Deliberate departures that stay:

- **Dark only.** The home page film and photographs are shot on a dark studio, and the travelling movement is cut
  out for a dark page. `ThemeProvider` forces dark. The light tokens stay in `globals.css` so a light theme can come
  back without redesigning the palette.
- **No signed-in web app yet.** The blueprint's `lib/api`, `lib/auth/dal.ts`, `proxy.ts`, sign-in and dashboard
  routes, TanStack Query, RHF, nuqs and MSW come back with the community features (reviews, have/had/want lists).
  Adding them now would ship code no page uses.
- **Sentry** waits for the first production deploy, as the blueprint's own "not run yet" list says.
