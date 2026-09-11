// Fail-open anonymous analytics client for AI Work Style MVP.
// Sends only allowlisted categorical fields; never blocks the diagnosis UX.
(function (global) {
  'use strict';

  const ENDPOINT = '/api/events';
  const ALLOWED_EVENTS = new Set([
    'page_view',
    'diagnosis_start',
    'diagnosis_complete',
    'recommendation_click'
  ]);
  const ALLOWED_KEYS = new Set([
    'source', 'campaign', 'pattern', 'budget', 'decision',
    'recommendation_id', 'kind', 'rank'
  ]);
  const SAFE_VALUE = /^[a-zA-Z0-9_.:-]{1,80}$/;

  function clean(name, data) {
    if (!ALLOWED_EVENTS.has(name)) return null;
    const payload = { name };
    for (const [key, value] of Object.entries(data || {})) {
      if (!ALLOWED_KEYS.has(key)) continue;
      const normalized = typeof value === 'number' ? String(value) : value;
      if (typeof normalized !== 'string' || !SAFE_VALUE.test(normalized)) continue;
      payload[key] = normalized;
    }
    return payload;
  }

  function send(name, data) {
    const payload = clean(name, data);
    if (!payload) return false;
    const body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(ENDPOINT, blob)) return true;
      }
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit',
        cache: 'no-store'
      }).catch(function () {});
      return true;
    } catch (_) {
      return false;
    }
  }

  global.MvpAnalytics = Object.freeze({ send: send });
})(window);
