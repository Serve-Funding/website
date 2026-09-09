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

## Built so far on this branch

**`financing_type`, a new form question (position 2).** The blocker found while starting the build:
**the form never collected which product the visitor wants.** `financing_needs` asks what the money
is *for* and lands on `use_of_proceeds`; nothing asked what shape the facility is, and
`projectWebsiteLead` accordingly never writes `deals.products_offered`. Since product selection is
the entire narrowing lever (126–144 lenders → 20–38), the incentive screen was not merely
unbuilt — it was **impossible**, and a count shipped today would have read ~130.

- Placed at position 2, above `annual_revenue`, because a Mike-routing rule firing on revenue calls
  `setShowChoicePoint` and returns — so anything below it is skipped for $10MM+ revenue leads, i.e.
  exactly the ones where the screen matters most. Constraint 4 in `form-questions.ts` records this.
- Labels describe the mechanic in the visitor's words ("Get paid now on unpaid invoices"), not our
  product names. Asking a stranger to self-classify into "Revenue-Based Term Loan" repeats the
  mistake #81 removed. Multi-select, with "Not sure yet" carrying no product filter rather than a
  wrong one.
- **Cross-repo contract change.** The portal must learn `financing_type` and map the labels to
  `CANONICAL_PRODUCTS` → `deals.products_offered`, in `src/lib/leads/facts.ts` where the bucket-string
  tables already live (one side of the contract, not two copies of a product list). Until it does,
  the answer rides along in `inbound_log.payload` and is lost to the projection — which is the
  capture-first design working as intended, but it means **this field does nothing until the
  Serve-Platform side ships.**

Verified: `npm run build` passes (including `verify-seo`) and `tsc --noEmit` is clean.

**The one-page form, at `/get-started`.** A NEW route, not a replacement for `/discover` — #81 tuned
that funnel on real numbers and replacing it in place would destroy the only baseline this page can
be judged against. Both run; the CTA gets pointed here when there's a reason, and the loser is
retired with evidence. It is `noindex` while that comparison runs (two near-identical intake forms
on one domain is a duplicate-content signal and would split the link equity of the page the AIEO
work went into), and therefore deliberately absent from `sitemap.ts` and from `ROUTE_SOURCES` —
add both in the same commit that removes the noindex.

- Reads the same `formQuestions` and the same `triageRules` as `ConversationalForm`. The two must
  route a given lead to the same calendar, and a second copy of either is how that stops being true.
- `triageCompleteAnswers` (in `triage-rules.ts`) is the only new logic: it evaluates every rule
  against the whole answer set at submit instead of question-by-question, reads rules in order so
  position is priority, and ignores `skip_question` (nothing is skipped when everything is visible).
- Calendly routing moved to `src/lib/calendly-routing.ts` so both forms share one copy of the URLs.
  `useDealInquiryForm` re-exports `CALENDLY_URLS`, so no importer changed.
- `company_state` is collected here as a `<select>` from `src/data/us-states.ts`, which closes half
  of the eligibility-gate blocker below. Postal codes go over the wire because that is what
  `deals.deal_state` and `states_excluded` hold.
- Only the ask and contact details are required. The rest is optional on purpose: a partial answer
  set still projects to a usable deal and still scores, because points only add.

**Manual verification** (this repo has no test framework):

- Rendered `/get-started` and confirmed every question plus the state dropdown is on one page.
- Submitted a real lead through the browser with the n8n webhook redirected to a local sink, so
  nothing reached the production sheet. The captured payload carried every contract key —
  `financing_type: ["Get paid now on unpaid invoices"]`, `company_state: "GA"`, `triage_action:
  "mike"`, Michael's owner calendar — **including `financing_needs`, which the one-at-a-time form
  would have skipped for this lead**, since the `$10MM-$20MM` rule fires on revenue and stops the
  form.
- All three streams fired independently. `/api/notify` returned 400 (no local Resend key) and the
  visitor still saw the success screen — the `Promise.allSettled` isolation behaving as intended.
- Diffed `triageCompleteAnswers` against `checkTriageRules` over 9 answer sets covering all four
  rules, both defaults, and the browser submission above: **the two agree on every one.**

