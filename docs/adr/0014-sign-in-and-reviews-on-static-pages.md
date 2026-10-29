# 0014. Sign-in and reviews on static pages

Status: accepted

- Watch pages stay static. Reviews load in the browser from `/api/watches/:slug/reviews`, so a new or newly
  published review shows without a rebuild, and the page still renders (with a short notice) when the API is down.
  `AggregateRating` JSON-LD is left out for now: it would have to be in the static HTML to count, and the static
  HTML cannot know the rating.
- Sign-in is a dialog: mobile number, then the six-digit code. The session stays in the API's httpOnly cookies.
  A readable `kronos_signed_in` cookie only says that a sign-in happened in this browser, so guests never send
  `/auth/me` and never collect a 401; a stale marker is cleared on the first failed check.
- `apiFetch` renews an expired access cookie once through `/auth/refresh` and repeats the request; requests that
  expire together share one renewal.
- A reader without a name on the account can give one in the review form; it is saved to the profile first.
- `/admin/reviews` is the moderation desk. The API enforces the admin role; the page only decides what to draw.
  It is `noindex` and disallowed in `robots.txt`.
