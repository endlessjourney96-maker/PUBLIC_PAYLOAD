// Contract tests for anonymous MVP analytics and static asset coexistence.
// Run with: node tests/analytics-contract.test.js
// No network access required.
const assert = require('node:assert/strict');
const fs = require('node:fs');

const worker = fs.readFileSync('src/analytics-worker.js', 'utf8');
const engine = fs.readFileSync('src/work-pattern-engine.js', 'utf8');
const page = fs.readFileSync('index.html', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');

const events = ['page_view','diagnosis_start','diagnosis_complete','recommendation_click'];
for (const event of events) {
  assert(worker.includes(`'${event}'`), `worker must allow ${event}`);
  assert(engine.includes(`'${event}'`), `bridge must allow ${event}`);
  assert(page.includes(`'${event}'`), `UI must emit ${event}`);
}

for (const key of ['pattern','budget','decision','recommendation_id','kind','rank']) {
  assert(worker.includes(`'${key}'`) || worker.includes(`'${key}',`) || worker.includes(`, '${key}'`), `worker must accept ${key}`);
  assert(engine.includes(`'${key}'`) || engine.includes(`'${key}',`) || engine.includes(`, '${key}'`), `bridge must map ${key}`);
}

assert(engine.includes("key==='solution_id'?'recommendation_id':key"), 'solution_id must map to recommendation_id');
assert(worker.includes("url.pathname !== '/api/events'"), 'worker endpoint must remain /api/events');
assert(worker.includes("if (length > 2048)"), 'payload size guard must remain');
assert(worker.includes('SAFE_VALUE'), 'value allowlist validation must remain');
assert(worker.includes("e.recommendation_id || 'none'"), 'recommendation id must be persisted as anonymous dimension');
assert(!worker.includes("request.headers.get('user-agent')"), 'UA must not be persisted');
assert(!worker.includes('cf-connecting-ip'), 'IP must not be persisted');
assert(!worker.includes('cookie'), 'cookies must not be persisted');
assert(wrangler.includes('ai_work_style_events'), 'Analytics Engine dataset binding must remain configured');

// Deployment contract: static files are served by Cloudflare Assets while only /api/*
// invokes the Worker first. This prevents analytics routing from swallowing the MVP UI.
assert(wrangler.includes('"directory": "./"'), 'static assets directory must remain configured');
assert(wrangler.includes('"binding": "ASSETS"'), 'static assets binding must remain configured');
assert(wrangler.includes('"run_worker_first": ["/api/*"]'), 'only API routes should run the Worker first');
assert(worker.includes("return new Response('Not found', { status: 404 })"), 'non-event API requests should remain rejected by Worker');

console.log('analytics + assets contract: OK');
