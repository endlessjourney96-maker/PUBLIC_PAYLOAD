// Read-only Workers Analytics Engine query helper.
// Requires CF_ACCOUNT_ID and CF_ANALYTICS_TOKEN (Account Analytics: Read).
// Never writes events and never fabricates KPI traffic.
const accountId = process.env.CF_ACCOUNT_ID;
const token = process.env.CF_ANALYTICS_TOKEN;
const dataset = process.env.ANALYTICS_DATASET || 'ai_work_style_events';

if (!accountId || !token) {
  console.error('Missing CF_ACCOUNT_ID or CF_ANALYTICS_TOKEN. Read-only analytics credentials are required.');
  process.exit(2);
}

if (!/^[A-Za-z0-9_]+$/.test(dataset)) {
  console.error('Unsafe ANALYTICS_DATASET value.');
  process.exit(2);
}

const sql = `
SELECT
  blob1 AS event_name,
  SUM(_sample_interval) AS observed_events,
  MAX(timestamp) AS last_observed_at
FROM ${dataset}
WHERE timestamp >= NOW() - INTERVAL '7' DAY
GROUP BY blob1
ORDER BY observed_events DESC
FORMAT JSON
`.trim();

const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${token}`,
    'content-type': 'text/plain; charset=utf-8'
  },
  body: sql
});

const text = await response.text();
if (!response.ok) {
  console.error(`Analytics Engine query failed: HTTP ${response.status}`);
  console.error(text.slice(0, 1000));
  process.exit(1);
}

let parsed;
try { parsed = JSON.parse(text); }
catch {
  console.error('Analytics Engine returned non-JSON output.');
  process.exit(1);
}

const rows = Array.isArray(parsed.data) ? parsed.data : [];
const allowed = new Set(['page_view','diagnosis_start','diagnosis_complete','recommendation_click']);
const output = rows
  .filter(row => allowed.has(row.event_name))
  .map(row => ({
    event_name: row.event_name,
    observed_events: Number(row.observed_events || 0),
    last_observed_at: row.last_observed_at || null
  }));

console.log(JSON.stringify({
  dataset,
  window: 'last_7_days',
  observed_only: true,
  events: output
}, null, 2));
