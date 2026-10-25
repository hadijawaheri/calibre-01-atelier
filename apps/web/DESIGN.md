---
name: Kronos
description: A Persian atlas of horology, set like a museum reference where the data leads and the real movement is the evidence.
colors:
  alabaster: "oklch(0.986 0.002 106)"
  plate-white: "oklch(1 0 0)"
  graphite-ink: "oklch(0.2 0.005 90)"
  mist: "oklch(0.966 0.002 106)"
  mist-deep: "oklch(0.955 0.003 106)"
  slate-text: "oklch(0.48 0.006 90)"
  hairline: "oklch(0.913 0.002 106)"
  input-rule: "oklch(0.87 0.003 106)"
  rose-gold: "oklch(0.62 0.09 50)"
  rose-gold-ink: "oklch(0.5 0.1 45)"
  signal-red: "oklch(0.52 0.19 27)"
  verdigris: "oklch(0.48 0.1 150)"
  graphite-night: "oklch(0.215 0.004 255)"
  night-plate: "oklch(0.25 0.004 255)"
  night-mist: "oklch(0.235 0.004 255)"
  night-mist-deep: "oklch(0.27 0.004 255)"
  night-ink: "oklch(0.95 0.003 100)"
  night-slate-text: "oklch(0.74 0.005 255)"
  night-hairline: "oklch(1 0 0 / 11%)"
  night-input-rule: "oklch(1 0 0 / 18%)"
  rose-gold-night: "oklch(0.76 0.08 55)"
  rose-gold-ink-night: "oklch(0.8 0.07 60)"
  signal-red-night: "oklch(0.68 0.17 25)"
  verdigris-night: "oklch(0.74 0.12 155)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Amiri, IBM Plex Sans Arabic, serif"
    fontSize: "clamp(2.375rem, 1.6rem + 2.6vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Cormorant Garamond, Amiri, IBM Plex Sans Arabic, serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1vw, 2.375rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  headline:
    fontFamily: "Cormorant Garamond, Amiri, IBM Plex Sans Arabic, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.375
  body-lead:
    fontFamily: "IBM Plex Sans, IBM Plex Sans Arabic, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 2
  body:
    fontFamily: "IBM Plex Sans, IBM Plex Sans Arabic, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 2
  body-sm:
    fontFamily: "IBM Plex Sans, IBM Plex Sans Arabic, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "IBM Plex Sans, IBM Plex Sans Arabic, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
  caps:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.16em"
  data:
    fontFamily: "IBM Plex Mono, IBM Plex Sans Arabic, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  gutter: "1rem"
  gutter-sm: "1.5rem"
  cell: "1rem"
  plate-pad: "1.25rem"
  entry-pad: "2rem"
  section-y: "5rem"
  section-y-lg: "7rem"
  container: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.alabaster}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-outline-hover:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.alabaster}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.none}"
    size: "2.25rem"
  plate:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.none}"
  plate-caption:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.body-sm}"
    padding: "0.75rem 1rem"
  plate-number:
    textColor: "{colors.slate-text}"
    typography: "{typography.caps}"
  spec-cell:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.body-sm}"
    padding: "1rem"
  tag:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.slate-text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.125rem 0.5rem"
  tag-ink:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.125rem 0.5rem"
  search-input:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    height: "2.5rem"
  tab:
    textColor: "{colors.slate-text}"
    typography: "{typography.body-sm}"
    padding: "0.75rem 0.5rem"
  tab-active:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.graphite-ink}"
  popover:
    backgroundColor: "{colors.plate-white}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.none}"
---

# Design System: Kronos

## Overview

**Creative North Star: "The Atlas of Horology"**

Kronos is set as a museum reference, not a product page. The data leads: a page opens on titles, standfirsts, ruled spec grids and a working dossier, and the photographs and the film arrive as numbered plates mounted in the same ruled frame as the facts. Everything sits on an alabaster ground; every container is a white plate with a 1px cool-grey rule; corners are square throughout. Depth comes from rules and the step between ground and plate, almost never from shadow.

Two scripts share one voice. Titles are set in Cormorant Garamond for Latin and Amiri for Persian, a garalde and a classical Naskh with real thick and thin strokes. Running text is IBM Plex Sans with its Arabic-script cut, Plex Sans Arabic. Latin references, calibre numbers, figure numbers and measurements are set in Plex Mono, in small tracked capitals when they act as a reference line. Persian is never tracked or uppercased. One colour, rose gold, marks what is live: the active tab, the current chapter, a highlighted wheel, a tolerance band. A graphite night theme keeps the same structure with paler rose gold.

