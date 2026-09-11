# Analytics client integration contract

Updated: 2026-09-11 17:00 JST

## Critical path
Connect the existing diagnosis UI to the persisted anonymous analytics client after the interview blackout ends, without allowing analytics failure to break diagnosis.

## Existing persisted components verified this cycle
- `index.html`: diagnosis UI currently records QA events only in `localStorage` and still says inputs are not sent to an external server.
- `src/analytics-client.js`: fail-open client posts only allowlisted categorical fields to `/api/events`.

## Required integration assertions
1. Load `/src/analytics-client.js` before diagnosis event calls.
2. Preserve existing `localStorage` QA logging during initial rollout.
3. Mirror only these production events to `MvpAnalytics.send`: `page_view`, `diagnosis_start`, `diagnosis_complete`, `recommendation_click`.
4. Map recommendation click field to `recommendation_id`; never send destination URL.
5. Do not send candidate arrays, free text, referrer, IP, User-Agent, cookies, email, name, or user identifiers.
6. Update the UI disclosure before enabling remote analytics: explain that anonymous usage events are sent while diagnosis answers remain categorical and no personal information is requested.
7. Analytics exceptions/network failures must never prevent diagnosis, result rendering, reset, or outbound recommendation links.

## Smoke-test matrix after integration
- analytics client loads: diagnosis completes and one remote `diagnosis_complete` attempt is made.
- analytics client missing: diagnosis still completes.
- `/api/events` returns error/offline: diagnosis and recommendation link still work.
- zero budget: no recommendation click is fabricated.
- recommendation click: only `recommendation_id` plus approved attribution/category fields are eligible for remote payload.

## Next action
After 17:30 JST, update `index.html` to load the client, add a fail-open mirror inside the existing `event()` path, remove non-allowlisted remote fields, revise the privacy microcopy, then re-fetch the committed file and perform a source-level smoke review. Do not claim KPI collection is live until a deployed event is verified in the analytics dataset.
