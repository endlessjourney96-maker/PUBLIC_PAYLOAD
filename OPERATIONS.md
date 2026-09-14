# AI仕事環境・商品選定MVP — Operations

Last verified: 2026-09-15 03:57 JST

## Canonical state

- Repository: `endlessjourney96-maker/PUBLIC_PAYLOAD`
- MVP entry: `index.html`
- Search-intent landing page: `meeting-minutes-pm.html`
- Recommendation engine: `src/work-pattern-engine.js`
- User Operating Model core: `src/user-operating-model.js`
- Diagnosis→UOM adapter: `src/diagnosis-uom-adapter.js`
- Anonymous event worker: `src/analytics-worker.js`
- Cloudflare deployment manifest: `wrangler.jsonc`
- Product principle: 3問診断 → 無料改善を先に提示 → 必要な場合だけAI/SaaS・物理商品・支援を比較 → 買わない判断も許容
- Ranking principle: fit first; affiliate payout must not affect ranking.

## Critical path

**Read one genuine Analytics Engine event → record first observed funnel KPI.**

Eight-suite preflight and the read-only public-runtime smoke are proven green in GitHub Actions. Do not spend the next cycle re-proving repository/runtime contracts unless code changes. The remaining observability gate is read access to the Analytics Engine dataset; do not generate synthetic valid events merely to make the KPI table non-empty.

## User Operating Model

UOM v1 is intentionally small and non-identifying. It captures structured intent and constraints such as goal, pains, budget, AI skill, automation preference, setup tolerance and existing tools. It excludes names, email, free text and affiliate payout. It is a common core candidate for future SaaS/product recommendations and B2B AI-DX, but UOM expansion must not delay first public measurement.

The existing 3-question diagnosis now has a minimal adapter at `src/diagnosis-uom-adapter.js`; it reuses answers already collected rather than expanding the questionnaire. Contract coverage: `tests/user-operating-model.test.js` and `tests/diagnosis-uom-adapter.test.js`.

## Deployment/runtime notes

`wrangler.jsonc` explicitly defines the Cloudflare Worker entry (`src/analytics-worker.js`), static assets, `/api/*` worker-first routing and Analytics Engine binding `ANALYTICS` → dataset `ai_work_style_events`.

Repository configuration does not by itself prove which commit is live. Before any deployment/configuration change:

1. Inspect the existing Cloudflare/Git integration and current deployed commit.
2. Avoid creating a new account, project, domain, paid service, or changing account settings without owner approval.
3. If the existing integration auto-deploys this repository, verify the public URL after the commit and record the deployed SHA when observable.
4. If it does not auto-deploy, stop before changing external configuration and report the exact owner action needed.

## Funnel contract

Only record observed values. Never infer or fabricate KPIs.

Allow-listed events:

- `page_view`
- `diagnosis_start`
- `diagnosis_complete`
- `recommendation_click`

The browser keeps a local `mvp_events` log and the work-pattern engine bridges the same allow-listed anonymous events to `POST /api/events`. `src/analytics-worker.js` implements that endpoint and writes valid events to Cloudflare Analytics Engine when the `ANALYTICS` binding is available. It rejects unsupported methods/events, oversized payloads and unsafe values; it does not intentionally persist IP, user-agent, referrer, free text, session IDs, names or email.

### Current measurement gap

The known public runtime passed the read-only smoke on 2026-09-14 JST, including `/`, `/meeting-minutes-pm.html`, and rejection behavior for an intentionally invalid `/api/events` request. This proves public reachability and the expected endpoint contract without writing fake KPI events.

A read-only query helper exists at `scripts/query-analytics-engine.mjs`. It queries only the four allow-listed event names for the last 7 days and uses `SUM(_sample_interval)` so observed counts remain sampling-aware. It requires `CF_ACCOUNT_ID` and `CF_ANALYTICS_TOKEN` with Cloudflare **Account Analytics: Read** permission. No credential is stored in this repository.

