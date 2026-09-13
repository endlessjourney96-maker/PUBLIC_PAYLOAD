// Static contract test for the Cloudflare analytics Worker.
// Keeps the production collector aligned with the privacy/validation rules
// without requiring a Cloudflare runtime in local/CI preflight.
const fs = require('node:fs');
const assert = require('node:assert');

const worker = fs.readFileSync('src/analytics-worker.js', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');

for (const event of ['page_view','diagnosis_start','diagnosis_complete','recommendation_click']) {
  assert(worker.includes(`'${event}'`), `missing allow-listed event: ${event}`);
}
for (const forbidden of ['email','ip','user_agent','referrer','session_id','cookie']) {
  assert(!new RegExp(`['\"]${forbidden}['\"]`).test(worker), `forbidden persisted field appears: ${forbidden}`);
}
assert(worker.includes("url.pathname !== '/api/events'"), 'worker must isolate /api/events');
assert(worker.includes("request.method !== 'POST'"), 'worker must reject non-POST requests');
assert(worker.includes('payload_too_large'), 'worker must enforce payload-size guard');
assert(worker.includes('ALLOWED_KEYS'), 'worker must use an explicit field allow-list');
assert(worker.includes('SAFE_VALUE'), 'worker must validate field values');
assert(worker.includes('env.ANALYTICS.writeDataPoint'), 'worker must write through Analytics Engine binding');
assert(wrangler.includes('"main": "src/analytics-worker.js"'), 'wrangler main must target analytics worker');
assert(wrangler.includes('"run_worker_first": ["/api/*"]'), 'API routes must execute Worker before static assets');
assert(wrangler.includes('"binding": "ANALYTICS"'), 'Analytics Engine binding must be configured');

console.log('analytics worker contract OK');
