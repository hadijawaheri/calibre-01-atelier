# 0003. Self-hosted fonts and shadcn components pulled from GitHub

Status: accepted

- Fonts (Vazirmatn, Cormorant Garamond, JetBrains Mono) are self-hosted with `next/font/local`: Google Fonts is often
  unreachable from Iran, and a missing Persian font breaks the whole layout.
- ui.shadcn.com was unreachable while building, so `shadcn add` could not run. The new-york-v4 sources were taken from
  the shadcn GitHub repository and converted with `shadcn migrate rtl`, which works offline. Local edits are limited to
  Persian labels, `rtl:rotate-180` on chevrons, next/link in pagination and a `thumbLabel` on Slider.
