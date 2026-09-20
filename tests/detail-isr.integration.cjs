// Exercise dynamic HTML with real Next.js Data Cache against a localhost-only API.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), dir = fs.mkdtempSync(path.join(root, '.detail-test-'));
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
let mode = 'valid', version = 1, next, log = '', calls = 0, leaks = 0, newExists = false; const callsBySlug = {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const listen = s => new Promise(r => s.listen(0, '127.0.0.1', () => r(s.address().port)));
function write(file, text) { const p = path.join(dir, file); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); }
const api = http.createServer((req, res) => {
    calls++; if (req.headers.cookie || req.headers.authorization || req.headers['accept-language'] !== 'ar' || req.url.includes('?')) leaks++;
    const country = req.url.startsWith('/home/country/'), slug = decodeURIComponent(req.url.split('/').pop());
    callsBySlug[slug] = (callsBySlug[slug] || 0) + 1;
    res.setHeader('Content-Type', 'application/json');
    if (slug === 'missing' || (slug === 'new' && !newExists) || mode === 'gone') { res.writeHead(404); return res.end(JSON.stringify(country ? { success: false, message: 'Country not found' } : { status: 'error', message: 'Category not found' })); }
    if (mode === 'failure' || mode === 'rate-limit') { res.writeHead(mode === 'failure' ? 503 : 429); return res.end('{}'); }
    if (mode === 'disconnect') return req.socket.destroy();
    if (mode === 'bad-json') return res.end('{broken');
    if (mode === 'invalid-redirect') { res.writeHead(301); return res.end('{}'); }
    if (slug === 'moved') { res.writeHead(301, { Location: '/must-not-follow' }); return res.end(JSON.stringify({ redirect_url: '/category/أزياء-موضة/' })); }
    const seo = { title: 'Title-v' + version, description: 'Description-v' + version, image: '/image.png' };
    const stores = [{ id: version, slug: 'store-v' + version, store_name: 'Store-v' + version, image: null }];
    const data = country ? { success: true, data: { country: slug, country_seo: seo, stores } } : { category: { id: 2, name: 'Category-v' + version, slug, image: null, category_seo: seo, stores } };
    if (mode === 'malformed') delete (country ? data.data : data.category).stores;
    res.end(JSON.stringify(data));
});
async function run(args, env) { return new Promise((resolve, reject) => { const p = spawn(process.execPath, [nextBin, ...args], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] }); let s = ''; p.stdout.on('data', d => s += d); p.stderr.on('data', d => s += d); p.on('error', reject); p.on('exit', c => c === 0 ? resolve(s) : reject(Error(s))); }); }
(async () => {
    const apiPort = await listen(api), reserve = http.createServer(), port = await listen(reserve); await new Promise(r => reserve.close(r)); const origin = 'http://127.0.0.1:' + port;
    for (const file of ['src/lib/detail-data.ts', 'src/lib/api-result.ts', 'src/services/public-detail-data.ts', 'src/types/index.d.ts']) write(file, fs.readFileSync(path.join(root, file), 'utf8'));
    write('package.json', JSON.stringify({ private: true, dependencies: { next: '16.3.0', react: '19.2.3', 'react-dom': '19.2.3' } }));
    fs.symlinkSync(fs.realpathSync(path.join(root, 'node_modules')), path.join(dir, 'node_modules'), 'dir');
    write('next.config.js', 'module.exports={experimental:{cpus:1},turbopack:{root:' + JSON.stringify(root) + '}};');
    write('tsconfig.json', JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: true, esModuleInterop: true, moduleResolution: 'bundler', module: 'esnext', target: 'ES2017', jsx: 'preserve', paths: { '@/*': ['./src/*'] } } }));
    write('src/app/layout.tsx', 'export default function Layout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>;}');
    write('src/app/health/route.ts', 'export async function GET(){return new Response("ok");}');
    write('src/app/[kind]/[slug]/page.tsx', `import {cache} from 'react';import {connection} from 'next/server';import {notFound,redirect} from 'next/navigation';import {createDetailLoader} from '@/services/public-detail-data';import {validateCategoryDetail,validateCountryDetail} from '@/lib/detail-data';
 const country=cache(createDetailLoader('country',validateCountryDetail,1)),category=cache(createDetailLoader('category',validateCategoryDetail,1));
 const warmCountry=cache(createDetailLoader('country',validateCountryDetail,300)),warmCategory=cache(createDetailLoader('category',validateCategoryDetail,300));
 const get=cache(async(kind:string,slug:string)=>{await connection();const loader=slug==='cached-warm'?(kind==='country'?warmCountry:warmCategory):(kind==='country'?country:category);return loader(slug);});
 export async function generateMetadata({params}:any){const {kind,slug}=await params,r=await get(kind,slug);if(r.kind==='not_found')notFound();if(r.kind==='redirect')return {title:'Redirecting...',robots:{index:false},alternates:{canonical:r.redirect_url}};const d:any=(r.data as any).data||(r.data as any).category;return {title:(d.country_seo||d.category_seo).title,robots:{index:true},alternates:{canonical:'https://example.test/'+kind+'/'+slug}};}
 export default async function Page({params}:any){const {kind,slug}=await params,r=await get(kind,slug);if(r.kind==='not_found')notFound();if(r.kind==='redirect')redirect(r.redirect_url);const d:any=(r.data as any).data||(r.data as any).category;return <main><h1>{d.country||d.name}</h1>{d.stores.map((s:any)=><a key={s.id} href={'/store/'+s.slug}>{s.store_name}</a>)}</main>;}`);
    const env = { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_Couponake_API_URL: 'http://127.0.0.1:' + apiPort + '/' };
    console.log('Building real Next.js detail data-cache fixture...'); await run(['build'], env);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, '.next/prerender-manifest.json'), 'utf8'));
    assert.equal(Object.keys(manifest.routes).filter(x => /country|category/.test(x)).length, 0);
    next = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] }); next.stdout.on('data', d => log += d); next.stderr.on('data', d => log += d);
    for (let i = 0; i < 100; i++) { try { if ((await fetch(origin + '/health')).ok) break; } catch { } if (i === 99) throw Error(log); await sleep(100); }
    const paths = ['/country/' + encodeURIComponent('العراق'), '/category/' + encodeURIComponent('أزياء-موضة')];
    const get = async p => { const r = await fetch(origin + p, { redirect: 'manual', headers: { Authorization: 'Bearer test-only', Cookie: 'session=test-only', 'User-Agent': 'Googlebot' } }); const body = await r.text(); if (r.status === 500) console.log('Fixture error:', log.slice(-2500)); return { status: r.status, body, cache: r.headers.get('x-nextjs-cache'), location: r.headers.get('location') }; };
    const good = (r, v) => r.status === 200 && r.body.includes('Title-v' + v) && r.body.includes('/store/store-v' + v);
    async function until(check, timeout = 16000) { const deadline = Date.now() + timeout; while (Date.now() < deadline) { if (await check()) return; await sleep(150); } throw Error('Timed out; ' + log.slice(-1500)); }
    for (const p of paths) assert.ok(good(await get(p), 1));
    console.log('PASS server-rendered country/category HTML, metadata and links');
    const earlyRedirect = await get('/category/moved'); assert.equal(earlyRedirect.status, 307); assert.equal(earlyRedirect.location, '/category/%D8%A3%D8%B2%D9%8A%D8%A7%D8%A1-%D9%85%D9%88%D8%B6%D8%A9/');
    console.log('PASS redirect returns one correctly encoded Location');
    mode = 'valid'; version = 2; await sleep(1300); for (const p of paths) await until(async () => good(await get(p), 2));
    const warmPaths = ['/country/cached-warm', '/category/cached-warm']; for (const p of warmPaths) assert.ok(good(await get(p), 2));
    const start = callsBySlug['cached-warm']; for (const p of warmPaths) for (let i = 0; i < 5; i++)assert.ok(good(await get(p + '?search=private'), 2)); assert.equal(callsBySlug['cached-warm'], start); assert.equal(leaks, 0);
    console.log('PASS warm HTML requests avoid source calls; no user headers or filters shared');
    for (const fault of ['malformed', 'bad-json', 'invalid-redirect', 'failure', 'rate-limit', 'disconnect']) {
        mode = fault; await sleep(1300); const old = calls;
        for (const p of paths) assert.ok(good(await get(p), 2));
        await until(async () => calls > old);
        if (['failure', 'rate-limit', 'disconnect'].includes(fault)) await sleep(11500); else await sleep(300);
        for (const p of paths) assert.ok(good(await get(p), 2));
        // Let any retry started by the previous read finish before changing modes.
        if (['failure', 'rate-limit', 'disconnect'].includes(fault)) await sleep(11500);
        console.log('PASS last good HTML/metadata retained: ' + fault);
    }
    mode = 'valid'; version = 3; for (const p of paths) await until(async () => good(await get(p), 3)); console.log('PASS metadata and store updates arrive after recovery');
    assert.equal((await get('/country/missing')).status, 404); assert.equal((await get('/category/missing')).status, 404);
    assert.equal((await get('/category/new')).status, 404); newExists = true; await sleep(1300); await until(async () => good(await get('/category/new'), 3));
    console.log('PASS real 404 and newly created slug without a rebuild');
    const moved = await get('/category/moved'); assert.equal(moved.status, 307); assert.equal(moved.location, '/category/%D8%A3%D8%B2%D9%8A%D8%A7%D8%A1-%D9%85%D9%88%D8%B6%D8%A9/');
    mode = 'malformed'; assert.equal((await get('/country/cold-error')).status, 500); assert.equal((await get('/category/cold-error')).status, 500); assert.equal(leaks, 0);
    console.log('PASS manual API redirect and cold malformed responses stay errors');
    console.log('DETAIL DATA CACHE INTEGRATION PASSED');
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(async () => { if (next) { const exited = new Promise(r => next.once('exit', r)); next.kill('SIGTERM'); await exited; } await new Promise(r => api.close(r)); if (path.dirname(dir) !== root || !path.basename(dir).startsWith('.detail-test-')) throw Error('Unsafe cleanup'); fs.rmSync(dir, { recursive: true, force: true }); });
