# 0012. Entry pages, search, comparison and complications

Status: accepted

- Every watch and calibre of the register has its own static page (`/watches/[slug]`, `/calibres/[slug]`), generated
  from the same data as the catalogues; unknown slugs are a real 404 (`dynamicParams = false`). A watch page shows the
  calibre inside it, the other watches with that calibre, the house's other models and the nearest models of other
  houses by year; a calibre page lists the watches that use it and the calibres of its kind. The catalogues stay as
  the long overview and link into the entry pages.
- `/complications` explains seven complications. The ADR 0010 rules hold: every date and figure is one a listed
  source states, and where sources disagree no year is given. A complication links to the register only through data
  that already says so (a calibre's `kind`, a lab family), never through a guessed list of models.
- Search folds what people type (Arabic ye and kaf, Persian and Arabic digits, the non-joiner, dashes) and ranks
  name matches above matches in the facts. The header list shows the best few and opens `/search?q=` for the rest.
  The search page is static and reads the address on the client; it is `noindex`, since it repeats the entries.
- `/compare?watches=a,b,c` (or `?calibres=`) compares up to three entries row by row. The rows are built on the
  server and only strings reach the browser; a figure no source gives reads as a dash. The choice lives in the
  address so a comparison can be shared.
- SEO: every page sets its canonical URL and its own Open Graph fields through `pageMetadata`, which repeats the
  site-wide fields and the site's preview image because Next replaces a parent's `openGraph` instead of merging it.
  Entry pages carry `TechArticle` and `BreadcrumbList` JSON-LD, the home page `WebSite`, and the sitemap lists every
  entry page.
