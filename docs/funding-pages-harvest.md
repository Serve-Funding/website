# /funding harvest — blocks keyed by destination

**Generated 2026-08-31 from `src/data/funding-pages.ts` after PR #60.**
Advance rates below are Michael's verified figures, not the originally published ones.

Nine pages move into nine destinations. Every block below is either MOVE (structured, transplants
as-is), FOLD (merges into a field that already exists), or REWRITE (substance survives, voice does not).
Blocks deliberately dropped: `fitsIf` (duplicates `bestFor`), `versus` (`/compare/*` owns it),
`schema` (both destinations already emit it), and the `/funding` index hero.

Delete this file and `scripts/harvest-funding-pages.ts` once the migration lands.

---

## Product-level ABL facts → `/solutions/asset-based-lending`

Pulled from all four ABL crosses. These are true of ABL generally rather than of one vertical, so
they belong on the product page. The vertical-specific exclusions stay on the industry pages.

| Label | Value |
|---|---|
| Eligible receivables | 80%-85% |
| Machinery and equipment | 70%-80% of appraised liquidation value |
| Finished goods inventory | 60%-75% of net orderly liquidation value |
| Raw materials | Generally ineligible. Lenders want finished goods |
| Work in process | Ineligible, zero borrowing base credit |
| Facility size | $250K to $25MM |
| Pricing | Prime + 1%-6% depending on vertical and collateral mix |
| Reporting | Monthly borrowing-base certificate, weekly for tighter facilities |

Sourced from the manufacturing cross after PR #60. Vertical-specific rates that do NOT belong here:
healthcare net-collectible-value advances, construction retainage treatment, staffing AR rates.

---

## `revenue-based-financing` → `/solutions/working-capital-loans`

**Source H1:** Revenue-Based Financing: Growth Capital in Days, Paid Monthly

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $10MM+ |
| How it is sized | Roughly 10%-15% of annual revenue |
| Pricing (2026) | 1.25%-4% per month, roughly 18%-48% effective APR |
| Structure | Fixed monthly payment over 6-48 months. Revolving versions available from select lenders |
| Payment frequency | Monthly. No daily or weekly ACH extraction from sales |
| Time to close | 2-10 business days; 24-72 hours on emergency payroll |
| Early payoff | The better products forgive unearned interest, which can nearly halve the real cost. Confirm this in writing |
| What underwriting reads | 12 months of bank statements, weighted to the last 3. No appraisal, no field exam |
| Owner credit | Matters more than in asset-based lending. Clean 680+ widens the options meaningfully |
| Lien position | Subordinate structures available; will sit behind an existing factor or ABL |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Companies with a large book of commercial invoices**

If you have $1MM+ of receivables from creditworthy business customers, an asset-based line or invoice financing at Prime plus 1%-5% is a fraction of the cost of revenue-based financing and the facility grows with sales instead of amortizing away. Do not buy RBF because it is faster if the cheaper facility can be in place in three weeks. We will usually structure both: RBF now, the cheap facility underwriting in parallel.

**Already two or more advances deep**

Adding a term loan on top of a stack is stacking, whatever it is called. The conversation you need is a consolidation that pays those positions off and closes them. That is a different page and a different lender set.

**Revenue trending down over the last two quarters**

Revenue-based underwriting reads trailing deposits, so a declining trend prices badly or declines outright. If there is collateral, an asset-based facility looks at what you own rather than at the trend, and is the better door.

**Financing an acquisition or a partner buyout**

RBF is sized to 10%-15% of revenue, which almost never covers a purchase price. Acquisitions want SBA 7(a) for the price and a bridge for the timing gap.

**Under about $2MM in revenue, or asking under $250K**

Below that the revenue-based options thin out and most of what will look at you are advances. Still worth a conversation, because sometimes there is an asset to lend against that changes the answer entirely, and if there genuinely is not, we will tell you rather than put you into something we would not want to sign ourselves.

### MOVE — worked example → new `workedExample` field

A specialty food manufacturer doing about $13MM in revenue lands shelf placement with a regional grocery chain. Filling it means roughly $900K of additional raw material and a second production shift, starting in three weeks. The company is profitable, has a $1.5MM bank line that is drawn to $1.3MM, and has never taken outside capital.

The first offer to arrive is an advance: $1MM in 48 hours at a 1.32 factor rate, so $1.32MM of payback pulled at 12% of daily deposits. On the projected nine-month payback that is an effective cost north of 68%, extracted daily against receivables that pay in 45 days. It would fund the shelf placement and squeeze the cash the shelf placement depends on.

What we place instead is $1.4MM of revenue-based financing at 2.1% per month over 30 months, funded in seven business days, with written forgiveness of unearned interest on early payoff. Monthly payment lands near $63K. In parallel, an asset-based facility goes into underwriting against the growing receivable book from the chain, and closes about nine weeks later at Prime plus 3%. The company retires the RBF at month eleven and, because the prepayment terms were real, pays roughly $214K of total interest rather than the roughly $390K the full 30-month schedule implied. Same speed as the advance, and a little over a quarter of the cost.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

Revenue-based financing is a term loan sized against a company trailing revenue rather than against its collateral, repaid in fixed monthly installments over 6 to 48 months. As of 2026 it runs $250K to $10MM, is typically sized at 10%-15% of annual revenue, prices at 1.25%-4% per month (roughly 18%-48% effective APR), and funds in 2 to 10 business days. The distinction that decides whether this product helps or hurts is the repayment mechanic. A merchant cash advance pulls 10%-20% of revenue by daily or weekly ACH until a fixed factor amount is paid, which commonly annualizes at 50%-200%+ and takes cash on days your customers have not paid you yet. Revenue-based financing takes one payment a month, and the better products forgive unearned interest on early payoff, which can cut the real cost close to half. Same speed as an advance, roughly a third to a half of the cost. The practical qualifying gate is three consecutive months of healthy bank deposits.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Underwriting reads deposits, not collateral** — Twelve months of bank statements, with the last three carrying the most weight. The question is whether the business consistently generates enough cash to carry a fixed monthly payment. No field exam, no appraisal, no borrowing base, which is why this closes in days rather than weeks.
2. **Size lands at 10%-15% of annual revenue** — A $12MM company should expect roughly $1.2MM to $1.8MM as the realistic ceiling. Knowing that number before you start saves the conversation where someone asks for $4MM against $12MM of revenue and hears no from six lenders.
3. **Terms get set at 6 to 48 months, monthly** — Pricing runs 1.25%-4% per month depending on deposit consistency, time in business, industry, and owner credit. Ask specifically about prepayment: real forgiveness of unearned interest is the difference between a 30% effective cost and a 16% one, and it is not standard across lenders.
4. **Funding in 2 to 10 business days** — Emergency payroll situations have closed inside 24 to 72 hours. What stretches a five-day close is almost always a document sitting on the borrower side, not the lender.
5. **Treat it as step one where something cheaper exists** — If the business has receivables, inventory, or owned equipment, the right play is usually to close RBF now and put an asset-based line or factoring facility into underwriting the same week. Six to eight weeks later the cheaper facility retires the RBF. Speed and price are both available; they are just not available on the same day.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: What is the difference between revenue-based financing and a merchant cash advance?**

The repayment mechanic, and it drives everything else. An MCA buys a share of future receivables and collects 10%-20% of revenue by daily or weekly ACH until a fixed factor amount is paid, commonly annualizing at 50%-200%+. Revenue-based financing is a loan with a fixed monthly payment over a known term at 1.25%-4% per month. Both fund in days on similar underwriting. One takes cash on days your customers have not paid you; the other does not.

**Q: How much revenue-based financing can I get?**

Plan on 10%-15% of annual revenue as the realistic ceiling, so roughly $1.2MM to $1.8MM on $12MM of revenue. Facilities run $250K to $10MM+. If the number you need is well above that band, the answer is usually a different product rather than a different lender: an asset-based line sizes to collateral instead of revenue and can go considerably higher.

**Q: What does revenue-based financing cost in 2026?**

1.25%-4% per month, which is roughly 18%-48% effective APR depending on deposit consistency, time in business, industry, and owner credit. The single question most worth asking on a term sheet is what happens on early payoff. Real forgiveness of unearned interest can nearly halve what the money costs, and it is not standard across lenders.

**Q: Is this the kind of RBF where my payment goes up in a good month?**

Not the structure we place. Two different products carry the name. One takes a percentage of revenue, so the payment rises when sales rise and the schedule moves under you, which is genuinely difficult in a seasonal business. Serve places the fixed-payment version: a known monthly amount over a known term. If a lender quotes you a percentage of revenue, that is a different product and worth evaluating differently.

**Q: Should I use this if I have a lot of receivables?**

Probably not as the destination. A commercial receivable book of $1MM or more supports an asset-based line or an invoice facility at Prime plus 1%-5%, which is a fraction of the cost and grows with sales. The honest structure in that case is revenue-based financing now, because it closes in days, with the cheaper facility underwriting in parallel and retiring it in six to eight weeks. Speed and price are both available, just not on the same day.

**Q: Does taking this hurt my chances of getting cheaper money later?**

The opposite, generally. Twelve months of clean monthly payments is exactly the history an asset-based lender, a non-bank SBA lender, or a bank wants to underwrite. The thing that damages the next facility is a stack of advances with daily draws and multiple UCC filings, which is a large part of why the mechanic matters more than the headline rate.

**Q: How fast can this actually fund?**

Two to ten business days normally, and 24 to 72 hours when payroll is the reason. What determines where you land is almost entirely how fast the file gets assembled: twelve months of bank statements, a current AR aging if you have one, and a clear explanation of what the money is for. Lenders are rarely the bottleneck.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

