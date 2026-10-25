# 0009. The horologium atlas redesign: a museum reference where the data leads

Status: accepted (supersedes 0008)

On 2026-10-25 the owner asked for a fundamental redesign built on his reference repository
`hadijawaheri/horologium-atlas`, a light, museum-grade horology encyclopedia. The canon black-and-gold look of
ADR 0008 is replaced. The direction contract lives in `apps/web/.impeccable/surfaces/src-app-site-page-tsx.md`;
DESIGN.md records the resulting system.

Decisions:

- **Palette:** alabaster ground, white plates, cool grey 1px rules, graphite ink. Rose gold (`--metal`) is the one
  colour, used for lines, bars, markers and the active tab; `--metal-ink` carries small text at AA. A neutral graphite
  night theme keeps the dark mode.
- **Fonts, self-hosted** (Google Fonts is unreliable from Iran): Cormorant Garamond for Latin titles with Amiri as its
  Persian counterpart; IBM Plex Sans with IBM Plex Sans Arabic for text, so both scripts share one family; IBM Plex
  Mono in tracked capitals for Latin references and data only. Bodoni Moda, Jost and Vazirmatn are gone.
- **Atlas kit** (`src/components/atlas`): page header, ruled spec grids whose gaps are the rules, small tags,
  numbered figure plates. Data tables for comparisons.
- **Header:** sticky in the flow (no longer fixed and hiding), with an omni-search over families, watches and parts,
  built on the server from the same data the pages show, and a category row of sections and families. The custom
  cursor and the Lenis smooth scrolling are removed: an encyclopedia is read, not glided through.
- **Home:** an atlas hub. A tabbed calibre dossier beside the title in the first viewport; the film keeps its scroll
  scrub inside a numbered plate; explainers, plates, timegrapher, a real gear plan with its tooth table, and the
  families table.
- **Not copied from the reference:** eyebrow labels above headings (the context moved to reference lines and
  captions); ratings, reviews, prices and value curves (invented data; PRODUCT.md forbids invented claims); the
  watch, brand, complication and community pages (owner's choice: later, with sourced facts); letter-spacing or
  capitals on Persian.
