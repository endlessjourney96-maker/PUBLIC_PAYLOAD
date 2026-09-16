# First Real Traffic Validation Runbook

Last updated: 2026-09-16 10:00 JST

## Objective

Move the AI work-environment/product-selection MVP from build-complete to evidence-producing with the smallest owner-approved real acquisition test, without expanding product scope or contaminating KPI.

## Preconditions

- Latest observed MVP Preflight is green: run #24, head `5ee519b04bf66ff9b35199eba6458420fe9d79d8`, completed successfully.
- Keep exactly one acquisition path: `meeting-minutes-pm.html` → diagnosis → free improvement → only-if-needed recommendation.
- Do not generate synthetic valid analytics events to populate KPI.
- Do not activate affiliate links, paid ads, SNS posts, outreach, account changes, purchases, contracts, or Cloudflare settings without explicit owner approval.

## Phase A — Observability gate

When approved Cloudflare read-only access is available:

1. Run `scripts/query-analytics-engine.mjs` with `CF_ACCOUNT_ID` and a read-only `CF_ANALYTICS_TOKEN` supplied through the approved environment, never committed to Git.
2. Record only returned genuine events in `OPERATIONS.md`.
3. If no rows are returned, record the result as observed no-row output for that exact query window; do not convert unknown historical periods into zero.
4. If the query cannot run because credentials are unavailable, stop at this gate and keep KPI unknown.

## Phase B — One approved real acquisition source

After observability is proven, use one owner-approved external entry only. The destination must be the existing `meeting-minutes-pm.html`; do not create another landing page for the first test.

Keep source attribution consistent with the existing campaign contract. Do not add identity, email, free text, cookies, session IDs, or referrer persistence merely to improve attribution.

## Evidence ladder

Evaluate in sequence:

1. `page_view`
2. `diagnosis_start`
3. `diagnosis_complete`
4. `recommendation_click`
5. independently observable external CV
6. confirmed revenue

Do not skip ahead and optimize monetization before the preceding behavior is observable.

## Decision matrix

| First observed break | PM response | Do not do yet |
|---|---|---|
| No attributable page view | inspect acquisition/discoverability and destination correctness | add product features |
| Page view, no diagnosis start | improve existing promise/CTA | add channels |
| Start, no completion | reduce ambiguity/friction in the existing 3 questions | add questions |
| Completion, no recommendation click | distinguish valid free-only outcome from weak recommendation fit | force purchase intent |
| Recommendation click | hold path stable and collect a small real sample | redesign funnel immediately |
| CV but no confirmed revenue | verify external conversion/revenue evidence | book estimated revenue |

## Success definition for the first test

The first test succeeds operationally when at least one genuine attributable event can be read end-to-end from the approved analytics path. Commercial success is a separate claim and requires observed recommendation click/CV/revenue evidence.

## Market-scout implication — 2026-09-16

Fresh market evidence continues to strengthen the B2B AI workflow/governance opportunity, but does not justify diverting build capacity before first MVP funnel evidence. Enterprise demand is shifting toward workflow orchestration, observability, governance, cost control, and ROI measurement. Treat this as validation that the existing diagnosis/UOM/measurement assets have downstream B2B reuse value, not as permission to start a second product.

Decision: **新規着手なし**. Re-score the B2B candidate only after the current funnel yields genuine behavioral evidence or a concrete buyer signal appears.

## Owner approval boundary

Owner action is required only when the next step crosses an external boundary: supplying/authorizing read-only Cloudflare access, approving an external traffic action, affiliate activation, posting, outreach, paid acquisition, account/configuration change, contract, purchase, or other external commitment.

## Next PM action

1. Keep the product stable; run no broader feature expansion.
2. If approved Analytics Engine read access appears, query immediately and record only observed values.
3. If access remains unavailable, fix only defects that directly block trust, measurability, discoverability of the existing page, or first recommendation click/CV.
4. Preserve the single-path test until real evidence identifies the first break point.
5. Keep new-business scouting observational unless a candidate clearly exceeds the current MVP after time-to-first-sale, margin, fixed cost, reuse, automation leverage, competition, and legal/security risk are included.