The company this page is written for is doing fine. Revenue is up, the pipeline is real, and there is a specific thing that needs funding in the next two weeks: inventory ahead of a season, a crew for a contract that was just awarded, materials for an order that came in bigger than expected. The bank is not the problem in the sense of having said no. The bank is the problem in the sense of taking three to twelve weeks, and the opportunity does not wait three to twelve weeks.

So the owner starts making calls, and within about a day the market finds them. Somebody offers $500K in 48 hours at a 1.35 factor rate. The paperwork is short, the funding is real, and almost nothing in the document is expressed as an interest rate, so the cost is genuinely difficult to evaluate under time pressure. What is being sold is speed, and speed is exactly what the buyer came for.

What gets lost is the mechanic. A 1.35 factor on $500K is $675K of payback, extracted at 10%-20% of daily revenue, starting the next business day, whether or not your customers have paid you. On a nine-month payback that annualizes past 70%. And because the amount owed is fixed rather than accruing, paying it off early usually saves nothing, so a strong quarter accelerates the extraction without reducing the bill.

Revenue-based financing, structured as a fixed monthly payment, funds in the same two to ten business days on the same kind of underwriting. It reads trailing bank deposits rather than collateral, so it does not require a receivable book or free-and-clear equipment. It costs 1.25%-4% per month rather than a factor rate. And on the better products, paying it off early forgives the unearned interest, which is the single largest lever on what the money actually ends up costing. The reason to know this before you need it is that the decision gets made in about 48 hours, and 48 hours is not enough time to learn a new product category.

One clarification, because the term is used for two different things. Some products called revenue-based financing take a percentage of revenue each month, so the payment rises in a strong month and the amortization schedule moves under you. Serve places the fixed-payment structure: a known monthly amount over a known term. The variable-payment version has real problems in a seasonal business, and we have written about them separately.

---

## `invoice-factoring` → `/solutions/invoice-factoring`

> **Cleanest transplant. Written 2026-08-31, never had a counterpart problem.**

**Source H1:** Invoice Factoring: Cash Against Invoices You Have Already Issued

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K to $25MM, sized to the receivable book |
| Advance rate, commercial invoices | 80%-90% of face value, 85% typical |
| Advance rate, government receivables | 80%-90%, subject to assignment of claims |
| Cost | 1%-3% per 30 days outstanding |
| Reserve | 10%-20%, released on collection less the fee |
| Time to fund the first invoice | 5-10 business days to document, then 24-48 hours |
| Typical single-customer concentration limit | 20%-30% of the ledger |
| Invoice ageing limit | Normally 90 days, occasionally 120 |
| Contract term | 12-24 months is standard, 30-90 day terms exist and cost more |
| Balance sheet treatment | A true sale of the receivable, not debt |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Companies invoicing consumers, or taking payment by card at the point of sale**

There is no commercial receivable to sell. What fits that revenue pattern is revenue-based financing, sized against your deposits rather than against an invoice ledger.

**Contractors billing on progress or holding retainage**

A construction receivable behaves differently from a commercial one. Progress billings are conditional until the work is accepted, retainage is not collectible until the job closes, and pay-when-paid clauses put a third party between you and the money. Most factors will not buy that paper. An asset-based facility built for construction is the better door.

**Needing cash before the goods exist**

If the money is going to a supplier so an order can be produced, that is purchase order financing. The two are frequently arranged together: PO financing pays the supplier, and the factoring advance retires the PO position the day the invoice is issued.

**Companies that also need to borrow against inventory, equipment or property**

Factoring only ever addresses the receivable. If there is meaningful collateral elsewhere on the balance sheet, one asset-based line against all of it is usually cheaper per dollar and simpler to administer than a factoring facility plus separate borrowings.

**Already inside a factoring agreement with another funder**

Most factoring contracts carry a term, a minimum volume commitment, and an early termination fee, and the incumbent holds a first-position UCC on your receivables. Moving is normal and happens constantly, but it is a buyout conversation rather than a new facility. Send us the agreement before you sign anything else.

### MOVE — worked example → new `workedExample` field

A wholesale distributor doing roughly $12MM in revenue sells into regional grocery and food-service chains on net 45 terms, though the ledger actually pays closer to 58 days. Receivables run about $2.1MM at any one time. The company is profitable, has been trading nine years, and was declined for a bank line increase because two quarters in the prior year showed compressed margins during a commodity swing.

We place a $2MM factoring facility at an 85% advance rate, priced at about 1.4% per 30 days, with the largest customer carved out at a higher concentration limit because that buyer is a national chain with public financials. Documentation takes eight business days, most of it spent obtaining a subordination from the equipment lender holding a blanket lien.

On a representative month the company submits $900K of verified invoices and receives about $765K within 48 hours. Those invoices collect over an average of 56 days, so the fee lands near $23K, and the $135K reserve is released as each invoice pays. Annualized across the facility the financing cost runs close to $265K against roughly $2.4MM of gross margin.

What the company actually bought is a purchasing position. Paying suppliers inside terms rather than at 45 days earns a 2% early-payment discount on about $7MM of annual purchases, worth roughly $140K, which recovers over half the cost of the facility. Eighteen months later, with two clean years on the books, the same distributor moved onto an asset-based line at a materially lower rate. That is the normal arc. For most companies factoring is a bridge to cheaper capital rather than a permanent arrangement.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

Invoice factoring converts unpaid commercial invoices into cash by selling them to a funder at a discount, typically advancing 80%-90% of face value within 24 to 48 hours of the invoice being verified. As of 2026, facilities run $250K to $25MM, cost 1%-3% per 30 days outstanding, and take 5 to 10 business days to put in place. The reserve, meaning the 10%-20% held back, is released when your customer pays, less the fee. Two things decide whether a company qualifies, and neither is its own credit. The first is who owes the money: factoring underwrites the creditworthiness of your customers, so a company with thin financials and invoices out to solid commercial or government buyers is a normal approval. The second is whether the work is finished. A factor buys receivables for goods delivered or services rendered and accepted, never work still in progress, which is what separates factoring from purchase order financing. Because a factoring line is sized to your receivables rather than to a fixed loan amount, the facility grows as sales grow instead of amortizing away.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **The funder underwrites your customers, not you** — You provide an accounts receivable ageing, a sample of invoices, and details of your largest debtors. The credit work is done on the companies that owe you money. Expect questions about concentration: most facilities want no single customer above 20%-30% of the ledger, though exceptions are routine when that customer is large and creditworthy.
2. **A facility limit and an advance rate are set** — The limit is sized to your receivable book, commonly 1 to 1.5 times peak monthly billings. The advance rate on commercial invoices normally lands at 80%-90%, with 85% the usual starting point. Weaker debtors, longer terms or heavy concentration pull it down.
3. **Documentation and a UCC filing, 5 to 10 business days** — The factor files a first-position UCC on your receivables and sets up a lockbox in your company name. If a lender already holds a blanket lien, that lender must subordinate its interest in the receivables. Arranging that subordination is usually the longest step, and it is the one worth starting early.
4. **You submit invoices and they are verified** — Verification means the factor confirms with your customer that the goods arrived or the work was accepted and that no dispute exists. On an established account this is a routine email. It is also the reason a disputed invoice cannot be funded, however good the customer.
5. **The advance funds in 24 to 48 hours** — Once verified, 80%-90% of face value reaches your account, usually the next business day. After the first few submissions the cycle becomes routine and same-day funding is common.
6. **Your customer pays the lockbox, and the reserve is released** — Payment goes to the lockbox rather than to you. The factor applies it, releases the reserve, and deducts the fee for the days the invoice was outstanding. An invoice paid in 30 days costs roughly a third of what the same invoice costs if it pays in 90, which is why customer payment behavior matters more than the headline rate.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Will my customers know I am factoring invoices?**

Under a standard notification facility, yes. Your customer receives a notice of assignment and pays into a lockbox in your company name. Accounts payable departments at large commercial and government buyers process assigned receivables constantly and treat the notice as routine paperwork rather than as a signal of distress. Make the call to your customer yourself, a few days ahead of the paperwork, and it lands as housekeeping instead of news. Non-notification facilities do exist for stronger companies, and they cost more.

**Q: What does invoice factoring cost in 2026?**

Between 1% and 3% of face value per 30 days outstanding. The rate depends on monthly volume, the credit quality of your customers, and how quickly they actually pay. A facility quoted at 1.5% per 30 days on invoices that collect in 45 days costs about 2.25% of face. The figure to compare is cost per dollar collected over your real ageing, not the headline monthly rate, and any funder unwilling to model that for you is telling you something.

**Q: Is factoring a loan? Does it put debt on my balance sheet?**

A properly documented factoring facility is a true sale of the receivable, so the receivable comes off your balance sheet and no debt goes on. That distinction matters if you have covenants elsewhere restricting additional indebtedness. The factor does file a UCC financing statement on your receivables, which is a lien and will be visible to any other lender, so existing secured lenders generally need to subordinate.

**Q: What is the difference between recourse and non-recourse factoring?**

Under recourse factoring, if your customer never pays, you buy the invoice back. Under non-recourse, the factor absorbs that loss. The distinction is narrower than it sounds: non-recourse ordinarily covers customer insolvency only, not disputes, short payments, or a customer withholding because of a quality issue. Those come back to you under either structure. Non-recourse typically costs 0.25%-0.75% more per 30 days, and it is worth paying when the ledger is concentrated in a few names.

**Q: Can I factor a single invoice instead of my whole ledger?**

Spot factoring exists and can solve a one-off gap, though it prices well above a committed facility, often 3%-5% for a single invoice, because the funder underwrites a customer relationship it will not see again. Most facilities instead ask for the whole ledger or all invoices from selected customers. If your need genuinely is one invoice once, say so early, because the lender set is different.