The density is that of a reference work: generous leading for Persian prose, tight ruled grids for data, a single 80rem container. This world replaces the earlier cinematic black-and-gold look; it does not borrow from it.

**Key Characteristics:**

- Alabaster ground, white plates, 1px cool-grey hairlines, graphite ink.
- Square corners everywhere (radius 0).
- Ruled grids whose 1px gaps are the rules.
- Numbered plates for every photograph, drawing, chart and film, with a caption bar beneath.
- Garalde and Naskh titles, Plex Sans text, Plex Mono caps for Latin references and data.
- Rose gold only as a line, bar, marker or active-tab rule.

## Colors

A near-colourless atlas: warm-neutral paper and plates, graphite ink, and a single rose-gold accent that is never a fill for text-bearing surfaces.

### Primary

- **Rose Gold** (rose-gold; night: rose-gold-night): the one colour. Used only as lines, bars and markers: the 1px rule under the active dossier tab, the active chapter bar of the film, the balance wheel in the gear plan, the tock trace and 12% tolerance band of the timegrapher, the caret, the text selection tint, single 1.25-stroke status icons, and the focus ring of form controls.
- **Rose Gold Ink** (rose-gold-ink; night: rose-gold-ink-night): the darker cut that carries small text at about 5:1: a part's role line in the lab, the counted step numbers in long explanations, the selected part in a list, link hover.

### Neutral

- **Alabaster** (alabaster; night: graphite-night): the page ground.
- **Plate White** (plate-white; night: night-plate): every plate, spec cell, tag, search field and popover.
- **Graphite Ink** (graphite-ink; night: night-ink): text, primary buttons, outline-button borders, the current nav underline, chart traces.
- **Mist** (mist; night: night-mist): the active tab cell, image wells before load, table heads (at 60%), banded sections (at 50%), the footer (at 60%), hovered rows.
- **Mist Deep** (mist-deep; night: night-mist-deep): the accent surface of shadcn primitives.
- **Slate Text** (slate-text; night: night-slate-text): standfirsts, body copy beside titles, labels, captions' numbers.
- **Hairline** (hairline; night: night-hairline): every rule, plate border and grid gap.
- **Input Rule** (input-rule; night: night-input-rule): the resting border of fields; focus turns it graphite.

### Status

- **Signal Red** (signal-red / signal-red-night) and **Verdigris** (verdigris / verdigris-night): destructive and success states only.

### Named Rules

**The One Metal Rule.** Rose gold is a line, a bar, a marker or the active tab's rule. It never fills a button, a plate or a section, and small text in rose gold always uses rose-gold-ink.

**The Graphite Action Rule.** The primary action is graphite ink on alabaster, not rose gold. Emphasis comes from weight of ink, not hue.

## Typography

**Display Font:** Cormorant Garamond (Latin), Amiri (Persian), falling back to IBM Plex Sans Arabic, serif
**Body Font:** IBM Plex Sans (Latin) with IBM Plex Sans Arabic (Persian)
**Label/Mono Font:** IBM Plex Mono

**Character:** A classical serif pair for titles, one per script, over a precise humanist sans; the mono is the atlas's instrument voice for references and measurements. All faces are self-hosted.

### Hierarchy

- **Display** (500, clamp 2.375rem to 3.75rem, 1.25, word-spacing -0.1em, balanced): page titles and the main title of each home section. The Amiri word space is tightened because its default opens holes at display size.
- **Title** (500, clamp 1.75rem to 2.375rem, 1.3, word-spacing -0.1em): section titles one step down, the film's chapter titles, calibre names in the dossier, article section heads.
- **Headline** (400, 1.5rem to 1.75rem, snug): entry titles inside plates and grids (feature entries, family names, part names).
- **Body Lead** (400, 1.125rem, line-height 2.25rem): the standfirst under a hero title.
- **Body** (400, 1rem, line-height 2rem): running Persian prose, held to a 60 to 68ch measure.
- **Body Small** (400, 0.875rem, line-height 1.75rem): captions, table cells, short plate text, buttons, nav.
- **Label** (400, 0.75rem, 1.6, slate, untracked): Persian field labels, table heads, footer column heads.
- **Caps** (Plex Mono 400, 0.6875rem, 0.16em tracking, uppercase): Latin reference lines under titles, plate numbers, plate-head references, the footer imprint, error codes.
- **Data** (Plex Mono 400, 0.75rem to 1rem, tabular figures): Latin values and calibre references in lists and tables, set left to right.

