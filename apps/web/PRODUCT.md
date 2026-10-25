# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Persian-speaking watch enthusiasts, in Iran and abroad, from the curious first-timer who has just noticed a
mechanical watch to the collector comparing calibres. Most arrive on a phone. Their job: understand what is inside a
watch and why one movement differs from another, in their own language, without a salesperson in the room.

## Product Purpose

Kronos (کرونوس) is a Persian watch encyclopedia in the spirit of Fragrantica: calibres, movement families, brands and
models explained in Persian. It is a reference, not a shop (ADR 0005). Success is a visitor who leaves knowing how a
movement keeps time and which family the watch on their wrist belongs to, and who comes back to look things up.

Planned, not built: articles on watchmaking and its history, model and brand pages, reviews and ratings,
have/had/want lists, community accounts, AR try-on. The owner expects the site to carry many photographs, long
articles and video, so the design system must serve long reading and large media as well as the home page's story.

## Positioning

Real movements, shown working. Every calibre on the site comes from the real thing: the owner's films and photographs
of a Swiss automatic, and CAD files of real calibres for the 3D lab. Nothing is drawn by hand and presented as a real
calibre. No other Persian source lets a reader take a movement apart and watch the escapement tick.

## Operating Context

- The home page tells the story of one real automatic movement on scroll: a scroll-scrubbed film of it coming apart,
  photographs of both sides, the cut-out movement travelling down the page.
- The movement lab (`/lab`) covers four families: Swiss standard automatic (ETA 2824-2 / SW200), ultra-thin, quartz,
  tourbillon. The automatic opens in an interactive 3D lab (explode, pick a part, slow time); the others show their
  facts until their CAD file is bought.
- Readers move between the story, the lab and the facts; they read long Persian prose about mechanisms.

## Capabilities and Constraints

- Persian, right to left, throughout. Latin only for brand, model and calibre names.
- Fonts and assets are self-hosted: Google Fonts and other foreign hosts are unreliable from inside Iran.
- Light and dark themes, following the system until the visitor chooses.
- Respects reduced motion everywhere.
- Next.js + shadcn/ui (RTL) + Tailwind v4; motion and Lenis on the home page; three.js / R3F in the lab.
- The 3D lab only shows a real calibre from real CAD; families without a model say so honestly.
- No commerce: no prices, carts or buy buttons.

## Brand Commitments

- Name: Kronos / کرونوس, "دانشنامهٔ فارسی ساعت".
- The owner's bar is luxury watchmaking itself (Rolex, Cartier, Patek): the site must feel as made as the object.
- The owner replaced the earlier canon luxury-watch look (and the oryzo.ai scroll feel before it) on 2026-10-25
  with the look of their reference repository `hadijawaheri/horologium-atlas`, played straight: a museum-grade
  light encyclopedia. Alabaster ground with white plates and cool grey 1px rules; a refined garalde serif for titles
  with a precise sans and a monospace for data, references and measurements; square corners; ruled spec grids,
  small tags, data tables, tabs; a sticky header with an omni-search and a category row; one rose-gold accent. A
  graphite night version keeps the dark theme. No shop, configurator or checkout: the site is a reference.

## Evidence on Hand

- `public/media/movement-film/{lg,sm}/001-240.webp`: 240 frames of the owner's film of the automatic coming apart.
- `public/media/movement-photos/`: caseback side, dial side, balance close-up.
- `public/media/movement-cutout/`: caseback and dial cut-outs of the same movement.
- `src/features/movement/calibres.ts`: verified facts, specs and real watches for the four families.
- No testimonials, press, user counts or reviews exist yet; none may be invented.

## Product Principles

1. The real thing, or nothing: show the actual movement, never an illustration passed off as one.
2. Explain the mechanism, not the price: every surface should leave the reader understanding something.
3. Persian first: written and set for Persian readers, not translated afterwards.
4. Made like the object: the craft of the page answers to the craft of the watch.

## Accessibility & Inclusion

WCAG AA contrast in both themes, keyboard access, reduced-motion alternatives for every scroll effect, no
letter-spacing on Persian text.
