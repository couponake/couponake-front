# Indexing settings regression checks

Run with the dependencies from this repository's lockfile:

```sh
node --test tests/indexing-settings.test.cjs
node tests/indexing-settings.integration.cjs
npx tsc --noEmit --incremental false
```

The unit tests execute the real TypeScript services and main sitemap handler with mocked network/framework boundaries. They cover intentional ON/OFF, partial or malformed payloads, duplicate flags, HTTP failures, timeouts, and recovery.

The integration test builds a temporary Next.js app with the actual settings services and sitemap handler. It serves a mock API and the app on loopback-only ephemeral ports, exercises the real persistent cache and tag revalidation, and removes only its temporary fixture on completion. It does not call the production API, change application settings, or delete content. Run tests sequentially before building the full application; the temporary fixture lives under the repository while the test runs.

The six-hour settings refresh interval is unchanged. A cold failed read propagates an error; a failed refresh keeps the previous validated settings. Explicit OFF values remain authoritative. Ordinary streaming responses may already have sent headers when a late error occurs; the fix must not synthesize false indexing settings in either case.