### Named Rules

**The Untracked Persian Rule.** Persian is never letter-spaced and never uppercased; tracking breaks its joins. Caps is reserved for Latin.

**The Reference Line Rule.** A Latin reference (calibre number, figure number, "Error 404") sits below or beside its Persian title in caps, never above it. There are no eyebrows or kickers over headings.

**The Mono Measures Rule.** Numbers that are measured or compared (vph, hours, jewels, s/d, teeth) are set in the mono or with tabular figures, so columns align.

## Layout

One centred container (80rem) with a 1rem gutter, 1.5rem from 40rem up. Home sections breathe at 5rem vertical padding, 7rem from 64rem; page bodies at 3.5rem and 5rem. Breakpoints are 40rem, 48rem (header switches from search row to category row; header height 7.25rem to 6.5rem) and 64rem (split layouts engage).

Split layouts pair a text column with a plate: a flexible column against a 22 to 32rem plate, or near-equal columns (1 : 1.1 to 1.15) for statement and figure pairs. Section heads are a title on the start side and a short slate note on the end side, ruled off below with 1.5rem padding. Data is set in ruled grids (gap 1px over a hairline background) of 2 to 4 columns; tables become stacked ruled entries below 48rem.

Scroll stages (the film, the plate gallery) pin a full-height panel below the sticky header and translate scroll into frame or plate progress; reduced motion must get a still equivalent.

### Long reading (articles)

Articles use one text column held to 68ch (body, 2rem leading) with headings in Title, ruled off below (1rem padding). Ordered explanations count their steps in a small square ruled box with rose-gold-ink Persian numerals, because order is the mechanism. Figures may break out of the measure up to the container width; captions stay with their figure. Asides (specs, cross-references) sit in a 26rem side column from 64rem and fall below the text on phones. Breadcrumbs are a single slate small line with a slash separator.

### Named Rules

**The Measure Rule.** Persian prose never runs wider than 68ch, at line-height 2.

## Elevation & Depth

Flat by construction. Depth is the step from alabaster ground to white plate plus a 1px hairline; banded sections use mist at 50%. Only floating layers get a resting shadow.

### Shadow Vocabulary

- **Popover** (`box-shadow: 0 12px 30px -16px oklch(0.2 0.005 90 / 0.25)`; night `0 16px 36px -18px oklch(0 0 0 / 0.7)`): search results and other popovers, menus and listboxes. The token is named plate-shadow in source; it is not for plates.
- **Object** (`filter: drop-shadow(0 18px 22px oklch(0.2 0.005 90 / 0.18))`; night `0 24px 30px oklch(0 0 0 / 0.55)`): only the cut-out photographed movement resting on its white mat.

### Named Rules

**The Ruled Not Raised Rule.** Plates, cards, tables and figures carry no shadow at rest. A resting shadow means the layer floats above the page.

## Shapes

Square everywhere: radius 0 on buttons, fields, tags, tabs, plates, sheets and popovers (every shadcn radius step resolves to 0). Form comes from 1px rules: plate borders, rules between rows, the 1px gaps of spec grids, a 1px underline for the current nav item and the active tab. Step counters and tags are small ruled boxes. Drawings use thin non-scaling strokes (1 to 1.25px) with dashed centre lines.

## Components

### Buttons

Quiet and exact; ink, not colour.

- **Shape:** square (0px).
- **Primary:** graphite fill, alabaster text, Body Small regular; large 2.75rem tall with 1.5rem inline padding, default 2.25rem.
- **Outline:** 1px graphite border, transparent; inverts to graphite fill with alabaster text on hover.
- **Ghost:** text at 75% ink, full ink on hover; used for icon buttons (theme toggle, menu).
- **Hover / Focus:** colour transitions 300ms on the glide curve (cubic-bezier(0.16, 1, 0.3, 1)); focus ring 3px rose gold at 50%. Pair a primary with an outline; never two primaries.

### Tags

- **Style:** white, 1px hairline, 0.125rem by 0.5rem, Persian in 0.75rem slate; Latin tags in caps at 0.625rem. Ink tone marks a positive state ("آماده").

### Plates (Cards / Containers)

