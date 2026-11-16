# What the site could say now, backed by our own data

Scope: proof points, case studies, new pages, FAQ entries. Ranked by how much each helps a business owner decide whether to trust Serve. Nothing here edits the repos. Nothing names a client.

Sources: `/tmp/audit/portal_aggregates.json` (CRM, 488 deals, 66 marked funded), `quotes-findings.md`, brain `Closed Deal Stories.md` and `Solutions Tombstones for Banker.md`, site `src/data/{company-info,fundingData,faq-data,industries}.ts`.

## Read this first: the CRM does not back what the site says about speed

The site's loudest claim is "funded in 3-10 days". It is in the page descriptions for the home page (`src/app/page.tsx:34,39,55`), `/solutions` (`src/app/solutions/page.tsx:7,12`), `/fundings` (`src/app/fundings/layout.tsx:5`) and `/blog` (`src/app/blog/page.tsx:26`).

The CRM says the median time from deal created to funded is about 54 days (`days_created_to_funded_median`). It is probably longer than real work time, because a deal row can sit open before anyone starts, and tranches can pull the date later. I am not certain how "funded" is dated. Even so, it is not 3-10 days.

The case studies make this worse. About 14 of the 23 cases in `src/data/fundingData.ts` show "Days", "Weeks" or "under 2 weeks". The CRM suggests those are the fastest cases, not the typical one. A business owner who has been burned by "24 hours" promises (quotes research, theme 1) will notice.

Ask Mike before changing anything: what is the honest typical time for a first closing, and what is the fastest? Proposal 1 is built on that.

---

## Ranked proposals (16)

### 1. Replace "3-10 days" with an honest timing statement
- **Evidence:** median ~54 days created-to-funded (CRM). Fastest cases on the site: 3 to 4 business days (`fundingData.ts` cases 6 and 9). The brain's 12-day close is "12 business days after the full package", which is about 2.5 weeks, yet the site calls the same deal "< 2 weeks" (`fundingData.ts:45`). Flag as unsure which is right; check with Mike.
- **Say:** "The fastest closings take a few days, when the file is complete and one lender fits. Larger or layered deals take a few weeks to a couple of months. In our records, a typical deal takes about eight weeks from first call to funding." Clear ranges by product are already in `faq-data.ts:61-64`; link to them.
- **Why it ranks first:** every other proof point is worth less if the headline number is one a visitor can catch out.

### 2. "What happens after you submit" page (and a short block on `/discover`)
- **Evidence:** the strongest new theme in the quotes research is being hounded after asking for help: dozens of lender emails and texts within 48 hours, and being asked for bank logins before seeing a proposal. CRM: median 1 lender submitted per funded deal (`lenders_submitted_per_funded_deal_median`). Unsure whether that reflects real practice or thin data entry; confirm before printing it.
- **Say, in plain steps:** one person answers you; we do not sell your details; we do not ask for bank login before there is a proposal on the table (confirm with Mike this is true in practice); you tell your story once and we carry it to lenders; you see who we send it to. Give the realistic timeline from proposal 1.
- **Words to borrow, not quote:** "you tell it once", "one person answers".
- **Where:** new `/how-it-works` or `/what-happens-next`; one short block on `src/app/discover/page.tsx`. `serveFundingProcess` in `company-info.ts` has three generic steps (Discovery, Diligence, Delivery); this page replaces that level of detail with real ones.

### 3. "When we will say no" page
- **Evidence:** owners thank us for candour; two independently said they would rather hear no early than a yes that becomes a no later. The site already says "half of being useful is being clear about what does not work", and the industry pages have "when this is the wrong answer" sections. There is no single page that collects them.
- **Say:** the cases where we tell you early we cannot help. Use only the criteria Mike confirms. The qualification block in `company-info.ts` is mostly empty (`disqualifiers: []`, several blank fields), so Mike has to supply these. Examples that appear in the quotes research as lender-side no's: a business under two years old with no revenue history, requests that need real collateral and have none, owners who need money in 24 hours for a deal that takes weeks. Mark each as "confirm" until Mike signs off.
- **Also say what we will not do:** no fees before funding is already an FAQ (`faq-data.ts:467`); put it next to this page.

### 4. Fix the proof points the CRM does not support
Do this before adding new ones. These are in `src/data/company-info.ts` unless noted.

