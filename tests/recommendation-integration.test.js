// Run with: node tests/recommendation-integration.test.js
// Contract QA for: work pattern -> budget gate -> concrete solution catalog.
const assert=require('assert');
const Engine=require('../src/work-pattern-engine.js');
const Catalog=require('../data/solution-catalog.js');

const patterns={
 information:['knowledge','search','ai','information'],
 writing:['writing','template','ai'],
 coordination:['calendar','communication','automation'],
 numbers:['spreadsheet','automation','ai'],
 repetition:['automation','integration','rpa'],
 customer:['crm','sales','ai','customer'],
 field:['mobile','physical','workflow'],
 teaching:['knowledge','training','ai'],
 creative:['creative','ai','workflow'],
 technical:['coding','devops','ai'],
 management:['management','decision','ai'],
 other:['discovery','workflow']
};

function concrete(pattern,budget){
  const base=Engine.recommend(pattern,budget);
  const allowedKinds=new Set(base.recommendations.filter(x=>x.kind!=='free').map(x=>x.kind));
  return Catalog.find(pattern.solution_tags).filter(x=>allowedKinds.has(x.kind)).slice(0,3);
}

for(const [id,tags] of Object.entries(patterns)){
  const p={id,free_first:'free-first',solution_tags:tags};
  const zero=Engine.recommend(p,'zero');
  assert.equal(zero.decision,'buy_nothing',`${id}: zero budget must buy nothing`);
  assert.equal(concrete(p,'zero').length,0,`${id}: zero budget must show no paid concrete candidates`);
  for(const budget of ['low','mid']){
    const base=Engine.recommend(p,budget);
    assert.equal(base.ranking_policy,'fit_first_no_affiliate_payout',`${id}/${budget}: ranking policy changed`);
    const options=concrete(p,budget);
    assert.ok(options.length<=3,`${id}/${budget}: too many concrete candidates`);
    for(const option of options){
      assert.ok(option.tags.some(t=>tags.includes(t)),`${id}/${budget}/${option.id}: candidate has no tag fit`);
    }
  }
}

assert.ok(Catalog.items.some(x=>x.kind==='ai_saas'),'catalog must contain AI/SaaS');
assert.ok(Catalog.items.some(x=>x.kind==='physical'),'catalog must contain physical solutions');
assert.ok(Catalog.items.some(x=>x.kind==='service'),'catalog must contain service solutions');
assert.ok(!Catalog.items.some(x=>'affiliate_payout' in x||'commission' in x),'catalog must not encode payout as ranking data');

console.log('recommendation-integration: 12 patterns x 3 budgets passed contract QA');
