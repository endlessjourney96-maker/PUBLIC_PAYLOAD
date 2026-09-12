# Runtime Verification Runbook

Updated: 2026-09-13 JST

## Purpose

Close the current critical path without adding product scope: prove which repository revision is actually serving the existing public Cloudflare runtime, then enable measurement work only against the verified architecture.

## Non-negotiable order

1. Verify public runtime is reachable.
2. Verify `/` and `/meeting-minutes-pm.html` return HTTP 2xx.
3. Identify the deployed revision or prove that it cannot be identified from the current tool surface.
4. Run one QA diagnosis and recommendation click; QA traffic is test evidence, not external-user KPI.
5. Only after architecture is known, implement/attach an anonymous event collector compatible with `docs/analytics-contract.md`.
6. Send real acquisition traffic only after the smoke gate passes.

## Evidence record

| item | status | evidence |
|---|---|---|
| repository writable | PASS | `endlessjourney96-maker/PUBLIC_PAYLOAD` |
| canonical operations file | PASS | `OPERATIONS.md` |
| public runtime URL | PENDING RE-VERIFICATION | known from prior project history; not verified in this run |
| deployed SHA | UNKNOWN | no deployment manifest or Cloudflare deployment connector available in current runtime |
| remote `/api/events` collector | NOT PROVEN | browser sender exists; server implementation not present in repository |
| external-user funnel KPI | NOT OBSERVED | do not infer from QA or local event logs |

## Owner action only if automation remains blocked

In the existing Cloudflare project (do not create a new project/account):

1. Open the deployment currently serving the MVP.
2. Confirm its production URL.
3. Confirm whether deployment source is GitHub and, if shown, the deployed commit SHA.
4. Do not change settings yet.
5. Record URL + SHA in `OPERATIONS.md` or hand them back to the automation.

This is a read-only verification. Any configuration/deployment change remains approval-gated.

## GO / STOP

GO to measurement implementation only when the public runtime and architecture are identified. STOP feature work while they are unknown. Do not create another UI version, broaden Rakuyoko research, or add products merely to show progress.

## Next implementation after GO

Create the smallest anonymous collector/readout that satisfies `docs/analytics-contract.md`; test allow-listed event names/fields, rejection of unexpected fields, no PII/cookies/fingerprinting, and aggregate-only reporting. Then obtain the first real funnel observations in order: PV → diagnosis_start → diagnosis_complete → recommendation_click → CV → revenue.