| Site claim | What the CRM shows | Verdict |
|---|---|---|
| "65% repeat client rate" (`company-info.ts:~60,~120,~140,~255`; also printed in `src/app/llms-full.txt/route.ts:140`) | 57 distinct funded clients; 6 have 2 or more funded deals (about 11%). Separately, 21 of 66 funded deals have lead source "Repeat Client" (about 32% of deals). | Not supported. Remove. Use the deal-level figure with its definition instead (see 5). |
| "100+ clients served" (`totalClientsServed`, also in llms-full) | 57 distinct funded clients in the CRM. | Not supported as "served". Could be true if it counts people who got advice or declined offers; Mike must define it. Otherwise use "more than 50 businesses funded". |
| "$50MM+ facilitated" (`totalCapitalFacilitated`; code comment says "~$74MM actual") | $55.1MM across 51 deals with a recorded amount (15 funded deals have no amount). | $50MM+ is supported. The $74MM comment is not; do not use it unless Mike has another source. |
| "Average deal size $500K - $3.35MM" (`averageDealSize`) | Median closing $250K. 26 of 66 funded deals asked for under $250K, 26 for $250K to $1MM. Only 13 were over $1MM. | Misleading. The typical deal is much smaller. Replace with a median and a range. |
| "100% of referred deals funded within target timelines" (`vsPeerAdvisors.successRate`) | Not measurable; 66 of 488 deals are funded. | Remove. |
| "We negotiate 10-20 percentage point rate reductions" (`faq-data.ts:~105`) | Nothing in the CRM stores before/after rates. | Unsupported. Remove or replace with one real example if Mike can document it. |
| "Dozens of alternative lenders" (`faq-data.ts:~110`) | 179 active lenders in the network, 315 lender products. | Understated. Needs a definition of "active" from Mike before printing a number. |
| Founded 2021 | Earliest closings in the CRM are 2022 (5 deals). | Not a conflict (2021 can be the founding year). Phrase proof as "since 2022". |

Note: `llms-full` is read by AI search. A wrong figure there is repeated by AI answers.

### 5. Proof strip the CRM does support
Use ranges and "since 2022", never exact client-level numbers. Suggested wording, each tied to a field:
- "More than $50MM funded since 2022" — $55.1MM recorded across 51 closings.
- "More than 60 deals funded for about 55 businesses" — 66 funded deals, 57 distinct clients. Say "deals funded", not "clients served".
- "A network of 150+ active lenders and 300+ lender products" — only after Mike defines "active"; 179 and 315 are the raw counts.
- "Closings have grown every year" — 5 (2022), 8, 10, 13, 15 (2026 so far; year not over as of mid-November). True for count of closings. Do not claim dollar growth: dollars went 1.0MM, 24.1MM, 16.4MM, 4.6MM, 9.0MM, and 2023 is skewed by one very large equipment deal (about $22MM of the $55MM total).
- "Typical deal: about $250K. Range: about $20K to $22MM" — median and min/max of recorded closings. Say "typical" and "median", not "average".
- "Funded in 13 states, most in Georgia, Florida and Texas" — about 12 GA, 11 FL, 11 TX (the CRM spells Texas two ways, so I added TX and Texas; 13 deals have no state).
- "About a third of funded deals came back from clients we had already funded" — only if Mike confirms "Repeat Client" means what it says. Say "deals", never "clients".
- "Most work comes by introduction" — of funded deals with a recorded source, bankers (11), personal referrals (7) and partners (3) dominate, and only 1 came from the website. 22 have no source recorded, so say "of those we can trace". This also helps the banker pages and fits the "relationships over bots" line.
- Industry mix: construction 13, healthcare 9, manufacturing 9, technology 5, then logistics, hospitality, staffing, oil and gas, wholesale (9 not recorded). Say "most often construction, healthcare and manufacturing". Matches existing industry pages.
- Do not publish lender-count-per-deal until its meaning is checked.

### 6. New case study from the brain: the specialty vehicle manufacturer bridge
The only story in `Closed Deal Stories.md` that is not on the site (the medical device, plastics recycling and medical practice stories are all on it). Anonymised outline:
- **Industry:** specialty vehicle manufacturer, mountain-west state (the brain gives the state; "Mountain West" is safer).
- **Situation:** several vehicles in production at once, cash tied up in the builds, narrow window to deliver and convert to receivables.
- **Structure:** $1MM bridge, 18-month term, monthly (not weekly) payments, a strong prepay discount schedule, room to move into an asset-based line later.
- **Outcome range:** "about $1MM, closed under a year-end deadline" — the brain gives no date or timeline; ask Mike. Do not invent a speed.
- **Warning:** the brain's heading uses what looks like the client's business name. Do not copy the heading. Keep the whole entry to industry, region and structure.
- **Why it earns a slot:** it is a manufacturer; quotes research has an owner saying lenders "don't do manufacturers". A manufacturer case that says yes is direct counter-evidence.

