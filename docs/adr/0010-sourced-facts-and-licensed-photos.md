# 0010. Sourced facts and freely licensed photos

Status: accepted

- Every brand history and calibre family lists the pages its facts were checked against, the maker's own site first and
  references such as Wikipedia, Hodinkee or Nippon.com after it. A claim no source backs is removed or reworded rather
  than kept.
- Brand sites' photographs are copyrighted, so the site uses only Wikimedia Commons files under CC BY-SA or in the
  public domain. Each plate credits the author, the licence and the file page, as the licence asks.
- The photos are loaded from Wikimedia's CDN as sized thumbnails (`unoptimized`, `remotePatterns` in next.config). The
  build machine could not reach Wikimedia, so they are not copied into `public/` yet. Like the fonts in ADR 0003, they
  should be self-hosted once they can be downloaded, keeping the same credits; the e2e suite routes them to a local
  stand-in so it does not depend on the network.
