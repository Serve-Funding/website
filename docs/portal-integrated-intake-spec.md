# Portal-Integrated Intake — Spec

**Status:** Design agreed, not built. **Date:** 2026-09-09. **Owner:** Kyler.
**Repos:** `website` (this one) + `Serve-Platform`.

## The goal

Two things, which are separable and get conflated:

1. **A website form submission should create the deal in the portal** so nobody keys it in by hand.
2. **The heavier, more sensitive asks** — bank statements, ownership detail, documents — should happen
   on the portal, where we already have upload, storage and a client-facing application.

Plus a third thing that makes (2) worth a visitor's time: give them something real back before they
ever get on a call.

## What already exists — do not rebuild these

| Piece | Where | State |
|---|---|---|
| Website → portal lead forwarder | `src/app/api/portal-lead/route.ts` | Built. Dark behind `PORTAL_LEAD_ENABLED=true` |
| Portal lead receiver | `Serve-Platform/src/app/api/webhooks/inbound-lead/route.ts` | Built. Captures to `inbound_log`, then projects |
| Lead → live deal projection | `Serve-Platform/src/lib/leads/ingest.ts` | Built (Sarah + Mike, 2026-08-31). Creates the `deals` row and find-or-creates the contact |
| Lead heat scoring | `Serve-Platform/src/lib/leads/tier.ts` | Built. Emits `deals.lead_quality` |
| Client application wizard | `Serve-Platform/src/app/(app)/my-application/[dealId]/[step]` | Built. Multi-step, doc upload |
| Invite-token onboarding | `Serve-Platform/src/app/onboarding` + `actions/client-portal.ts` | Built. Currently requires an admin to send the link |
| Distinct-lender match count | `Serve-Platform/src/lib/match/count.ts` (`countMatches`) | Built, pure, unit-tested |

**Goal 1 is therefore already shipping.** Confirm `PORTAL_LEAD_ENABLED=true` is set in the website's
production environment — the route returns `{ ok: true, skipped: 'disabled' }` otherwise, silently.

Note also that `Serve-Platform/src/app/apply/page.tsx` is a **retired** public intake page that now
redirects to `/login`. The standalone public form was deliberately replaced by the admin-initiated
flow. This spec does not un-retire it; the public form stays on the marketing domain.

## Decisions

**Boundary: short form on the website, portal for the rest.** A one-page intake at
servefunding.com creates the deal, then hands off. Rejected: hosting the whole form on
portal.servefunding.com (cold traffic hits an unfamiliar login-shaped domain, and it moves our
highest-intent conversion page off the domain carrying the AIEO work) and iframing the portal form
(fights our CSP, breaks mobile sizing, splits analytics).

**Auth: magic link, no password.** An emailed token tied to the client's `deals` row, reusing the
existing invite-token pattern. The email doubles as address verification before anyone uploads a
bank statement. The delta from today is that the **lead path mints and sends the link
automatically** instead of waiting on an admin in `/applications → + New Application`.

**One page, all questions visible.** Sarah's 2026-09-08 note, point 4: "I think the user might
answer them all if they could SEE them all instead of one at a time. The One at a Time approach
leaves the user wondering when it will end."

Worth building on the honest version of that, from the funnel data in #81 (90 days of Umami to
2026-09-08): 128 people loaded the Discover form, 34 answered the first question, 26 handed over
name/email/phone, 22 finished. **The entire loss is screen one — once someone starts, they finish,
and the contact step is not the wall.** So a one-page layout is not primarily a
completion-rate fix; length was never the measured problem. What it buys is that the visitor can see
the scope before investing, and it gives the program-fit screen a single place to be earned. Judge
it against 34/128 starting, not against 22/26 finishing.

## The incentive screen — and what the measurement says

The idea: after submitting, tell the visitor we have lenders who could work their deal, as a reason
to continue into the portal and hand over statements before a call.

`countMatches(deal, products)` returns `{ match, potential, lenders }` and already backs several
internal surfaces. **Measured against production on 2026-09-09** (313 lender products, 183 lenders,
166 active lenders considered), with the field sets a one-page form could realistically collect:

| Profile | `match` | `match+potential` |
|---|---|---|
| $250K ABL, manufacturer, GA, $180K/mo, 6 yr, 700 | **0** | 20 |
| $2M CRE bridge, CA, $250K/mo, 10 yr, 720 | **0** | 31 |
| $400K factoring, staffing, NY, $300K/mo, 4 yr | **0** | 23 |
| $1M equipment, trucking, TX, $400K/mo, 8 yr, 680 | 2 | 22 |
| $75K RBF, restaurant, FL, $60K/mo, 2 yr, 620 | 4 | 25 |
| $30K RBF, salon, OH, $18K/mo, 1 yr, **580** | 1 | 15 |
| $150K RBF, **cannabis dispensary**, CO, $120K/mo | 4 | 24 |

### Three findings

**1. The strict `match` count is inverted — do not show it.** Our three strongest deal shapes score
zero while a 580-FICO salon and a restricted-industry dispensary beat them. This is mechanical, not
a bug: `classifyProduct` only returns `match` when *every* criterion the deal activated is populated
on the lender product. Column population across 313 products —

| column | populated | |
|---|---|---|
| `products_offered` | 313 | 100% |
| `max_funding_amount` | 141 | 45% |
| `min_funding_amount` | 137 | 44% |
| `min_credit_score` | 73 | 23% |
| `min_time_in_business_months` | 57 | 18% |
| `restricted_industries` | 50 | 16% |
| `min_monthly_revenue` | 39 | 12% |
| `states_excluded` | 24 | 8% |