### 7. Thicken the thin case studies
The site has 23 cases. The thinnest `fullStory` entries are the PO financing, specialty services, welding and HVAC ones (about 550 to 760 characters, no structure or reason lenders said no). Pattern across the 23: most show amount, a product label and a speed, few show what a bank said or why the structure was chosen. Owners trust "why", not "how fast".

For each, add four fields (the schema is `FundingCase` in `fundingData.ts:1-11`): who said no first and why (category, not name); what we proposed instead; what it cost relative to alternatives (a plain statement, no rates, since fee figures were deliberately removed); what changed afterwards. Outlines below. Only use facts already in the current entries or confirmed by Mike.

- **Coffee importer, PO financing ($1MM, `fundingData.ts` case 7).** Situation: a trading company needs to buy ahead of delivery. Structure: purchase-order line. Add: why the bank did not do POs, whether the importer later moved to a cheaper line. Outcome: "days". Thin because it has no mention of what happened after.
- **Welding contractor, MCA refinance ($55K, case 22).** Situation: two high-cost cash advances from a broker. Structure: a term loan that pays both off plus working capital. Add: the monthly payment change (a range, e.g. "daily payments became monthly"), and that a tax lien was being resolved. This is the single most relevant case for owners who have been burned by easy money (quotes theme 8). Move it higher on `/fundings`.
- **Specialty services firm, payroll cover ($150K, case 9) and HVAC ($75K, case 21).** Each is a one-paragraph "paid payroll on time" story. Combine into one "small and fast" outline: what was needed, which lender type, what the owner had to send. That doubles as the document checklist in proposal 11.
- **Landscape materials, inventory ($205K, case 17).** Rich, but the story names a city, a husband-and-wife ownership and a family betrayal. That is identifiable even without a company name. Trim before using it more; I would remove city and the family detail. This is a privacy flag, not an enrichment.
- **Seasonal event venues (cases 5, 6).** Good, but two near-identical stories. Keep both; they show a bank saying no on seasonality and a banker introducing us.

### 8. Situation pages in the owner's words (new `/situations/...` or sections on solution pages)
Each is a short page, 400 to 700 words, with a plain headline, the situation, what options exist, when it is the wrong answer, and one linked case. Evidence for each is in `quotes-findings.md`.
1. **"My bank said no."** Theme 5 (category rejection). Link to the medical device, excavation and venue cases. Existing FAQ: `faq-data.ts:56`.
2. **"I'm under two years old."** An owner quote: "no one else talks to anybody if you're younger than two years old" (paraphrase for the page). Needs a real answer on what is possible and what is not; ask Mike (see proposal 3).
3. **"I'm a manufacturer / real estate / contractor."** Category pages that name the case. There are six industry pages already (`industries.ts:70,222,370,528,644,803`: staffing, healthcare, manufacturing, government contractors, construction, e-commerce). CRM funds mostly construction, healthcare, manufacturing, technology, and logistics. Gaps: technology (5 funded), logistics (3), hospitality (3), oil and gas (2), real estate. Real estate has an owner quote ("Banks don't like real estate people") and one public case; make a real-estate and a logistics/transportation page first.
4. **"I stacked cash advances and need out."** Theme 8. Exists as FAQ and solution pages; add a "what the first call looks like" block.
5. **"I need payroll covered this week."** Theme 7 (personal stake). Existing FAQ answers speed but not the human side; add one line about who you talk to and what you send.
- **Phrasing:** use the nouns from the research ("room to breathe", "a bridge", "a yes", "a no up front"), not full sentences, and do not present them as quotes.

### 9. "What owners tell us before we talk" block
A short, anonymous composite block on `/discover` or the home page, labelled as a summary, not a testimonial. Quotes research section 3 already says this is honest and needs no permission. Draft six lines in our voice: asked for help and got flooded; tired of retelling facts to each new contact; burned by easy money; told no by a risk department; asked to share bank logins first; told "we don't do manufacturers". Each line is followed by a link to the matching situation page (proposal 8) or the "what happens next" page (proposal 2). Mark each as composite.

