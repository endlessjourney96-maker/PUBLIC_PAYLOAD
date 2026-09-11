// Anonymous KPI endpoint for AI Work Style MVP
// Cloudflare Worker + Analytics Engine binding: ANALYTICS
// Privacy: no IP, UA, referrer, free text, cookies, or identifiers are persisted.

const ALLOWED_EVENTS = new Set([
  'page_view',
  'diagnosis_start',
  'diagnosis_complete',
  'recommendation_click'
]);
const ALLOWED_KEYS = new Set([
  'name','source','campaign','pain','role','budget','recommendation_id'
]);
const SAFE_VALUE = /^[a-zA-Z0-9_.:-]{1,80}$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function sanitize(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (!ALLOWED_KEYS.has(key) || typeof value !== 'string') continue;
    if (!SAFE_VALUE.test(value)) continue;
    out[key] = value;
  }
  if (!ALLOWED_EVENTS.has(out.name)) return null;
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/events') return new Response('Not found', { status: 404 });
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

    const length = Number(request.headers.get('content-length') || 0);
    if (length > 2048) return json({ ok: false, error: 'payload_too_large' }, 413);

    let raw;
    try { raw = await request.json(); }
    catch { return json({ ok: false, error: 'invalid_json' }, 400); }

    const e = sanitize(raw);
    if (!e) return json({ ok: false, error: 'invalid_event' }, 400);

    // Dataset schema:
    // blobs: event, source, campaign, pain, role, budget, recommendation_id
    // doubles: count (=1)
    env.ANALYTICS.writeDataPoint({
      blobs: [
        e.name,
        e.source || 'none',
        e.campaign || 'none',
        e.pain || 'none',
        e.role || 'none',
        e.budget || 'none',
        e.recommendation_id || 'none'
      ],
      doubles: [1]
    });

    return json({ ok: true }, 202);
  }
};
