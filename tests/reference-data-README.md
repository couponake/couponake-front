# Public reference-data cache

Run from the project root with locked dependencies installed:

```sh
node node_modules/typescript/bin/tsc --noEmit --incremental false
node --test tests/reference-data.test.cjs
node tests/reference-data.integration.cjs
npm run build
```

The integration test builds a minimal real Next.js application using the actual
reference-data loaders and country-options route. Its API and Next server listen
only on localhost. It checks cold failure, cache hits, incomplete successful
responses, invalid JSON, 503, disconnects, recovered updates and time-based
revalidation. Cookies, bearer tokens and query filters must not reach the shared
upstream request. Temporary fixture cleanup is restricted to the directory the
test created. No production/staging database or application endpoint is mutated.

Production policies: categories first page and complete country options revalidate
after 300 seconds; country metadata first page keeps its existing 3600-second
interval. Refresh occurs on a subsequent request, serves the previous value while
pending, and keeps it on error. A successful refresh becomes visible on following
requests. These intervals are not guarantees during source outages. Browser country
options use a shared five-minute React Query stale time; an already mounted browser
can continue displaying its current selection until another fetch/navigation.

Only fixed anonymous Arabic lists are cached. Search/pagination/filter requests
retain their existing behavior. The country-options route ignores incoming query
parameters and authentication and returns only the public country names. It uses
`Cache-Control: no-store` for the HTTP response; the validated server Data Cache is
shared. Validation runs before committing to that cache. A legitimate empty list
is accepted only with consistent success and pagination metadata; partial lists,
missing fields, duplicate identities, and invalid pagination are rejected.

The unit tests validate payload contracts. The isolated integration test does not
replace browser checks for search, navigation and hydration. A deployment check
must confirm category/country links in server HTML, index settings on production,
and the staging-only Nginx noindex header. Do not copy staging environment files or
Nginx rules into a production PR.
