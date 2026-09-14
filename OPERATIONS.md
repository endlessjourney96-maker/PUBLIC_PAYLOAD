# AI仕事環境・商品選定MVP — Operations

Last verified: 2026-09-14 10:00 JST

## Canonical state

- Repository: `endlessjourney96-maker/PUBLIC_PAYLOAD`
- MVP entry: `index.html`
- Search-intent landing page: `meeting-minutes-pm.html`
- Recommendation engine: `src/work-pattern-engine.js`
- User Operating Model core: `src/user-operating-model.js`
- Anonymous event worker: `src/analytics-worker.js`
- Cloudflare deployment manifest: `wrangler.jsonc`
- Product principle: 3問診断 → 無料改善を先に提示 → 必要な場合だけAI/SaaS・物理商品・支援を比較 → 買わない判断も許容
- Ranking principle: fit first; affiliate payout must not affect ranking.

## Critical path

**Public runtime verification → first observed anonymous event → first observed funnel KPI.**

Seven-suite preflight is now proven green in GitHub Actions. Do not spend the next cycle re-proving repository contracts unless code changes. The next value gate is proving that the connected public runtime is actually running the intended code and observing a real anonymous event end-to-end.

## User Operating Model

UOM v1 is intentionally small and non-identifying. It captures structured intent and constraints such as goal, pains, budget, AI skill, automation preference, setup tolerance and existing tools. It excludes names, email, free text and affiliate payout. It is a common core candidate for future SaaS/product recommendations and B2B AI-DX, but UOM expansion must not delay first public measurement.

Contract coverage: `tests/user-operating-model.test.js`.

## Deployment/runtime notes

`wrangler.jsonc` explicitly defines the Cloudflare Worker entry (`src/analytics-worker.js`), static assets, `/api/*` worker-first routing and Analytics Engine binding `ANALYTICS` → dataset `ai_work_style_events`.

Repository configuration does not by itself prove which commit is live. Before any deployment/configuration change:

1. Inspect the existing Cloudflare/Git integration and current deployed commit.
2. Avoid creating a new account, project, domain, paid service, or changing account settings without owner approval.
3. If the existing integration auto-deploys this repository, verify the public URL after the commit and record the deployed SHA.
4. If it does not auto-deploy, stop before changing external configuration and report the exact owner action needed.

## Funnel contract

Only record observed values. Never infer or fabricate KPIs.

Allow-listed events:

- `page_view`
- `diagnosis_start`
- `diagnosis_complete`
- `recommendation_click`

The browser keeps a local `mvp_events` log and attempts to send the same allow-listed anonymous events to `POST /api/events`. `src/analytics-worker.js` implements that endpoint and writes valid events to Cloudflare Analytics Engine when the `ANALYTICS` binding is available. It rejects unsupported methods/events, oversized payloads and unsafe values; it does not intentionally persist IP, user-agent, referrer, free text, session IDs, names or email.

### Current measurement gap

The remote collector exists in repository code, but production deployment and Analytics Engine ingestion have not yet been re-verified. Therefore remote PV/click/CV reporting must not be claimed until a real public request is observed.

## Preflight

Canonical command: `node tests/run-all.js`.

**PASS verified 2026-09-14 JST.** GitHub Actions run `34785582730` completed successfully on head SHA `49a6532a9b13460058daa4290352cc126f8f5bae`; job `preflight` and step `Run seven-suite preflight` both concluded `success`.

The suite covers engine, catalog, recommendation integration, UOM, analytics/assets contract, browser analytics bridge and Worker analytics contract.

## Smoke acceptance

After confirming a deployed runtime, verify:

1. `/` returns HTTP 2xx.
2. `/meeting-minutes-pm.html` returns HTTP 2xx.
3. Landing-page CTA reaches the diagnosis page.
4. Major CTA is usable at mobile width.
5. Diagnosis can start and complete.
6. A recommendation can be clicked when a paid comparison is eligible.
7. "Buy nothing" remains possible for zero-budget/no-fit cases.
8. `POST /api/events` accepts only anonymous allow-listed fields and an event is observable in the configured dataset.

## KPI log

| checked_at | public_url | deployed_sha | PV | diagnosis_start | diagnosis_complete | recommendation_click | CV | revenue_yen |
|---|---|---|---:|---:|---:|---:|---:|---:|
| 2026-09-14 10:00 JST | not re-verified this cycle | not re-verified | - | - | - | - | - | - |

## PMO priority

1. **AI仕事環境・商品選定MVP** — primary; verify runtime and close first measurement loop.
2. **note / owned content** — acquisition after funnel measurability; avoid volume production first.
3. **ラクヨコ** — short-term monetization experiment using the same recommendation model; do not delay primary MVP.
4. **法人DX / UOM-based services / digital products** — strategically attractive, especially as UOM expands from individual to team/company operating models, but keep outside the first-click/CV critical path.

## New-business scout decision

**新規着手なし.** UOM strengthens the existing MVP and future AI-DX path rather than justifying a separate project. New ideas must beat the current path on time-to-first-revenue, margin/recurrence, effort, fixed cost, asset reuse, automation leverage, defensibility and safety before receiving build capacity.

## Next cycle

1. Read this file first.
2. Do not repeat preflight unless repository code changes; current seven-suite baseline is green.
3. Confirm the known Cloudflare Workers public runtime and deployed commit without changing external configuration.
4. If runtime matches, perform smoke acceptance and observe one anonymous event end-to-end.
5. Record only real observed funnel KPIs.
6. Only after the measurement loop works, connect the existing 3-question diagnosis to the smallest useful UOM adapter; do not expand the questionnaire merely to populate UOM.

## Guardrails

No new account, paid service, contract, purchase, identity verification, bank/tax operation, affiliate activation, external messaging, social posting, application, or account-setting change without explicit owner approval. No unsafe scraping, auth bypass, spam, secret exposure, misleading advertising, or rights infringement.
