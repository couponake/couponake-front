// Real Next.js cache with a localhost-only faulting API; never mutates site data.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const dir = fs.mkdtempSync(path.join(root, '.reference-test-'));
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
let mode = 'forbidden', version = 1, next, log = '';
const calls = { categories: 0, countries: 0, options: 0, expiry: 0 };
const leaks = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
function write(file, text) { const p = path.join(dir, file); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); }
function listen(s) { return new Promise(r => s.listen(0, '127.0.0.1', () => r(s.address().port))); }
const api = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const kind = url.searchParams.has('test') ? 'expiry' : url.pathname.includes('categories') ? 'categories' : url.pathname.includes('countries-meta') ? 'countries' : 'options';
  calls[kind]++;
  if (req.headers.authorization || req.headers.cookie) leaks.push('private headers');
  if (req.headers['accept-language'] !== 'ar') leaks.push('wrong language');
  res.setHeader('Content-Type', 'application/json');
  if (mode === 'forbidden') { res.writeHead(403); return res.end('{}'); }
  if (mode === 'failure') { res.writeHead(503); return res.end('{}'); }
  if (mode === 'disconnect') return req.socket.destroy();
  if (mode === 'bad-json') return res.end('{broken');
  const category = kind === 'categories' || kind === 'expiry';
  const count = category ? 29 : 12;
  const meta = { current_page: 1, last_page: 1, per_page: category ? 50 : kind === 'options' ? 300 : 20, total: count };
  let data = Array.from({ length: count }, (_, i) => category ?
    { id: i + 1, name: 'Category ' + i + ' v' + version, slug: 'category-' + i, image: '/image.webp' } :
    kind === 'countries' ? { name: 'Country ' + i + ' v' + version, meta: {} } : 'Country ' + i + ' v' + version);
  if (mode === 'partial') data = data.slice(0, 1);
  res.end(JSON.stringify(category ? { success: true, categories: data, pagination: meta } : { status: 'success', data, meta }));
});
async function run(args, env) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [nextBin, ...args], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = ''; p.stdout.on('data', d => output += d); p.stderr.on('data', d => output += d);
    p.on('error', reject); p.on('exit', code => code === 0 ? resolve(output) : reject(new Error(output)));
  });
}
(async () => {
  const apiPort = await listen(api), reserve = http.createServer(), port = await listen(reserve);
  await new Promise(r => reserve.close(r));
  const origin = 'http://127.0.0.1:' + port;
  for (const file of ['src/lib/reference-data.ts', 'src/services/public-reference-data.ts', 'src/app/api/reference-data/countries/route.ts'])
    write(file, fs.readFileSync(path.join(root, file), 'utf8'));
  write('src/types/index.ts', 'export type CategoryItem = {id:number;name:string;slug:string;image:string}; export type paginationProps = {current_page:number;last_page:number;per_page:number;total:number;from:number;to:number};');
  write('package.json', JSON.stringify({ private: true, dependencies: { next: '16.3.0', react: '19.2.3', 'react-dom': '19.2.3' } }));
  fs.symlinkSync(fs.realpathSync(path.join(root, 'node_modules')), path.join(dir, 'node_modules'), 'dir');
  write('next.config.js', 'module.exports={experimental:{cpus:1}};');
  write('tsconfig.json', JSON.stringify({ compilerOptions: { strict: true, esModuleInterop: true, moduleResolution: 'bundler', module: 'esnext', target: 'ES2017', jsx: 'preserve', paths: { '@/*': ['./src/*'] } } }));
  write('src/app/layout.tsx', 'export default function Layout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>;}');
  write('src/app/health/route.ts', 'export async function GET(){return new Response("ok");}');
  write('src/app/probe/[kind]/route.ts', `import {getCategories,getCountries,createPublicListLoader} from '@/services/public-reference-data';
    import {validateCategories} from '@/lib/reference-data';
    const short=createPublicListLoader('categories?per_page=50&test=expiry','public-expiry-test',validateCategories,1);
    export async function GET(_:Request,{params}:{params:Promise<{kind:string}>}){const {kind}=await params;return Response.json(await (kind==='categories'?getCategories():kind==='countries'?getCountries():short()));}`);
  write('src/app/invalidate/route.ts', `import {revalidateTag} from 'next/cache'; export async function POST(){for(const t of ['public-categories','public-countries','public-country-options'])revalidateTag(t,'max');return new Response('ok');}`);
  const env = { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_Couponake_API_URL: 'http://127.0.0.1:' + apiPort + '/' };
  console.log('Building isolated cache fixture...'); await run(['build', '--webpack'], env);
  next = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] });
  next.stdout.on('data', d => log += d); next.stderr.on('data', d => log += d);
  for (let i = 0; i < 100; i++) { try { if ((await fetch(origin + '/health')).ok) break; } catch { } if (i === 99) throw new Error(log); await sleep(100); }
  const paths = ['/probe/categories', '/probe/countries', '/api/reference-data/countries'];
  const get = async p => { const r = await fetch(origin + p, { headers: { Authorization: 'Bearer test-only', Cookie: 'session=test-only' } }); return { status: r.status, body: await r.text() }; };
  const valid = r => r.status === 200 && r.body.includes('v1');
  for (const p of paths) assert.equal((await get(p)).status, p.startsWith('/api/') ? 503 : 500);
  console.log('PASS cold failures remain errors, no empty successful data');
  mode = 'valid'; for (const p of paths) assert.ok(valid(await get(p)));
  const before = { ...calls };
  for (let i = 0; i < 20; i++)for (const p of paths) assert.ok(valid(await get(p)));
  assert.deepEqual(calls, before);
  assert.ok(valid(await get(paths[2] + '?search=private-filter')));
  assert.deepEqual(calls, before); assert.equal(leaks.length, 0);
  console.log('PASS 60 warm reads generated 0 additional API requests; no cookies, auth or filters forwarded');
  for (const fault of ['partial', 'bad-json', 'failure', 'disconnect']) {
    mode = fault; const old = { ...calls }; await fetch(origin + '/invalidate', { method: 'POST' });
    for (const p of paths) assert.ok(valid(await get(p)));
    for (let i = 0; i < 100 && ['categories', 'countries', 'options'].some(k => calls[k] === old[k]); i++)await sleep(50);
    await sleep(100);
    for (const p of paths) assert.ok(valid(await get(p)));
    for (const k of ['categories', 'countries', 'options']) assert.ok(calls[k] > old[k]);
    console.log('PASS last complete list retained during ' + fault);
  }
  mode = 'valid'; version = 2; await fetch(origin + '/invalidate', { method: 'POST' });
  for (const p of paths) { let r; for (let i = 0; i < 60; i++) { r = await get(p); if (r.body.includes('v2')) break; await sleep(100); } assert.ok(r.body.includes('v2')); }
  console.log('PASS recovered updates replace old data');
  assert.ok((await get('/probe/expiry')).body.includes('v2')); version = 3; await sleep(1200);
  let response; for (let i = 0; i < 60; i++) { response = await get('/probe/expiry'); if (response.body.includes('v3')) break; await sleep(100); }
  assert.ok(response.body.includes('v3')); assert.equal(leaks.length, 0);
  console.log('PASS timed revalidation updates on subsequent requests');
  console.log('REFERENCE INTEGRATION PASSED');
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(async () => {
  if (next) { const exited = new Promise(r => next.once('exit', r)); next.kill('SIGTERM'); await exited; }
  await new Promise(r => api.close(r));
  if (path.dirname(dir) !== root || !path.basename(dir).startsWith('.reference-test-')) throw new Error('Unsafe test cleanup');
  fs.rmSync(dir, { recursive: true, force: true });
});
