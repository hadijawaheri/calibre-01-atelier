# Kronos redesign: where to resume

Branch `redesign/canon-wip` (from `feat/watch-reference`, PR #2 untouched). Direction: the canon luxury-watch look Hadi
pinned in his own brief (2026-10-22), recorded in `apps/web/PRODUCT.md` (Brand Commitments) and the surface brief
`apps/web/.impeccable/surfaces/src-app-site-page-tsx.md` (direction contract). No shop, no configurator, no checkout.
The site must carry many photos, long articles and video later.

## Done

- Fonts: Bodoni Moda (Latin display), Amiri (Persian display), Jost (Latin text), Vazirmatn (Persian text).
  Cormorant and JetBrains Mono removed.
- Tokens in `globals.css`: ivory/stone light, matte black/charcoal dark, `--metal` (bronze light, pale gold dark)
  replaces `--gold`; square corners; utilities `display` (the one heading size), `caps` (Latin tracked captions only),
  `rim-light`, `hairline`; themed selection, focus, scrollbar, caret.
- Button variants restyled. Header: centred wordmark, tiny links, frosted, hides on scroll down (`header-reveal.tsx`).
  Footer centred. Custom cursor (`custom-cursor.tsx`, reads `data-cursor="label"`).
- Home: hero, statement, wrist, features, film, gallery (depth blur), timegrapher, blueprint, families (catalogue
  ledger), finale. Eyebrows, chips, numbers and cards removed.
- typecheck and lint green at this point. Not yet built, screenshotted or e2e-tested.

## To do (updated 2026-10-23)

Lab, lab index, profile, 404, loading and error states are redone; e2e (26), unit, typecheck and lint pass;
`impeccable detect` is clean. Review captures live in `.impeccable/review/` (gitignored).

1. Act on the finish reviewer's disposition, then spawn `impeccable-documenter` (DESIGN.md + `.impeccable/design.json`;
   include rules for articles, figures and video).
2. ADR for the redesign; merge the branch into `feat/watch-reference`, push to PR #2, reply to Hadi in Persian with
   previews.
