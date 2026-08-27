# Paid search plan for the /funding problem pages

Last updated: 2026-08-27

Companion to the eight problem pages at `/funding/*` (`src/data/funding-pages.ts`).

## Recommendation: do not buy clicks yet

Merge the pages and spend nothing for 60 days. Then, if the organic signal justifies it,
$1,500/month on revenue-based financing only.

An earlier draft of this document recommended $6,000/month across four campaigns, led by
MCA consolidation. That was wrong twice over, and both errors are worth recording so nobody
re-derives them.

**Error one: it optimized for click volume instead of deal quality.** MCA consolidation has
the sharpest search volume in this category, which is why it led the plan. It also selects
precisely for companies already two to four advances deep, which is the hardest,
lowest-margin, highest-effort file Serve places. Mike's positioning is that a healthy
company should come to Serve *instead of* the MCA broker, not *after* it. Paying for the
after case buys the wrong deals faster.

**Error two: the unit economics were inflated at the top.** Corrected below.

The MCA consolidation page stays live. It is a good answer to a question people genuinely
ask, it demonstrates that Serve is not the predatory option, and it costs nothing to run
organically. It just does not get ad budget.

## The corrected economics

| | Earlier draft | Actual |
|---|---|---|
| Success fee | 3% | **2%** (confirmed) |
| Average deal | $2MM | **~$740K** ($74MM facilitated / 100+ clients, per `company-info.ts`) |
| Revenue per close | $60K | **~$15K** |

Three assumptions compounded in the wrong direction:

| Input | Earlier draft | Honest number |
|---|---|---|
| Revenue per close | $20K-$60K | ~$15K |
| Click → funnel start | 18% | 8%-12% is normal for a good paid landing page; 18% is a best case |
| Blended CPC | $27 | ~$40 for the first 60 days, because a new account with no history pays above market while quality score builds |

Rerun at the honest numbers, cost per funded deal moves from roughly $3,100 to roughly
$8,000, against about $15,000 of revenue. **Call it 2x gross**, before any of Mike's or
Camden's time. That does not justify standing up a channel nobody at Serve currently owns.

There is a volume ceiling on top of that. This is a niche B2B term set, likely a few hundred
to a couple thousand US searches a month across the whole cluster. A new account at low
impression share may not be able to spend $6,000/month on exact and phrase match at all,
and the only ways to hit that number are broad match or Performance Max, both of which buy
the traffic this entire page set exists to avoid.

## The 60-day $0 plan

The pages are the asset. They are in the sitemap, in `public/llms.txt`, and rendered into
`/llms-full.txt` with their direct answers, terms tables and deflections. Serve's organic
impressions already come more from AI assistants than from classic search, and these pages
were written for that specifically. Find out what they pull on their own before renting
traffic to them.

- Verify the domain in Google Search Console. There is no historical query data for this
  site available today, which is why every CPC below is modeled rather than measured, and
  it is the single cheapest gap to close.
- Watch landing-page entries and `/discover` starts per page in Umami. The metric that
  matters is not volume; it is whether the companies arriving match the $5MM-$50MM band.
- Re-read `/llms-full.txt` output after the first crawl cycle and check whether ChatGPT,
  Gemini, Claude and Perplexity cite the pages when asked the questions they answer. Ask
  them directly: "what does MCA consolidation cost", "revenue-based financing vs merchant
  cash advance", "asset-based lending for a staffing agency". That is the channel already
  working, and it is free.

## If and when paid starts: revenue-based financing first

One campaign, $1,500/month, 90 days, $4,500 total. At roughly $25 blended CPC that is about
60 clicks a month. It will not produce statistical significance on conversion rate and does
not need to. The only question worth $4,500 is whether paid clicks on these terms bring
$5MM+ companies or $500K companies, and that reads off eight leads.

### Campaign 1 — Revenue-based financing → `/funding/revenue-based-financing`

The deal type Serve wants more of, and the searcher who has not taken an advance yet.

| Term | Est. CPC |
|---|---|
| alternative to merchant cash advance | $22-$40 |
| revenue based financing companies | $20-$38 |
| revenue based financing | $18-$35 |
| revenue based loan vs merchant cash advance | $18-$32 |
| working capital loan for growing business | $18-$35 |
| growth capital for profitable business | $15-$30 |
| business loan monthly payments not daily | $12-$28 |
| business loan without daily payments | $12-$28 |

Blended target: **$25**.

Two of these deserve special attention. `alternative to merchant cash advance` and
`business loan without daily payments` are typed by someone holding an MCA term sheet who
has not signed it. That is the cleanest borrower in this entire keyword universe: healthy
enough to be offered capital, sceptical enough to check, and not yet stacked. It is also
exactly the moment Mike's positioning is built for. Low volume, and worth paying up for.

### Later, in this order, and only after campaign 1 proves out

**Campaign 2 — Asset-based lending by industry** (four ad groups → the four industry pages,
blended ~$26). Best cost-to-quality ratio in the set. Anyone searching `borrowing base line
of credit` or `staffing agency receivables financing` is a controller, CFO or banker. The
sleeper terms are worth their own cheap ad group and near-perfect qualification at tiny
volume: `borrowing base certificate`, `field exam asset based lender`, `advance rate
accounts receivable`, `notice of assignment factoring`, `net orderly liquidation value
lending`.