— so the moment the form asks state and industry, it activates two criteria populated on 8% and 16%
of products, and `match` collapses to ~0 by construction. The strict count measures **how completely
a lender's row is filled in**, not fit. That is the right question for an internal reviewer and the
wrong one for a visitor.

**2. `match + potential` is stable at 15–37, clustering 22–25.** A usable "a couple dozen lenders"
number. But the narrowing comes almost entirely from the product selection: amount alone returns
126–144 lenders (meaningless), product narrows it to 20–38, and **every field after that barely
moves it** (20 stays 20; 23 stays 23). So "tell us more and we'll match you better" is not a real
incentive — extra answers only shuffle lenders from `match` into `potential`.

**3. The count does not protect us from telling a disqualified applicant they have options.** The
cannabis dispensary returns 24: 22 products restrict cannabis, against a pool of 166 lenders. Same
shape of failure for an excluded state or an out-of-band ask. This is the load-bearing risk in the
whole feature — it would have Michael personally walking back a number the site gave.

## Design

### Eligibility gate — runs first, server-side

Before any number is computed or shown: restricted industry, excluded state, and an ask outside
anything in the matrix. A profile that fails the gate sees **no number** and is routed to a human
("let's talk — a few things here need an advisor"). The count is only ever rendered for profiles that
clear it.

### Lead with program fit, not a lender count

`products_offered` is the one field with no density problem (100% populated), so the robust,
defensible statement is about programs:

> **Your profile fits 3 of our financing programs** — Asset-Based Lending, Factoring, PO Financing.
> More than 20 lenders in our network write in that space.
> *Subject to underwriting. Not an offer or commitment to lend.*

- **Count as a band, never an integer.** "More than 20," not "23." The measured stability (15–37)
  supports bands, and a band means a matrix edit doesn't silently change what a visitor was told
  yesterday. Kyler's own phrasing — "a handful of lenders that might be interested" — is the
  register to write in.
- **Wording is a claim about published lender criteria, not a credit decision.** Keep the
  underwriting disclaimer adjacent to the number, not in a footer.
- **Never fabricate the number.** A made-up match count on a financial-services site is a
  deceptive-practice exposure (UDAP), not a matter of taste, and it is the same category of claim
  Michael scrubbed unverified rates for.

### Security

- Runs **server-side only**. Returns a count band and program names — **never lender names, never
  criteria values**.
- Fires **after** submit, not as a live calculator. An unauthenticated endpoint that reveals which
  criteria pass and which fail is a reverse-engineering surface for the matrix, which is Serve's
  competitive asset. Post-submit also means the screen is the completion incentive rather than
  something to tune inputs against and abandon.
- Rate-limited, behind BotID.

### Flow

1. Visitor hits a one-page intake on servefunding.com. Roughly: name, email, phone, company, amount,
   product/use of funds, monthly revenue, state, industry, time in business, optional credit
   estimate. Product selection is the field that carries the match signal — make it prominent, not
   an afterthought.
2. Submit → existing `/api/portal-lead` path → `inbound-lead` → `projectInboundLead` creates the deal.
3. Eligibility gate runs. Pass → program-fit screen with banded count. Fail → advisor routing.
4. Magic link minted and emailed automatically, tied to that `deals` row: "continue your
   application." Portal side handles ownership detail, statements, documents.
5. Follow-up email goes out **whether or not they book a call**, carrying something of value —
   Sarah's point 5: "What is the customer trying to get? A real answer/something of value."

## Also in Sarah's 2026-09-08 note — all three already shipped to `dev`

Landed before this spec was written; listed so nobody redoes them:

- Newsletter popup covering the lead form — removed in #82.
- Lead with the funding amount instead of "business owner or funding partner" — #81.
- Above-the-fold CTA on the homepage — #83.

Also on `dev` and relevant here: #72 added email-deliverability and phone-line-type verification on
form intake (`src/app/api/verify-contact`). The one-page form should keep that, and the magic-link
handoff should trust it — a bounced address means the portal link never arrives, which is a silent
dead end.

## Open questions

- **Band thresholds.** "More than 20" fits every archetype measured, but the floor case ($30K salon)
  returned 15. Decide the bands, and decide what shows below the lowest one.
- **Attribution.** This form is the natural place to fix the UTM/referrer gap found 2026-09-08 —
  every website lead currently gets `lead_source` hardcoded to "search." Capture landing UTMs +
  referrer in `sessionStorage` and append to the payload; derive AI-search sources from known
  referrer hostnames in `website-lead.ts`.
- **Does the client need an account eventually?** Magic link covers first submission. Repeat deals
  and returning clients probably want a real login — out of scope here.

## Non-goals

- Un-retiring the portal's public `/apply` page.
- Showing lender names or criteria to anyone unauthenticated.
- Any change to the internal `match`/`potential` classification. Worth noting separately that the
  same density problem means the internal "N lenders match" chip is showing reps zero on good deals;
  and that backfilling `min_monthly_revenue`, `states_excluded` and `restricted_industries` across
  the matrix would improve both surfaces at once. That is a data project, not a code one.

## Reproducing the measurement

Not committed — it was a throwaway harness. To redo it: snapshot the columns
`validateLenderMatch` reads from `lender_products`, then call `countMatches` from
`Serve-Platform/src/lib/match/count.ts` against the archetypes in the table above, reporting
`match`, `potential` and their sum per field set. Run it under vitest inside `Serve-Platform` so the
`@/*` aliases resolve.
