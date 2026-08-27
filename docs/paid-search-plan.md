# Paid search plan for the /funding problem pages

Last updated: 2026-08-27

Companion to the seven problem pages at `/funding/*` (`src/data/funding-pages.ts`). Those
pages exist so paid clicks land on the specific expensive problem instead of the homepage.
This document is how they get fed.

Every CPC below is a modeled estimate, not measured data. Serve has no paid-search history
and no Google Ads account attached to this domain yet, so nothing here comes from Search
Console or Keyword Planner data for this account. Replace these numbers with real auction
data after the first 30 days.

## The one finding that changes the keyword list

**"C&I bridge loan" is not a search term.** It is bank jargon. Commercial and industrial
lending is how a bank classifies a loan on its own call report, and business owners do not
use the phrase. Bidding it buys almost nothing.

The goal behind Mike's instinct is still correct: pull commercial borrowers and repel real
estate. The way to get that is not the C&I keyword. It is three other things:

1. Bid the commercial long tail (`bridge loan for business acquisition`), never the head
   term (`bridge loan`), which belongs to CRE and hard money and always will.
2. Run an aggressive real-estate negative list, below. This does more work than any
   keyword choice.
3. Put the repellent in the ad and the H1. The page title is
   "C&I Bridge Loans: For Operations, Not Property" and the direct answer ends with a
   sentence telling property borrowers to leave. Use C&I as positioning copy, not as a bid.

## Unit economics

One closed deal absorbs a lot of clicks, which is the whole reason this works in reverse
from a consumer funnel.

| | Conservative | Brief's assumption |
|---|---|---|
| Deal size | $1MM | $2MM |
| Success fee | 2% | 3% |
| Revenue per close | $20K | $60K |

Note the fee gap. The site and `llms.txt` publish a success fee of 1%–2%, and the brief
models 3%. At 2% on a $1MM deal the allowable cost per acquisition is a third of what a 3%
fee on $2MM allows. Both still clear comfortably, but the budget ceiling depends on which
number is real, so it is worth confirming before scaling past the test.

Modeled funnel, click to funded deal:

| Stage | Rate | Reasoning |
|---|---|---|
| Click → funnel start | 18% | Bottom-funnel page matched to the query; the qualifying block deliberately turns some visitors away |
| Funnel start → call booked | 40% | Seven questions, no credit pull |
| Call booked → engagement signed | 25% | Advisory sale, not a product sale |
| Engagement → funded close | 50% | Not every mandate funds |
| **Click → funded deal** | **~0.9%** | Roughly 1 in 115 clicks |

At a $27 blended CPC that is about $3,100 of media per funded deal. Against $20K–$60K of
revenue, 6x to 19x. At $45 CPC on the most competitive MCA terms it is about $5,200 per
deal, still 4x to 12x. **CPC is not the risk here. Click quality is.** A page that pulls
$800K-revenue companies with $75K asks converts at the same rate and produces nothing worth
closing, which is why the qualifying block sits above the fold on every page.

## Keyword clusters, one per campaign

Exact and phrase match only. No broad match, no Performance Max, no Display, no Search
Partners for the first 90 days. Broad match and PMax will find the cheapest traffic
available, and the cheapest traffic in this category is the LGP audience.

### Campaign 1 — MCA consolidation → `/funding/mca-consolidation`

Highest intent and highest volume in the set. Also the most competitive, because MCA
funders and consumer debt-relief operators bid it hard.

| Term | Est. CPC |
|---|---|
| mca consolidation | $35–$60 |
| merchant cash advance consolidation | $35–$60 |
| consolidate merchant cash advances | $30–$55 |
| merchant cash advance consolidation loan | $35–$60 |
| mca refinance / mca payoff loan | $30–$50 |
| merchant cash advance relief | $25–$45 |
| how to get out of a merchant cash advance | $20–$40 |
| stop daily ach payments business loan | $15–$30 |
| reverse consolidation mca | $30–$50 |

Blended target: **$38**. Serve's differentiator here is structural, not rhetorical. Every
competitor bidding these terms is selling another advance. The page says so and shows the
comparison table.

### Campaign 2 — Business bridge → `/funding/business-bridge-loan`

Low volume, moderate cost, and entirely dependent on the negative list.

| Term | Est. CPC |
|---|---|
| bridge loan for business acquisition | $20–$40 |
| acquisition bridge financing | $25–$45 |
| business bridge loan | $18–$35 |
| short term business loan for acquisition | $20–$40 |
| bridge financing for manufacturing company | $10–$25 |
| commercial and industrial loan | $12–$28 |
| bridge loan while sba processes | $15–$30 |

Blended target: **$27**. Do not bid `bridge loan`, `bridge financing`, or `bridge lender`
on their own in any match type.

### Campaign 3 — Asset-based lending by industry → four ad groups

Best cost-to-quality ratio in the set. A searcher using this vocabulary is a controller,
CFO, or banker.

| Term | Est. CPC | Ad group |
|---|---|---|
| asset based lending manufacturing | $15–$35 | Manufacturing |
| borrowing base line of credit | $12–$25 | Manufacturing |
| inventory and receivables line of credit | $15–$30 | Manufacturing |
| asset based loan for staffing agency | $20–$40 | Staffing |
| payroll funding staffing agency | $25–$45 | Staffing |
| staffing agency receivables financing | $20–$40 | Staffing |
| medical receivables financing | $20–$40 | Healthcare |
| healthcare accounts receivable financing | $20–$40 | Healthcare |
| medicare receivables lender | $18–$35 | Healthcare |
| construction accounts receivable financing | $15–$35 | Construction |
| progress billing financing contractor | $12–$28 | Construction |
| equipment collateral loan contractor | $15–$30 | Construction |

