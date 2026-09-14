// Isolated integration test: real Next.js cache, local mock API, no production mutations.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const dir = fs.mkdtempSync(path.join(root, ".indexing-test-"));
const nextBin = path.join(root, "node_modules/next/dist/bin/next");
const names = ["super_site", "categories", "stores", "countries", "blogs",
  "contact_us", "faqs", "syas-alkhsosy-alafdl", "shrot-alastkhdam", "mn-nhn"];
let mode = "forbidden", flags = {}, calls = 0, next;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function write(file, content) {
  const dest = path.join(dir, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}
function copy(file) { write(file, fs.readFileSync(path.join(root, file), "utf8")); }
function listen(server) {
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve(server.address().port)));
}
function run(args, env) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [nextBin, ...args], { cwd: dir, env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    p.stdout.on("data", d => output += d);
    p.stderr.on("data", d => output += d);
    p.on("error", reject);
    p.on("exit", code => code === 0 ? resolve(output) : reject(new Error(output)));
  });
}
const api = http.createServer((req, res) => {
  calls++;
  res.setHeader("Content-Type", "application/json");
  if (mode === "forbidden") { res.writeHead(403); return res.end("{}"); }
  if (mode === "failure") { res.writeHead(503); return res.end("{}"); }
  if (mode === "malformed") return res.end(JSON.stringify({ data: { settings: [] } }));
  res.end(JSON.stringify({ data: { menus: [], notifications: [],
    settings: names.map((name, id) => ({ id, name, val: flags[name] || "on" })) } }));
});
(async () => {
  const apiPort = await listen(api);
  const reserve = http.createServer();
  const port = await listen(reserve);
  await new Promise(resolve => reserve.close(resolve));
  const origin = "http://127.0.0.1:" + port;
  for (const file of [
    "src/lib/api-result.ts", "src/lib/indexing-settings.ts",
    "src/services/GetSettingsRequest.ts", "src/services/getIndexingSettings.ts",
    "src/services/getSitemapIndexingSettings.ts", "src/types/settingsEnum.ts",
    "src/app/sitemap/main/route.ts"
  ]) copy(file);
  write("src/types/index.ts", 'export type Settings = { menus: unknown[]; notifications: unknown[]; settings: { id: number; name: string; val: string }[] };');
  write("package.json", JSON.stringify({ private: true, dependencies: { next: "16.3.0", react: "19.2.3", "react-dom": "19.2.3" } }));
  fs.symlinkSync(fs.realpathSync(path.join(root, "node_modules")), path.join(dir, "node_modules"), "dir");
  write("next.config.js", 'module.exports = { experimental: { cpus: 1 } };');
  write("tsconfig.json", JSON.stringify({ compilerOptions: { strict: true, esModuleInterop: true,
    moduleResolution: "bundler", module: "esnext", target: "ES2017", jsx: "preserve",
    paths: { "@/*": ["./src/*"] } } }));
  write("src/app/layout.tsx", 'import { connection } from "next/server"; import { getSettings } from "@/services/GetSettingsRequest"; export default async function Layout({children}: {children: React.ReactNode}) { await connection(); await getSettings(); return <html><body>{children}</body></html>; }');
  write("src/app/probe/page.tsx", 'import { connection } from "next/server"; import { getSettingEnabled } from "@/services/getIndexingSettings"; export async function generateMetadata(){ await connection(); return { robots: { index: await getSettingEnabled("blogs") } }; } export default async function Page(){ await connection(); return <main>Indexing cache probe</main>; }');
  write("src/app/health/route.ts", 'export async function GET(){ return new Response("ok"); }');
  write("src/app/invalidate/route.ts", 'import { revalidateTag } from "next/cache"; export async function POST(){ revalidateTag("site-settings", "max"); return new Response("ok"); }');
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_API_URL: "http://127.0.0.1:" + apiPort + "/",
    NODE_ENV: "production" };
  console.log("Building isolated Next.js fixture...");
  const build = await run(["build", "--webpack"], env);
  console.log(build.slice(-2500));
  next = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: dir, env, stdio: ["ignore", "pipe", "pipe"] });
  let logs = "";
  next.stdout.on("data", d => logs += d);
  next.stderr.on("data", d => logs += d);
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(origin + "/health")).ok) break; } catch {}
    if (i === 99) throw new Error("Next did not start: " + logs.slice(-2500));
    await sleep(100);
  }
  const get = async route => {
    const r = await fetch(origin + route, { signal: AbortSignal.timeout(35000) });
    return { status: r.status, body: await r.text() };
  };
  const invalidate = async () => assert.equal((await fetch(origin + "/invalidate", { method: "POST" })).status, 200);
  const indexed = r => r.status === 200 && /name="robots" content="index"/.test(r.body);
  const noindexed = r => r.status === 200 && /name="robots" content="noindex"/.test(r.body);
  assert.equal((await get("/probe")).status, 500);
  assert.equal((await get("/sitemap/main")).status, 500);
  console.log("PASS cold upstream failure: page and sitemap 500, not false settings or 404");
  mode = "valid";
  assert.ok(indexed(await get("/probe")));
  assert.equal(((await get("/sitemap/main")).body.match(/<loc>/g) || []).length, 10);
  console.log("PASS recovery and successful initial cache");
  mode = "malformed";
  let before = calls;
  await invalidate();
  assert.ok(indexed(await get("/probe")));
  for (let i = 0; calls === before && i < 30; i++) await sleep(100);
  await sleep(200);
  assert.ok(calls > before);
  assert.ok(indexed(await get("/probe")));
  assert.equal((await get("/sitemap/main")).status, 200);
  console.log("PASS malformed 200 cannot replace last valid settings");
  mode = "failure"; before = calls;
  await invalidate();
  assert.ok(indexed(await get("/probe")));
  for (let i = 0; calls < before + 4 && i < 220; i++) await sleep(100);
  await sleep(200);
  assert.ok(calls >= before + 4);
  console.log("PASS cached page stays indexed during 503 refresh retries");
  mode = "valid"; flags = { blogs: "off" };
  await invalidate();
  let response;
  for (let i = 0; i < 100; i++) {
    response = await get("/probe");
    if (noindexed(response)) break;
    await sleep(100);
  }
  assert.ok(noindexed(response));
  let sitemap = await get("/sitemap/main");
  assert.equal(sitemap.status, 200);
  assert.ok(!sitemap.body.includes("https://coupoonat.com/blog/"));
  assert.ok(sitemap.body.includes("https://coupoonat.com/stores/"));
  console.log("PASS deliberate blogs OFF updates metadata and only that sitemap section");
  flags = { super_site: "off" };
  await invalidate();
  for (let i = 0; i < 100; i++) {
    sitemap = await get("/sitemap/main");
    if (sitemap.status === 404) break;
    await sleep(100);
  }
  assert.equal(sitemap.status, 404);
  console.log("PASS deliberate site OFF preserves intentional sitemap 404");
  console.log("INTEGRATION PASSED");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (next) {
    const closed = new Promise(resolve => next.once("exit", resolve));
    next.kill("SIGTERM");
    await closed;
  }
  await new Promise(resolve => api.close(resolve));
  // Only remove the temporary fixture this test created, never application data.
  if (path.dirname(dir) !== root || !path.basename(dir).startsWith(".indexing-test-")) throw new Error("Unsafe fixture path");
  fs.rmSync(dir, { recursive: true, force: true });
});