**Q: Which invoices will a factor refuse to buy?**

Anything pre-billed or covering work still in progress. Invoices already more than 90 days old. Invoices to a customer you also buy from, because the contra account can be netted against what you are owed. Related-party invoices. Consignment and guaranteed-sale arrangements, where the sale is not final. Progress billings and retainage. Foreign receivables without credit insurance. Anything under dispute. Expect roughly 5%-15% of a typical ledger to be ineligible, and size the facility on the eligible portion rather than on the gross ageing.

**Q: How quickly can a facility be in place?**

Five to ten business days from a complete submission to the first funded invoice, then 24 to 48 hours per submission after that. The step that most often extends it is obtaining a subordination or lien release from an existing secured lender, which depends on that lender rather than on the factor. If you know a blanket lien is on file, raise it in the first conversation.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

The invoices are good. That is what makes this particular cash shortage so difficult to explain to anyone who has not run a business on terms. You delivered, the customer accepted, the paperwork is clean, and a national buyer with an investment-grade balance sheet owes you $600K. They will pay. They will pay on day 58 of net 45, because that is how their accounts payable department runs, and there is no version of the conversation where you tell them otherwise and keep the account.

Meanwhile payroll is Friday, your suppliers are on net 30, and the growth that created the receivable is the same growth that is now consuming the cash. This is the part that catches people out: the faster you grow, the worse it gets. Every new order pushes more cash out the door in wages and materials weeks before any of it comes back. A company can be profitable on every single job and still run out of money, and plenty do.

The bank is not the answer inside this timeframe, and often not at all. A line of credit is underwritten on your financial statements, your debt service coverage, and two or three years of history. If you are young, if last year was uneven, if there is a lien on file, or if you simply need the facility in two weeks rather than two months, the answer is no or the answer arrives too late to matter.

So the offers that do arrive are the ones that come fast, and they are almost always advances against revenue, repaid by daily debit. That structure takes money on days your customers have not paid you, which is precisely the problem you were trying to solve. Factoring inverts it. Instead of borrowing against what you might collect, you sell what you are already owed, and the money arrives against the specific invoice that created the gap.

---

## `purchase-order-financing` → `/solutions/purchase-order-funding`

**Source H1:** You Won an Order You Cannot Afford to Fill

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Transaction size | $250K - $10MM+ |
| Coverage of supplier cost | 70%-100% |
| Pricing (2026) | Roughly 2%-4% per 30 days on the funded amount |
| Time to close | 5-15 business days, driven by supplier and customer diligence |
| Gross margin required | Roughly 20%-25% or better on the transaction |
| What is financed | Finished goods that ship: resale, drop-ship, contract-manufactured |
| What is not financed | Services, labor, in-house work in process |
| Primary credit decision | Your end customer credit, then your supplier reliability |
| Typical exit | Invoice factoring on the resulting receivable, usually arranged in the same package |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Service businesses, staffing, or anything where the cost is labor**

There is no supplier to pay and no goods to secure. What you want is invoice factoring against the receivable once you have billed, or a payroll-funding facility if the gap is between payroll and collection.

**Manufacturers converting raw materials in-house**

PO funders will not finance work in process, because half-finished goods are not collateral anyone can liquidate. Inventory financing or an asset-based line against raw materials and finished goods is the right structure. Some funders will cover the raw-material purchase specifically, which is worth asking about.

**Gross margin under about 15%**

The arithmetic does not survive the cost of the money. Either the order needs repricing or the capital needs to come from a cheaper facility, an ABL or a bank line, which takes longer to put in place but works at thin margins.

**A purchase order that is really a forecast**

Letters of intent, blanket agreements with no firm quantities, and verbal commitments are not financeable. A funder needs a document your customer is contractually bound by.

### MOVE — worked example → new `workedExample` field

A consumer products company doing roughly $7MM in revenue receives a $1.9MM purchase order from a national retailer, roughly triple its largest previous order. Supplier cost is about $1.25MM against an overseas manufacturer it has used for three years, with 50% due at production start and the balance at shipment. Gross margin on the transaction is about 34%.

We arrange PO financing covering 100% of supplier cost. That is $1.25MM, issued as a letter of credit at production start with the balance released against shipping documents, priced at roughly 3% per 30 days. Alongside it, a factoring facility is set up on the retailer receivable at an 85% advance rate, so the moment the invoice is issued the factoring advance retires the PO position. Both facilities are documented together before production starts, which is the part that makes the timing work.

The cycle runs 71 days from letter of credit to customer payment. Total financing cost lands near $102K against roughly $650K of gross margin. The company nets about $548K on an order it could not otherwise have accepted, and finishes with an open factoring line ready for the reorder that arrives four months later.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

Purchase order financing pays your supplier directly so you can fill a confirmed order that is larger than your working capital. The funder issues payment or a letter of credit to the supplier against the purchase order, the goods ship to your customer, and the funder is repaid out of the resulting invoice, usually by rolling straight into invoice factoring. As of 2026, PO financing covers 70%-100% of supplier cost on orders from $250K to $10MM+, prices at roughly 2%-4% per 30 days of the funded amount, and closes in 5-15 business days once the supplier and end customer check out. The gate is gross margin: the transaction generally needs 20%-25% or better to absorb the cost, and the funder cares as much about your customer credit and your supplier reliability as about your financials. It only works for finished goods that ship, not for services, not for labor, and not for work you manufacture yourself from raw inputs.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **The funder underwrites your customer, not you** — The primary credit question is whether the company that issued the PO will pay the resulting invoice. Your financials matter, but a thin balance sheet with a blue-chip or government customer on the other side is a normal PO financing profile rather than a disqualifier.
2. **The supplier is vetted too** — A funder is about to wire money to your vendor on the expectation that goods ship on time and to spec. Suppliers with a delivery history, especially ones who have delivered for you before, move a file forward. A new overseas supplier with no track record is the most common reason a PO deal stalls.
3. **Payment goes to the supplier, never to you** — The funder pays the supplier directly, or issues a letter of credit, covering 70%-100% of supplier cost. This is not a cash advance to your operating account, which is why it does not solve a general working capital shortage.
4. **Goods ship, invoice is issued, factoring takes over** — Once the order ships and you invoice, the receivable is factored and the factoring advance repays the PO funder. In practice the two facilities are usually arranged together at the start, which is far cleaner than trying to bolt factoring on after the goods are in transit.
5. **You collect the residual** — After the supplier cost, the PO financing fee, and the factoring fee, the remaining margin lands with you when your customer pays. This is why the 20%-25% margin floor matters. It is what is left after three layers of cost.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Can I get purchase order financing with bad credit or a weak balance sheet?**

Often, yes. The primary credit decision is about your end customer, not about you. A company with thin financials and a firm order from a creditworthy buyer is a normal PO financing profile. What will stop a deal is a customer whose credit does not check out, a supplier with no delivery history, or margin too thin to carry the cost.

**Q: What does purchase order financing cost in 2026?**

Roughly 2%-4% per 30 days on the funded amount. A typical 60-day cycle from supplier payment to customer collection therefore runs 4%-8% of the financed amount. Add the factoring fee on the exit and plan for total financing cost of 5%-10% of the transaction. That is why the margin floor sits around 20%-25%.

**Q: Will the money come to my company?**

No. The funder pays your supplier directly or issues a letter of credit in their favor. This is intentional. It is what makes the structure financeable, and it is also why PO financing does not solve a general cash shortage. If what you need is operating cash rather than supplier payment, the right tools are factoring, an asset-based line, or a working capital loan.

**Q: Does my customer find out?**

Usually yes, because the receivable gets factored on the exit and payment is directed to a lockbox. In practice large commercial and government buyers deal with assigned receivables constantly and their AP departments handle it as routine paperwork. It is worth telling your customer before they receive the notice rather than after.

**Q: I manufacture the goods myself. Does this work?**

Generally not for the manufacturing itself. PO funders will not finance work in process, because a half-built product is not collateral. Some will finance the raw-material purchase specifically, and the more common structure for manufacturers is inventory financing or an asset-based line against raw materials and finished goods. It is worth a conversation about which of your costs are actually financeable.

**Q: How fast can this close?**

Five to fifteen business days. The variable is diligence on two third parties, your customer credit and your supplier reliability, neither of which you fully control. The fastest closings happen when the supplier has delivered for you before and the customer is a name the funder already knows.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

This is the good problem, and it is still a problem. A customer you have been chasing for two years sends a purchase order that is three times anything you have filled before. The margin is real. The customer is good. And your supplier wants 50% down before production starts, which is more cash than the business has, so the order that should be the best thing that happened this year turns into a decision about whether to decline it or take money you should not take.

What makes it hard is that the collateral does not exist yet. There is no invoice to factor, because nothing has shipped. There is no inventory to borrow against, because nothing has been made. A bank looks at the balance sheet and sees a company too small for the order, which is exactly what it is. That is the point of the financing. The asset being lent against is the purchase order itself and the credit of the company that issued it.

The usual mistake at this moment is to reach for the fastest money instead of the right money. An advance sized against trailing revenue will not cover a step-change order, and the daily repayment starts before the goods have even shipped, which means the company is servicing debt out of cash flow that is 90 days from existing. Companies fail on good orders more often than on bad ones, and this is usually how.

The other honest constraint is margin. PO financing costs roughly 2%-4% per 30 days, and a transaction with a 60-day cycle from supplier payment to customer collection carries perhaps 5%-8% of cost. On a 30% gross margin that is a good trade. On a 12% margin it is most of the profit, and the right answer is to say so before anyone pays for diligence.

---

## `business-bridge-loan` → `/solutions/bridge-funding`

> **Carry the real-estate routing block over verbatim. It is the fix Michael asked for on 2026-08-28.**

