const assert=require('assert');
const catalog=require('../data/solution-catalog.js');

assert.ok(Array.isArray(catalog.items)&&catalog.items.length>=8,'catalog should expose concrete candidates');
assert.ok(catalog.items.every(x=>!('affiliate_payout' in x)&&!('commission' in x)&&!('reward' in x)),'monetization must not leak into ranking data');

const automation=catalog.find(['automation','integration']);
assert.ok(automation.length>=2,'automation diagnosis should have multiple comparison candidates');
assert.ok(automation.every(x=>x.tags.some(t=>['automation','integration'].includes(t))),'results must match requested tags');

const physical=catalog.find(['physical'],'physical');
assert.ok(physical.length>=1&&physical.every(x=>x.kind==='physical'),'kind filter must be respected');

const none=catalog.find(['definitely-no-match']);
assert.deepStrictEqual(none,[],'unknown needs should safely return no paid candidate');

console.log('solution-catalog.test.js: OK');
