---
name: Kronos
description: A Persian watch encyclopedia set like a museum vitrine, with one real movement in an empty, rim-lit room.
colors:
  ivory: "oklch(0.965 0.009 85)"
  ivory-popover: "oklch(0.975 0.008 85)"
  ink: "oklch(0.17 0.006 70)"
  stone: "oklch(0.925 0.014 80)"
  stone-ink-muted: "oklch(0.46 0.014 70)"
  bronze: "oklch(0.5 0.07 65)"
  ink-rule: "oklch(0.17 0.006 70 / 12%)"
  ink-input: "oklch(0.17 0.006 70 / 22%)"
  oxide-red: "oklch(0.5 0.17 27)"
  verdigris: "oklch(0.48 0.1 150)"
  matte-black: "oklch(0.13 0.003 80)"
  charcoal-popover: "oklch(0.17 0.004 80)"
  charcoal: "oklch(0.175 0.004 80)"
  charcoal-raised: "oklch(0.2 0.005 80)"
  warm-ivory-text: "oklch(0.93 0.012 85)"
  ash-muted: "oklch(0.7 0.014 80)"
  pale-gold: "oklch(0.8 0.06 85)"
  white-rule: "oklch(1 0 0 / 9%)"
  white-input: "oklch(1 0 0 / 16%)"
  oxide-red-night: "oklch(0.66 0.17 25)"
  verdigris-night: "oklch(0.74 0.12 155)"
typography:
  display:
    fontFamily: "Bodoni Moda, Amiri, Vazirmatn, serif"
    fontSize: "clamp(2.5rem, 1.5rem + 3.6vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
  title:
    fontFamily: "Bodoni Moda, Amiri, Vazirmatn, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  title-sm:
    fontFamily: "Bodoni Moda, Amiri, Vazirmatn, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.333
    letterSpacing: "normal"
  body:
    fontFamily: "Jost, Vazirmatn, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 2
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Jost, Vazirmatn, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Jost, Vazirmatn, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.333
    letterSpacing: "normal"
  caps:
    fontFamily: "Jost, ui-sans-serif, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.28em"
  wordmark:
    fontFamily: "Bodoni Moda, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.45em"
rounded:
  none: "0px"
  ring: "9999px"
spacing:
  gutter: "16px"
  gutter-wide: "32px"
  caption-gap: "12px"
  stack-tight: "16px"
  stack: "24px"
  block: "64px"
  section: "96px"
  section-wide: "192px"
  container: "80rem"
  measure: "65ch"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "48px"
  button-primary-night:
    backgroundColor: "{colors.warm-ivory-text}"
    textColor: "{colors.matte-black}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "36px"
  nav-link:
    textColor: "{colors.stone-ink-muted}"
    typography: "{typography.label}"
  ledger-row:
    backgroundColor: "transparent"
    padding: "32px 0"
  ledger-row-hover:
    backgroundColor: "{colors.stone}"
  media-plate:
    backgroundColor: "{colors.stone}"
    rounded: "{rounded.none}"
  cursor-ring:
    rounded: "{rounded.ring}"
    size: "32px"
---

# Design System: Kronos

## Overview

**Creative North Star: "The Empty Vitrine"**

Kronos is set like a museum case at night: one real movement hangs in soft rim light in the middle of a large, quiet room, and everything else on the page stays out of its way. The room is deep monochrome, ivory and stone by day and matte black and charcoal by night. Metal appears only where a watch house would engrave: a hairline, a small caption, an icon. There are no cards, no chips and no badges. Structure comes from 1px rules and from empty space.

The page is Persian and right to left. Persian display is set in Amiri, a classical Naskh with real thick and thin strokes, as the counterpart of the Latin didone, Bodoni Moda. Text is Vazirmatn for Persian and Jost for Latin. Latin names, references and credits are the only words that ever carry tracked capitals. Each page keeps one display size. Paragraphs are short and widely leaded, and long reading keeps a 65ch measure.

Motion is inertial and slow. Colour and state changes take 500ms on a long glide curve. The header slips away as you read and comes back when you scroll up. Gallery plates sharpen into focus as their neighbours blur, and a small ring cursor follows the pointer with spring lag and names what a drag or click will do. Every scroll effect has a still alternative when reduced motion is requested.

**Key Characteristics:**

- Deep monochrome room in two themes; bronze (light) or pale gold (dark) metal only as line, small type and icon.
- Square corners everywhere; 1px rules, metal-tinted for section heads and captions.
- One filled control, the primary button, in ink on ivory (or ivory on black).
- One display size per page; titles drop to the display face at 1.875rem or 1.5rem.
- Depth comes from the object: drop shadows and rim light belong to the cut-out movement, never to UI surfaces.
- Generous vertical rhythm (sections of 96 to 192px) inside an 80rem centred container.

