# First Attributable Acquisition Playbook

Last updated: 2026-09-15 19:00 JST

## Purpose

Get the first genuine, attributable funnel signal for the AI work-environment/product-selection MVP without expanding features or contaminating KPI.

## Single test path

Use only the existing owned-search entry first:

`meeting-minutes-pm.html` → `index.html?role=manager&pain=meeting&source=owned_search&campaign=meeting-minutes-pm` → 3-question diagnosis → free improvement advice → recommendation consideration only when needed.

Do not fan out to additional landing pages, SNS, paid ads, outreach, or affiliate activation until this path is measurable and has produced a real signal.

## Evidence ladder

Record only observed values, in this order:

1. genuine `page_view` attributed to `source=owned_search`, `campaign=meeting-minutes-pm`
2. genuine `diagnosis_start`
3. genuine `diagnosis_complete`
4. genuine `recommendation_click`
5. actual external CV if independently observable
6. actual revenue only when confirmed

Missing is unknown, never zero. Synthetic valid events must not be used to populate KPI.

## Stop / continue rules

- Visit observed, diagnosis not started: improve above-the-fold promise/CTA before adding channels.
- Diagnosis started, not completed: reduce friction or ambiguity in the existing 3 questions; do not add questions.
- Diagnosis completed, no recommendation click: inspect whether free advice solved the problem (valid outcome) versus recommendation relevance being weak. Preserve the buy-nothing option.
- Recommendation click observed: keep the same acquisition path long enough to obtain a small real sample before expanding content volume.
- No measurable event because Analytics Engine cannot be read: do not interpret this as zero demand; observability remains the blocker.

## AI discovery / AEO preflight

Cloudflare announced a September 15, 2026 default-policy change affecting AI crawler access, especially mixed-use crawlers on ad-supported pages. Before treating AI-search/AEO as an acquisition channel, explicitly inspect the deployed zone's crawler controls and current monetization state. Do not change Cloudflare account/zone settings without owner approval.

For the current MVP:

1. Keep owned-search validation first; do not pivot traffic strategy solely because of the policy change.
2. Before any future AEO experiment, verify whether search crawlers, AI-agent crawlers, and training crawlers are allowed/blocked for the deployed property.
3. If ads are introduced later, re-run this preflight because crawler defaults can differ for ad-supported pages.
4. Record AI-referral/citation evidence only when actually observed; do not infer AEO reach from crawler settings alone.
5. Treat crawler-control changes as owner-gated account/configuration changes.

## Owner-gated actions

External posting, outreach, paid acquisition, affiliate activation, purchases, contracts, account changes, Cloudflare credential/token changes, and Cloudflare crawler-policy changes require explicit owner approval.

## Next action

1. Treat GitHub Actions run 17 (`4713020c...`) as the current green eight-suite quality gate.
2. When approved Cloudflare read-only access becomes available, run `scripts/query-analytics-engine.mjs` and record only returned genuine events.
3. Once measurable, drive exactly one approved real acquisition source through `meeting-minutes-pm` before creating additional acquisition pages.
4. Before activating AI-search/AEO as a channel, perform the AI discovery/AEO preflight above and record the observed crawler-policy state without changing it.