**Source H1:** Business Bridge Loans: Commercial and Industrial, Not Real Estate

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $5MM+ |
| Collateral | Receivables, inventory, equipment, assignable contract proceeds, not real property |
| Pricing (2026) | Roughly Prime + 4%-8%, typically interest-only |
| Time to close | 3-7 business days from a clean file |
| Time outstanding | 30-180 days in most cases |
| Early payoff | Credit for early payoff on most products, so you pay for the days you use |
| Lien position | First position preferred; subordinated structures available behind an existing factor or ABL |
| Qualifying exits | ABL or SBA in underwriting, signed acquisition with a funding date, assignable contract, property under contract |
| Disqualifying exits | Soft investor interest, expected revenue improvement, speculative asset appreciation |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Financing real property rather than a business: purchase, refinance, construction, fix-and-flip, multifamily, land**

That is a commercial real estate bridge, underwritten on the property rather than on the business, and it is work we do constantly. Quick to close, and needed all the time. Different structure, different lenders, same firm. Our real estate lending page is the right starting point, and the fastest route is simply to tell us what the property is and when you need to close.

**No visible exit, where the plan is that revenue improves**

A bridge with no takeout is not a bridge, it is short-term debt at bridge pricing, and in six months it will be the problem instead of the solution. What you probably want is a working capital facility or an asset-based line with an amortization you can actually carry.

**Investors who "seem interested" as the repayment source**

Soft equity interest is not an exit and no credible lender will treat it as one. Come back when there is a signed term sheet, and in the meantime look at what your operating assets alone will support.

**Needing under $250K**

The diligence cost does not amortize at that size and the pricing gets punishing. A working capital loan or a single-invoice advance is usually the better structure.

### MOVE — worked example → new `workedExample` field

A specialty contractor doing about $18MM in revenue wins a $4.2MM municipal contract. Mobilization (crews, bonding, materials) runs roughly $600K, and the first progress payment is 75 days out under the contract terms. The company has $2.1MM in receivables from other work and a bank line that is fully drawn.

The exit is the contract itself: an assignment of claims on the municipal receivable, plus an asset-based facility already in underwriting against the existing AR book, expected to close in about seven weeks. We place a $650K bridge at Prime plus 6%, interest-only, secured by the existing receivables and subordinated to nothing because the bank line is unsecured. Funding takes five business days.

The ABL closes in week eight and retires the bridge. Total interest paid on the bridge: roughly $22K over 58 days. Against a $4.2MM contract the company would otherwise have had to decline, that is not a close call. But it only worked because the exit was two named, dated, documentable events rather than a general expectation that things would improve.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

A commercial and industrial (C&I) bridge loan is short-term capital secured by a company operating assets (receivables, inventory, equipment, signed contracts) rather than by real estate. It exists to carry a business from today to one specific event: an acquisition closing, a contract mobilizing, a permanent facility finishing underwriting. As of 2026, C&I bridges typically run $250K to $5MM at roughly Prime plus 4%-8%, close in 3-7 business days, and stay outstanding 30-180 days on interest-only payments with credit for early payoff, so the real cost is the days you actually use the money. The discipline that separates a bridge from expensive working capital is the exit: a facility already in underwriting, a contract with an assignment of claims, an acquisition with a signed LOI and a funding date. If you are financing a building rather than a business, what you want is a commercial real estate bridge instead: a different structure, underwritten on the property, with a different lender set. Serve places those regularly. The two are separated here because they answer different credit questions, not because either of them belongs to someone else.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Name the exit and its date** — Everything else follows from this. An ABL in underwriting, a property under contract, an SBA approval in process, a contract with an assignment of claims, a signed acquisition LOI with a funding date. If the exit cannot be named in a sentence, there is no bridge to structure.
2. **Size to the gap, not to the appetite** — A bridge should cover the specific shortfall plus a modest cushion. Oversizing it means paying interest on money that sits idle and, worse, giving yourself room to spend the takeout before it arrives.
3. **Identify the operating collateral** — Receivables are the most common. Inventory, free-and-clear equipment, and assignable contract proceeds all work. Some structures are subordinated and will sit behind an existing factor or ABL rather than requiring first position, which matters if you already have a senior lender.
4. **Close in 3-7 business days** — Interest-only payments so debt service stays low while the bridge is live. Most products carry real early-payoff credit, so the day the takeout funds, you stop paying.
5. **Run the permanent facility in parallel** — This is the sequence that makes bridges worth doing: close the bridge in days, then let the cheaper six-to-eight-week facility underwrite while the business keeps operating. Waiting for the cheap money with no bridge is how companies lose the contract that justified the financing.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: What is the difference between a C&I bridge loan and a commercial real estate bridge loan?**

The collateral and the underwriting question. A C&I bridge is secured by a company operating assets (receivables, inventory, equipment, contract proceeds) and underwritten on the business and its exit event. A CRE bridge is secured by real property and underwritten on the asset value, loan-to-value, and the property exit. Different lenders, different pricing, different documents. Most "bridge loan" search results are about the second one, which is why this page exists.

**Q: How fast can a business bridge loan close?**

Three to seven business days from a clean file as of 2026. Clean means six months of bank statements, a current AR aging, and documentation of the exit event ready to hand over on day one. The thing that usually stretches a five-day close to fifteen is not the lender, it is waiting on a document from the borrower.

**Q: What actually counts as an exit?**

Something with a date and a document. An asset-based line or SBA loan already in underwriting. A signed acquisition agreement with a funding date. A contract that can be assigned, with the assignment in process. A property under contract with a closing date. What does not count: investors who seem interested, expected revenue improvement, or an asset you believe will appreciate. We will not structure a bridge against those, because in ninety days the bridge becomes the problem.

**Q: Is a bridge loan expensive?**

The annualized rate is high and the total dollars are usually modest, because the money is outstanding for 30-180 days rather than years. Prime plus 6% on $650K for 60 days is roughly $12K-$14K of interest. Evaluate it as dollars against the value of the transaction it protects, over the actual days outstanding, and not as an annualized rate you would never actually pay.

**Q: Can a bridge sit behind my existing factor or bank line?**

Often, yes. Subordinated bridge structures exist specifically for companies that already have a senior lender in first position. Whether it works depends on your existing intercreditor terms, which we read before proposing anything. If your senior lender has to consent, that conversation happens early rather than at closing.

**Q: Do you do real estate bridge loans at all?**

Yes, and a good deal of it. Real estate bridges are fast to close and we do them constantly. They are a separate product with a separate lender set, which is why they have their own page rather than living on this one. Underwriting a building and underwriting an operating company are genuinely different disciplines, and treating them as one is how borrowers end up with the wrong structure. Tell us which one you have and we will point you at the right desk.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

Search "bridge loan" and the entire first page is about property. That is not an accident. Commercial real estate bridge lending is a larger, better-funded advertising market, so the language got taken. An operating company with a timing problem ends up reading about loan-to-value ratios and appraisals that have nothing to do with its situation, and eventually gives up and calls whoever answers the phone fastest.

What an operating company actually has is a gap between two dates. The acquisition funds on the 15th and the seller wants a deposit on the 1st. The contract was awarded but mobilization has to be paid before the first invoice goes out. The asset-based line is in underwriting and will close in seven weeks, and there are seven weeks of payroll between here and there. In each case the money has a specific source and a specific date. That is the definition of a bridge, and it is a different credit question entirely from lending against a building.

The annualized rate on a bridge always looks alarming when you write it down. Prime plus 6% on 90 days is not the same economic event as Prime plus 6% for five years, and treating it as one leads companies to turn down a structure that would have cost them $40K to protect a transaction worth several hundred thousand. The honest way to evaluate a bridge is total dollars of interest against the value of the thing it protects, over the actual number of days outstanding.

The failure mode is the exit. A bridge is safe when the takeout is real and visible, and dangerous when it is not, because the structure assumes repayment from an event rather than from operations. This is where a good advisor earns their keep: not by finding the money, which is usually the easy part, but by refusing to structure a bridge when the exit will not hold up.

---

## `mca-consolidation` → `/solutions/debt-refinance`

> **Competitor-compensation line already cut in PR #60. Does not travel.**

**Source H1:** MCA Consolidation: Replacing Daily Payments With One Monthly Payment

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $10MM |
| First-step structure | Term loan, 18-36 months, monthly payments |
| First-step pricing (2026) | Roughly 18%-22% APR |
| Payment frequency | Monthly, with no daily or weekly ACH sweeps |
| Time to close | 10-20 business days on a clean file |
| Positions taken out | Typically 2-4 in a single tranche |
| Typical debt service reduction | 30%-50% of current monthly outflow |
| Second-step target (12+ months later) | ABL, non-bank SBA, or bank line in the low teens or better |
| What underwriting requires | 13-week cash flow forecast, 6 months bank statements, current AR aging |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Under about $2MM in revenue with no commercial invoices**

Conventional refinance math rarely closes at that size. A home equity line or a single-invoice advance is usually the only honest answer, and we will say so on the first call rather than run you through a diligence process that ends in a no.

**Six or more stacked positions with no collateral left**

A refinance does not reach that far. What is needed is a restructuring conversation: negotiating directly with the funders, or a formal workout, not more capital. We can point you toward counsel that does this work.

**Consumer-facing or DTC businesses with no B2B receivables**

Without commercial invoices there is no receivable to secure a takeout against, so a conventional consolidation is harder. That does not mean there is nothing here. Inventory, equipment and card-processing history all get financed, and our e-commerce and DTC guide covers what actually works. Worth a conversation rather than an assumption.

**Looking for one more advance to cover this week**

That is stacking, and it is exactly how a two-position problem becomes a six-position one. If this week is the emergency, say so and we will tell you honestly whether anything real can close in time.

