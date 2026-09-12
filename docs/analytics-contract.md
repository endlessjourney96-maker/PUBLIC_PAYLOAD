# Anonymous Funnel Analytics Contract

Updated: 2026-09-13 JST

## Purpose

Define the smallest privacy-preserving measurement contract needed to move the AI Work Environment MVP from "touchable" to "measurable" without coupling the recommendation engine to a specific analytics vendor.

## Allowed events

Only these event names are accepted by the client bridge and any future `/api/events` collector:

- `page_view`
- `diagnosis_start`
- `diagnosis_complete`
- `recommendation_click`

## Allowed properties

The collector MUST drop all properties except:

- `pattern`
- `budget`
- `decision`
- `recommendation_id`
- `kind`
- `rank`

Values must be numbers converted to strings or ASCII identifiers matching `^[a-zA-Z0-9_.:-]{1,80}$`.

## Explicitly forbidden

Do not collect name, email, phone, free text, IP-derived identity, user-agent fingerprint, advertising ID, account ID, precise location, cookies, or cross-site identifiers. Do not add third-party analytics merely to satisfy this MVP contract.

## Ranking separation

Analytics and monetization data MUST NOT feed recommendation ranking. Recommendation ranking remains fit-first and excludes affiliate payout/revenue.

## Failure behavior

Analytics is non-critical. Diagnosis and recommendations MUST continue if event delivery fails. Client requests use same-origin `/api/events`, omit credentials, and fail open.

## Minimum collector acceptance tests

1. POST of each allow-listed event returns a success response.
2. Unknown event names are rejected or ignored.
3. Unknown fields are dropped.
4. Invalid/oversized values are dropped or rejected.
5. No request body is written to application logs before sanitization.
6. GET/readout, if implemented, exposes aggregate counts only and no raw visitor records.
7. Recommendation UI works when the collector is unavailable.

## KPI definitions

- PV = observed `page_view` count.
- Diagnosis starts = observed `diagnosis_start` count.
- Diagnosis completions = observed `diagnosis_complete` count.
- Recommendation clicks = observed `recommendation_click` count.
- CV and revenue are NOT inferred from clicks; record only independently observed conversion/revenue data.

## Implementation gate

Do not implement or deploy a collector until the existing public runtime architecture is confirmed. If Cloudflare Worker routing already exists, implement the smallest compatible same-origin handler there. If not, document the owner action needed rather than creating/changing external infrastructure without approval.