## Colors

A warm deep monochrome with one metal, which changes alloy with the theme.

### Primary

- **Ink** (`ink`): the light theme's text and the fill of the one primary button. Ivory text on ink is the site's only filled control.
- **Warm Ivory Text** (`warm-ivory-text`): the dark theme's text and the fill of its primary button.

### Secondary

- **Bronze** (`bronze`, light) / **Pale Gold** (`pale-gold`, dark): the metal (`--metal`). Used for hairlines (mixed to 45% through the `hairline` utility), the footer's 16-unit rule (50%), counted numerals in long reading, the role line of a selected part, the active chapter bar under the film, selected Latin part names, icons such as the energy bolt and hovered arrows, the focus outline (1px, offset 3px), the text caret, and text selection (30% mix). Bronze reads at 5.5:1 on ivory. It is never a fill, a background or display type.

### Tertiary

- **Oxide Red** (`oxide-red` / `oxide-red-night`): destructive and error only.
- **Verdigris** (`verdigris` / `verdigris-night`): success only.

### Neutral

- **Ivory** (`ivory`): light page and card background; also the 3D room's light backdrop (`#f6f3ed`).
- **Ivory Popover** (`ivory-popover`): sheets and popovers, one step lifted.
- **Stone** (`stone`): `--surface`, `--muted`, `--secondary`, `--accent` in light. Media plates are stone before the image arrives, and ledger rows tint to stone at 60% on hover.
- **Stone Ink Muted** (`stone-ink-muted`): secondary text, nav links, captions and labels.
- **Ink Rule** (`ink-rule`) / **Ink Input** (`ink-input`): plain 1px dividers (12%) and field strokes (22%).
- **Matte Black** (`matte-black`): dark page background; the 3D night room (`#080706`).
- **Charcoal** (`charcoal`), **Charcoal Popover** (`charcoal-popover`), **Charcoal Raised** (`charcoal-raised`): dark surface, popover and accent steps.
- **Ash Muted** (`ash-muted`): dark secondary text.
- **White Rule** (`white-rule`) / **White Input** (`white-input`): dark dividers (9%) and field strokes (16%).

### Named Rules

**The Metal Is a Line Rule.** `--metal` draws lines, small type (0.875rem and below) and icons. It never fills a shape, sets a background or colours display type.

**The One Filled Control Rule.** Only the primary button is filled, in ink (or ivory at night). Every other control is text, an outline or a rule. The outline button fills only as its hover state.

**The Same Room Rule.** Any 3D stage's background is the page's own ivory or matte black, so the stage reads as the same room. Studio light colours inside the scene are physical materials and sit outside the token system.

## Typography

**Display Font:** Bodoni Moda (Latin) and Amiri 400 (Persian), with Vazirmatn and serif as fallbacks
**Body Font:** Jost (Latin) and Vazirmatn (Persian), with ui-sans-serif and system-ui
**Label Font:** Jost, in tracked capitals, for Latin only (`caps`)

**Character:** A high-contrast didone and a classical Naskh share the display voice and carry the thick-and-thin of engraved metal. The geometric sans and Vazirmatn are calm and even beneath them. All fonts are self-hosted.

### Hierarchy

- **Display** (400, `clamp(2.5rem, 1.5rem + 3.6vw, 4.75rem)`, 1.35, word-spacing -0.02em, balanced wrap): the `display` utility. Page titles and the heading of each home chapter. One size, used on every page; width is held by a ch cap (12ch to 22ch) rather than a smaller size.
- **Title** (400, 1.875rem): the display face for the names of calibres in ledgers and the lab, the mobile menu title, and the one statement inside a status plate.
- **Title Small** (400, 1.5rem): the selected part's name and its key figure in the lab panel.
- **Body** (400, 1rem, line-height 2): all running prose, muted next to display and at 85% foreground in long reading. Intro lines are capped at 20 to 28rem.
- **Body Small** (400, 0.875rem, 1.75): panel prose, spec rows, notes under watches, button text, footer statement.
- **Label** (400, 0.75rem): Persian section heads over a hairline, ledger column heads, nav links, chapter names under the film. Muted, never tracked.
- **Caps** (400, 0.6875rem, 0.28em, uppercase, 1.6): Latin calibre references, brand and model names, corner captions, plate indexes, measurements. Always `dir="ltr"`.
- **Wordmark** (Bodoni Moda 400, 1.25rem, 0.45em): KRONOS, centred, with the Persian "دانشنامهٔ ساعت" at 10px beneath, untracked.

