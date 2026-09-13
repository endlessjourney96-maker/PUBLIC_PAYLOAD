const assert = require('node:assert/strict');
const UOM = require('../src/user-operating-model.js');

const model = UOM.create({
  goal: 'reduce_stress',
  pains: ['tool_fragmentation', 'repetitive_tasks', 'bad token !'],
  budget: 'low',
  ai_skill: 'intermediate',
  automation_preference: 'high',
  setup_tolerance: 'low',
  existing_tools: ['chatgpt', 'claude', 'chatgpt']
});

assert.equal(model.schema_version, 1);
assert.equal(model.goal, 'reduce_stress');
assert.deepEqual(model.pains, ['tool_fragmentation', 'repetitive_tasks']);
assert.deepEqual(model.existing_tools, ['chatgpt', 'claude']);
assert.equal(model.budget, 'low');
assert.equal(model.automation_preference, 'high');
assert.equal(model.setup_tolerance, 'low');
assert.deepEqual(model.recommendation_history, []);

const fallback = UOM.create({ goal: 'invalid', budget: 'expensive', ai_skill: 'wizard' });
assert.equal(fallback.goal, 'save_time');
assert.equal(fallback.budget, 'zero');
assert.equal(fallback.ai_skill, 'beginner');

const context = UOM.toRecommendationContext(model);
assert.equal(context.budget, 'low');
assert(context.preference_tags.includes('goal:reduce_stress'));
assert(context.preference_tags.includes('automation:high'));
assert(context.preference_tags.includes('setup:low'));
assert(context.preference_tags.includes('pain:tool_fragmentation'));
assert(!Object.hasOwn(context, 'affiliate_payout'));
assert(!Object.hasOwn(context, 'email'));
assert(!Object.hasOwn(context, 'name'));

let historyModel = model;
for (let i = 0; i < 12; i++) {
  historyModel = UOM.recordDecision(historyModel, {
    recommendation_id: `rec_${i}`,
    decision: i === 11 ? 'buy_nothing' : 'accepted'
  });
}
assert.equal(historyModel.recommendation_history.length, 10);
assert.deepEqual(historyModel.recommendation_history.at(-1), {
  recommendation_id: 'rec_11',
  decision: 'buy_nothing'
});

console.log('User Operating Model contract OK');