Blended target: **$26**.

**Sleeper terms worth their own cheap ad group.** Nobody outside the industry types these,
so volume is tiny, CPC is low, and qualification is close to perfect: `borrowing base
certificate`, `field exam asset based lender`, `advance rate accounts receivable`, `notice
of assignment factoring`, `net orderly liquidation value lending`. Expect single-digit
monthly impressions per term and take every click.

### Campaign 4 — Purchase order financing → `/funding/purchase-order-financing`

Cleanest intent, lowest competition, smallest volume.

| Term | Est. CPC |
|---|---|
| purchase order financing | $15–$30 |
| purchase order funding company | $18–$35 |
| po financing for large order | $15–$30 |
| finance a large purchase order | $10–$25 |
| supplier payment financing | $12–$25 |

Blended target: **$22**.

## Negative keywords

**Real estate block (applies site-wide, not only to the bridge campaign).** This list is
the single highest-leverage item in the plan:

`real estate`, `commercial real estate`, `cre`, `property`, `properties`, `mortgage`,
`hard money`, `fix and flip`, `flip`, `flipping`, `multifamily`, `apartment`, `apartments`,
`rental`, `rentals`, `land`, `lot loan`, `house`, `home`, `homes`, `residential`,
`construction loan`, `development loan`, `ground up`, `appraisal`, `ltv`, `loan to value`,
`cap rate`, `reit`, `hotel`, `self storage`, `airbnb`, `landlord`, `tenant`

Note that `construction loan` is negative while the construction ABL campaign is live. The
distinction the account has to hold is financing a contracting business versus financing a
building. Ad group names should make that obvious to whoever touches the account next.

**Size and intent block:** `free`, `grant`, `grants`, `no credit check`, `startup`,
`start up`, `new business`, `under 100k`, `personal loan`, `payday`, `student`, `bad credit
personal`, `crypto`, `salary`, `jobs`, `career`, `how to become`, `broker training`,
`iso agent`, `course`, `certification`, `software`, `crm`, `template`, `sample letter`

Keep `what is` and `definition` variants out of paid but let them keep working organically.
Those queries are how AI assistants build answers, and the pages are written for that.

## Account setup

- **Structure.** Four campaigns, one per page cluster, so a high-CPC MCA auction cannot eat
  the ABL budget. Ad groups inside campaign 3 map one-to-one to the four industry pages.
- **Bidding.** Manual CPC or Maximize Clicks with a hard CPC cap for the first 60 days. Do
  not start on tCPA. There will not be enough conversion volume to train it, and it will
  spend the budget learning something the negative list already knows.
- **Conversion actions.** Two. `funnel_started` as the micro-conversion for optimization
  signal, `call_booked` as primary. Once HubSpot has enough volume, import the
  qualified-lead stage as an offline conversion. At this deal size that offline import is
  what eventually makes automated bidding usable.
- **Attribution.** Land every ad on `?utm_source=google&utm_campaign=<campaign>` plus the
  page's own `src` param, which the page already carries into `/discover?src=<slug>`. Umami
  captures landing page and UTMs on the session, so campaign-to-booking attribution works
  without touching the qualifying funnel. If Mike later wants the source stamped on the
  lead record itself, that is one field for whoever owns the funnel rewrite.
- **Geography.** US only. Before launch, confirm whether California's commercial financing
  disclosure rules (SB 1235) and New York's CFDL affect advertising claims in those states.
  Serve's success-only fee structure is a compliance strength worth stating in ad copy, but
  the disclosure question is a real one and the licensing screen should answer it rather
  than this document.
- **Schedule.** Do not restrict to business hours. Owners research an expensive problem at
  night, which is the behavior this whole page set is built around. Run all hours, turn
  call extensions off outside business hours, and let the funnel take the after-hours
  traffic.

## Budget

**Recommended test: $6,000/month for 90 days ($18,000 total).**

| Campaign | Monthly | Share | Est. clicks/mo |
|---|---|---|---|
| MCA consolidation | $2,400 | 40% | ~63 |
| ABL by industry | $1,800 | 30% | ~69 |
| Business bridge | $1,200 | 20% | ~44 |
| Purchase order | $600 | 10% | ~27 |
| **Total** | **$6,000** | | **~203** |

Modeled output at the funnel rates above: roughly 36 funnel starts and 14 booked calls per
month, 3 to 5 engagements over the quarter, 1 to 3 funded deals. One funded $1MM deal at a
2% fee returns the entire $18,000 test.

**Decision gates at day 60, not day 14.** This ticket size produces too few events for
weekly reads to mean anything.

- Click to funnel start under 8% on a campaign: rewrite that landing page, do not add
  budget. The page is failing to match the query.
- Cost per booked call over $400: pause the campaign and audit the search terms report for
  what the negative list is missing.
- One funded deal attributable to paid: raise to $12,000–$15,000/month and add the
  remaining industry ad groups.

## What not to spend on

**Meta, TikTok, and SMS.** That is the Lucky Growth Partners channel, and it produces LGP's
deal size. A $12MM manufacturer with a working capital gap is not on TikTok looking for a
business loan. Serve's ticket size is a function of where the traffic comes from, and
paying for cheap clicks is paying to become a different company.

**More Google, once campaign 1 is saturated.** Serve's primary referral source is
commercial bankers, and there is a `/bankers` page already built for them. LinkedIn
targeting commercial lenders, CPAs, and turnaround advisors at an estimated $12–$18 CPC
will probably beat incremental search spend once the MCA campaign hits its impression
share ceiling. Worth testing at $1,500/month as the second channel rather than doubling
campaign 1.