### Named Rules

**The One Display Size Rule.** A page has one display size, the `display` utility. A smaller heading is Title or Title Small in the same face, never a new step of the display clamp.

**The Untracked Persian Rule.** Persian is never letter-spaced, in any size or weight: tracking breaks the joins of the script. Tracked capitals are for Latin words only.

**The Counted Numerals Rule.** Figures that are indexes or measurements use tabular numerals; Persian ordinals in long reading are set at 0.75rem in the metal.

## Layout

A centred, museum-symmetric grid. The page container is 80rem (`max-w-7xl`) with 16px gutters, 32px from 640px. Long-form pages narrow to 72rem; the 404 to 36rem. The header is a three-column grid (links, centred wordmark, theme toggle) 64px tall; the footer stacks centred with 40px gaps and 96px vertical padding.

Vertical rhythm is generous. Home chapters are tall scroll tracks (130dvh to 520vh) with a sticky full-height stage; static sections use 192px block padding, and long-form pages 96 to 128px top padding. Inside sections, 64 to 96px separates blocks, 24px separates a section head from its content, 24px separates long-reading paragraphs, and 12 to 16px separates a caption from its plate.

Hero and finale are centred symmetrically, with the object in the optical centre and the action at bottom centre between two Latin corner captions (hidden under 640px). The calibre profile places long reading beside a 22rem aside of specs from 1024px. The lab gives the stage the full width minus a 400px control panel on a start-side rule, and stacks below 1024px.

### Derived rules for future surfaces (not yet shipped)

Articles, figures and video do not exist yet. These rules follow from the built system and apply when those templates are made:

- **Article body:** the long-reading measure from the calibre facts: a 65ch column, 1rem Vazirmatn at line-height 2, text at 85% foreground, 24px between paragraphs. Section heads are Persian Label (0.75rem, muted) over a hairline rule with 16px below the text. Article titles take the page's one display size. Counted steps take Persian ordinals in the metal.
- **Figure:** a framed media plate. The image sits in a square-cornered box with a fixed aspect ratio, stone behind it while it loads, cropped by `object-cover`. Beneath it is a figcaption on a hairline top rule with 12px above the text. The Persian caption is in body at the start; the Latin credit, source or index is in `caps`, muted, `dir="ltr"`, tabular, at the end, aligned on the baseline.
- **Video:** the same plate at 16:9. The first frame or a poster paints with the page. Chapter markers, if any, are 1px bars (rule colour, metal when active) with Label text beneath. Captions and credits follow the figure rule. Under reduced motion nothing autoplays or scrubs.
- **Full-bleed media:** cut-out objects keep their drop shadow on the rim-light glow; photographs never get a shadow, a border radius or a frame thicker than a hairline.

## Elevation & Depth

UI surfaces are flat: no box shadows on buttons, rows, panels or plates. Depth belongs to the object and the light. The cut-out movement carries a soft drop shadow and sits on a radial rim-light glow (an ellipse of 55% by 50%, white at 95% in light, warm grey at 55% in dark, fading by 70%). The frosted header (55% background, 24px blur, 150% saturation) is the only translucent layer. The gallery adds depth of field: plates away from the centre scale to 0.78, dim to 50% and blur 6px.

### Shadow Vocabulary

- **Object** (`--object-shadow`: `0 30px 40px oklch(0.25 0.02 60 / 0.22)` light, `0 40px 60px oklch(0 0 0 / 0.6)` dark): cut-out movements resting in the page, applied as a `drop-shadow` filter.
- **Object Hero** (`--object-shadow-hero`: `0 40px 56px oklch(0.25 0.02 60 / 0.26)` light, `0 50px 70px oklch(0 0 0 / 0.65)` dark): the first-viewport cut-out only.
- **Contact** (`--object-contact`): the ground shadow under the travelling movement, squashed as it turns.

### Named Rules

**The Object Casts the Only Shadow Rule.** Soft offset shadows belong to cut-out physical objects. Interface elements stay flat and are separated by rules and space.

## Shapes

Every corner is square (`--radius: 0`, all radius steps mapped to it). Form comes from 1px lines: hairlines in the metal at 45% for section heads, captions, status plates and the lab's detail panel; plain rules (12% ink or 9% white) between ledger and spec rows and on the lab panel's start side. The only round shapes are the cursor ring and dot and the loading disc, which are lenses rather than containers.

### Named Rules

**The Square Corner Rule.** No radius on any box, button, field, image or sheet. A circle is allowed only for a pointer or loading lens.

## Components

### Buttons

Restrained and engraved: the fill is rare and the text is small.