### 10. FAQ entries that answer the fears in the quotes research
Add to `src/data/faq-data.ts` (the `/faq` page and the chatbot read it). Each must answer in the first sentence. Mark any answer that needs Mike's input.
1. **"Will I get flooded with calls and emails after I submit?"** No; one person replies. List what we do not do (confirm each with Mike).
2. **"Do you need my bank login before I see a proposal?"** Answer from actual practice; confirm with Mike. The quotes research shows owners were asked for this elsewhere.
3. **"Do I have to tell my story to every lender?"** No: we tell it once and carry the file.
4. **"What if the answer is no?"** We say so early, and why, and what would change it (ties to proposal 3).
5. **"How long will this really take?"** Real range from proposal 1; contrast with 24-hour promises without naming anyone.
6. **"I got burned by easy money. How do I know you are different?"** Say what we are (an advisor, not a lender), who pays us and when (the site currently avoids fee figures; keep that, but say plainly "we are paid by the lender or the engagement, at closing" only if true; ask Mike, see `faq-data.ts:71`).
7. **"Will this put my house or personal assets at risk?"** Theme 7: owners protect personal assets first. Say which structures need a personal guarantee and which do not, product by product (some lines on the Tombstones sheet say "no PGs" for tech loans; do not copy rates or fees from that banker sheet).
8. **"I can't afford 100 more hours of paperwork. What do you need from me?"** Theme 6 (time is the cost). Answer with a short document list per product and "a first answer on a bank-statement review". See proposal 11.
9. **"Do you work with companies under two years old / manufacturers / real estate owners?"** One entry each, short and honest.
10. **"Will you tell my bank?"** Banker-referral deals are 11 of 66 funded; owners may worry. Confirm practice before answering.

### 11. "What to have ready" checklist per product
Time is the cost (quotes theme 6: one owner spent a day on submissions). The `Solutions Tombstones for Banker.md` and industry pages list product minimums (time in business, credit ranges) but there is no owner-facing "what to gather and in what order". One short block per product, three to six items, with "what you can skip at first". Do not publish the Tombstones rates, origination fees or monthly rate ranges: the site rule is that fee figures were deliberately removed, and the sheet is written for bankers.

### 12. A "who we work for" block with real numbers
Use the CRM request-size buckets: under $250K (26 deals), $250K-$1MM (26), $1MM-$5MM (8), over $5MM (5). Say "most of our deals are under $1MM; we also do the occasional large one". This answers "am I too small?" and corrects the "$500K - $3.35MM" average claim. The home and FAQ copy say "$250K to $100MM" (`faq-data.ts:51`), but a quarter or more of funded deals asked for under $250K; check whether that range is a minimum we apply or a legacy line. Do not state a minimum until Mike confirms.

### 13. Product mix from the CRM, with an honest caveat
The CRM tags only 17 of 66 funded deals with a product (revenue-based term loan 12, factoring 2, working capital 1, real estate 1, other 1); 49 have none. Not good enough to publish. Do not use. Fix the data first (a data task, not a website task), then publish "what we funded, by type". Until then the site's solution pages (ABL, factoring, PO, etc.) overstate our mix relative to what the CRM can show.

### 14. A case study "pattern" page: how our deals are built
Many closed deals were multi-step: several tranches over months (medical device, labels, wine, landscape, real estate). The site already says "layered capital" (FAQ ~line 636). One page that shows three to four structures anonymised as diagrams: short bridge into an asset-based line; unsecured loan plus receivables line plus second mortgage; subordinated term behind a bank line; and the equipment path. It makes the "creative structure" claim concrete and uses facts already in the brain and `fundingData.ts`. Mark exact tranche terms as "illustrative" if not confirmed.

### 15. A short "lender network" explainer
179 active lenders and 315 products in the CRM versus "dozens" and "extensive network" on the site. Describe the network by type (banks, asset-based, factoring, equipment, bridge, real estate, government contract), not by name. Add "how we pick which two or three to send your file to" using the real process Mike describes. Do not publish lender names (they are Serve's partners; check with Mike).

### 16. Fix "average" and repeat metrics inside `llms-full`
`src/app/llms-full.txt/route.ts:137-140` prints the figures from proposal 4 to AI crawlers. When the site numbers change, change them here, and add the new proof strip so AI answers quote the true version. Low effort, high leverage for AI search.

---

## What I could not check
- How "funded" and the dates are set in the CRM, so the 54-day median may overstate or understate real elapsed time.
- What "active lender" means for the 179 count.
- Whether the "Repeat Client" lead source matches real repeat business.
- What Mike actually does about logins, fees timing, and minimums; every "confirm with Mike" above is a real open question.
- I did not read Mike's emails or call lines for this task. They would likely give better "when we say no" criteria than I could write from the docs.

## Privacy notes
- The brain's `Closed Deal Stories.md` has a heading that looks like a real business name. Nothing from it is copied here and it should not go on the site.
- The landscape materials case (`fundingData.ts` case 17) has city, family and ownership details that could identify the owners; recommend trimming.
