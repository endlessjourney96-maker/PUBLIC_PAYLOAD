// Executable browser-bridge QA without network access.
// Run: node tests/analytics-bridge.test.js
const assert = require('node:assert/strict');

const sent=[];
global.window={localStorage:null,__mvpAnalyticsBridge:false};
class StorageMock {
  constructor(){this.data={};}
  setItem(k,v){this.data[k]=String(v);}
  getItem(k){return this.data[k]??null;}
}
global.Storage=StorageMock;
window.localStorage=new StorageMock();
global.navigator={sendBeacon:(url,body)=>{sent.push({url,body});return true;}};
global.Blob=class BlobMock{constructor(parts,opts){this.parts=parts;this.type=opts&&opts.type;}};
global.fetch=()=>Promise.resolve({ok:true});

require('../src/work-pattern-engine.js');

function emit(event){window.localStorage.setItem('mvp_events',JSON.stringify([event]));}
emit({name:'page_view',pattern:'writing',email:'secret@example.com'});
emit({name:'diagnosis_complete',pattern:'technical',budget:'low',decision:'compare_options'});
emit({name:'recommendation_click',pattern:'technical',budget:'low',solution_id:'codex',kind:'ai_saas',rank:1,free_text:'do not send'});

assert.equal(sent.length,3,'each supported event should send once');
for(const x of sent) assert.equal(x.url,'/api/events');
const payloads=sent.map(x=>JSON.parse(x.body.parts.join('')));
assert.equal(payloads[2].recommendation_id,'codex','solution_id must map to recommendation_id');
assert.equal(payloads[2].rank,'1','numeric rank must normalize safely');
assert.ok(!('email' in payloads[0]),'unexpected personal fields must be dropped');
assert.ok(!('free_text' in payloads[2]),'free text must be dropped');

const before=sent.length;
emit({name:'unknown_event',pattern:'writing'});
assert.equal(sent.length,before,'unknown events must not be sent');
console.log('analytics bridge: anonymous event forwarding OK');