- **Shape:** square (0px). Large is 48px tall with 32px inline padding; default is 36px.
- **Primary:** ink fill, ivory text (inverted at night), 0.875rem regular. Hover softens the fill to 85%. It carries "ورود به آزمایشگاه" and the 404's main way out.
- **Outline:** transparent with a 1px border at 25% foreground; on hover it fills to foreground with background text.
- **Ghost:** 75% foreground text, rising to full on hover; used for the theme toggle (Lucide Sun and Moon at 16px).
- **Hover / Focus:** colour transitions take 500ms on `ease-glide`. Focus is the global 1px metal outline offset 3px.

### Ledger Rows

The collector's catalogue in place of cards.

- **Style:** one row per item on a 12% rule, the column heads in Label over a hairline. The name is in Title; the values are in body at 85%.
- **State:** hover and focus tint the row to stone at 60%; the trailing directional arrow turns to the metal and nudges 4px toward reading direction.
- **Spec rows:** 0.875rem, label muted at the start, value at the end, 12px block padding.

### Media Plate (gallery)

- **Style:** a 4:5 square-cornered plate, stone underneath, `object-cover`. The figcaption sits on a hairline top rule with 12px above: Persian caption at the start, Latin `NN / NN` index in `caps` at the end.
- **Behaviour:** on a horizontal scroll track the centred plate is sharp at full scale; neighbours dim, blur and shrink. Only the image blurs; the caption stays legible.

### Film Plate

- **Style:** an unframed 16:9 stage on wide screens (46dvh full-width on phones), scrubbed by scroll from the owner's frames, first frame painted with the page. Under it is a row of chapter bars: 1px rules that turn metal for the active chapter, with Label names beneath.

### Status Plate

- **Style:** a full-width 16:9 (4:5 on phones) block between hairline top and bottom rules, rim light behind, centred Title statement, body text and one outline action. Used where the real 3D model is not ready.

### Inputs / Controls (lab)

- **Style:** shadcn RTL slider, switch and toggle group on square corners, with 22% ink (16% white) strokes; labels in Body Small, values in tabular Label. Part lists are text buttons: Persian name at the start, Latin name in `caps` at the end, metal when selected.

### Navigation

- **Header:** fixed and frosted with a 60% rule beneath; centred wordmark; two Label links in muted text that brighten over 500ms; theme toggle at the end. It hides (fades, lifts 16px over 700ms) on scrolling down past 120px and returns on scrolling up or on keyboard focus. Below 1024px the links move into a sheet with a Title heading.
- **Footer:** centred wordmark, a short muted statement, Label links, a 64px metal rule at 50%, then the disclaimer at 0.75rem.

### Custom Cursor

- **Style:** a 32px ring at 40% foreground with a 2px backdrop blur, trailing on a spring, plus an exact 4px dot. Over links and buttons it grows to 48px with a metal border. Over an element with `data-cursor="..."` it grows to 96px, takes a 40% background and shows the label at 11px (for example "ورود" or "بکشید تا بچرخد").
- **Scope:** fine pointers with hover only, never under reduced motion. While active it sets `html[data-cursor="on"]` to hide the system cursor.

## Do's and Don'ts

### Do:

- **Do** use semantic tokens only (`background`, `foreground`, `surface`, `metal`, `border`); the 3D studio lights are the one physical exception.
- **Do** keep each page to the one `display` size and cap headings by ch width (12ch to 22ch) instead of resizing them.
- **Do** set long reading at a 65ch measure, line-height 2, with 24px between paragraphs, and head sections with a 0.75rem muted label over a hairline.
- **Do** caption media on a hairline top rule: the Persian caption at the start, the Latin credit or index in `caps` with `dir="ltr"` at the end.
- **Do** give a cut-out object the object shadow and a rim-light glow, and keep every other surface flat.
- **Do** put `data-cursor` with a short Persian verb on any element where a drag or click does something unusual.
- **Do** run transitions on `ease-glide` (500ms for colour, 700 to 1000ms for entrances) and provide a still version under reduced motion.

### Don't:

- **Don't** letter-space Persian text at any size; tracking breaks the joins.
- **Don't** use `caps` or any tracking on Persian words; it is for Latin names, references and credits only.
- **Don't** fill a control other than the primary button, or fill anything with the metal.
- **Don't** round a corner on any box, button, image or field.
- **Don't** put a box shadow on an interface surface; shadows belong to cut-out objects.
- **Don't** build cards, chips, badges or kicker lines above headings; use ledger rows, hairline section heads and space.
- **Don't** show a drawn model or illustration as a real calibre; a family without its CAD file gets the status plate.