## Design

### Eligibility gate — runs first, server-side

Before any number is computed or shown: restricted industry, excluded state, and an ask outside
anything in the matrix. A profile that fails the gate sees **no number** and is routed to a human
("let's talk — a few things here need an advisor"). The count is only ever rendered for profiles that
clear it.

**The gate cannot be built on the current industry question — this is unresolved.** Two mismatches
found while building:

1. ~~**No state is collected at all.**~~ **Half done.** The one-page form now collects
   `company_state` as a `<select>`, which is where a 50-option question belongs — it was never going
   to work as a `single` screen in the one-at-a-time UI, and `ConversationalForm` renders only
   `single` and `multi`. **Still outstanding on the portal side:** `readWebsiteLeadPayload` does not
   read `company_state` and `projectWebsiteLead` writes no `deal_state`, so the answer currently
   reaches `inbound_log.payload` and stops there. `/discover` still doesn't ask at all. Note state
   matters beyond the gate — it drives the licensing screen.
2. **The industry vocabularies don't meet.** The form offers 16 curated industries; lender
   `restricted_industries` are strings like "Marijuana / cannabis (medical or recreational)" and
   "Trucking/Transportation/Logistics", neither of which appears in the form's list. A dispensary
   picks **"Other"**, so the gate's most important case cannot fire on this field. Needs a decision:
   free-text industry matched against the restricted vocabulary, an explicit restricted-industry
   disclosure question, or a gate that treats "Other" as not-clearable.

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

## The program-fit screen — built and verified end to end

`/api/program-fit` on the website proxies to the portal's `/api/webhooks/program-fit`, holding the
shared secret so the browser never does. The gate and the band are the portal's decision; this side
only renders it.

**The screen has three outcomes, and only one shows a number.**

| Portal verdict | What the visitor sees |
|---|---|
| `eligible`, band present | "Your profile fits **Factoring**. **More than 20 lenders** in our network write that kind of facility." + the underwriting disclaimer |
| blocked, programs known | "Based on what you told us, we'd start with **Factoring**. There are a few things here an advisor should look at with you before we say what's available." |
| nothing known, or the call failed | The plain confirmation, exactly as before |

**The wording is deliberately "lenders who write that kind of facility", not "lenders who match
you."** The second would be a per-profile claim the matrix cannot support: `min_funding_amount` /
`max_funding_amount` are populated on only ~44% of products, so the count barely moves with the size
of the ask — a $100K request and a $10MM request on the same facility land in the same band. Both
statements are true; only one is precise about what was actually computed.

**Every failure path is invisible.** The route answers 200 with `eligible: false` when unconfigured,
timed out, rate-limited or the portal is down, and the fit call runs strictly *after* the three
capture streams — so a screen failure can never cost a lead or show a visitor an error. It stays
dark until `PORTAL_PROGRAM_FIT_URL` and `PORTAL_INBOUND_SECRET` are set.

**Rate limiting is deliberately modest, and it is worth being straight about why.** The limiter is
an in-memory per-IP map: it does not survive a cold start and does not see other instances, so it
stops a trivial scripted loop and nothing more. The real protection is the response shape — a band
and program names, never lender names, criteria or an exact count — so varying one field and
watching the number move teaches an attacker almost nothing. If the response ever carries more, this
needs to become a real limiter.

**Verified against a production build** (dev-mode chunks were being served stale from cache, which
masked the wiring for a while — worth knowing if this is retested):

- Eligible: `Factoring` → "More than 20", and `Commercial real estate` → "More than 35", with the
  three CRE products correctly collapsed to one program name.
- Blocked: industry `Other` → **no number**, programs still named, advisor routing. This is the
  dispensary case, and the raw count behind it was 23 — it would have displayed "more than 20".
- The band's capitalisation is applied on this side; the portal emits it lowercase because it also
  reads mid-sentence there.

## The magic-link handoff — built

The confirmation screen's "Upload documents" button goes straight into the visitor's own
application, no password. Reuses `Serve-Platform/src/lib/auth/access-links.ts` wholesale: a durable
14-day token in `access_tokens` with a **fresh Supabase OTP minted per click** — that shape exists
because raw emailed OTPs are single-use and corporate mail scanners pre-open URLs and burn them
before the human clicks.

