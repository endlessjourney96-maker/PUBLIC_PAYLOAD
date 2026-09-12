# AI仕事環境・商品選定MVP — Operations

Last verified: 2026-09-13 JST

## Canonical state

- Repository: `endlessjourney96-maker/PUBLIC_PAYLOAD`
- MVP entry: `index.html`
- Search-intent landing page: `meeting-minutes-pm.html`
- Recommendation engine: `src/work-pattern-engine.js`
- Product principle: 3問診断 → 無料改善を先に提示 → 必要な場合だけAI/SaaS・物理商品・支援を比較 → 買わない判断も許容
- Ranking principle: fit first; affiliate payout must not affect ranking.

## Critical path

**Public runtime verification → first observed funnel KPI.**

The repository now exists and is writable, so the previous blocker "GitHub repository unavailable" is obsolete. Do not create feature versions merely to show activity. First verify the already-connected public runtime and close the measurement loop.

## Deployment/runtime notes

A previously confirmed Cloudflare Workers public URL exists in project history, but this repository does not currently contain a `wrangler.toml` or another explicit deployment manifest. Do not assume the current repository commit is deployed merely because GitHub is writable.

Before any deployment/configuration change:

1. Inspect the existing Cloudflare/Git integration and current deployed commit.
2. Avoid creating a new account, project, domain, paid service, or changing account settings without owner approval.
3. If the existing integration auto-deploys this repository, verify the public URL after the commit and record the deployed SHA.
4. If it does not auto-deploy, stop before changing external configuration and report the exact owner action needed.

## Funnel contract

Only record observed values. Never infer or fabricate KPIs.

Events implemented in the browser:

- `page_view`
- `diagnosis_start`
- `diagnosis_complete`
- `recommendation_click`

The browser keeps a local `mvp_events` log. `src/work-pattern-engine.js` also attempts to send the same allow-listed anonymous events to `POST /api/events` and fails open when unavailable.

### Current measurement gap

No server-side `/api/events` implementation is present in this repository as of this verification. Therefore remote PV/click/CV reporting must not be claimed from repository code alone. Closing this gap is the next implementation candidate **only after confirming the existing public runtime architecture**, so we do not build an incompatible backend.

## Smoke acceptance

After confirming a deployed runtime, verify:

1. `/` returns HTTP 2xx.
2. `/meeting-minutes-pm.html` returns HTTP 2xx.
3. Landing-page CTA reaches the diagnosis page.
4. Major CTA is usable at mobile width.
5. Diagnosis can start and complete.
6. A recommendation can be clicked when a paid comparison is eligible.
7. "Buy nothing" remains possible for zero-budget/no-fit cases.
8. Any remote event endpoint used in production accepts only anonymous allow-listed fields and does not collect personal information.

## KPI log

| checked_at | public_url | deployed_sha | PV | diagnosis_start | diagnosis_complete | recommendation_click | CV | revenue_yen |
|---|---|---|---:|---:|---:|---:|---:|---:|
| 2026-09-13 | not re-verified this cycle | not re-verified | - | - | - | - | - | - |

## PMO priority

1. **AI仕事環境・商品選定MVP** — primary; close public runtime + measurement loop.
2. **note / owned content** — use as acquisition only after the MVP funnel is measurable; avoid volume production before that.
3. **ラクヨコ** — keep as a short-term monetization experiment using the same recommendation model, but do not let it delay the primary MVP.
4. **法人DX / digital products** — attractive monetization path but longer lead time; keep separate from the first-click/CV critical path.

## Next cycle

1. Read this file first.
2. Confirm whether the known Cloudflare Workers runtime is still live and whether it deploys from this repository.
3. Record the public URL and deployed SHA if verifiable.
4. If runtime architecture is confirmed, implement the smallest compatible anonymous event collector + readout/test path; otherwise create only the deployment handoff needed for the owner.
5. Record observed funnel KPIs only after a real public request.

## Guardrails

No new account, paid service, contract, purchase, identity verification, bank/tax operation, affiliate activation, external messaging, or account-setting change without explicit owner approval. No unsafe scraping, auth bypass, spam, secret exposure, misleading advertising, or rights infringement.
