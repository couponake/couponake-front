const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/reference-data.ts'), 'utf8');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { exports: exportsObject, require });
const { validateCategories: categories, validateCountries: countries, validateCountryOptions: options } = exportsObject;
const meta = { current_page: 1, last_page: 1, per_page: 50, total: 2 };
const items = [{ id: 1, name: 'A', slug: 'a', image: '/a.webp' }, { id: 2, name: 'B', slug: 'b', image: '/b.webp' }];
const good = () => ({ success: true, categories: structuredClone(items), pagination: { ...meta } });
test('valid category links and pagination survive validation', () => assert.equal(categories(good()).categories.length, 2));
for (const value of [null, {}, { success: false }, { success: true, categories: [] }]) {
  test('reject malformed category envelope '+JSON.stringify(value), () => assert.throws(() => categories(value)));
}
test('reject partial successful list instead of caching missing links', () => {
  const value = good(); value.categories.pop(); assert.throws(() => categories(value));
});
test('reject duplicate category IDs or slugs', () => {
  for (const key of ['id', 'slug']) { const value = good(); value.categories[1][key] = value.categories[0][key]; assert.throws(() => categories(value)); }
});
test('reject broken links and absent display fields', () => {
  for (const key of ['name', 'slug', 'image']) { const value = good(); value.categories[0][key] = ''; assert.throws(() => categories(value)); }
});
test('valid explicit empty catalog is different from a partial response', () => {
  assert.equal(categories({ success: true, categories: [], pagination: { ...meta, total: 0 } }).categories.length, 0);
});
test('pagination remains valid when categories grow beyond first page', () => {
  assert.equal(categories({ success: true, categories: items, pagination: { ...meta, per_page: 2, total: 3, last_page: 2 } }).pagination.last_page, 2);
});
test('countries require metadata, names and matching pagination', () => {
  const value = { status: 'success', data: [{ name: 'A', meta: {} }, { name: 'B', meta: {} }], meta };
  assert.equal(countries(value).data.length, 2);
  assert.throws(() => countries({ ...value, data: [{ name: 'A' }, { name: 'B' }] }));
  assert.throws(() => countries({ ...value, data: [value.data[0], value.data[0]] }));
});
test('country select requires complete list; negative page size is rejected', () => {
  assert.equal(options({ status: 'success', data: ['A', 'B'], meta }).length, 2);
  for (const broken of [{ ...meta, per_page: -1 }, { ...meta, total: 3 }, { ...meta, per_page: 2, total: 3, last_page: 2 }])
    assert.throws(() => options({ status: 'success', data: ['A', 'B'], meta: broken }));
});
test('reject duplicate or non-string country options', () => {
  for (const data of [['A', 'A'], ['A', null], ['A', ' ']]) assert.throws(() => options({ status: 'success', data, meta }));
});
