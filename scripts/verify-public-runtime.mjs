#!/usr/bin/env node

/**
 * Read-only production smoke verifier for the AI work-environment MVP.
 * Usage: node scripts/verify-public-runtime.mjs https://<worker>.workers.dev
 *
 * It performs no deployment/config/account changes and records no KPI.
 * A successful run only proves HTTP/runtime contracts; Analytics Engine
 * ingestion must still be confirmed separately from observed production data.
 */

const base = (process.argv[2] || process.env.PUBLIC_RUNTIME_URL || '').replace(/\/$/, '');
if (!base || !/^https:\/\//i.test(base)) {
  console.error('Usage: node scripts/verify-public-runtime.mjs https://<public-runtime>');
  process.exit(2);
}

const checks = [];

async function checkGet(path) {
  const url = `${base}${path}`;
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();
    checks.push({ path, ok: response.ok, status: response.status, bytes: text.length });
  } catch (error) {
    checks.push({ path, ok: false, status: null, error: String(error?.message || error) });
  }
}

async function checkEventEndpoint() {
  const path = '/api/events';
  const url = `${base}${path}`;
  try {
    // Contract-only probe: deliberately unsupported event. A correct worker must reject it.
    // This avoids creating a fake page_view / click that could contaminate real KPI counts.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event: '__runtime_contract_probe__' }),
    });
    checks.push({
      path: `${path} (invalid-event rejection)`,
      ok: response.status >= 400 && response.status < 500,
      status: response.status,
    });
  } catch (error) {
    checks.push({ path, ok: false, status: null, error: String(error?.message || error) });
  }
}

await checkGet('/');
await checkGet('/meeting-minutes-pm.html');
await checkEventEndpoint();

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), base, checks }, null, 2));
process.exit(checks.every((item) => item.ok) ? 0 : 1);
