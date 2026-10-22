# Kronos redesign: where to resume

Branch `redesign/canon-wip` (from `feat/watch-reference`, PR #2 untouched). Direction: the canon luxury-watch look Hadi
pinned in his own brief (2026-10-22), recorded in `apps/web/PRODUCT.md` (Brand Commitments) and the surface brief
`apps/web/.impeccable/surfaces/src-app-site-page-tsx.md` (direction contract). No shop, no configurator, no checkout.
The site must carry many photos, long articles and video later.

## Done

- Fonts: Bodoni Moda (Latin display), Markazi Text (Persian display), Jost (Latin text), Vazirmatn (Persian text).
  Cormorant and JetBrains Mono removed.
- Tokens in `globals.css`: ivory/stone light, matte black/charcoal dark, `--metal` (bronze light, pale gold dark)
  replaces `--gold`; square corners; utilities `display` (the one heading size), `caps` (Latin tracked captions only),
  `rim-light`, `hairline`; themed selection, focus, scrollbar, caret.
- Button variants restyled. Header: centred wordmark, tiny links, frosted, hides on scroll down (`header-reveal.tsx`).
  Footer centred. Custom cursor (`custom-cursor.tsx`, reads `data-cursor="label"`).
- Home: hero, statement, wrist, features, film, gallery (depth blur), timegrapher, blueprint, families (catalogue
  ledger), finale. Eyebrows, chips, numbers and cards removed.
- typecheck and lint green at this point. Not yet built, screenshotted or e2e-tested.

## To do

1. Still using removed classes (`eyebrow`, `text-gold`, `font-mono`, `bg-surface/60` cards): `movement-lab.tsx`,
   `calibre-index.tsx` (make it a ledger like home-families), `calibre-profile.tsx`, `calibre-facts.tsx`,
   `components/shared/page-header.tsx`, `app/not-found.tsx`, `app/(site)/loading.tsx`, `components/layout/error-state.tsx`.
   Add `data-cursor="بکشید تا بچرخد"` to the lab canvas; hide its touch hint on fine pointers.
2. `layout.tsx` themeColor: match new backgrounds.
3. Build, screenshot (`$S/tour.mjs`, both themes, mobile 390 + desktop 1440), fix, check contrast and Markazi ZWNJ
   rendering.
4. Update e2e tests for changed copy (hero h1 is now "موومنت واقعی، در حال کار"), run typecheck, lint, unit, e2e.
5. `impeccable detect --json`, capture `.impeccable/review/desktop.png` + `mobile.png`, spawn
   `impeccable-finish-reviewer`, then `impeccable-documenter` (DESIGN.md + `.impeccable/design.json`; include rules
   for articles, figures and video).
6. ADR for the redesign; merge the branch into `feat/watch-reference`, push to PR #2, reply to Hadi in Persian with
   previews.