- **The URL comes from the lead call, not the gate.** `inbound-lead` mints it because the deal has
  to exist before there is anything to link to, and returns it as `handoff_url`. The website's
  `/api/portal-lead` names that one field through rather than forwarding the portal's body, which
  also holds the deal id and the projection outcome — neither belongs in a browser.
- **The email check is the spam gate.** Minting provisions a real client account, so an unguarded
  mint turns the public form into an account factory. We mint only for an address #72's verifier
  confirmed accepts mail. `unchecked` does **not** pass — an unconfigured verifier must not silently
  open the guard — and neither does `catchall`, where the domain accepts everything and proves
  nothing about the mailbox. Six tests pin this boundary.
- **A banker gets no link, by design.** `provisionExternalUser` refuses to turn a known lender
  contact into a client (the 2026-08-19 trap), so that case fails safe for free.
- **Nothing is emailed.** The link is returned and surfaced on screen, full stop. Outbound mail to a
  borrower is Michael's voice and Michael's decision; emailing this is a separate change.
- **The documents button only shows when the gate cleared AND a link exists** — otherwise the single
  call CTA, never a dead button.

**Verified:** with a stub returning a link, both CTAs render with the right hrefs. With the local
verifier unconfigured (`unchecked`), the button correctly stays hidden — the guard doing its job.

### One bug this turned up

`getRoleType` read `userRole === OWNER_ROLE ? 'owner' : 'partner'`, so **any** other value — including
unanswered — routed to Michael's *partner* calendar. Harmless on the conversational form, where
`user_role` is question 3 and you cannot advance past it. On the one-page form the question is
optional, so every visitor who skipped it was being sent to the partner calendar. Now only the
explicit partner answer means partner. Sarah, 2026-09-08: "We have rarely or never had a partner
come through the website."

## Also in Sarah's 2026-09-08 note — all three already shipped to `dev`

Landed before this spec was written; listed so nobody redoes them:

- Newsletter popup covering the lead form — removed in #82.
- Lead with the funding amount instead of "business owner or funding partner" — #81.
- Above-the-fold CTA on the homepage — #83.

Also on `dev` and relevant here: #72 added email-deliverability and phone-line-type verification on
form intake (`src/app/api/verify-contact`). The one-page form should keep that, and the magic-link
handoff should trust it — a bounced address means the portal link never arrives, which is a silent
dead end.

### One page means triage moves to submit-time — done, via `triageCompleteAnswers`

A consequence of Sarah's request that nobody had flagged, now implemented and verified to agree with
the mid-form routing on every rule. Recorded below as the reasoning behind it. Today the triage rules run **mid-form**: a
`mike` rule firing on `annual_revenue` stops the form and routes straight to Mike's calendar, which
is why `annual_revenue` has to sit second-to-last and why one question is deliberately sacrificed.
On a single page everyone answers everything, so:

- Mike-vs-Kyler routing has to be evaluated **at submit** against the whole answer set, not
  question-by-question. The rules themselves survive (they are keyed on `question_id` and read form
  state), but `checkAndAdvance`'s early return does not.
- The upside: no question is skipped any more, so high-revenue leads would start arriving *with*
  `financing_type` and `financing_needs` instead of dropping out at revenue.
- The ordering constraints in `form-questions.ts` become presentational rather than load-bearing —
  which means the comment block explaining them must be rewritten at the same time, not left to
  imply a dependency that no longer exists.

## Open questions

- **Band thresholds.** Now measured through the real mapping rather than estimated: with a facility
  named, the count runs **13 (SBA) to 38 (CRE)** — factoring 24, ABL 21, equipment 23, RBF 37. So
  "more than 20" does not cover SBA. Decide the bands, and decide what shows below the lowest one.
- **What the screen shows for "Not sure yet".** It measures at **144**, because the matcher reads an
  empty `products_offered` as match-all. It must show no number — decide what it shows instead
  (the programs we'd explore, or straight to advisor routing).
- ~~**The program-fit screen itself is not built.**~~ **Built.** See below.
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