### MOVE — worked example → new `workedExample` field

A metal fabricator doing roughly $9MM in revenue loses a customer that represented about a fifth of the book. Payroll does not shrink on the same timeline as revenue, so over five months the company takes three advances totaling $780K. By the time we see it, the combined draw is about $4,100 per business day. Call it $86K a month against roughly $95K of gross monthly margin. The business is profitable on paper and cannot fund a purchase order.

The asset is the receivable book: about $1.6MM outstanding, spread across eleven industrial customers on net-45 to net-60, no single account over 18% of the total. That concentration profile is what makes the file workable. We structure a $850K term loan at 20% APR over 30 months, secured by the receivables, which pays all three positions off at their current balances and closes them. New monthly payment: about $38K. Monthly debt service falls by roughly 55%.

Eleven months of clean payment history later, the same receivable book supports a $1.2MM asset-based revolving line at Prime plus 3.5%, which retires the term loan and leaves the company with a facility that grows as sales grow instead of a payment that shrinks as it amortizes. The first loan was never the destination. It was the thing that made the second one possible.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

MCA consolidation replaces two or more merchant cash advances with a single facility that pays them off at their current balances and moves the company from daily or weekly ACH draws to one monthly payment. For a business doing $5MM to $50MM in revenue, the realistic first step as of 2026 is an 18-36 month term loan priced around 18%-22% APR, closing in 10-20 business days, which typically cuts monthly debt service by 30%-50%. That is not a rate anyone brags about. It is the step that stops the daily extraction and buys the twelve months of clean payment history that qualifies the company for asset-based pricing in the low teens or better. Consolidation is a ladder, not a single leap, and any lender promising to land you at bank pricing in one move is selling you a fourth position.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Get the real payoff numbers** — Not the original funded amounts. The current balances, the daily or weekly draw on each, and the remaining term. Most owners we talk to have never seen these side by side. This alone sometimes changes the plan.
2. **Find the asset** — Commercial receivables are the most common answer, then free-and-clear equipment, then inventory, then equity in owner-occupied property. The asset is what moves this from "another advance" to "a loan against something."
3. **Build the file lenders actually need** — Six months of bank statements, a current AR aging, existing advance contracts, and a 13-week cash flow forecast showing the new payment clears. The forecast is not paperwork theater. It is the document the credit committee argues over.
4. **Take out two to four positions in one tranche** — The lender wires the funders directly and gets written payoff letters, so the positions close rather than sitting dormant with a UCC still filed. If the stack is deeper than four, expect the first tranche to clear the most expensive positions and the rest to be addressed in sequence.
5. **Twelve months later, refinance again, cheaper** — This is the part that matters and the part nobody mentions. A year of clean monthly payments on the consolidation loan is what qualifies the company for an asset-based line, a non-bank SBA loan, or a bank facility in the low teens or better. The first step exists to earn the second.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Is MCA consolidation just another merchant cash advance?**

It should not be, and often is. A genuine consolidation is a term loan or an asset-secured facility that pays your advances off at their current balances and switches you to monthly payments. If the document in front of you quotes a factor rate, specifies a daily or weekly ACH, and does not name the specific positions it retires, you are being sold a fourth position with a friendlier label. Ask for written payoff letters as a condition of funding.

**Q: How much does MCA consolidation cost in 2026?**

The realistic first step is an 18-36 month term loan around 18%-22% APR. In isolation that is expensive money. Against a stacked position with a blended true cost above 70%, it typically cuts monthly debt service by 30%-50% and stops the daily extraction. The cheap money comes at the second step, twelve months later, once there is clean payment history to underwrite.

**Q: How many advances can be consolidated at once?**

Two to four positions in a single tranche is normal. Beyond four the arithmetic usually stops working, because the payoff total exceeds what the collateral supports. At six or more positions the honest answer is generally not a refinance at all but a negotiation with the funders, and we will tell you that rather than take you through three weeks of diligence to reach the same conclusion.

**Q: Will consolidating hurt my credit or trigger a default?**

Paying an advance off at its stated balance is contractually a payoff, not a default, and most agreements permit it. The risks worth checking before you sign anything are prepayment terms that do not forgive unearned fees, confessions of judgment on older contracts, and cross-default language between positions. We read the existing contracts before structuring the takeout, because one bad clause changes the whole sequence.

**Q: What if my business does not have receivables to secure against?**

Then the options narrow to free-and-clear equipment, inventory a lender will lend against, or equity in property. If none of those exist, a conventional refinance generally will not close and the realistic paths are a home equity line on the owner side or direct negotiation with the funders. We would rather say that in the first conversation than three weeks in.

**Q: Do you charge anything before funding?**

No. Serve earns a success fee upon the closing of a facility, agreed in writing before you sign anything, and nothing at all if it does not close. No retainers, no application fees, no diligence deposits. If someone in this market asks you for money upfront to arrange a consolidation, that is worth walking away from.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

The daily draw is the part nobody explains properly at signing. A merchant cash advance is priced as a factor rate, 1.35 on $500K say, which sounds like 35% until you notice the repayment window is nine months. Convert it and the true annualized cost lands somewhere north of 70%. Stack a second and a third position on top and the combined number moves into the triple digits, which is why a profitable company can be shipping product, winning work, and still unable to make payroll.

What actually breaks is not the rate. It is the timing. Advances pull Monday through Friday regardless of whether your customer paid you, so a business on net-60 terms is funding somebody else float out of daily cash. Every dollar the advance takes on a Tuesday is a dollar not available for materials on Wednesday, and the usual response, taking another advance to cover the gap, is what turns a survivable problem into a structural one.

The phone calls start about the same time. Brokers buy lists of UCC filings, so the moment a funder files against your receivables you become a lead, and the pitch is always some version of consolidation. Read the term sheet closely and most of those offers are a larger advance at a higher factor rate: a fourth position wearing the word "consolidation," with the cost built into the factor rate rather than itemized anywhere you can see it. It closes in 48 hours because nobody underwrote anything.

A real consolidation looks different and takes longer. A lender taking out positions other lenders considered risky needs to see why repayment is realistic, which means a 13-week cash flow forecast, an explanation of what caused the stack, and ideally an asset to secure against. Ten to twenty business days, not two. The reward for the extra two weeks is that the daily draws actually stop.

---

## `asset-based-lending-manufacturing` → `/industries/manufacturing`

> **WORKED-EXAMPLE CONFLICT. Destination has one. Recommendation: take the ABL version, it was reworked in PR #60.**

**Source H1:** Asset-Based Lending for Manufacturers

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $25MM |
| Pricing (2026) | Roughly Prime + 1%-5% |
| Eligible receivables | 80%-85% advance; typically under 90 days, no intercompany, concentration reserved |
| Finished goods | 60%-75% of net orderly liquidation value |
| Raw materials | Generally ineligible. Lenders want finished goods |
| Work in process | Almost always ineligible, zero borrowing base credit |
| Machinery and equipment | 70%-80% of appraised liquidation value, often as a term tranche |
| Time to close | 10-20 business days including field exam and appraisal |
| Ongoing reporting | Monthly borrowing base certificate, AR aging, inventory report |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Job shops where nearly all inventory sits in work in process**

The borrowing base will disappoint. A receivables-only facility or invoice factoring against your finished jobs is usually the better structure, sometimes paired with a sale-leaseback on owned equipment to pull cash out of the machines.

**Single-customer manufacturers**

One buyer at 60% or more of the book is a concentration problem that caps advance rates hard. Factoring with a credit-insured structure sometimes works where ABL will not, because the factor can insure the specific account debtor.

**Companies that need money this week**

ABL takes 10-20 business days and involves a field exam and an appraisal. Close a bridge or a working capital loan now and let the ABL underwrite in parallel. That sequence is standard, not a compromise.

**Manufacturers unwilling to report monthly**

ABL runs on borrowing base certificates, AR agings, and inventory reporting. If that reporting cadence is not realistic for your team, a term loan with a fixed payment is a better fit even at a higher rate.

### MOVE — worked example → new `workedExample` field

A precision components manufacturer doing about $14MM in revenue has a $1MM bank line it outgrew two years ago. The balance sheet shows $2.6MM in receivables, $3.9MM in inventory, and machinery the company owns outright.

Modeling the borrowing base first changes expectations in a useful way. Of the $2.6MM in AR, about $2.3MM is eligible after removing invoices past 90 days and reserving for a customer at 24% of the book, giving roughly $1.9MM at an 83% advance. The inventory splits into $1.1MM finished goods, $1.4MM raw material, and $1.4MM work in process. Only the finished goods count, contributing about $715K at 65% of NOLV. Raw materials and WIP contribute nothing. An appraisal supports a $900K term tranche against the machinery at 75% of orderly liquidation value.

Total facility: roughly $3.5MM against a $1MM bank line, at Prime plus 3.25%, closed in 17 business days. The company also learns something operationally: $2.8MM of its balance sheet sits in raw material and work in process earning no borrowing base credit, which becomes an argument for shortening cycle times and buying closer to demand that has nothing to do with financing.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

