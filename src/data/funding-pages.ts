/**
 * SERVE FUNDING — PROBLEM PAGES (/funding/[slug])
 *
 * Bottom-funnel landing pages, one per expensive problem, built to be the
 * destination for paid search rather than routing every click through the
 * homepage. Three jobs, in this order:
 *
 *   1. QUALIFY. Paid clicks at this ticket size cost real money, so the page
 *      states the revenue band and the ask range in plain sight and tells the
 *      wrong reader where to go instead. A visitor who self-selects out on the
 *      page is cheaper than one who self-selects out on a call.
 *   2. BE QUOTABLE. Serve's organic impressions are coming more from AI
 *      assistants than from classic search (observed Aug 2026). `directAnswer`,
 *      `terms`, and `faqs` are written to be lifted verbatim by an assistant
 *      answering a funding question — self-contained, numeric, dated.
 *   3. CONVERT INTO THE FUNNEL. Every page routes to /discover?src=<slug>.
 *      The qualifying funnel itself is a separate workstream — these pages link
 *      to it and never reimplement it.
 *
 * These are PROBLEM pages, not product pages. /solutions/* explains what a
 * product is; these pages start from what has gone wrong and name the number.
 * Where a page overlaps a solution page, the two cross-link and the H1s differ.
 *
 * SEO gate: `title` must be <= 54 chars (the template appends " | Serve
 * Funding") and `excerpt` must be 120-160 chars. Both are checked by
 * scripts/verify-seo.ts, which runs before next build.
 *
 * Last Updated: 2026-08-27
 */

export interface FundingPage {
  /** URL slug — /funding/<id> */
  id: string
  /** On-page H1. Should read like the thing the visitor typed, not like a product name. */
  h1: string
  /** <title> minus the suffix. Max 54 chars. */
  title: string
  /** Meta description. 120-160 chars. */
  excerpt: string
  /**
   * The AI-citation payload: 3-5 sentences that answer the question completely
   * on their own, with amounts, rates and timelines. Written to survive being
   * quoted out of context.
   */
  directAnswer: string
  /** The qualifying gate, stated where a visitor cannot miss it. */
  fitsIf: string[]
  /** Honest deflection. Repels unqualified paid traffic; also the reason an assistant trusts the page. */
  notFor: Array<{ who: string; instead: string }>
  /** 3-4 paragraphs naming the problem in the reader's own words. Split on blank lines. */
  theProblem: string
  /** The mechanics, in order. */
  howItWorks: Array<{ step: string; detail: string }>
  /** Quotable terms table. Keep every value numeric and dated where it moves. */
  terms: Array<{ label: string; value: string }>
  /** Serve's positioning against whatever the visitor will otherwise be sold. */
  versus: {
    heading: string
    theirsLabel: string
    oursLabel: string
    rows: Array<{ dimension: string; theirs: string; ours: string }>
  }
  /** Generic-sized worked example with real dollars. No customer identification. */
  workedExample: string
  faqs: Array<{ question: string; answer: string }>
  /** Internal links out to the deeper explanation. */
  related: Array<{ label: string; href: string }>
  /** Numbers for the Service schema. */
  schema: { minAmount: string; maxAmount: string; rate: string; closingTime: string }
}

