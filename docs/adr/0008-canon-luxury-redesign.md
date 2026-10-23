# 0008. A canon luxury redesign: vitrine, didone and hairline metal

Status: accepted

The owner asked for a fundamental redesign to the Impeccable skill's standards, then pinned the look in his own
words: the classic luxury-watch house. Deep monochrome (matte black, charcoal, stone, ivory), metal only as hairlines,
a didone serif with a geometric sans, tracked capitals on Latin words, dramatic empty space, a minimal header that gets
out of the way, a custom cursor, depth blur, one hero object. A dealt alternative (a Persian qanat world) was offered
and set aside in favour of his brief. The direction contract lives in
`apps/web/.impeccable/surfaces/src-app-site-page-tsx.md`; DESIGN.md records the resulting system.

Decisions:

- **Fonts, self-hosted:** Bodoni Moda for Latin display, Amiri for Persian display (a classical Naskh with real
  stroke contrast), Jost for Latin text, Vazirmatn for Persian text. Cormorant and JetBrains Mono are gone.
  Persian is never letter-spaced; only Latin captions use the `caps` utility.
- **One heading size per page** (`display`), body, and small captions. No kickers above headings, no chips, no section
  numbers, no cards: catalogues are ruled lists (home families, lab index).
- **`--metal` replaces `--gold`:** bronze on ivory, pale gold on black, used for lines, small text and icons only. The
  one filled control is ink on ivory, ivory on black.
- **Square corners** (`--radius: 0`) across shadcn components; button variants restyled.
- **Header** hides on scroll down and returns on scroll up or focus. **Custom cursor** on fine pointers without
  reduced motion; elements name their action with `data-cursor`.
- **No configurator, no checkout:** the site is a reference, not a shop (ADR 0005), and the owner said so again. The
  lab's real controls are the honest equivalent.
- The 3D stage's room colour follows the theme.