Asset-based lending gives a manufacturer a revolving line sized to its collateral rather than to its earnings, which is why the line grows as the business grows instead of capping at whatever a bank underwrote last year. As of 2026, a manufacturing ABL runs $250K to $25MM at roughly Prime plus 1%-5%, closes in 10-20 business days, and advances against three collateral classes at different rates: 80%-85% on eligible receivables, 60%-75% of net orderly liquidation value on finished goods, and 70%-80% of liquidation value on machinery and equipment. What surprises most manufacturers is how much inventory does not count. Work in process is almost universally ineligible, because a half-machined part has no liquidation market, and most lenders will not advance against raw materials either. Those two exclusions are why a company with $4MM of inventory on the balance sheet may only see $1.5MM of borrowing base, and why the fix is usually operational rather than financial.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Model the borrowing base before anything else** — AR aging plus an inventory breakdown by class (raw, WIP, finished) plus an equipment list. Apply the standard advance rates and eligibility rules and you have a realistic availability number within a day, before anyone spends money on diligence.
2. **Field exam and appraisals** — A third-party examiner tests your AR and inventory records; equipment gets appraised at orderly and forced liquidation value. This is the step that takes real time. Costs are usually borne by the borrower and disclosed upfront.
3. **Structure the facility** — A revolver against AR and inventory, often with a separate term component against machinery. Pricing as of 2026 runs Prime plus 1%-5% depending on collateral quality, reporting discipline, and whether the lender is bank-owned or independent.
4. **Monthly reporting keeps the line alive** — A borrowing base certificate, an AR aging, and inventory reporting each month. This is the real ongoing cost of ABL and the reason it is cheaper than factoring. The lender substitutes reporting for taking over collections.
5. **The line grows with the collateral** — A good year raises availability automatically. Most facilities also allow a mid-stream increase once the lender knows your account debtors, which happens in days rather than in a new underwriting cycle.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Why does my inventory not count for as much as I expected?**

Because ABL advance rates are set against liquidation value rather than book value, and most of a manufacturer inventory does not qualify at all. Work in process is excluded entirely, since a partially machined part has no resale market, and raw materials are generally ineligible too. What lenders want is finished goods, which advance at 60%-75% of net orderly liquidation value. It is common for $4MM of book inventory to produce $1.5MM of availability, which is why we model the borrowing base before anyone pays for a field exam.

**Q: What does a manufacturing ABL cost in 2026?**

Roughly Prime plus 1%-5% on drawn funds, plus an unused line fee, plus field exam and appraisal costs at setup. Bank-owned lenders price at the low end and are more rigid on eligibility; independent lenders are more flexible and slightly pricier. For most manufacturers who do not qualify for a bank line, it remains the cheapest revolving structure available.

**Q: Will an ABL work if one customer is most of my revenue?**

It gets harder. Concentration above roughly 20%-25% draws a reserve, and a single customer at 60% or more of the book usually caps the facility below what the company needs. Factoring with credit insurance on that specific account debtor sometimes works where ABL will not, because the risk can be insured rather than reserved against.

**Q: How is this different from invoice factoring?**

Factoring is the sale of specific invoices, with the factor collecting from your customers through a lockbox. ABL is a loan against a pool of collateral where you keep collecting yourself and report monthly. ABL is cheaper and less intrusive; factoring is faster to put in place and more forgiving of weak financials. We compare them in detail on our factoring vs. ABL page.

**Q: Can I get an ABL if I am not profitable?**

Often, yes. That is much of the point. ABL underwrites collateral rather than earnings, so a loss year that would fail a bank covenant test does not automatically disqualify you. What the lender needs is collateral that holds up under examination and records clean enough to report against monthly.

**Q: How long does it take?**

10-20 business days, driven by the field exam and equipment appraisal. If capital is needed sooner, the standard sequence is a working capital loan or bridge closing in days while the ABL underwrites in parallel, with the ABL retiring the bridge on close.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

Manufacturers get told no by banks for a reason that has nothing to do with the quality of the business. A bank sizes a line to trailing EBITDA and debt service coverage, so a company that reinvests everything into capacity, or that took a bad quarter on a tariff shift, or that grew 40% and consumed all its cash doing it, looks weak on exactly the metrics the bank cares about. The receivables are excellent. The equipment is paid for. The line is capped at $750K.

Asset-based lending asks a different question: what do you own, and what is it worth if we have to sell it. That reframing is why an ABL line moves with the business. Ship more, invoice more, and the borrowing base rises the following month without a new credit approval. For a manufacturer in a growth year, that difference matters more than the rate.

The part worth understanding before you start is eligibility, because the gap between what is on the balance sheet and what is in the borrowing base is where most disappointment lives. Work in process is ineligible almost everywhere. A partially machined casting has no liquidation market, so it gets zero. Inventory held on consignment is usually out. Tooling owned by your customer is not your collateral. Receivables past 90 days come out, as do intercompany invoices, and concentration above a threshold gets reserved against.

None of that is a reason to avoid ABL. It is a reason to model the borrowing base before you commit to a field exam, which is what we do first, because knowing that $4MM of inventory produces $1.5MM of availability changes the conversation from disappointment to planning.

---

## `asset-based-lending-healthcare` → `/industries/healthcare`

> **WORKED-EXAMPLE CONFLICT. Recommendation: keep the existing one, this repeats it.**

**Source H1:** Asset-Based Lending for Healthcare Providers

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $25MM |
| Advance rate | 65%-85% of net collectible value, not of billed charges |
| Pricing (2026) | Prime + 2%-6%, depending on payor mix and collection history |
| Time to close | 15-30 business days |
| Payors financed | Commercial insurance, managed care, Medicare, Medicaid, workers compensation |
| Government payor structure | Two-account lockbox with a deposit account control agreement, because direct assignment is barred |
| Key underwriting inputs | Aging by payor, gross-to-net collection rate, denial rate, days in AR |
| Common exclusions | Self-pay balances, claims past 120-180 days, amounts under audit or recoupment |
| Lender type | Specialized medical funders, not generalist ABL lenders |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Practices under an active payor audit or recoupment demand**

A pending recoupment is a claim ahead of the lender on the same receivables, so lenders will wait it out. Resolve or quantify the exposure first: a documented settlement is financeable, an open audit of unknown scope generally is not. Tell us early rather than letting diligence find it, and we will tell you what the file needs to look like when it is time.

**Cash-pay or elective practices with no third-party AR**

There is no payor receivable to advance against. A working capital loan or equipment financing usually fits better, and both move faster.

**Providers who cannot produce collection history by payor**

The advance rate is derived from your historical net collection rate. Without that data a funder either declines or prices for the worst case. Twelve months of clean payor-level reporting is worth more to your cost of capital than any negotiation.

**Anyone expecting to advance against gross charges**

Nobody lends against billed charges. Model the borrowing base off expected net collections and the numbers stop being a surprise. We will run that calculation before you commit to diligence.

### MOVE — worked example → new `workedExample` field

A multi-site specialty practice with about $16MM in net patient service revenue is carrying $4.8MM in gross receivables and financing a biweekly clinical payroll of roughly $420K out of a fully drawn bank line. Payor mix runs about 58% commercial, 27% Medicare, 11% Medicaid, and 4% self-pay.

The gross number is not the working number. Historical gross-to-net conversion on this book is about 41%, so $4.8MM in billed charges represents roughly $1.97MM of expected net collections. Removing self-pay balances and claims past 150 days leaves about $1.72MM eligible. At a 71% advance rate, supported by a documented denial rate under 6% and clean payor-level reporting, the facility sizes to roughly $1.22MM.

Structure: commercial payors directed to a lockbox, Medicare and Medicaid flowing into a practice-name account under a deposit account control agreement and swept daily. Priced at Prime plus 4.25%, closed in 24 business days. The practice stops timing payroll against deposit timing, and the reporting discipline the facility requires surfaces a denial pattern with one managed care plan that had been quietly costing more than the financing does.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

Healthcare asset-based lending advances against third-party payor receivables (insurance, Medicare, Medicaid, managed care) at 65%-85% of net collectible value rather than against billed charges. The gap is not a penalty; it reflects that a healthcare claim is billed at gross charges and collects at a contracted rate, so a $100 charge might net $38, and the lender advances against the $38. As of 2026, facilities run $250K to $25MM, price from Prime plus 2%-6%, and close in 15-30 business days, longer than commercial ABL because payor mix, denial rates, and aging by payor all have to be analyzed. The structural complication is that federal anti-assignment rules bar Medicare and Medicaid from paying a lender directly, so these facilities use a two-account lockbox structure where government payments land in the provider own account and are swept under a deposit account control agreement. Providers should expect a specialized medical funder rather than a generalist ABL lender.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Analyze payor mix and net collection rate** — Aging by payor, historical gross-to-net conversion, denial rate, and days in AR. This is the substance of the underwrite. Commercial-heavy books get better advance rates than Medicaid-heavy books, and documented history beats estimates every time.
2. **Set the advance rate off net collectible value** — 65%-85% of expected net collections, not of billed charges. Modeling this first is what keeps the process from ending in disappointment three weeks in.
3. **Build the lockbox structure** — Commercial payors can be directed to a lockbox. Medicare and Medicaid cannot be assigned, so those payments flow into a provider-name account governed by a deposit account control agreement and are swept from there. Your bank will need to participate.
4. **Close in 15-30 business days** — Longer than a commercial ABL because of the payor analysis and the account structure. Facilities from $250K to $25MM, priced from Prime plus 2%-6% depending on payor mix and collection history.
5. **Report monthly and reprice as the book improves** — Aging by payor and a borrowing base certificate each month. A year of improving collection rates is a real argument for a better advance rate, and specialized funders do respond to it.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Why is the advance rate quoted against net collectible value rather than what I billed?**

Because a healthcare receivable is billed at gross charges and collects at a contracted rate. If $100 of billed charges historically converts to $40 of cash, the lender is advancing 70% of the $40, not of the $100. The percentage looks lower and the underlying math is consistent with commercial lending. Model your borrowing base off expected net collections and the number stops being a surprise.

**Q: Can Medicare and Medicaid receivables be financed?**

Yes, but not by assigning the payment to a lender. Federal anti-assignment rules bar that. The standard structure is a two-account arrangement where government payments land in an account in the provider name, subject to a deposit account control agreement, and are swept from there. It is well established, and it is one reason these facilities go to specialized medical funders.

