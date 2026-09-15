# AI仕事環境・商品選定MVP — Operations

Last verified: 2026-09-15 10:00 JST

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

**Read one genuine Analytics Engine event → record first observed funnel KPI → drive one attributable acquisition path to first recommendation click/CV.**

Eight-suite preflight and the read-only public-runtime smoke are proven green. Do not spend cycles re-proving unchanged contracts. Analytics Engine read access remains the observability gate; never generate synthetic valid events merely to populate KPI.

## Acquisition attribution

The owned-search landing page already links to `index.html` with anonymous `source=owned_search` and `campaign=meeting-minutes-pm`. On 2026-09-15 the diagnosis page and browser analytics bridge were updated so safe `source` and `campaign` query values are preserved across `page_view`, `diagnosis_start`, `diagnosis_complete`, and `recommendation_click`. The Worker already supported these fields. This closes a measurement-design gap: once read access exists, the first real funnel can be attributed to the acquisition entry without cookies, session IDs, referrer persistence, names, email, or free text.

`tests/analytics-bridge.test.js` now covers source/campaign forwarding plus rejection of personal/free-text fields. GitHub Actions run 14 for the preceding attribution code commit completed success; run 15 for the final test commit was queued at last observation, so do not yet claim the final head as green until that run completes.

## User Operating Model

UOM v1 is intentionally small and non-identifying. It captures structured intent and constraints such as goal, pains, budget, AI skill, automation preference, setup tolerance and existing tools. It excludes names, email, free text and affiliate payout. The existing 3-question diagnosis has a minimal adapter at `src/diagnosis-uom-adapter.js`; do not expand the questionnaire merely to populate UOM.

## Funnel contract

Only record observed values. Never infer or fabricate KPIs.

Allow-listed events: `page_view`, `diagnosis_start`, `diagnosis_complete`, `recommendation_click`.

Anonymous dimensions may include source, campaign, pattern, budget, decision, recommendation_id, kind and rank. No IP, user-agent, referrer, free text, session IDs, names or email are intentionally persisted.

### Current measurement gap

The known public runtime passed read-only smoke, but genuine Analytics Engine ingestion is not independently observable from this environment without approved read-only credentials/connection. `scripts/query-analytics-engine.mjs` is ready and requires `CF_ACCOUNT_ID` and `CF_ANALYTICS_TOKEN` with Cloudflare Account Analytics: Read permission. No credential is stored in the repository.

## KPI log

| checked_at | public_url | deployed_sha | PV | diagnosis_start | diagnosis_complete | recommendation_click | CV | revenue_yen |
|---|---|---|---:|---:|---:|---:|---:|---:|
| 2026-09-15 10:00 JST | known Workers runtime smoke PASS | not independently observed | - | - | - | - | - | - |

## Morning PMO — 2026-09-15

### Previous-day / overnight result
- Public runtime contract and eight-suite baseline were established.
- Diagnosis→UOM adapter was completed without adding questions or PII.
- Landing-page privacy wording was aligned with actual anonymous event behavior.
- Acquisition attribution gap was identified and implementation added: owned-search source/campaign can now flow through the funnel.

### Current hypothesis
A narrow problem-first landing page (starting with PM meeting-minutes burden) → free improvement advice → 3-question diagnosis → only-if-needed comparison is a stronger trust/CV path than generic AI-tool rankings. The immediate test is not content volume; it is whether one attributable entry can produce diagnosis completion and recommendation consideration without weakening the buy-nothing option.

### Monetization distance
Code/runtime readiness is near the measurement stage, but monetization is not yet proven. The next meaningful commercial evidence is: real attributable visit → diagnosis completion → recommendation click; after that, only actual external conversion/revenue may be recorded as CV/revenue.

### Observed KPI
No new verified PV, clicks, CV or revenue are available. Missing values remain unknown, not zero.

### Today top 3
1. Close read-only Analytics Engine observability when an approved connection becomes available.
2. Confirm final attribution test CI green and keep source/campaign measurement intact through deployment.
3. After measurability, use one owned acquisition path first; do not fan out to multiple channels before the first attributable funnel signal.

### Short-term monetization radar
- Primary: AI仕事環境・商品選定MVP — highest asset reuse and lowest incremental fixed cost.
- Secondary: ラクヨコ — keep as a bounded monetization experiment only if it reuses the same recommendation/measurement assets.
- B2B AI-DX/UOM service — strategically attractive but slower to first proof and must not displace current CV validation.

## New-business scout decision

**新規着手なし.** No observed change currently justifies diverting build capacity from the primary MVP. UOM, B2B DX, digital products, creator/SNS operations and AI-assisted service work remain radar items, not active builds, until they clearly beat the current path on time-to-first-revenue, margin/recurrence, effort, fixed cost, asset reuse, automation leverage, defensibility and safety.

## Next cycle

1. Read this file first.
2. Check the final attribution-head GitHub Actions result; if green, treat acquisition attribution as quality-gated.
3. If approved Cloudflare read-only credentials/connection are available, run `scripts/query-analytics-engine.mjs` and record only returned observed values.
4. If credentials are unavailable, do not create/change tokens autonomously and do not fabricate KPI.
5. Avoid broader feature work. Prepare only work that shortens the path to one attributable real funnel and first recommendation click/CV.

## Guardrails

No new account, paid service, contract, purchase, identity verification, bank/tax operation, affiliate activation, external messaging, social posting, application, or account-setting change without explicit owner approval. No unsafe scraping, auth bypass, spam, secret exposure, misleading advertising, or rights infringement.
