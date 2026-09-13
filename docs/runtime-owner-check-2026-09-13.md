# Production runtime verification card — 2026-09-13

## Why this exists

The MVP implementation is persisted and recoverable. The remaining critical blocker is identifying the exact Cloudflare production deployment before adding a server-side analytics collector or sending acquisition traffic.

## Known historical runtime

A prior external probe recorded this production candidate:

`https://soft-fog-b2ad.ryo-endless-journey96.workers.dev/`

On 2026-09-11 06:00 JST that probe still showed the older/simple diagnosis UI, so repository state must NOT be assumed to equal production state.

## Minimal read-only owner check

In the existing Cloudflare project, record only these values (no settings change required):

1. Production URL
2. Connected Git repository (expected candidate: `endlessjourney96-maker/PUBLIC_PAYLOAD`)
3. Production branch
4. Latest production deployment commit SHA, if displayed
5. Whether automatic deployments from GitHub are enabled

Do **not** create a new project/domain/account or change build/deploy settings during this check.

## GO / STOP gate

### GO
Proceed to acceptance and analytics implementation only when:
- production URL is identified;
- the deployed source/commit is known or production HTML can be matched to the canonical repository version;
- `/` and `/meeting-minutes-pm.html` are both reachable;
- no account/configuration change is required merely to inspect the deployment.

### STOP
Stop and request explicit owner approval when:
- a new Cloudflare project/domain/account is required;
- deployment settings must be changed;
- pushing a commit would unexpectedly publish externally and the intended deployment is unclear;
- production source cannot be tied safely to this repository.

## After GO

1. Run the smoke acceptance in `OPERATIONS.md`.
2. Verify the 3-question free-first flow and the buy-nothing outcome.
3. Implement the smallest runtime-compatible anonymous `POST /api/events` collector following `docs/analytics-contract.md`.
4. Test allow-listed events only: `page_view`, `diagnosis_start`, `diagnosis_complete`, `recommendation_click`.
5. Record only observed KPIs; do not infer CV or revenue from clicks.
6. Only after measurement works, prepare one acquisition channel for first external traffic.

## Current KPI status

PV / diagnosis_start / diagnosis_complete / recommendation_click / CV / revenue: **not newly observed in this cycle**.

## PM decision

No new feature version, catalog expansion, Rakuyoko deep-dive, or new-business launch until this production gate is cleared. New-business scout status: **新規着手なし**; current MVP validation has higher near-term expected value.
