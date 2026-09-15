# AI仕事環境・商品選定MVP — Operations

Last verified: 2026-09-15 22:00 JST

## Canonical state

- Repository: `endlessjourney96-maker/PUBLIC_PAYLOAD`
- MVP entry: `index.html`
- Search-intent landing page: `meeting-minutes-pm.html`
- Recommendation engine: `src/work-pattern-engine.js`
- User Operating Model core: `src/user-operating-model.js`
- Diagnosis→UOM adapter: `src/diagnosis-uom-adapter.js`
- Anonymous event worker: `src/analytics-worker.js`
- Cloudflare deployment manifest: `wrangler.jsonc`
- Acquisition playbook: `ACQUISITION_PLAYBOOK.md`
- Product principle: 3問診断 → 無料改善を先に提示 → 必要な場合だけAI/SaaS・物理商品・支援を比較 → 買わない判断も許容
- Ranking principle: fit first; affiliate payout must not affect ranking.

## Critical path

**Read one genuine Analytics Engine event → record first observed funnel KPI → drive one attributable acquisition path to first recommendation click/CV.**

Eight-suite preflight and the read-only public-runtime smoke are proven green. The latest AEO/playbook head (`6c79830a...`) also passed GitHub Actions run 19 on 2026-09-15. Do not spend cycles re-proving unchanged contracts. Analytics Engine read access remains the observability gate; never generate synthetic valid events merely to populate KPI.

## Acquisition attribution

The owned-search landing page links to `index.html` with anonymous `source=owned_search` and `campaign=meeting-minutes-pm`. Safe source/campaign values are preserved across `page_view`, `diagnosis_start`, `diagnosis_complete`, and `recommendation_click`. No cookies, session IDs, referrer persistence, names, email, or free text are required for this attribution.

`tests/analytics-bridge.test.js` covers source/campaign forwarding plus rejection of personal/free-text fields. The attribution implementation and subsequent playbook/AEO gate are quality-gated green.

## AI discovery / AEO gate

`ACQUISITION_PLAYBOOK.md` now requires a read-only crawler-policy inspection before treating AI-search/AEO as an acquisition channel. Do not change Cloudflare crawler/account settings without owner approval. This is a future acquisition gate, not a reason to divert effort from the first measurable owned-search funnel.

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
| 2026-09-15 22:00 JST | known Workers runtime smoke PASS | not independently observed | - | - | - | - | - | - |

No new verified PV, clicks, CV or revenue are available. Missing values remain unknown, not zero.

## PM decision — 2026-09-15 22:00 JST

- Latest AEO/playbook change is CI-green (run 19, head `6c79830a...`).
- Do not expand features, landing pages, SNS channels, paid acquisition, affiliate activation, or UOM scope before first measurable funnel evidence.
- New-business scout: **新規着手なし**. No observed change justifies diverting build capacity from the primary MVP.
- Strategic radar remains B2B AI-DX/UOM and reusable recommendation/measurement assets, but these stay behind current CV validation.

## Next cycle

1. Read this file and `ACQUISITION_PLAYBOOK.md` first.
2. If approved Cloudflare read-only credentials/connection are available, run `scripts/query-analytics-engine.mjs` and record only returned observed values.
3. If credentials are unavailable, do not create/change tokens autonomously and do not fabricate KPI.
4. Keep the single test path `meeting-minutes-pm` → diagnosis → free advice → only-if-needed recommendation ready for the first approved real acquisition.
5. Avoid broader feature work; only fix defects that directly block measurability, trust, or first recommendation click/CV.

## Guardrails

No new account, paid service, contract, purchase, identity verification, bank/tax operation, affiliate activation, external messaging, social posting, application, or account-setting change without explicit owner approval. No unsafe scraping, auth bypass, spam, secret exposure, misleading advertising, or rights infringement.