export const fundingPages: FundingPage[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // REVENUE-BASED FINANCING — the front door, and the deal type Serve actually
  // wants more of: a healthy company that has NOT yet taken an advance. Listed
  // first because it carries the paid budget; mca-consolidation below is the
  // honest side door for companies that arrive already stacked, and runs on
  // organic only.
  //
  // Note on terminology: two different products get called RBF. One takes a
  // percentage of revenue, so the payment spikes in a strong month (covered
  // critically in /blog/rbf-repayment-reality-payment-spikes). The other is a
  // fixed monthly payment over a known term. Serve places the second. The page
  // says so explicitly rather than letting the reader assume.
  // ──────────────────────────────────────────────────────────────────────────
  // MCA CONSOLIDATION — the honest side door, ORGANIC ONLY. Paid clicks on
  // these terms select for companies already two to four advances deep, which
  // is the hardest, lowest-margin file Serve places. The page earns its place
  // because it is a genuinely good answer to a question people ask, and
  // because it proves Serve is not the predatory option. It does not earn ad
  // budget. See docs/paid-search-plan.md.
  // ──────────────────────────────────────────────────────────────────────────
  // C&I BRIDGE — exists mainly to separate operating-company bridge intent
  // from the real-estate bridge traffic that owns those keywords. The H1 and
  // the direct answer both do the repelling.
  // ──────────────────────────────────────────────────────────────────────────
  // PURCHASE ORDER FINANCING — deliberately framed as the problem ("the order
  // is bigger than the balance sheet") rather than the product, so it does not
  // compete with /solutions/purchase-order-funding on the head term.
  // ──────────────────────────────────────────────────────────────────────────
  // INVOICE FACTORING — the product Serve places most often and the one the
  // problem pages were missing. Sits deliberately next to the PO page above,
  // because factoring is the standard exit from a PO facility, and next to the
  // ABL pages below, because the reader who lands here is usually choosing
  // between the two without knowing that is the choice they are making.
  //
  // The page is written on the axis that separates it from /funding/asset-
  // based-lending-*: factoring answers "I need cash against invoices I have
  // already issued", ABL answers "I need a line against the whole balance
  // sheet". Same borrower, different question. Keep that split if this page is
  // ever rewritten, or the two cannibalize each other in search.
  // ──────────────────────────────────────────────────────────────────────────
  // ABL x INDUSTRY — four crosses. The product page explains ABL generally and
  // the industry page explains the industry generally; these pages answer the
  // question a searcher actually types, which is both at once. The value in
  // each is the eligibility detail: what counts as collateral in THIS industry
  // and what gets excluded.
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'asset-based-lending-manufacturing',
    h1: 'Asset-Based Lending for Manufacturers',
    title: 'Asset-Based Lending for Manufacturers',
    excerpt: 'How manufacturers borrow against receivables, inventory and equipment. Advance rates by collateral class, what gets excluded, and why WIP does not count.',
    directAnswer:
      'Asset-based lending gives a manufacturer a revolving line sized to its collateral rather than to its earnings, which is why the line grows as the business grows instead of capping at whatever a bank underwrote last year. As of 2026, a manufacturing ABL runs $250K to $25MM at roughly Prime plus 1%-5%, closes in 10-20 business days, and advances against three collateral classes at different rates: 80%-85% on eligible receivables, 60%-75% of net orderly liquidation value on finished goods, and 70%-80% of liquidation value on machinery and equipment. What surprises most manufacturers is how much inventory does not count. Work in process is almost universally ineligible, because a half-machined part has no liquidation market, and most lenders will not advance against raw materials either. Those two exclusions are why a company with $4MM of inventory on the balance sheet may only see $1.5MM of borrowing base, and why the fix is usually operational rather than financial.',
    fitsIf: [
      'Sweet spot is $5MM-$50MM in annual revenue and two or more years operating. Neither is a cutoff',
      'Receivables from commercial or government buyers on terms, not consumer sales',
      'Inventory in finished goods or raw materials, and ideally owned machinery',
      'Growth or a bank line that has stopped keeping up with sales',
      'Books clean enough to support a monthly borrowing base certificate and a field exam',
    ],
    notFor: [
      {
        who: 'Job shops where nearly all inventory sits in work in process',
        instead: 'The borrowing base will disappoint. A receivables-only facility or invoice factoring against your finished jobs is usually the better structure, sometimes paired with a sale-leaseback on owned equipment to pull cash out of the machines.',
      },
      {
        who: 'Single-customer manufacturers',
        instead: 'One buyer at 60% or more of the book is a concentration problem that caps advance rates hard. Factoring with a credit-insured structure sometimes works where ABL will not, because the factor can insure the specific account debtor.',
      },
      {
        who: 'Companies that need money this week',
        instead: 'ABL takes 10-20 business days and involves a field exam and an appraisal. Close a bridge or a working capital loan now and let the ABL underwrite in parallel. That sequence is standard, not a compromise.',
      },
      {
        who: 'Manufacturers unwilling to report monthly',
        instead: 'ABL runs on borrowing base certificates, AR agings, and inventory reporting. If that reporting cadence is not realistic for your team, a term loan with a fixed payment is a better fit even at a higher rate.',
      },
    ],
    theProblem:
      'Manufacturers get told no by banks for a reason that has nothing to do with the quality of the business. A bank sizes a line to trailing EBITDA and debt service coverage, so a company that reinvests everything into capacity, or that took a bad quarter on a tariff shift, or that grew 40% and consumed all its cash doing it, looks weak on exactly the metrics the bank cares about. The receivables are excellent. The equipment is paid for. The line is capped at $750K.\n\nAsset-based lending asks a different question: what do you own, and what is it worth if we have to sell it. That reframing is why an ABL line moves with the business. Ship more, invoice more, and the borrowing base rises the following month without a new credit approval. For a manufacturer in a growth year, that difference matters more than the rate.\n\nThe part worth understanding before you start is eligibility, because the gap between what is on the balance sheet and what is in the borrowing base is where most disappointment lives. Work in process is ineligible almost everywhere. A partially machined casting has no liquidation market, so it gets zero. Inventory held on consignment is usually out. Tooling owned by your customer is not your collateral. Receivables past 90 days come out, as do intercompany invoices, and concentration above a threshold gets reserved against.\n\nNone of that is a reason to avoid ABL. It is a reason to model the borrowing base before you commit to a field exam, which is what we do first, because knowing that $4MM of inventory produces $1.5MM of availability changes the conversation from disappointment to planning.',
    howItWorks: [
      {
        step: 'Model the borrowing base before anything else',
        detail: 'AR aging plus an inventory breakdown by class (raw, WIP, finished) plus an equipment list. Apply the standard advance rates and eligibility rules and you have a realistic availability number within a day, before anyone spends money on diligence.',
      },
      {
        step: 'Field exam and appraisals',
        detail: 'A third-party examiner tests your AR and inventory records; equipment gets appraised at orderly and forced liquidation value. This is the step that takes real time. Costs are usually borne by the borrower and disclosed upfront.',
      },
      {
        step: 'Structure the facility',
        detail: 'A revolver against AR and inventory, often with a separate term component against machinery. Pricing as of 2026 runs Prime plus 1%-5% depending on collateral quality, reporting discipline, and whether the lender is bank-owned or independent.',
      },
      {
        step: 'Monthly reporting keeps the line alive',
        detail: 'A borrowing base certificate, an AR aging, and inventory reporting each month. This is the real ongoing cost of ABL and the reason it is cheaper than factoring. The lender substitutes reporting for taking over collections.',
      },
      {
        step: 'The line grows with the collateral',
        detail: 'A good year raises availability automatically. Most facilities also allow a mid-stream increase once the lender knows your account debtors, which happens in days rather than in a new underwriting cycle.',
      },
    ],
    terms: [
      { label: 'Facility size', value: '$250K - $25MM' },
      { label: 'Pricing (2026)', value: 'Roughly Prime + 1%-5%' },
      { label: 'Eligible receivables', value: '80%-85% advance; typically under 90 days, no intercompany, concentration reserved' },
      { label: 'Finished goods', value: '60%-75% of net orderly liquidation value' },
      { label: 'Raw materials', value: 'Generally ineligible. Lenders want finished goods' },
      { label: 'Work in process', value: 'Almost always ineligible, zero borrowing base credit' },
      { label: 'Machinery and equipment', value: '70%-80% of appraised liquidation value, often as a term tranche' },
      { label: 'Time to close', value: '10-20 business days including field exam and appraisal' },
      { label: 'Ongoing reporting', value: 'Monthly borrowing base certificate, AR aging, inventory report' },
      { label: 'Serve fee', value: 'A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs' },
    ],
    versus: {
      heading: 'ABL vs. the bank line it usually replaces',
      theirsLabel: 'A traditional bank line of credit',
      oursLabel: 'An asset-based revolving line',
      rows: [
        { dimension: 'How the limit is set', theirs: 'Trailing EBITDA and debt service coverage', ours: 'Eligible collateral, recalculated monthly' },
        { dimension: 'What a growth year does', theirs: 'Nothing until the next annual review', ours: 'Raises availability the following month' },
        { dimension: 'What a bad quarter does', theirs: 'Can trip a covenant and freeze the line', ours: 'Reduces availability in proportion to collateral, without a default' },
        { dimension: 'Covenants', theirs: 'Fixed charge coverage, leverage, tangible net worth', ours: 'Usually a springing covenant or none, in exchange for reporting' },
        { dimension: 'Cost', theirs: 'Cheaper when you qualify, and you may not', ours: 'Prime + 1%-5%, still the cheapest revolving option for most non-bank-eligible manufacturers' },
        { dimension: 'Time to put in place', theirs: '30-90 days', ours: '10-20 business days' },
      ],
    },
    workedExample:
      'A precision components manufacturer doing about $14MM in revenue has a $1MM bank line it outgrew two years ago. The balance sheet shows $2.6MM in receivables, $3.9MM in inventory, and machinery the company owns outright.\n\nModeling the borrowing base first changes expectations in a useful way. Of the $2.6MM in AR, about $2.3MM is eligible after removing invoices past 90 days and reserving for a customer at 24% of the book, giving roughly $1.9MM at an 83% advance. The inventory splits into $1.1MM finished goods, $1.4MM raw material, and $1.4MM work in process. Only the finished goods count, contributing about $715K at 65% of NOLV. Raw materials and WIP contribute nothing. An appraisal supports a $900K term tranche against the machinery at 75% of orderly liquidation value.\n\nTotal facility: roughly $3.5MM against a $1MM bank line, at Prime plus 3.25%, closed in 17 business days. The company also learns something operationally: $2.8MM of its balance sheet sits in raw material and work in process earning no borrowing base credit, which becomes an argument for shortening cycle times and buying closer to demand that has nothing to do with financing.',
    faqs: [
      {
        question: 'Why does my inventory not count for as much as I expected?',
        answer: 'Because ABL advance rates are set against liquidation value rather than book value, and most of a manufacturer inventory does not qualify at all. Work in process is excluded entirely, since a partially machined part has no resale market, and raw materials are generally ineligible too. What lenders want is finished goods, which advance at 60%-75% of net orderly liquidation value. It is common for $4MM of book inventory to produce $1.5MM of availability, which is why we model the borrowing base before anyone pays for a field exam.',
      },
      {
        question: 'What does a manufacturing ABL cost in 2026?',
        answer: 'Roughly Prime plus 1%-5% on drawn funds, plus an unused line fee, plus field exam and appraisal costs at setup. Bank-owned lenders price at the low end and are more rigid on eligibility; independent lenders are more flexible and slightly pricier. For most manufacturers who do not qualify for a bank line, it remains the cheapest revolving structure available.',
      },
      {
        question: 'Will an ABL work if one customer is most of my revenue?',
        answer: 'It gets harder. Concentration above roughly 20%-25% draws a reserve, and a single customer at 60% or more of the book usually caps the facility below what the company needs. Factoring with credit insurance on that specific account debtor sometimes works where ABL will not, because the risk can be insured rather than reserved against.',
      },
      {
        question: 'How is this different from invoice factoring?',
        answer: 'Factoring is the sale of specific invoices, with the factor collecting from your customers through a lockbox. ABL is a loan against a pool of collateral where you keep collecting yourself and report monthly. ABL is cheaper and less intrusive; factoring is faster to put in place and more forgiving of weak financials. We compare them in detail on our factoring vs. ABL page.',
      },
      {
        question: 'Can I get an ABL if I am not profitable?',
        answer: 'Often, yes. That is much of the point. ABL underwrites collateral rather than earnings, so a loss year that would fail a bank covenant test does not automatically disqualify you. What the lender needs is collateral that holds up under examination and records clean enough to report against monthly.',
      },
      {
        question: 'How long does it take?',
        answer: '10-20 business days, driven by the field exam and equipment appraisal. If capital is needed sooner, the standard sequence is a working capital loan or bridge closing in days while the ABL underwrites in parallel, with the ABL retiring the bridge on close.',
      },
    ],
    related: [
      { label: 'Asset-Based Lending, the full product explanation', href: '/solutions/asset-based-lending' },
      { label: 'Manufacturing financing guide', href: '/industries/manufacturing' },
      { label: 'Invoice factoring vs. asset-based lending', href: '/compare/invoice-factoring-vs-asset-based-lending' },
      { label: 'Inventory financing', href: '/solutions/inventory-financing' },
    ],
    schema: {
      minAmount: '$250,000',
      maxAmount: '$25,000,000',
      rate: 'Prime + 1%-5%',
      closingTime: '10-20 business days',
    },
  },

  {
    id: 'asset-based-lending-staffing',
    h1: 'Asset-Based Lending for Staffing Agencies',
    title: 'Asset-Based Lending for Staffing Agencies',
    excerpt: 'Weekly payroll against net-45 clients. How staffing agencies borrow against receivables, what gets excluded, and why payroll tax liens kill deals.',
    directAnswer:
      'For a staffing agency, asset-based lending means a receivables-only facility, because receivables are effectively the entire balance sheet. There is no inventory and there is rarely meaningful equipment. As of 2026, staffing facilities run $250K to $25MM, advance 80%-95% against eligible receivables, and price from Prime plus 1%-5% for an ABL structure or 0.5%-1.5% per invoice for factoring, with setup in 10-20 business days. The problem the facility solves is structural rather than temporary: payroll runs weekly and clients pay in 45 to 60 days, so every new placement consumes cash before it produces any, and a growing agency is short of money precisely because it is growing. Two things stop these deals more than anything else: unbilled accrued time, which is not eligible collateral until it is invoiced, and unpaid payroll taxes, because an IRS lien primes the lender and no facility closes over one.',
    fitsIf: [
      'Sweet spot is $5MM-$50MM in annual revenue and two or more years operating. Neither is a cutoff',
      'Commercial or government clients on terms: light industrial, IT, healthcare, professional',
      'Payroll taxes current, with proof',
      'Timekeeping and billing tight enough to invoice weekly',
      'Client concentration under roughly 30%-40%, or a plan for the one account that is over',
    ],
    notFor: [
      {
        who: 'Agencies behind on 941 payroll tax deposits',
        instead: 'Fix this first. It is not negotiable. A federal tax lien takes priority over the lender security interest, so no facility closes until the liability is resolved or sits under a formal installment agreement the lender can review. Get a payroll tax professional on it, then come back to us. We would rather help you structure the facility on the other side of that than pretend it is not in the way.',
      },
      {
        who: 'Direct-hire or permanent placement only',
        instead: 'Contingent fee receivables are harder to finance because the fee is often refundable within a guarantee period. Some lenders will work with them at lower advance rates. If your book is a mix, expect the temp side to carry the facility.',
      },
      {
        who: '1099 or independent-contractor models with disputed classification',
        instead: 'Classification exposure is a real credit issue rather than paperwork, and lenders read it as a contingent liability. Worth resolving before a facility gets underwritten around it. Tell us where it stands anyway. If it is already being addressed, that is often a conversation lenders will have.',
      },
      {
        who: 'One client at more than half the book',
        instead: 'Advance rates collapse under that kind of concentration. A credit-insured factoring structure on that specific account debtor is often the only workable answer.',
      },
    ],
    theProblem:
      'Staffing is the clearest example in business of growth consuming cash. You place twelve people on Monday, you pay them Friday, and the client pays you in 45 days. Every dollar of new revenue costs you roughly six weeks of payroll before it produces anything, so the faster you grow the tighter it gets. The owner ends up funding a growing business out of personal reserves, which works until it does not.\n\nWhat makes this financeable is that the receivable is genuinely good. A staffing invoice against a creditworthy employer for hours already worked, verified by an approved timesheet, is about as clean an asset as exists in commercial lending. That is why advance rates in staffing run higher than in most industries, where 80% to 95% is normal, and why lenders who specialize here are comfortable at sizes a general commercial lender would not touch on the same financials.\n\nThe two things that reliably kill staffing deals are both self-inflicted and both fixable. The first is unbilled accrued time: hours worked but not yet invoiced are not eligible collateral, which means an agency that bills semi-monthly is carrying up to two weeks of payroll with no borrowing base credit for it. Moving to weekly billing often creates more availability than negotiating a better advance rate would.\n\nThe second is payroll taxes. An unpaid 941 liability produces a federal tax lien that primes any lender security interest, and lenders will not close over one. This comes up more than it should, because an agency squeezed for cash often treats the payroll tax deposit as the most flexible payment available. It is the least flexible one. If this is where you are, deal with the liability first. The financing conversation only becomes possible after.',
    howItWorks: [
      {
        step: 'Verify the receivables are billable now',
        detail: 'Eligible means invoiced, against an approved timesheet, within terms. Accrued unbilled time contributes nothing until it is billed, so the first structural question is usually how often you invoice rather than how much you can borrow.',
      },
      {
        step: 'Confirm payroll taxes are current',
        detail: 'Expect to produce 941 filings and deposit records. This is a gate, not a preference. If there is a liability, it needs to be resolved or under a documented installment agreement the lender can review before anything else happens.',
      },
      {
        step: 'Choose ABL or factoring',
        detail: 'ABL is cheaper and you keep collecting; factoring is faster to put in place, more forgiving of thin financials, and the factor handles collections through a lockbox. Many agencies start with factoring and move to ABL after twelve to eighteen months of clean history.',
      },
      {
        step: 'Set the facility to fund payroll cycles',
        detail: 'The practical test is whether a draw can be requested and funded inside your payroll window. Facilities that fund within 24 hours of invoice upload are what makes weekly payroll work; a facility that takes three days does not solve the problem.',
      },
      {
        step: 'The line scales with headcount',
        detail: 'Add placements, invoice more, borrow more, without a new credit approval. This is the whole reason a staffing agency wants a collateral-based facility rather than a fixed-limit loan.',
      },
    ],
    terms: [
      { label: 'Facility size', value: '$250K - $25MM' },
      { label: 'Advance rate on eligible AR', value: '80%-95%' },
      { label: 'ABL pricing (2026)', value: 'Prime + 1%-5% on drawn funds' },
      { label: 'Factoring pricing (2026)', value: '0.5%-1.5% per invoice, depending on terms and client credit' },
      { label: 'Funding speed once live', value: '24-48 hours from invoice upload' },
      { label: 'Setup time', value: '10-20 business days' },
      { label: 'Ineligible collateral', value: 'Unbilled accrued time, invoices past 90 days, disputed hours, intercompany' },
      { label: 'Hard gate', value: 'Payroll taxes current. An IRS lien primes the lender and stops the deal' },
      { label: 'Concentration', value: 'Reserves typically begin above 30%-40% for a single client' },
      { label: 'Serve fee', value: 'A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs' },
    ],
    versus: {
      heading: 'A receivables facility vs. the advance an agency usually takes instead',
      theirsLabel: 'A revenue-based advance sized to deposits',
      oursLabel: 'A receivables facility that scales with placements',
      rows: [
        { dimension: 'How much is available', theirs: 'A fixed amount, roughly 10%-15% of annual revenue', ours: '80%-95% of your invoiced receivables, recalculated continuously' },
        { dimension: 'What happens when you grow', theirs: 'Nothing. You reapply, or stack a second position', ours: 'Availability rises with the invoice book automatically' },
        { dimension: 'Repayment', theirs: 'Daily or weekly ACH from deposits, whether clients paid or not', ours: 'Self-liquidating, so the facility repays as clients pay' },
        { dimension: 'Cost', theirs: 'Factor rates that annualize well past 50%', ours: 'Prime + 1%-5%, or 0.5%-1.5% per invoice' },
        { dimension: 'Effect on payroll timing', theirs: 'Extracts cash on payroll week', ours: 'Funds within 24-48 hours of invoicing, on your payroll cycle' },
        { dimension: 'Intermediary compensation', theirs: 'Built into the factor rate rather than quoted separately, so you rarely see it', ours: 'A success fee, agreed in writing before you sign and earned only if you close' },
      ],
    },
    workedExample:
      'A light industrial staffing agency doing about $11MM in revenue is funding weekly payroll of roughly $150K out of the owner personal line of credit and a single advance taken the previous spring. Receivables stand at $1.75MM across nineteen clients, the largest at 22% of the book. Payroll taxes are current.\n\nThe first finding has nothing to do with the lender. The agency bills semi-monthly, so at any moment $250K-$300K of worked hours sit unbilled and therefore ineligible. Moving to weekly invoicing adds roughly $260K of eligible receivables before a single term is negotiated. With that change, about $1.6MM of the book is eligible after removing aged and disputed items, supporting roughly $1.4MM at an 88% advance rate.\n\nWe place a factoring facility at 88% with a 1.05% fee per invoice on 45-day terms and 24-hour funding, closed in 13 business days. The advance taken the previous spring is retired out of the first draw. Fourteen months later the same book supports an ABL at Prime plus 3%, which cuts the cost of the facility by roughly 40% and returns collections to the agency. The factoring facility was the on-ramp, not the destination.',
    faqs: [
      {
        question: 'Can I finance payroll before I invoice the client?',
        answer: 'Generally not through the facility itself, because unbilled accrued time is not eligible collateral. The practical fix is billing frequency: an agency that invoices weekly instead of semi-monthly converts up to two weeks of payroll from ineligible to eligible, which usually creates more availability than any advance-rate negotiation would. Some payroll-funding providers will bridge the gap, at a price.',
      },
      {
        question: 'What if I am behind on payroll taxes?',
        answer: 'Resolve that before looking for financing. A federal tax lien takes priority over a lender security interest, so almost no facility will close over an unresolved 941 liability. Lenders will sometimes proceed where there is a documented IRS installment agreement in good standing that they can review. Get a payroll tax professional involved first. This is not a financing problem.',
      },
      {
        question: 'Factoring or ABL for a staffing agency?',
        answer: 'Factoring if you need speed, have thin financials, or are growing fast enough that collections management is a burden. It funds in 24-48 hours and the factor handles the lockbox. ABL if your financials support it and you want to keep collecting and pay less. A common path is factoring for the first twelve to eighteen months, then ABL once there is clean history to underwrite.',
      },
      {
        question: 'Will my clients know I am financing my receivables?',
        answer: 'With factoring, yes. Payments are directed to a lockbox in your name that the factor sweeps, and clients receive a notice of assignment. Large employers process these constantly and their AP teams treat it as routine. With an ABL you keep collecting and clients generally notice nothing. Either way, tell your largest accounts yourself before the paperwork reaches them.',
      },
      {
        question: 'How much can a staffing agency borrow?',
        answer: '80%-95% of eligible invoiced receivables, with facilities from $250K to $25MM. Eligible excludes unbilled time, invoices past 90 days, disputed hours, and a reserve against any client concentrated above roughly 30%-40% of the book. The useful exercise is to run your current AR aging through those rules. The answer is usually within a day.',
      },
      {
        question: 'Does this work for direct-hire placements?',
        answer: 'Less well. Permanent placement fees are often refundable inside a guarantee period, which makes them weaker collateral, and advance rates drop accordingly. If your book mixes temp and direct-hire, expect the temporary staffing receivables to carry the facility and the placement fees to be treated as a secondary or ineligible category.',
      },
    ],
    related: [
      { label: 'Asset-Based Lending, the full product explanation', href: '/solutions/asset-based-lending' },
      { label: 'Staffing agency financing guide', href: '/industries/staffing' },
      { label: 'Staffing: revenue-based financing vs. invoice factoring', href: '/blog/staffing-agency-rbf-vs-invoice-factoring' },
      { label: 'Invoice financing', href: '/solutions/invoice-factoring' },
    ],
    schema: {
      minAmount: '$250,000',
      maxAmount: '$25,000,000',
      rate: 'Prime + 1%-5% (ABL) or 0.5%-1.5% per invoice (factoring)',
      closingTime: '10-20 business days',
    },
  },

  {
    id: 'asset-based-lending-healthcare',
    h1: 'Asset-Based Lending for Healthcare Providers',
    title: 'Asset-Based Lending for Healthcare Providers',
    excerpt: 'Why insurance receivables advance at 65 to 75 percent instead of 85, how Medicare assignment rules work, and what a healthcare facility actually costs.',
    directAnswer:
      'Healthcare asset-based lending advances against third-party payor receivables (insurance, Medicare, Medicaid, managed care) at 65%-85% of net collectible value rather than against billed charges. The gap is not a penalty; it reflects that a healthcare claim is billed at gross charges and collects at a contracted rate, so a $100 charge might net $38, and the lender advances against the $38. As of 2026, facilities run $250K to $25MM, price from Prime plus 2%-6%, and close in 15-30 business days, longer than commercial ABL because payor mix, denial rates, and aging by payor all have to be analyzed. The structural complication is that federal anti-assignment rules bar Medicare and Medicaid from paying a lender directly, so these facilities use a two-account lockbox structure where government payments land in the provider own account and are swept under a deposit account control agreement. Providers should expect a specialized medical funder rather than a generalist ABL lender.',
    fitsIf: [
      'Sweet spot is $5MM-$50MM in annual revenue or net patient service revenue, and two or more years operating. Neither is a cutoff',
      'Third-party payor receivables: insurance, managed care, Medicare, Medicaid, workers compensation',
      'A billing operation that can produce aging by payor and a historical collection rate',
      'Denial and adjustment rates you can document rather than estimate',
      'No unresolved compliance action, recoupment demand, or payor audit outstanding',
    ],
    notFor: [
      {
        who: 'Practices under an active payor audit or recoupment demand',
        instead: 'A pending recoupment is a claim ahead of the lender on the same receivables, so lenders will wait it out. Resolve or quantify the exposure first: a documented settlement is financeable, an open audit of unknown scope generally is not. Tell us early rather than letting diligence find it, and we will tell you what the file needs to look like when it is time.',
      },
      {
        who: 'Cash-pay or elective practices with no third-party AR',
        instead: 'There is no payor receivable to advance against. A working capital loan or equipment financing usually fits better, and both move faster.',
      },
      {
        who: 'Providers who cannot produce collection history by payor',
        instead: 'The advance rate is derived from your historical net collection rate. Without that data a funder either declines or prices for the worst case. Twelve months of clean payor-level reporting is worth more to your cost of capital than any negotiation.',
      },
      {
        who: 'Anyone expecting to advance against gross charges',
        instead: 'Nobody lends against billed charges. Model the borrowing base off expected net collections and the numbers stop being a surprise. We will run that calculation before you commit to diligence.',
      },
    ],
    theProblem:
      'Healthcare receivables confuse every lender who has not specialized in them, and they confuse plenty of providers too. The core of it is that a healthcare invoice does not mean what an invoice means anywhere else. Bill $100 to a commercial plan and you might collect $42. Bill the same service to Medicare and you might collect $31. Bill it to a plan you are out of network with and you might collect $12 after an appeal, or nothing. The balance sheet says receivables. What exists is a probability distribution.\n\nThat is why the advance is set against net collectible value rather than billed charges, and why the analysis takes longer. A funder is calculating more than whether the payor will pay. It works out what proportion of billed charges historically converts to cash, at what speed, by payor, and reserves for denials, adjustments and recoupment. A practice with clean payor-level collection data gets a better advance rate than one without, purely because the uncertainty is smaller.\n\nThe second complication is legal rather than financial. Federal law restricts assignment of Medicare and Medicaid claims, which means government payments cannot be directed to a lender lockbox the way a commercial receivable can. The workaround is a two-account structure: government payments land in an account in the provider name, controlled through a deposit account control agreement, and are swept from there. The structure is well established, and it is one of several reasons this financing goes to specialized medical funders rather than generalist ABL lenders.\n\nWhat providers gain for the extra complexity is a facility that solves an actual structural problem. Payroll for clinical staff runs biweekly. Payors pay in 30 to 90 days, sometimes longer after a denial and appeal cycle. Growth in patient volume increases the receivable balance and the payroll before it increases cash. A facility sized to receivables rather than to earnings closes that gap without asking a practice to be profitable on a trailing basis first.',
    howItWorks: [
      {
        step: 'Analyze payor mix and net collection rate',
        detail: 'Aging by payor, historical gross-to-net conversion, denial rate, and days in AR. This is the substance of the underwrite. Commercial-heavy books get better advance rates than Medicaid-heavy books, and documented history beats estimates every time.',
      },
      {
        step: 'Set the advance rate off net collectible value',
        detail: '65%-85% of expected net collections, not of billed charges. Modeling this first is what keeps the process from ending in disappointment three weeks in.',
      },
      {
        step: 'Build the lockbox structure',
        detail: 'Commercial payors can be directed to a lockbox. Medicare and Medicaid cannot be assigned, so those payments flow into a provider-name account governed by a deposit account control agreement and are swept from there. Your bank will need to participate.',
      },
      {
        step: 'Close in 15-30 business days',
        detail: 'Longer than a commercial ABL because of the payor analysis and the account structure. Facilities from $250K to $25MM, priced from Prime plus 2%-6% depending on payor mix and collection history.',
      },
      {
        step: 'Report monthly and reprice as the book improves',
        detail: 'Aging by payor and a borrowing base certificate each month. A year of improving collection rates is a real argument for a better advance rate, and specialized funders do respond to it.',
      },
    ],
    terms: [
      { label: 'Facility size', value: '$250K - $25MM' },
      { label: 'Advance rate', value: '65%-85% of net collectible value, not of billed charges' },
      { label: 'Pricing (2026)', value: 'Prime + 2%-6%, depending on payor mix and collection history' },
      { label: 'Time to close', value: '15-30 business days' },
      { label: 'Payors financed', value: 'Commercial insurance, managed care, Medicare, Medicaid, workers compensation' },
      { label: 'Government payor structure', value: 'Two-account lockbox with a deposit account control agreement, because direct assignment is barred' },
      { label: 'Key underwriting inputs', value: 'Aging by payor, gross-to-net collection rate, denial rate, days in AR' },
      { label: 'Common exclusions', value: 'Self-pay balances, claims past 120-180 days, amounts under audit or recoupment' },
      { label: 'Lender type', value: 'Specialized medical funders, not generalist ABL lenders' },
      { label: 'Serve fee', value: 'A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs' },
    ],
    versus: {
      heading: 'A medical receivables facility vs. what gets pitched to practices',
      theirsLabel: 'A revenue-based advance against card and deposit volume',
      oursLabel: 'A medical receivables facility',
      rows: [
        { dimension: 'What is underwritten', theirs: 'Trailing bank deposits', ours: 'Payor mix, net collection rate, and aging by payor' },
        { dimension: 'How much is available', theirs: 'Roughly 10%-15% of annual revenue, fixed', ours: '65%-85% of net collectible receivables, recalculated monthly' },
        { dimension: 'Repayment', theirs: 'Daily or weekly ACH, independent of when payors pay', ours: 'Self-liquidating as claims adjudicate and pay' },
        { dimension: 'Cost', theirs: 'Factor rates that annualize well past 50%', ours: 'Prime + 2%-6%' },
        { dimension: 'Handling of denials', theirs: 'Irrelevant to the lender. The draw continues regardless', ours: 'Reserved for in the borrowing base, so availability tracks reality' },
        { dimension: 'Intermediary compensation', theirs: 'Built into the factor rate rather than quoted separately, so you rarely see it', ours: 'A success fee, agreed in writing before you sign and earned only if you close' },
      ],
    },
    workedExample:
      'A multi-site specialty practice with about $16MM in net patient service revenue is carrying $4.8MM in gross receivables and financing a biweekly clinical payroll of roughly $420K out of a fully drawn bank line. Payor mix runs about 58% commercial, 27% Medicare, 11% Medicaid, and 4% self-pay.\n\nThe gross number is not the working number. Historical gross-to-net conversion on this book is about 41%, so $4.8MM in billed charges represents roughly $1.97MM of expected net collections. Removing self-pay balances and claims past 150 days leaves about $1.72MM eligible. At a 71% advance rate, supported by a documented denial rate under 6% and clean payor-level reporting, the facility sizes to roughly $1.22MM.\n\nStructure: commercial payors directed to a lockbox, Medicare and Medicaid flowing into a practice-name account under a deposit account control agreement and swept daily. Priced at Prime plus 4.25%, closed in 24 business days. The practice stops timing payroll against deposit timing, and the reporting discipline the facility requires surfaces a denial pattern with one managed care plan that had been quietly costing more than the financing does.',
    faqs: [
      {
        question: 'Why is the advance rate quoted against net collectible value rather than what I billed?',
        answer: 'Because a healthcare receivable is billed at gross charges and collects at a contracted rate. If $100 of billed charges historically converts to $40 of cash, the lender is advancing 70% of the $40, not of the $100. The percentage looks lower and the underlying math is consistent with commercial lending. Model your borrowing base off expected net collections and the number stops being a surprise.',
      },
      {
        question: 'Can Medicare and Medicaid receivables be financed?',
        answer: 'Yes, but not by assigning the payment to a lender. Federal anti-assignment rules bar that. The standard structure is a two-account arrangement where government payments land in an account in the provider name, subject to a deposit account control agreement, and are swept from there. It is well established, and it is one reason these facilities go to specialized medical funders.',
      },
      {
        question: 'What does healthcare asset-based lending cost in 2026?',
        answer: 'Prime plus 2%-6% on drawn funds, with pricing driven mainly by payor mix and documented collection history. A commercial-heavy book with a low denial rate prices near the bottom of that range; a Medicaid-heavy book with inconsistent reporting prices near the top or gets declined. Setup costs include the payor analysis and, sometimes, a third-party billing review.',
      },
      {
        question: 'How long does it take to close?',
        answer: '15-30 business days, longer than a commercial ABL. The additional time goes to the payor-level analysis and to setting up the two-account lockbox structure with your bank. If cash is needed sooner, a working capital loan closing in days can bridge while the facility underwrites.',
      },
      {
        question: 'Will an open payor audit stop the deal?',
        answer: 'Usually, yes. A recoupment demand is a claim ahead of the lender against the same receivables, so funders wait for it to resolve or be quantified. A documented settlement with a payment plan is generally financeable; an open audit of unknown scope generally is not. Tell your advisor about it at the start rather than letting diligence find it.',
      },
      {
        question: 'Is this the same as medical factoring?',
        answer: 'Closely related. Medical factoring is the sale of specific claims with the funder managing collections; a medical ABL is a loan against the receivable pool with the provider continuing to bill and collect. Factoring is faster to establish and more forgiving of weak financials; ABL costs less and is less intrusive. Payor mix often decides which lenders will engage at all.',
      },
    ],
    related: [
      { label: 'Asset-Based Lending, the full product explanation', href: '/solutions/asset-based-lending' },
      { label: 'Healthcare financing guide', href: '/industries/healthcare' },
      { label: 'AR financing for healthcare supply companies', href: '/blog/ar-financing-healthcare-supply' },
      { label: 'Invoice financing', href: '/solutions/invoice-factoring' },
    ],
    schema: {
      minAmount: '$250,000',
      maxAmount: '$25,000,000',
      rate: 'Prime + 2%-6%',
      closingTime: '15-30 business days',
    },
  },

  {
    id: 'asset-based-lending-construction',
    h1: 'Asset-Based Lending for Construction Contractors',
    title: 'Asset-Based Lending for Contractors',
    excerpt: 'Most lenders decline construction receivables. What retainage, lien rights and pay-when-paid do to a borrowing base, and which structures actually work.',
    directAnswer:
      'Most asset-based lenders decline construction receivables, and it is worth understanding why before you spend three weeks finding out. Progress billings carry retainage held until project completion, pay-when-paid clauses make payment contingent on money flowing down from an owner, mechanics lien and bond claims can jump ahead of a lender security interest, and percentage-of-completion accounting makes the receivable balance a judgment rather than a fact. As of 2026, the contractors who do get financed use one of three structures: an equipment-led facility advancing 70%-80% of liquidation value on owned machinery, a specialist progress-billing facility advancing 70%-80% on approved billings with retainage excluded, or contract financing against a single assigned contract. Facilities run $250K to $25MM, price from Prime plus 2%-6%, and close in 15-30 business days. The practical lever most contractors underuse is their equipment, which is often paid for and appraises well.',
    fitsIf: [
      'Sweet spot is $5MM-$50MM in annual revenue and two or more years operating. Neither is a cutoff',
      'Owned, paid-for equipment, frequently the strongest collateral in the business',
      'Approved progress billings with documented sign-offs, not invoices you have only submitted',
      'A work-in-progress schedule you can actually produce and defend',
      'Clean lien and bond history, with no outstanding claims against completed work',
    ],
    notFor: [
      {
        who: 'Contractors whose entire receivable balance is retainage',
        instead: 'Retainage is either excluded from the borrowing base or advanced at a fraction, because it is contingent on completion and subject to offset. If retainage is most of what you are owed, the answer is equipment-secured financing or a bridge against a specific contract, not a receivables facility.',
      },
      {
        who: 'Anyone financing a building rather than a business',
        instead: 'A construction loan against a project is real estate lending, underwritten on the property and drawn against inspections. That is a different product with different lenders. See our real estate lending page.',
      },
      {
        who: 'Contractors with active mechanics lien or bond claims on completed work',
        instead: 'Those claims can prime a lender lien on the same receivables. Resolve or quantify them first. A documented resolution is financeable, an open claim usually is not. If it is in progress, say so and we will look at the equipment side in the meantime, which is often the stronger collateral anyway.',
      },
      {
        who: 'Businesses with no WIP schedule',
        instead: 'A lender cannot underwrite progress billings without it, and the surety already requires one. If job-level cost tracking is not in place, that is the first project. It improves your bonding capacity at the same time.',
      },
    ],
    theProblem:
      'Construction runs on other people money and pays for it in cash flow. You mobilize on a job, carry labor and materials for 30 to 60 days, submit a progress billing, wait for approval, get paid on 45 to 90 day terms, and watch 5% to 10% sit in retainage until the whole project closes out, sometimes a year later. Meanwhile the next job wants mobilization money. The paperwork says the company is profitable and the bank account disagrees.\n\nThen the contractor goes looking for a receivables facility and gets declined by lenders who fund manufacturers and staffing agencies without blinking. That is not prejudice; construction receivables genuinely carry risks other receivables do not. Retainage is contingent on completion. Pay-when-paid clauses mean your customer owes you only once the owner pays them. Mechanics lien and bond claims from your own subs and suppliers can take priority over a lender lien on the very same money. And percentage-of-completion accounting makes the receivable balance an estimate that moves when the cost-to-complete estimate moves.\n\nThe contractors who solve this usually solve it with equipment rather than receivables. A fleet of excavators, cranes, or trucks that is paid for is excellent collateral: it appraises reliably, it has a deep resale market, and none of the offset problems that plague construction AR apply to it. Equipment-led facilities and sale-leasebacks routinely produce more availability than a receivables facility would, and close with less argument.\n\nWhere receivables do work, it is with lenders who specialize in construction and understand the paperwork. Those lenders advance against approved billings, with the sign-off documented, exclude or heavily discount retainage, and read the contract for pay-when-paid and offset language before quoting. Fewer lenders will look at the file, and the ones who do quote something realistic rather than something that falls apart at closing.',
    howItWorks: [
      {
        step: 'Start with the equipment schedule',
        detail: 'List owned machinery with year, model, hours, and whether it is free and clear. For most contractors this produces the largest single block of borrowing base, at 70%-80% of appraised liquidation value, with none of the offset risk that attaches to progress billings.',
      },
      {
        step: 'Separate approved billings from submitted ones',
        detail: 'Only approved billings, with documented owner or general contractor sign-off, are eligible collateral. Submitted-but-unapproved billings are contingent, and lenders treat them accordingly. Tightening the approval cycle creates availability directly.',
      },
      {
        step: 'Carve out retainage explicitly',
        detail: 'Expect retainage to be excluded from the borrowing base. Knowing this at the start prevents the common failure, where a contractor counts $900K of retainage toward availability and finds out at closing that it contributed almost nothing.',
      },
      {
        step: 'Read the contract before quoting the facility',
        detail: 'Pay-when-paid clauses, offset rights, assignment restrictions, and the surety agreement all change what a lender can actually rely on. On bonded work the surety consent question comes up early, not at closing.',
      },
      {
        step: 'Match the structure to the job, not the year',
        detail: 'Contract financing against a single assigned contract often beats a general facility for a specific large award, especially on public work where an assignment of claims is available. The two structures coexist: a facility for the ongoing book, contract financing for the outlier job.',
      },
    ],
    terms: [
      { label: 'Facility size', value: '$250K - $25MM' },
      { label: 'Pricing (2026)', value: 'Prime + 2%-6%' },
      { label: 'Equipment advance', value: '70%-80% of appraised liquidation value on owned, free-and-clear machinery' },
      { label: 'Approved progress billings', value: '70%-80% advance, with documented sign-off required' },
      { label: 'Retainage', value: 'Excluded from the borrowing base' },
      { label: 'Time to close', value: '15-30 business days including appraisal and contract review' },
      { label: 'Contract-specific option', value: 'Contract financing against a single assigned contract, strongest on public work' },
      { label: 'Deal-stoppers', value: 'Active mechanics lien or bond claims, no WIP schedule, unresolved surety issues' },
      { label: 'What lenders read first', value: 'The contract: pay-when-paid, offset rights, assignment restrictions, surety agreement' },
      { label: 'Serve fee', value: 'A success fee, earned only on closing. Agreed in writing before you sign anything. No retainers, no upfront costs' },
    ],
    versus: {
      heading: 'Equipment-led financing vs. chasing a receivables facility',
      theirsLabel: 'A general receivables facility',
      oursLabel: 'An equipment-led structure',
      rows: [
        { dimension: 'Who will look at it', theirs: 'Few lenders, and most decline construction AR outright', ours: 'Many, because machinery collateral is understood everywhere' },
        { dimension: 'What retainage does to it', theirs: 'Excluded or nearly so, which often gutters availability', ours: 'Irrelevant, because the collateral is the equipment' },
        { dimension: 'Offset and lien risk', theirs: 'Real: subs, suppliers, and sureties can claim the same money', ours: 'Minimal: a titled asset with a deep resale market' },
        { dimension: 'Typical availability', theirs: '70%-80% of approved billings only', ours: '70%-80% of appraised liquidation value on the fleet' },
        { dimension: 'Time to close', theirs: '15-30 business days, if a lender engages at all', ours: '10-20 business days, appraisal-driven' },
        { dimension: 'Best combined use', theirs: 'The ongoing billing book, with a construction specialist', ours: 'The base facility, with contract financing layered on for a large award' },
      ],
    },
    workedExample:
      'A site work contractor doing about $22MM in revenue is carrying $3.4MM in receivables, of which roughly $1.1MM is retainage across seven jobs. It owns an equipment fleet (excavators, dozers, haul trucks) with no liens on most units. The bank line is $1.5MM and fully drawn every spring during mobilization season.\n\nThe receivables-only path is disappointing on inspection. Excluding retainage and the billings still awaiting owner approval leaves about $1.4MM of approved progress billings eligible, supporting roughly $1.05MM at a 75% advance rate. That is less than the existing bank line and it took three weeks to establish.\n\nThe equipment changes the picture. An appraisal supports $4.1MM of orderly liquidation value across the free-and-clear units, producing a $3.1MM term facility at 76%. Combined with a $1.05MM revolver against approved billings from a construction-specialist lender, total availability reaches roughly $4.15MM at a blended cost near Prime plus 4%. When the company wins a $6MM municipal award the following quarter, contract financing against the assigned contract covers mobilization without touching either facility. The fleet was the answer the whole time, and it had been sitting in the yard.',
    faqs: [
      {
        question: 'Why do lenders decline construction receivables?',
        answer: 'Four reasons that compound. Retainage is contingent on project completion. Pay-when-paid clauses make your customer obligation conditional on the owner paying them. Mechanics lien and bond claims from your subs and suppliers can take priority over a lender lien on the same receivables. And percentage-of-completion accounting means the receivable balance moves when the cost-to-complete estimate moves. Lenders who specialize in construction price for those risks; generalists decline.',
      },
      {
        question: 'Can I borrow against retainage?',
        answer: 'Effectively nothing. Expect retainage to be excluded from the borrowing base, because it is contingent on completion and exposed to offset. If retainage is a large share of what you are owed, plan the facility around equipment or a specific assigned contract instead, and treat retainage as cash that arrives at closeout rather than as availability.',
      },
      {
        question: 'What is the best financing structure for a contractor?',
        answer: 'For most contractors at $5MM-$50MM in revenue, an equipment-led facility is the strongest starting point. Owned machinery appraises reliably, has a deep resale market, and carries none of the offset problems construction AR does. Layer a progress-billing revolver from a construction specialist on top for the ongoing book, and use contract financing for individual large awards. Which mix fits depends on how much equipment you own outright.',
      },
      {
        question: 'Is this the same as a construction loan?',
        answer: 'No, and the distinction matters. A construction loan finances the building of a property and is underwritten on the real estate, drawn against inspections, and held by a real estate lender. What is described here finances the contracting business, its receivables and its equipment. If you are developing property, our real estate lending page is the right starting point.',
      },
      {
        question: 'How does bonding interact with this?',
        answer: 'Directly, and early. A surety has rights in contract proceeds and often in the contract itself, so on bonded work the surety position gets addressed before a lender quotes rather than at closing. Good news for contractors who bond: the WIP schedule and job-cost discipline the surety already requires is exactly what an ABL lender wants to see.',
      },
      {
        question: 'How long does it take to close?',
        answer: '15-30 business days. Equipment appraisals and contract review drive the timeline. If mobilization money is needed before that, a bridge secured by existing receivables can close in 3-7 business days and be retired by the facility on close, a standard sequence rather than a workaround.',
      },
    ],
    related: [
      { label: 'Asset-Based Lending, the full product explanation', href: '/solutions/asset-based-lending' },
      { label: 'Construction financing guide', href: '/industries/construction' },
      { label: 'Equipment financing and sale-leaseback compared', href: '/compare/equipment-financing-vs-sale-leaseback' },
      { label: 'Real estate lending, if the collateral is property', href: '/solutions/real-estate-lending' },
    ],
    schema: {
      minAmount: '$250,000',
      maxAmount: '$25,000,000',
      rate: 'Prime + 2%-6%',
      closingTime: '15-30 business days',
    },
  },
]

export function getFundingPage(id: string): FundingPage | undefined {
  return fundingPages.find(p => p.id === id)
}

export function getFundingPageIds(): string[] {
  return fundingPages.map(p => p.id)
}