Until read-only credentials are available through an approved secret/connection path, Analytics Engine ingestion cannot be independently observed from this operating environment. Do not place a Cloudflare token in source code, chat text, public GitHub variables, or logs.

## Preflight and runtime smoke

Canonical preflight command: `node tests/run-all.js`.

**Eight-suite PASS verified 2026-09-15 JST.** GitHub Actions run `34866212928`, head SHA `9353deccf7b18d89df9a7b3e947d8264797e295d`, completed `success`. This baseline includes the diagnosis→UOM adapter alongside engine, catalog, recommendation, UOM, analytics contract, browser bridge and worker contract tests.

**Public runtime smoke PASS verified 2026-09-14 JST.** GitHub Actions run `34816329100` on head SHA `ffd7709671c8542219c8ead15016b9b5265c0009` completed successfully. Job `public-runtime-smoke` and step `Verify known public runtime without writing KPI` both concluded `success`; the `preflight` job also concluded `success` in the same run.

A later operations-only push at head `20b3040344a682fcdea78e16fab362c861c9785c` also completed both jobs successfully in run `34830837848`.

The smoke verifier intentionally does not emit a valid KPI event. It checks public pages and the `/api/events` rejection contract so operational verification cannot be mistaken for real traffic.

## Smoke acceptance

Runtime contract verified automatically:

1. `/` returns HTTP 2xx.
2. `/meeting-minutes-pm.html` returns HTTP 2xx.
3. `/api/events` exhibits the expected rejection behavior for invalid input without writing KPI.

Still requiring real-user observation:

4. Landing-page CTA reaches the diagnosis page in an actual user session.
5. Major CTA is usable at mobile width.
6. Diagnosis can start and complete.
7. A recommendation can be clicked when a paid comparison is eligible.
8. "Buy nothing" remains possible for zero-budget/no-fit cases.
9. A real allow-listed event is observable in the configured Analytics Engine dataset.

## KPI log

| checked_at | public_url | deployed_sha | PV | diagnosis_start | diagnosis_complete | recommendation_click | CV | revenue_yen |
|---|---|---|---:|---:|---:|---:|---:|---:|
| 2026-09-15 03:57 JST | known Workers runtime smoke PASS | not independently observed | - | - | - | - | - | - |

## PMO priority

1. **AI仕事環境・商品選定MVP** — primary; obtain read-only observability and close first measurement loop.
2. **note / owned content** — acquisition after funnel measurability; avoid volume production first.
3. **ラクヨコ** — short-term monetization experiment using the same recommendation model; do not delay primary MVP.
4. **法人DX / UOM-based services / digital products** — strategically attractive, especially as UOM expands from individual to team/company operating models, but keep outside the first-click/CV critical path.

## New-business scout decision

**新規着手なし.** UOM strengthens the existing MVP and future AI-DX path rather than justifying a separate project. New ideas must beat the current path on time-to-first-revenue, margin/recurrence, effort, fixed cost, asset reuse, automation leverage, defensibility and safety before receiving build capacity.

## Next cycle

1. Read this file first.
2. Do not repeat preflight/runtime smoke unless repository/runtime code changes; current baselines are green.
3. If approved read-only Cloudflare credentials/connection are available, run `scripts/query-analytics-engine.mjs` and record only returned observed values.
4. If credentials are not available, do not create/change tokens autonomously; keep the exact observability gap explicit.
5. Do not generate a valid synthetic event and count it as KPI.
6. Keep the diagnosis→UOM adapter minimal; do not expand the questionnaire merely to populate UOM.
7. Once the measurement loop is observable, prioritize one real acquisition path and first recommendation click/CV before broader feature work.

## Guardrails

No new account, paid service, contract, purchase, identity verification, bank/tax operation, affiliate activation, external messaging, social posting, application, or account-setting change without explicit owner approval. No unsafe scraping, auth bypass, spam, secret exposure, misleading advertising, or rights infringement.
