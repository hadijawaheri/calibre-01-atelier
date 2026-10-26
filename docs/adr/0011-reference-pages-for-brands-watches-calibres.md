# 0011. Reference pages for brands, watches and calibres

Status: accepted

- `/brands`, `/watches` and `/calibres` are the site's reference register, next to the long reads on `/history` and the
  four families in `/lab`. Their data lives in `apps/web/src/features/reference`, one file per register, and the pages
  cross-link: a brand lists its watches, a watch links its calibre, a calibre leads into its lab family.
- The rules of ADR 0010 hold: every entry lists the pages its facts were checked against, and every photo is a
  Wikimedia Commons file whose author and licence were read from the Commons API and are credited under the plate.
- A figure no source gives is left out. The calibre table shows a dash for it, and a watch without a free photo shows
  an empty mat that says so, rather than a stand-in. Commons files whose description reads like an advertisement or
  names a seller of copies (the Nautilus 3700 and Fifty Fathoms images credited to the brands) were not used, since
  their free licence is doubtful. The Ventura photo was uploaded by Hamilton's own account under CC BY-SA and is kept.
- Entries are ordered by year (founding year for brands, introduction year for watches and calibres); calibres no
  source dates come last. A unit test keeps the order, the cross-links and the credits honest.