**Q: What does healthcare asset-based lending cost in 2026?**

Prime plus 2%-6% on drawn funds, with pricing driven mainly by payor mix and documented collection history. A commercial-heavy book with a low denial rate prices near the bottom of that range; a Medicaid-heavy book with inconsistent reporting prices near the top or gets declined. Setup costs include the payor analysis and, sometimes, a third-party billing review.

**Q: How long does it take to close?**

15-30 business days, longer than a commercial ABL. The additional time goes to the payor-level analysis and to setting up the two-account lockbox structure with your bank. If cash is needed sooner, a working capital loan closing in days can bridge while the facility underwrites.

**Q: Will an open payor audit stop the deal?**

Usually, yes. A recoupment demand is a claim ahead of the lender against the same receivables, so funders wait for it to resolve or be quantified. A documented settlement with a payment plan is generally financeable; an open audit of unknown scope generally is not. Tell your advisor about it at the start rather than letting diligence find it.

**Q: Is this the same as medical factoring?**

Closely related. Medical factoring is the sale of specific claims with the funder managing collections; a medical ABL is a loan against the receivable pool with the provider continuing to bill and collect. Factoring is faster to establish and more forgiving of weak financials; ABL costs less and is less intrusive. Payor mix often decides which lenders will engage at all.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

Healthcare receivables confuse every lender who has not specialized in them, and they confuse plenty of providers too. The core of it is that a healthcare invoice does not mean what an invoice means anywhere else. Bill $100 to a commercial plan and you might collect $42. Bill the same service to Medicare and you might collect $31. Bill it to a plan you are out of network with and you might collect $12 after an appeal, or nothing. The balance sheet says receivables. What exists is a probability distribution.

That is why the advance is set against net collectible value rather than billed charges, and why the analysis takes longer. A funder is calculating more than whether the payor will pay. It works out what proportion of billed charges historically converts to cash, at what speed, by payor, and reserves for denials, adjustments and recoupment. A practice with clean payor-level collection data gets a better advance rate than one without, purely because the uncertainty is smaller.

The second complication is legal rather than financial. Federal law restricts assignment of Medicare and Medicaid claims, which means government payments cannot be directed to a lender lockbox the way a commercial receivable can. The workaround is a two-account structure: government payments land in an account in the provider name, controlled through a deposit account control agreement, and are swept from there. The structure is well established, and it is one of several reasons this financing goes to specialized medical funders rather than generalist ABL lenders.

What providers gain for the extra complexity is a facility that solves an actual structural problem. Payroll for clinical staff runs biweekly. Payors pay in 30 to 90 days, sometimes longer after a denial and appeal cycle. Growth in patient volume increases the receivable balance and the payroll before it increases cash. A facility sized to receivables rather than to earnings closes that gap without asking a practice to be profitable on a trailing basis first.

---

## `asset-based-lending-staffing` → `/industries/staffing`

> **WORKED-EXAMPLE CONFLICT. Kyler to pick, they are close in quality.**

**Source H1:** Asset-Based Lending for Staffing Agencies

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $25MM |
| Advance rate on eligible AR | 80%-95% |
| ABL pricing (2026) | Prime + 1%-5% on drawn funds |
| Factoring pricing (2026) | 0.5%-1.5% per invoice, depending on terms and client credit |
| Funding speed once live | 24-48 hours from invoice upload |
| Setup time | 10-20 business days |
| Ineligible collateral | Unbilled accrued time, invoices past 90 days, disputed hours, intercompany |
| Hard gate | Payroll taxes current. An IRS lien primes the lender and stops the deal |
| Concentration | Reserves typically begin above 30%-40% for a single client |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Agencies behind on 941 payroll tax deposits**

Fix this first. It is not negotiable. A federal tax lien takes priority over the lender security interest, so no facility closes until the liability is resolved or sits under a formal installment agreement the lender can review. Get a payroll tax professional on it, then come back to us. We would rather help you structure the facility on the other side of that than pretend it is not in the way.

**Direct-hire or permanent placement only**

Contingent fee receivables are harder to finance because the fee is often refundable within a guarantee period. Some lenders will work with them at lower advance rates. If your book is a mix, expect the temp side to carry the facility.

**1099 or independent-contractor models with disputed classification**

Classification exposure is a real credit issue rather than paperwork, and lenders read it as a contingent liability. Worth resolving before a facility gets underwritten around it. Tell us where it stands anyway. If it is already being addressed, that is often a conversation lenders will have.

**One client at more than half the book**

Advance rates collapse under that kind of concentration. A credit-insured factoring structure on that specific account debtor is often the only workable answer.

### MOVE — worked example → new `workedExample` field

A light industrial staffing agency doing about $11MM in revenue is funding weekly payroll of roughly $150K out of the owner personal line of credit and a single advance taken the previous spring. Receivables stand at $1.75MM across nineteen clients, the largest at 22% of the book. Payroll taxes are current.

The first finding has nothing to do with the lender. The agency bills semi-monthly, so at any moment $250K-$300K of worked hours sit unbilled and therefore ineligible. Moving to weekly invoicing adds roughly $260K of eligible receivables before a single term is negotiated. With that change, about $1.6MM of the book is eligible after removing aged and disputed items, supporting roughly $1.4MM at an 88% advance rate.

We place a factoring facility at 88% with a 1.05% fee per invoice on 45-day terms and 24-hour funding, closed in 13 business days. The advance taken the previous spring is retired out of the first draw. Fourteen months later the same book supports an ABL at Prime plus 3%, which cuts the cost of the facility by roughly 40% and returns collections to the agency. The factoring facility was the on-ramp, not the destination.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

For a staffing agency, asset-based lending means a receivables-only facility, because receivables are effectively the entire balance sheet. There is no inventory and there is rarely meaningful equipment. As of 2026, staffing facilities run $250K to $25MM, advance 80%-95% against eligible receivables, and price from Prime plus 1%-5% for an ABL structure or 0.5%-1.5% per invoice for factoring, with setup in 10-20 business days. The problem the facility solves is structural rather than temporary: payroll runs weekly and clients pay in 45 to 60 days, so every new placement consumes cash before it produces any, and a growing agency is short of money precisely because it is growing. Two things stop these deals more than anything else: unbilled accrued time, which is not eligible collateral until it is invoiced, and unpaid payroll taxes, because an IRS lien primes the lender and no facility closes over one.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Verify the receivables are billable now** — Eligible means invoiced, against an approved timesheet, within terms. Accrued unbilled time contributes nothing until it is billed, so the first structural question is usually how often you invoice rather than how much you can borrow.
2. **Confirm payroll taxes are current** — Expect to produce 941 filings and deposit records. This is a gate, not a preference. If there is a liability, it needs to be resolved or under a documented installment agreement the lender can review before anything else happens.
3. **Choose ABL or factoring** — ABL is cheaper and you keep collecting; factoring is faster to put in place, more forgiving of thin financials, and the factor handles collections through a lockbox. Many agencies start with factoring and move to ABL after twelve to eighteen months of clean history.
4. **Set the facility to fund payroll cycles** — The practical test is whether a draw can be requested and funded inside your payroll window. Facilities that fund within 24 hours of invoice upload are what makes weekly payroll work; a facility that takes three days does not solve the problem.
5. **The line scales with headcount** — Add placements, invoice more, borrow more, without a new credit approval. This is the whole reason a staffing agency wants a collateral-based facility rather than a fixed-limit loan.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Can I finance payroll before I invoice the client?**

Generally not through the facility itself, because unbilled accrued time is not eligible collateral. The practical fix is billing frequency: an agency that invoices weekly instead of semi-monthly converts up to two weeks of payroll from ineligible to eligible, which usually creates more availability than any advance-rate negotiation would. Some payroll-funding providers will bridge the gap, at a price.

**Q: What if I am behind on payroll taxes?**

Resolve that before looking for financing. A federal tax lien takes priority over a lender security interest, so almost no facility will close over an unresolved 941 liability. Lenders will sometimes proceed where there is a documented IRS installment agreement in good standing that they can review. Get a payroll tax professional involved first. This is not a financing problem.

**Q: Factoring or ABL for a staffing agency?**

Factoring if you need speed, have thin financials, or are growing fast enough that collections management is a burden. It funds in 24-48 hours and the factor handles the lockbox. ABL if your financials support it and you want to keep collecting and pay less. A common path is factoring for the first twelve to eighteen months, then ABL once there is clean history to underwrite.

**Q: Will my clients know I am financing my receivables?**

With factoring, yes. Payments are directed to a lockbox in your name that the factor sweeps, and clients receive a notice of assignment. Large employers process these constantly and their AP teams treat it as routine. With an ABL you keep collecting and clients generally notice nothing. Either way, tell your largest accounts yourself before the paperwork reaches them.

**Q: How much can a staffing agency borrow?**

80%-95% of eligible invoiced receivables, with facilities from $250K to $25MM. Eligible excludes unbilled time, invoices past 90 days, disputed hours, and a reserve against any client concentrated above roughly 30%-40% of the book. The useful exercise is to run your current AR aging through those rules. The answer is usually within a day.

**Q: Does this work for direct-hire placements?**

Less well. Permanent placement fees are often refundable inside a guarantee period, which makes them weaker collateral, and advance rates drop accordingly. If your book mixes temp and direct-hire, expect the temporary staffing receivables to carry the facility and the placement fees to be treated as a secondary or ineligible category.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

Staffing is the clearest example in business of growth consuming cash. You place twelve people on Monday, you pay them Friday, and the client pays you in 45 days. Every dollar of new revenue costs you roughly six weeks of payroll before it produces anything, so the faster you grow the tighter it gets. The owner ends up funding a growing business out of personal reserves, which works until it does not.

