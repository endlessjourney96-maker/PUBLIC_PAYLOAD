// Run with: node tests/work-pattern-engine.test.js
const assert=require('assert');
const {recommend}=require('../src/work-pattern-engine.js');
const patterns={
 writing:{id:'writing',free_first:'目的・材料・任せる範囲をテンプレ化',solution_tags:['writing','template','ai']},
 repetition:{id:'repetition',free_first:'最頻工程を1つ削る',solution_tags:['automation','integration','rpa']},
 field:{id:'field',free_first:'移動・待ち・記録を測る',solution_tags:['mobile','physical','workflow']}
};
let r=recommend(patterns.writing,'zero');
assert.equal(r.decision,'buy_nothing');
assert.ok(r.recommendations.every(x=>x.cost===0));
assert.equal(r.ranking_policy,'fit_first_no_affiliate_payout');
r=recommend(patterns.repetition,'low');
assert.equal(r.decision,'compare_options');
assert.ok(r.recommendations.some(x=>x.id==='automation'));
assert.ok(r.recommendations.every(x=>x.cost<=3000));
r=recommend(patterns.field,'mid');
assert.ok(r.recommendations.some(x=>x.kind==='physical'||x.kind==='free'));
r=recommend(null,'mid');
assert.equal(r.decision,'buy_nothing');
console.log('work-pattern-engine: 4 scenarios passed');
