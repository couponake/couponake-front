# Country and category detail data cache

Scope: `/coupon_country/[slug]/` and `/coupon-category/[slug]/`. Cache validated public Arabic data for 300 seconds and render HTML on the server. UI, ordering, store records, canonical URLs and indexing settings are preserved. These pages list stores; store coupon fetching and interactive account operations are unchanged.

## Verification

```sh
npx tsc --noEmit
node --test tests/detail-data.test.cjs
node tests/detail-isr.integration.cjs
npm run build
```

Optional real-response validation: `DETAIL_FIXTURES=/path/to/captured-responses node --test tests/detail-data.test.cjs`.

The integration test (named for the original ISR investigation) builds and runs real Next.js with a localhost-only API and the actual loader/validators. It verifies server HTML, metadata and links, reuse of the data cache, no forwarding of user headers/filters, stale valid content during malformed responses/JSON/redirects, 503, 429 and disconnect, recovery, new slugs after a cached 404, exactly one correctly encoded redirect Location, and cold errors. One-second intervals exercise expiration; a separate 300-second loader checks reuse without timing races. Only its own temporary `.detail-test-*` directory is removed. No deployed API or database is modified by these tests.

## Why Full Route ISR is deferred

On installed Next.js 16.3.0, adding `generateStaticParams` reproduced [confirmed issue #82117](https://github.com/vercel/next.js/issues/82117): a cold cached redirect emits two Location headers. The test observed a comma-joined invalid target. This also survived the staging Nginx proxy. Changing redirect placement or status did not fix it; conditional `connection()` after entering ISR caused a static-to-dynamic 500. The proposed [upstream fix #95913](https://github.com/vercel/next.js/pull/95913) was still open at investigation time (2026-09-14).

The final pages call `connection()` unconditionally and do not generate static params. Explicit data caches remain usable while redirects stay outside the Full Route Cache. No framework upgrade, vendor patch, production proxy change or redirect rewrite is included. Full Route ISR/prerendering is unfinished and must pass the strict redirect regression before being enabled later.

## Contract and boundaries

- Keys include API base, entity kind and normalized slug. Raw Arabic and percent-encoded params share a key; path/query injection is rejected after decoding.
- A no-store fetch inside `unstable_cache` ensures only validated results are saved. Fixed anonymous Arabic headers are sent, with no incoming cookies, auth, filters or query string.
- Only the current Laravel entity-not-found 404 contract means not found. Invalid 200/301/404 responses throw. Network errors, 429 and 5xx receive one retry after 11 seconds, with a 10-second per-attempt timeout (about 31 seconds worst case, excluding scheduling overhead).
- Required SEO fields and store fields are validated. Existing distinct records sharing a slug are preserved. Missing lists are errors; explicitly empty lists are accepted. Without an API count contract, a structurally valid shortened list cannot be distinguished from a legitimate change.
- Data refresh is triggered by a subsequent request after 300 seconds. The first stale read can return old data and refresh in the background. Failed refresh preserves the last valid value; cold failures remain errors. This is not a strict five-minute update guarantee.
- HTML is rendered per request; there is no new Full Route/CDN HTML cache. The unchanged layout's explicit 60-second metadata fetch remains independent. New slugs do not require a rebuild, including a slug that previously returned a validated 404 after its cache refreshes.

## Sources

- [Next.js unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) and [connection](https://nextjs.org/docs/app/api-reference/functions/connection).
- [Next.js caching model](https://nextjs.org/docs/app/guides/caching-without-cache-components) and [ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration).
- [Google crawl guidance](https://developers.google.com/crawling/docs/crawl-budget): availability and efficient responses, without a ranking guarantee.
- [Community discussion #69685](https://github.com/vercel/next.js/discussions/69685): stale-first behavior questions informed expiration/recovery tests; replies are not treated as an authoritative specification.
- [Commerce-UI case study, Vercel, November 2023](https://vercel.com/customers/commerceui-headless-shopify-nextjs): agency/vendor account with multiple concurrent platform changes and no controlled SEO attribution. It is not evidence of an expected ranking/revenue uplift for Couponake.