What makes this financeable is that the receivable is genuinely good. A staffing invoice against a creditworthy employer for hours already worked, verified by an approved timesheet, is about as clean an asset as exists in commercial lending. That is why advance rates in staffing run higher than in most industries, where 80% to 95% is normal, and why lenders who specialize here are comfortable at sizes a general commercial lender would not touch on the same financials.

The two things that reliably kill staffing deals are both self-inflicted and both fixable. The first is unbilled accrued time: hours worked but not yet invoiced are not eligible collateral, which means an agency that bills semi-monthly is carrying up to two weeks of payroll with no borrowing base credit for it. Moving to weekly billing often creates more availability than negotiating a better advance rate would.

The second is payroll taxes. An unpaid 941 liability produces a federal tax lien that primes any lender security interest, and lenders will not close over one. This comes up more than it should, because an agency squeezed for cash often treats the payroll tax deposit as the most flexible payment available. It is the least flexible one. If this is where you are, deal with the liability first. The financing conversation only becomes possible after.

---

## `asset-based-lending-construction` → `/industries/construction`

> **WORKED-EXAMPLE CONFLICT. Kyler to pick.**

**Source H1:** Asset-Based Lending for Construction Contractors

### MOVE — terms table → new `terms` field

| Label | Value |
|---|---|
| Facility size | $250K - $25MM |
| Pricing (2026) | Prime + 2%-6% |
| Equipment advance | 70%-80% of appraised liquidation value on owned, free-and-clear machinery |
| Approved progress billings | 70%-80% advance, with documented sign-off required |
| Retainage | Excluded from the borrowing base |
| Time to close | 15-30 business days including appraisal and contract review |
| Contract-specific option | Contract financing against a single assigned contract, strongest on public work |
| Deal-stoppers | Active mechanics lien or bond claims, no WIP schedule, unresolved surety issues |
| What lenders read first | The contract: pay-when-paid, offset rights, assignment restrictions, surety agreement |
| Serve fee | A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs |

### MOVE — deflections → `notFor` (new on Solution) / `whatDoesntFit` (exists on Industry)

**Contractors whose entire receivable balance is retainage**

Retainage is either excluded from the borrowing base or advanced at a fraction, because it is contingent on completion and subject to offset. If retainage is most of what you are owed, the answer is equipment-secured financing or a bridge against a specific contract, not a receivables facility.

**Anyone financing a building rather than a business**

A construction loan against a project is real estate lending, underwritten on the property and drawn against inspections. That is a different product with different lenders. See our real estate lending page.

**Contractors with active mechanics lien or bond claims on completed work**

Those claims can prime a lender lien on the same receivables. Resolve or quantify them first. A documented resolution is financeable, an open claim usually is not. If it is in progress, say so and we will look at the equipment side in the meantime, which is often the stronger collateral anyway.

**Businesses with no WIP schedule**

A lender cannot underwrite progress billings without it, and the surety already requires one. If job-level cost tracking is not in place, that is the first project. It improves your bonding capacity at the same time.

### MOVE — worked example → new `workedExample` field

A site work contractor doing about $22MM in revenue is carrying $3.4MM in receivables, of which roughly $1.1MM is retainage across seven jobs. It owns an equipment fleet (excavators, dozers, haul trucks) with no liens on most units. The bank line is $1.5MM and fully drawn every spring during mobilization season.

The receivables-only path is disappointing on inspection. Excluding retainage and the billings still awaiting owner approval leaves about $1.4MM of approved progress billings eligible, supporting roughly $1.05MM at a 75% advance rate. That is less than the existing bank line and it took three weeks to establish.

The equipment changes the picture. An appraisal supports $4.1MM of orderly liquidation value across the free-and-clear units, producing a $3.1MM term facility at 76%. Combined with a $1.05MM revolver against approved billings from a construction-specialist lender, total availability reaches roughly $4.15MM at a blended cost near Prime plus 4%. When the company wins a $6MM municipal award the following quarter, contract financing against the assigned contract covers mobilization without touching either facility. The fleet was the answer the whole time, and it had been sitting in the yard.

### FOLD — answer capsule → compare against the destination's existing `whatIs` / `introduction`, keep the stronger

Most asset-based lenders decline construction receivables, and it is worth understanding why before you spend three weeks finding out. Progress billings carry retainage held until project completion, pay-when-paid clauses make payment contingent on money flowing down from an owner, mechanics lien and bond claims can jump ahead of a lender security interest, and percentage-of-completion accounting makes the receivable balance a judgment rather than a fact. As of 2026, the contractors who do get financed use one of three structures: an equipment-led facility advancing 70%-80% of liquidation value on owned machinery, a specialist progress-billing facility advancing 70%-80% on approved billings with retainage excluded, or contract financing against a single assigned contract. Facilities run $250K to $25MM, price from Prime plus 2%-6%, and close in 15-30 business days. The practical lever most contractors underuse is their equipment, which is often paid for and appraises well.

### FOLD — how it works → into `fullDesc` / `introduction` prose

1. **Start with the equipment schedule** — List owned machinery with year, model, hours, and whether it is free and clear. For most contractors this produces the largest single block of borrowing base, at 70%-80% of appraised liquidation value, with none of the offset risk that attaches to progress billings.
2. **Separate approved billings from submitted ones** — Only approved billings, with documented owner or general contractor sign-off, are eligible collateral. Submitted-but-unapproved billings are contingent, and lenders treat them accordingly. Tightening the approval cycle creates availability directly.
3. **Carve out retainage explicitly** — Expect retainage to be excluded from the borrowing base. Knowing this at the start prevents the common failure, where a contractor counts $900K of retainage toward availability and finds out at closing that it contributed almost nothing.
4. **Read the contract before quoting the facility** — Pay-when-paid clauses, offset rights, assignment restrictions, and the surety agreement all change what a lender can actually rely on. On bonded work the surety consent question comes up early, not at closing.
5. **Match the structure to the job, not the year** — Contract financing against a single assigned contract often beats a general facility for a specific large award, especially on public work where an assignment of claims is available. The two structures coexist: a facility for the ongoing book, contract financing for the outlier job.

### FOLD — FAQs → `src/data/faq-data.ts`, tag `relatedSolutions`, de-dupe against what is there

**Q: Why do lenders decline construction receivables?**

Four reasons that compound. Retainage is contingent on project completion. Pay-when-paid clauses make your customer obligation conditional on the owner paying them. Mechanics lien and bond claims from your subs and suppliers can take priority over a lender lien on the same receivables. And percentage-of-completion accounting means the receivable balance moves when the cost-to-complete estimate moves. Lenders who specialize in construction price for those risks; generalists decline.

**Q: Can I borrow against retainage?**

Effectively nothing. Expect retainage to be excluded from the borrowing base, because it is contingent on completion and exposed to offset. If retainage is a large share of what you are owed, plan the facility around equipment or a specific assigned contract instead, and treat retainage as cash that arrives at closeout rather than as availability.

**Q: What is the best financing structure for a contractor?**

For most contractors at $5MM-$50MM in revenue, an equipment-led facility is the strongest starting point. Owned machinery appraises reliably, has a deep resale market, and carries none of the offset problems construction AR does. Layer a progress-billing revolver from a construction specialist on top for the ongoing book, and use contract financing for individual large awards. Which mix fits depends on how much equipment you own outright.

**Q: Is this the same as a construction loan?**

No, and the distinction matters. A construction loan finances the building of a property and is underwritten on the real estate, drawn against inspections, and held by a real estate lender. What is described here finances the contracting business, its receivables and its equipment. If you are developing property, our real estate lending page is the right starting point.

**Q: How does bonding interact with this?**

Directly, and early. A surety has rights in contract proceeds and often in the contract itself, so on bonded work the surety position gets addressed before a lender quotes rather than at closing. Good news for contractors who bond: the WIP schedule and job-cost discipline the surety already requires is exactly what an ABL lender wants to see.

**Q: How long does it take to close?**

15-30 business days. Equipment appraisals and contract review drive the timeline. If mobilization money is needed before that, a bridge secured by existing receivables can close in 3-7 business days and be retired by the facility on close, a standard sequence rather than a workaround.

### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.

Construction runs on other people money and pays for it in cash flow. You mobilize on a job, carry labor and materials for 30 to 60 days, submit a progress billing, wait for approval, get paid on 45 to 90 day terms, and watch 5% to 10% sit in retainage until the whole project closes out, sometimes a year later. Meanwhile the next job wants mobilization money. The paperwork says the company is profitable and the bank account disagrees.

Then the contractor goes looking for a receivables facility and gets declined by lenders who fund manufacturers and staffing agencies without blinking. That is not prejudice; construction receivables genuinely carry risks other receivables do not. Retainage is contingent on completion. Pay-when-paid clauses mean your customer owes you only once the owner pays them. Mechanics lien and bond claims from your own subs and suppliers can take priority over a lender lien on the very same money. And percentage-of-completion accounting makes the receivable balance an estimate that moves when the cost-to-complete estimate moves.

The contractors who solve this usually solve it with equipment rather than receivables. A fleet of excavators, cranes, or trucks that is paid for is excellent collateral: it appraises reliably, it has a deep resale market, and none of the offset problems that plague construction AR apply to it. Equipment-led facilities and sale-leasebacks routinely produce more availability than a receivables facility would, and close with less argument.

Where receivables do work, it is with lenders who specialize in construction and understand the paperwork. Those lenders advance against approved billings, with the sign-off documented, exclude or heavily discount retainage, and read the contract for pay-when-paid and offset language before quoting. Fewer lenders will look at the file, and the ones who do quote something realistic rather than something that falls apart at closing.
