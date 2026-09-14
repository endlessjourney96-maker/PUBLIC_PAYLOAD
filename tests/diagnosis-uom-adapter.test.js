const assert=require('node:assert/strict');
const Adapter=require('../src/diagnosis-uom-adapter.js');

const repetition=Adapter.fromDiagnosis({pattern:'repetition',budget:'low',context:'企画・事務'});
assert.equal(repetition.schema_version,1);
assert.equal(repetition.goal,'delegate');
assert.deepEqual(repetition.pains,['repetitive_tasks']);
assert.equal(repetition.budget,'low');
assert.equal(repetition.automation_preference,'high');
assert.equal(repetition.ai_skill,'beginner');
assert.equal(repetition.setup_tolerance,'medium');
assert(!Object.hasOwn(repetition,'context'));
assert(!Object.hasOwn(repetition,'name'));
assert(!Object.hasOwn(repetition,'email'));

const unknown=Adapter.fromDiagnosis({pattern:'unknown',budget:'not-valid'});
assert.equal(unknown.goal,'learn');
assert.deepEqual(unknown.pains,['unstructured_work']);
assert.equal(unknown.budget,'zero');

console.log('Diagnosis to UOM adapter contract OK');
