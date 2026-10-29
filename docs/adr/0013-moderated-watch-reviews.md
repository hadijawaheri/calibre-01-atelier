# 0013. Moderated watch reviews

Status: accepted

- A signed-in person can leave one review per watch: a rating from 1 to 5, a text of 20 to 2000 letters and,
  optionally, how they know the watch (owner, former owner, handled one). Deleting it frees the slot for a new one.
- Nothing a person writes is public until an admin publishes it. Every write, including an edit of a published
  review, goes back to `pending`, so an approved review cannot be edited into spam. Rejected reviews stay stored and
  out of sight. The queue at `/v1/admin/reviews` serves the oldest waiting review first.
- Reviews are keyed by the watch slug. The register lives in the web app, so the API checks only the slug's shape;
  a review for a slug the site does not know is never shown, since no page asks for it.
- Privacy: a review shows the first name and the initial of the last name, copied onto the review on each write so
  the public listing never reads the users collection. With no name on the account it reads "کاربر کرونوس". The mobile
  number never leaves the API. Deleting the account takes its reviews down with it.
- The public listing returns the published count and the mean rating (one decimal) with the page, so the watch page
  needs one request. Writes are throttled to ten a minute per client.
