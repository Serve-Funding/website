# Public API routes have no rate limit — plan

**Written 2026-09-01, after PR #56 / #69 closed the `/api/webhook` open proxy.**
Nothing here is started. Picking it up = start at Tier 0.

`/api/chat`, `/api/lets-talk` and `/api/notify` are unauthenticated, uncapped, and
spend real money per request. #56 explicitly scoped rate limiting out; this is that
deferred piece, plus what measuring it turned up.

Verified open on production, 2026-09-01 — no Origin, no Referer, no cookies, HTTP 200
in 4.9s:

```
curl -X POST https://servefunding.com/api/chat \
  -H 'Content-Type: application/json' -d '{"message":"hi"}'
```

## What it costs

Haiku 4.5 is $1/MTok in, $5/MTok out; cache write 1.25x, cache read 0.1x. The chat
system prompt is **105,982 characters (~28,000 tokens)**, rebuilt per request from the
product corpus plus a 32-post blog index, and prompt-cached with a 5-minute TTL.
Token counts are derived from character length, so +/-10% — re-measure with
`messages.count_tokens` before quoting them anywhere that matters.

| Scenario | Per request |
| --- | --- |
| Warm cache, short message | ~$0.008 |
| Cold cache (first after a 5-minute gap) | ~$0.040 |
| Max-size `conversationHistory` | **~$0.18** |

That last row is the actual problem. `conversationHistory` is caller-supplied and
pushed into `messages` with no cap on item count or total length. Haiku 4.5's window
is 200K and the system prompt takes ~28K, so ~170K tokens of attacker-chosen history
fit in one request. It sits after the cache breakpoint, so it bills uncached at full
rate — $0.17 of input on a single HTTP call, in a ~680KB body, well inside Vercel's
4.5MB limit.

Serverless does the scaling for them. Twenty concurrent requests from one laptop is
roughly **$1,300/hour**; naive spam with no payload trick is still ~$115/hour.

## The other two routes

**`/api/lets-talk`** — same unbounded-history problem, and its ~3,300-token system
prompt is **not cached at all**, because it interpolates `formData` (name, email,
revenue, deal details) directly into the system text. That is both why it can't cache
and a prompt-injection surface: caller-controlled text lands inside the system prompt.

**`/api/notify`** — mildest. Recipients come from `RESEND_NOTIFY_EMAILS`, so nobody
can spam third parties through it. The real risk is quota: a flood burns the Resend
plan and **real lead notifications stop arriving**. An availability bug, not a spam one.

## Two things found while measuring

- **`middleware.ts` excludes `api` from its matcher.** Middleware is not in the path
  for any of these routes today, so a middleware-based limiter needs that matcher
  changed first — which also starts applying CSP headers to API responses (harmless,
  but it is a change).
- **Both AI routes return the raw exception to the caller** —
  `Failed to process chat request: ${errorMessage}` — leaking Anthropic API internals
  to anyone who probes.

## Plan

### Tier 0 — today, no code

Set a spend limit and budget alert on the Anthropic org in the Console. Ten minutes.
Everything below reduces probability; this is the only thing that caps damage.

### Tier 1 — input bounds (one small PR, ~half a day)

Highest leverage per line in the whole plan. No dependencies, no infrastructure.

- Cap `message` (~2,000 chars).
- Cap `conversationHistory` to the last ~20 turns and ~20,000 chars total.
- Reject oversized with a 400 **before** calling Anthropic.
- Stop echoing `errorMessage` to the client.

Takes worst case from ~$0.18 to ~$0.01 per request — an 18x cut. If only one thing
ever gets done, do this one.

### Tier 2 — rate limiting (1-2 days)

- **Vercel WAF rate limiting** — configuration, not code. Per-IP rules on `/api/*`,
  enforced at the edge *before* the function invokes, so blocked traffic bills nothing.
  Needs the Pro plan. Preferred if available: no code to maintain, and nothing inside
  the function can bypass it.
- **Upstash Redis + `@upstash/ratelimit`** — the standard Next.js answer. Free at this
  volume, ~100 lines plus one dependency and two env vars.

**Do not use an in-memory Map counter.** Vercel runs many concurrent isolates, so it
only catches repeat hits landing on the same warm instance. It passes local testing and
fails under exactly the burst it exists to stop — worse than nothing, because it looks
like coverage.

### Tier 3 — only if actually attacked

Turnstile on first message, per-session budget, anomaly alerting. Not now.

## Open questions — answer before Tier 2

1. **Does the Vercel plan include WAF rate limiting?** Unresolved: `get_project` on
   `serve-fundings-projects` returned 403 from the account that wrote this. Decides
   WAF vs Upstash.
2. **Whose Anthropic key is in this project's `ANTHROPIC_API_KEY`, and is it the same
   org the portal uses?** If it is, abuse of a public marketing site could exhaust rate
   limits the internal tooling depends on — that turns a cost problem into an
   availability problem for the team, and raises the priority of Tier 2.

Delete this file once Tier 2 lands.