**Campaign 3 — Business bridge** (→ `/funding/business-bridge-loan`, blended ~$27).
`acquisition bridge financing`, `bridge loan for business acquisition`, `short term business
loan for acquisition`, `bridge loan while sba processes`. Never bid `bridge loan`,
`bridge financing` or `bridge lender` alone in any match type.

**Campaign 4 — Purchase order financing** (→ `/funding/purchase-order-financing`, blended
~$22). Cleanest intent, lowest competition, smallest volume.

**Never — MCA consolidation.** Organic only, for the reasons at the top.

## Keyword research finding worth keeping

**"C&I bridge loan" is not a search term.** Commercial and industrial is how a bank
classifies a loan on its own call report; business owners do not type it. The instinct behind
it is right, and the way to get it is the commercial long tail plus negatives, with C&I used
as positioning copy. The page is titled "C&I Bridge Loans: For Operations, Not Property" and
its direct answer ends by telling property borrowers to go elsewhere.

## Negative keywords

Higher leverage than any keyword choice. The real-estate block applies account-wide.

`real estate`, `commercial real estate`, `cre`, `property`, `properties`, `mortgage`,
`hard money`, `fix and flip`, `flip`, `flipping`, `multifamily`, `apartment`, `rental`,
`land`, `lot loan`, `house`, `home`, `residential`, `construction loan`, `development loan`,
`ground up`, `appraisal`, `ltv`, `loan to value`, `cap rate`, `reit`, `hotel`,
`self storage`, `airbnb`, `landlord`, `tenant`

`construction loan` stays negative even when the construction ABL campaign runs. The
distinction the account must hold is financing a contracting business versus financing a
building, so name the ad groups so it is obvious to whoever touches the account next.

**Distressed-intent block, specific to keeping the RBF campaign clean.** These select for
the borrower Serve does not want to buy: `mca`, `merchant cash advance consolidation`,
`mca relief`, `mca payoff`, `stacked`, `default`, `defaulted`, `judgment`, `coj`,
`behind on payments`, `cant make payroll`, `debt relief`, `debt settlement`, `bankruptcy`,
`chapter 11`, `workout`, `forbearance`

Note `alternative to merchant cash advance` is a bid term while `merchant cash advance
consolidation` is a negative. That is deliberate and it is the whole strategy in two lines:
buy the borrower deciding, not the borrower recovering.

**Size and intent block:** `free`, `grant`, `grants`, `no credit check`, `startup`,
`start up`, `new business`, `under 100k`, `personal loan`, `payday`, `student`, `crypto`,
`salary`, `jobs`, `career`, `how to become`, `broker training`, `iso agent`, `course`,
`certification`, `software`, `crm`, `template`, `sample letter`

Keep `what is` and `definition` variants out of paid and let them keep working organically.
Those queries are how AI assistants assemble answers, and all eight pages are written for it.

## Account setup, when it happens

- **Bidding.** Manual CPC, or Maximize Clicks with a hard CPC cap. Not target CPA. At this
  volume it will spend the budget learning what the negative list already knows.
- **Match types.** Exact and phrase only. No broad, no Performance Max, no Display, no
  Search Partners. Ever, at this ticket size.
- **Conversions.** `funnel_started` as the micro-conversion, `call_booked` as primary. Once
  HubSpot has volume, import the qualified-lead stage as an offline conversion.
- **Attribution.** Land ads on `?utm_source=google&utm_campaign=<campaign>`. Each page
  already carries its `src` into `/discover?src=<slug>`, and Umami records landing page and
  UTMs on the session, so attribution works without touching the qualifying funnel being
  rebuilt in parallel.
- **Geography.** US only. Before launch, confirm whether California's commercial financing
  disclosure rules (SB 1235) and New York's CFDL affect advertising claims there. Serve's
  success-only fee is a compliance strength worth stating in ad copy, but the disclosure
  question belongs to the licensing screen rather than to this document.
- **Schedule.** All hours, deliberately. Owners research an expensive problem at night,
  which is the behavior this page set was built around. Call extensions off outside business
  hours; let the funnel take the rest.

## Decision gates

At day 60, not day 14. This ticket size produces too few events for a weekly read.

- Click to funnel start under 8%: rewrite the landing page rather than adding budget. The
  page is failing to match the query.
- Leads arriving below $5MM in revenue: the problem is the keyword list, not the page. Audit
  the search terms report and extend the negative list.
- Cost per booked call over $400: pause and audit.
- One funded deal attributable to paid: raise to $4,000-$6,000/month and add campaign 2.

## What not to spend on

**Meta, TikTok, and SMS.** That is the Lucky Growth Partners channel, and it produces LGP's
deal size. A $12MM manufacturer with a working capital gap is not on TikTok looking for a
business loan. Ticket size is a function of where the traffic comes from, so paying for
cheap clicks is paying to become a different company.

**A general Google budget, ahead of the banker channel.** Serve's primary referral source is
commercial bankers, with 100+ clients and a 65% repeat rate of proven motion behind it, and
`/bankers` is already built for them. LinkedIn targeting commercial lenders, CPAs and
turnaround advisors at an estimated $12-$18 CPC is adjacent to something that already works.
If there is discretionary marketing money, that is a better test than search.

## Standing caveat

Every CPC here is modeled. There is no Google Ads account on this domain and no Search
Console history, so none of these figures come from auction or query data for this account.
Verifying Search Console is step one of the 60-day plan for exactly this reason.
