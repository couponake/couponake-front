const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
// Run the real TypeScript services with only their framework/network boundaries
// replaced. Persistent Next.js cache behavior is covered by the integration run.
function services(fetchImpl) {
  const modules = new Map();
  const requests = [];
  const cacheOptions = [];
  function load(file) {
    const absolute = path.resolve(root, file);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const module = { exports: {} };
    modules.set(absolute, module);
    const source = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    const sandbox = {
      module, exports: module.exports, console,
      process: { env: { NEXT_PUBLIC_Couponake_API_URL: "https://api.example.test/api/" } },
      AbortSignal, Response,
      setTimeout: (fn) => setTimeout(fn, 0),
      fetch: async (url, options) => {
        requests.push({ url, options });
        return fetchImpl(url, options);
      },
      require: (name) => {
        if (name === "react") return { cache: (fn) => fn };
        if (name === "next/cache") return {
          unstable_cache: (fn, keys, options) => {
            cacheOptions.push({ keys, options });
            return fn;
          }
        };
        if (name === "next/server") return { NextResponse: Response };
        if (name.startsWith("@/")) return load("src/" + name.slice(2) + ".ts");
        return require(name);
      }
    };
    vm.runInNewContext(source, sandbox, { filename: absolute });
    return module.exports;
  }
  return { load, requests, cacheOptions };
}
const names = ["super_site", "categories", "stores", "countries", "blogs",
  "contact_us", "faqs", "syas-alkhsosy-alafdl", "shrot-alastkhdam", "mn-nhn"];
function fixture(overrides = {}) {
  return {
    status: "success", data: {
      menus: [], notifications: [],
      settings: names.map((name, id) => ({ id, name, val: overrides[name] ?? "on" }))
    }
  };
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status });
}
test("valid settings retain every enabled page and sitemap section", async () => {
  const s = services(() => json(fixture()));
  const page = s.load("src/services/getIndexingSettings.ts");
  for (const name of names) assert.equal(await page.getSettingEnabled(name), true);
  const flags = await s.load("src/services/getSitemapIndexingSettings.ts").getSitemapSettingEnabled();
  assert.equal(Object.keys(flags).length, 10);
  assert.equal(Object.values(flags).every(Boolean), true);
  assert.equal(s.requests[0].options.cache, "no-store");
  assert.equal(s.requests[0].options.next, undefined);
  assert.equal(s.cacheOptions[0].options.revalidate, 21600);
});
test("an intentional page OFF is preserved without disabling other sections", async () => {
  const s = services(() => json(fixture({ blogs: "off" })));
  const page = s.load("src/services/getIndexingSettings.ts");
  assert.equal(await page.getSettingEnabled("blogs"), false);
  assert.equal(await page.getSettingEnabled("stores"), true);
  const flags = await s.load("src/services/getSitemapIndexingSettings.ts").getSitemapSettingEnabled();
  assert.equal(flags.blogs, false);
  assert.equal(flags.stores, true);
});
test("intentional site OFF still disables page indexing and returns sitemap 404", async () => {
  const s = services(() => json(fixture({ super_site: "off" })));
  assert.equal(await s.load("src/services/getIndexingSettings.ts").getSettingEnabled("stores"), false);
  const response = await s.load("src/app/sitemap/main/route.ts").GET();
  assert.equal(response.status, 404);
});
test("valid settings produce the full main sitemap", async () => {
  const s = services(() => json(fixture()));
  const response = await s.load("src/app/sitemap/main/route.ts").GET();
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.equal((xml.match(/<loc>/g) || []).length, 10);
  assert.ok(xml.includes("https://couponake.com/blog/"));
});
const invalid = [
  ["null body", () => null],
  ["missing data", () => ({})],
  ["missing settings", () => ({ data: { menus: [], notifications: [] } })],
  ["empty settings", () => ({ data: { menus: [], notifications: [], settings: [] } })],
  ["missing flag", () => { const f = fixture(); f.data.settings.pop(); return f; }],
  ["invalid flag", () => fixture({ blogs: "unknown" })],
  ["duplicate flag", () => { const f = fixture(); f.data.settings.push(f.data.settings[0]); return f; }],
  ["missing menu payload", () => { const f = fixture(); delete f.data.menus; return f; }]
];
for (const [label, make] of invalid) {
  test("HTTP 200 with " + label + " throws instead of noindex or sitemap 404", async () => {
    const s = services(() => json(make()));
    await assert.rejects(s.load("src/services/getIndexingSettings.ts").getSettingEnabled("stores"));
    await assert.rejects(s.load("src/app/sitemap/main/route.ts").GET());
  });
}
for (const status of [401, 403, 404, 429, 500, 503]) {
  test("HTTP " + status + " propagates to page metadata and sitemap callers", async () => {
    const s = services(() => json({ message: "upstream failure" }, status));
    await assert.rejects(s.load("src/services/getIndexingSettings.ts").getSettingEnabled("blogs"));
    await assert.rejects(s.load("src/app/sitemap/main/route.ts").GET());
  });
}
test("malformed JSON and network timeouts do not become indexing flags", async () => {
  for (const fetchImpl of [
    () => new Response("{"),
    () => { throw new DOMException("Timed out", "TimeoutError"); }
  ]) {
    const s = services(fetchImpl);
    await assert.rejects(s.load("src/services/getIndexingSettings.ts").getSettingEnabled("stores"));
    await assert.rejects(s.load("src/services/getSitemapIndexingSettings.ts").getSitemapSettingEnabled());
  }
});
test("a failed cold read can recover on the next successful request", async () => {
  let failed = true;
  const s = services(() => failed ? json({}, 503) : json(fixture()));
  const page = s.load("src/services/getIndexingSettings.ts");
  await assert.rejects(page.getSettingEnabled("stores"));
  failed = false;
  assert.equal(await page.getSettingEnabled("stores"), true);
});
