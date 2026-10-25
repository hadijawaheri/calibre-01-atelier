---
version: 1
slug: "src-app-site-page-tsx"
primary_target: "src/app/(site)/page.tsx"
related_targets:
  [
    "src/components/layout/site-shell.tsx",
    "src/features/movement/components/calibre-page.tsx",
    "src/app/(site)/lab/page.tsx",
    "src/app/not-found.tsx",
  ]
---

# Home and site shell

Scope: the home page (Persuade), with the shell (header with search, footer), the lab index and calibre pages,
and 404 inheriting the same world. Visitor: a Persian watch lover, mostly on a phone. Job: understand what a real
movement does, compare the four families, and go into the lab. Action: "ورود به آزمایشگاه", and the header search.
Proof: the owner's film, photographs and cut-outs of one real Swiss automatic, the real CAD lab, the sourced facts in
calibres.ts. Constraints: Persian RTL, both themes, reduced motion, no shop, no invented ratings or reviews.

Memorable moment: the calibre dossier in the first viewport, a working tabbed record of the four families beside
the title, and the film scrubbing frame by frame inside its numbered plate.

Unresolved: the reference's watch, brand, complication and community pages are out for now (owner's choice,
2026-10-25); they come later with sourced facts.

## Direction contract

THESIS: the owner's reference, horologium-atlas, played straight: the site is an atlas of horology, a museum
reference where the data leads. Refuses the cinematic black-and-gold product page it replaces.

OWN-WORLD: alabaster ground (#FBFBFA), white plates, #E5E5E3 hairlines, graphite ink; rose gold only for markers,
bars and the active tab. Cormorant Garamond (Latin) and Amiri (Persian) for titles, IBM Plex Sans and Plex Sans
Arabic for text, Plex Mono in tracked capitals for Latin references and data. Square corners, ruled spec grids
whose gaps are the rules, small ruled tags, data tables, numbered figure plates. Graphite night theme.

STORY: the visitor reads the title, opens the dossier of a family, sees the real movement, watches it come apart,
reads four short entries, studies the plates, the timegrapher and the gear plan, compares the families in the
table, and enters the lab.

FIRST VIEWPORT: split: Persian display title, standfirst, primary and outline buttons and a mono facts row on the
start side; the calibre dossier plate (tabs, specs, watches, link to the full dossier) on the end side. Sticky
two-row header: wordmark, omni-search, theme toggle; the category row of sections and families.

FORM: the owner's pinned reference repository (the brief wins); seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md,
and every shipping raster carrying its provenance