- **Corner Style:** square.
- **Background:** plate white on alabaster or mist bands.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px hairline; inner divisions are hairline rules or 1px grid gaps.
- **Internal Padding:** 1rem cells, 1.25 to 1.5rem panels, 2rem entries.
- **Plate head:** optional top bar with the Persian name on the start side and a caps Latin reference on the end side, ruled off below.

### Spec Grid

A definition list in a ruled grid: each cell a Label over a Body Small value (Latin values in the mono, left to right). An odd last cell spans the row.

### Figure Plates, captions and numbering

Every photograph, drawing, chart and film is a plate: image well (mist until loaded, object-cover), then a caption bar ruled off above, 0.75rem by 1rem, with the Persian caption on the start side and the plate number in caps slate on the end side, left to right, never wrapping. Use the shared FigurePlate for photographs.

- **Numbering:** "Fig. n" for single figures, counted in order through a page or article ("Fig. 1 · Caseback"); "Pl. 01" (two digits) for plates in a sequence or gallery. A short Latin descriptor may follow after a middle dot.
- **Aspect:** 4:3 default, 4:5 for gallery plates, 16:9 for film; let the photograph keep its true proportion rather than cropping into the subject.
- **Alt and caption:** alt describes what is visible; the caption names it. Credit and provenance go in the caption bar, not over the image.
- **Long-form galleries:** a row of plates with 1px gaps or a scroll strip; the plate nearest centre may come forward (scale 0.9 to 1, only the photograph dims, captions stay legible).
- **Notes under a figure:** a second ruled bar in Label size and slate, for honesty notes ("demonstration data, not a measurement").

### Film Plate (video)

The film is a figure plate at 16:9, capped at 42dvh on phones. Its caption bar counts in caps: "Frame 001 / 240" for scroll-scrubbed films; for played video use a timecode in the same place ("00:42 / 03:10"). The first frame or a poster paints with the page. Controls belong in or under the caption bar as ghost icon buttons, square, never floating over the picture. Video never autoplays with sound; under reduced motion a scrubbed film shows still frames and played video waits for the reader. Chapter progress is a row of 2px bars (vertical markers from 64rem), the current one rose gold.

### Inputs / Fields

- **Style:** white field, 1px input rule, square, 2.5rem tall, inline icon 1rem at the start.
- **Focus:** the border turns graphite; no glow.
- **Popover list:** white, hairline, popover shadow; rows ruled, the active row mist; Latin names in data mono on the end side.

### Navigation

Sticky two-row header on alabaster at 92% with backdrop blur, ruled below. Row one: wordmark (KRONOS in Cormorant, 0.3em tracked Latin, with the Persian tagline beneath in 0.6875rem), omni-search, theme toggle. Row two from 48rem: the category row in Body Small slate, current item in ink with a 1px ink underline, a short vertical hairline between sections and families; on phones the search takes row two and the categories move to a right-side sheet of ruled rows. Footer: mist band, three columns (wordmark and note, sections, families) with Label heads, an imprint line in caps.

### Tabs (Calibre Dossier)

Equal-width tab cells separated by hairlines; inactive slate, hover ink; active cell in mist with a 1px rose-gold rule along its bottom edge.

### Data Tables

Inside a plate: head row in mist at 60% with Label headings; rows ruled, hovered row mist at 50%; first column a headline-size name with a data-mono reference beneath. Below 48rem, each row becomes a plate with a 2-column ruled grid.

## Do's and Don'ts

### Do:

- **Do** mount every photograph, chart, drawing and film in a plate with a ruled caption bar and a caps plate number ("Fig. 1 · Caseback", "Pl. 01", "Frame 001 / 240").
- **Do** set Latin references, calibre numbers and figure numbers in Plex Mono caps (0.6875rem, 0.16em), left to right, aligned to the end side.
- **Do** keep Persian prose to 68ch at line-height 2.
- **Do** use rose-gold-ink, not rose gold, for any small text that needs the accent.
- **Do** build data as ruled grids whose 1px gaps are the rules.
- **Do** give every scroll-driven stage a still, readable reduced-motion equivalent.

### Don't:

- **Don't** put eyebrows or kickers above headings; references go beneath or beside the title.
- **Don't** letter-space or uppercase Persian.
- **Don't** fill buttons, plates or sections with rose gold, or set small text in it.
- **Don't** give plates, cards, tables or figures a resting shadow; resting shadows belong to popovers only (and the drop shadow under the cut-out movement).
- **Don't** round corners.
- **Don't** float video controls or captions over the picture.
- **Don't** return to the cinematic black-and-gold product-page look this atlas replaced.
