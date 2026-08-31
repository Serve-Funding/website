/**
 * SOLUTIONS COMPARISON DATA
 *
 * Structured comparison fields for /solutions/compare — designed so AI engines
 * can extract clean chunks (speed, cost, range, collateral, alternative-to relationships)
 * while humans get continuous narrative prose.
 *
 * Each entry corresponds to a `fundingSolutions` entry by `id`. Keep these in sync.
 */

export interface SolutionComparison {
  id: string
  /** Display name used in the comparison table and headings */
  name: string
  /** One-line positioning: how this solution fits the "alternatives" frame */
  positioning: string
  /** Funding speed — keep terse: "2–10 business days" */
  speed: string
  /** Cost / pricing — terse: "1.25–4% / month", "Prime + 1–6%" */
  cost: string
  /** Deal size range */
  range: string
  /** Collateral requirement — terse */
  collateral: string
  /** Other solution IDs this most directly competes with / replaces */
  alternativeTo: string[]
  /** Three sentences of continuous prose: what it is + the wedge */
  narrative: string
  /** "Pick this if…" — bullets aimed at the human decision-maker */
  pickIf: string[]
  /** "Skip this if…" — bullets aimed at honest deflection */
  skipIf: string[]
  /** Real outcome / proof point, with a number */
  proof: string
}

export const solutionComparisons: SolutionComparison[] = [
  {
    id: 'working-capital-loans',
    name: 'Working Capital Loans (Revenue-Based)',
    positioning: 'The fastest, most flexible option, and the closest competitor to an MCA, but at half the cost.',
    speed: '2–10 business days',
    cost: '1.25%–4% per month (18–48% APR equivalent)',
    range: '$100K – $10M+',
    collateral: 'None, revenue-based',
    alternativeTo: ['debt-refinance', 'bridge-funding', 'asset-based-lending'],
    narrative:
      'Working capital loans (also called revenue-based financing) underwrite to your bank deposits, not your tax return, which is exactly why they fund in days when a bank would take weeks. The trade-off is cost: at 1.25–4% per month they sit between a bank line and a merchant cash advance, but their fixed monthly payment is structurally safer than the daily-pull MCA structure that destroys cash flow. For most growing companies whose bank just said no, this is the first product we shop, and the one our debt-refinance work usually rolls borrowers into.',
    pickIf: [
      'You need cash in days, not weeks',
      'Your bank line is maxed but revenue is growing',
      'You want a fixed monthly payment, not daily extractions',
      'Your tax return doesn\'t reflect current revenue trajectory',
    ],
    skipIf: [
      'You have strong AR or hard assets, and asset-based lending or factoring will cost 5–10 points less',
      'You can wait 4–8 weeks for an SBA loan',
    ],
    proof:
      'Borrowers refinancing out of MCA into working capital loans typically cut monthly debt service by 30–50% while preserving the speed that made them choose the MCA in the first place.',
  },
  {
    id: 'invoice-factoring',
    name: 'Invoice Factoring (AR Financing)',
    positioning: 'The cheapest fast option when your customers are creditworthy and your tax return isn\'t.',
    speed: '2–3 week setup, then 24–48 hours per invoice',
    cost: 'Prime + 1–6% + 0.25–1% per invoice',
    range: '$250K – $100MM',
    collateral: 'Unpaid B2B invoices (no other collateral needed)',
    alternativeTo: ['working-capital-loans', 'asset-based-lending', 'inventory-financing'],
    narrative:
      'Invoice factoring is the answer to the same problem as a working capital loan, slow customer payments choking growth, but priced like a bank product because the lender is underwriting your customers\' credit, not yours. You get 75–95% of an invoice\'s value within 24–48 hours of issuance and the balance (minus fees) when the customer pays. It\'s self-liquidating, scales automatically with sales, and is one of the only products that works when your business is growing fast but your tax return shows a loss.',
    pickIf: [
      'You sell B2B with net-30 to net-90 terms',
      'Your customers have strong credit even if you don\'t',
      'Your sales are growing faster than your bank line',
      'Your tax return doesn\'t reflect current reality',
    ],
    skipIf: [
      'You sell B2C or take card payments, so there are no invoices to factor',
      'Your AR concentration is one customer (factors discount heavily)',
    ],
    proof:
      'One healthcare-supply manufacturer started at $1MM at Prime + 2% (single-digit blended) and scaled the facility to $1.5MM within two months as sales grew, with no re-underwriting required.',
  },
  {
    id: 'asset-based-lending',
    name: 'Asset-Based Lending (ABL)',
    positioning: 'The bank-line replacement when you\'ve outgrown a traditional credit box but still have hard collateral.',
    speed: '4–8 weeks',
    cost: 'Prime + 1–5%',
    range: '$250K – $25M',
    collateral: 'AR + inventory + equipment + sometimes real estate',
    alternativeTo: ['invoice-factoring', 'working-capital-loans', 'inventory-financing'],
    narrative:
      'ABL is a revolving credit line backed by everything liquid on your balance sheet: receivables, inventory, equipment, sometimes real estate. Compared to invoice factoring it gives you more borrowing power per dollar of assets (you\'re not capped at AR) and reads more like a bank line on your balance sheet. Compared to a working capital loan it costs less but takes longer to close, so we shop ABL when speed is in weeks rather than days and the borrower has multiple asset types to lend against.',
    pickIf: [
      'You have $250K+ in AR plus inventory and/or equipment',
      'You want a single revolving facility, not multiple products',
      'You can wait 4–8 weeks for a cheaper rate than working capital',
      'You\'re consolidating multiple expensive debts',
    ],
    skipIf: [
      'You need cash this week',
      'Your only collateral is AR (factoring will be simpler and faster)',
    ],
    proof:
      'Most ABL banks won\'t look below $3–5MM. We facilitate facilities from $250K because we shop the deal across an extensive lender network with different size minimums.',
  },
  {
    id: 'equipment-leasing',
    name: 'Equipment Leasing & Financing',
    positioning: 'The right answer when the capital need is the equipment itself, not general working capital.',
    speed: '5–15 business days',
    cost: 'Prime + 3–10%',
    range: '$100K – $50MM+',
    collateral: 'The equipment being financed (plus sometimes a PG)',
    alternativeTo: ['asset-based-lending', 'sba-loans'],
    narrative:
      'When the capital you need is tied to a specific asset purchase (a machine, a truck, a server rack), financing the asset directly is almost always cheaper than drawing on a general working-capital line. Terms run 3–7 years, advance rates are 70–85% of liquidation value, and sale-leaseback structures let you extract equity from equipment you already own. This is where ABL borrowers go when the new collateral isn\'t AR or inventory but a piece of hardware.',
    pickIf: [
      'You\'re buying a specific, identifiable asset',
      'You want to preserve your bank line for working capital',
      'You already own equipment and want to extract equity (sale-leaseback)',
      'You want to match payment term to useful life of the asset',
    ],
    skipIf: [
      'You need general operating cash, so use working capital or ABL',
    ],
    proof:
      'Sale-leaseback against owned equipment routinely unlocks 50–70% of liquidation value in capital without adding a new debt covenant.',
  },
  {
    id: 'inventory-financing',
    name: 'Inventory Financing',
    positioning: 'The bridge between an asset-based line and a purchase-order loan when stock is the bottleneck.',
    speed: '3–6 weeks',
    cost: 'Prime + 6–12%',
    range: '$500K – $20M',
    collateral: 'Inventory (up to 85% of liquidation value)',
    alternativeTo: ['asset-based-lending', 'purchase-order-funding'],
    narrative:
      'If your growth is constrained by inventory you can\'t afford to hold, a holiday build for e-commerce or raw materials for a contracted production run, inventory financing advances against the stock itself. It costs more than an ABL line because inventory is harder to liquidate than AR, but it works for B2C and direct-to-consumer companies that factoring won\'t touch.',
    pickIf: [
      'Your business is e-commerce or retail with inventory turns',
      'You can\'t qualify for factoring (no B2B invoices)',
      'You need to scale stock ahead of a known demand spike',
    ],
    skipIf: [
      'You have unpaid B2B invoices (factoring is cheaper)',
      'The need is for upstream supplier payment, so see PO funding',
    ],
    proof:
      'Most lenders cap inventory advances at 85% of liquidation value, which is why we layer it with a PO facility for international importers managing tariff cycles.',
  },
  {
    id: 'purchase-order-funding',
    name: 'Purchase Order Funding',
    positioning: 'The one product that pays your suppliers before your customer pays you.',
    speed: '2–4 weeks approval, 5–10 days per draw',
    cost: '1.5%–3% per 30 days',
    range: '$250K – $50M',
    collateral: 'The purchase order itself + supplier invoices',
    alternativeTo: ['inventory-financing', 'invoice-factoring'],
    narrative:
      'PO funding is the answer when the cash shortage sits between you and your supplier. A customer has placed an order, but you need to pay an overseas factory before the customer pays you. It funds 70–100% of the PO value, supports international suppliers, and combines naturally with invoice factoring (PO funds production, factoring funds the wait after delivery).',
    pickIf: [
      'You have a confirmed customer PO you can\'t fulfill from cash on hand',
      'Your supplier is overseas and demands payment up front',
      'You\'re managing tariff cycles with bulk orders',
    ],
    skipIf: [
      'The need is to hold inventory speculatively (no committed PO yet), use inventory financing',
    ],
    proof:
      'A specialty coffee importer capped at $150K by their existing lender closed a $1MM PO facility in two weeks, enough to pay overseas suppliers and capitalize on a corporate-roaster demand surge.',
  },
  {
    id: 'government-contracts',
    name: 'Government Contract Financing',
    positioning: 'Industry-specific AR financing for the 30–90+ day payment cycle every government client runs.',
    speed: '10–20 business days',
    cost: 'Prime + 2–8%',
    range: '$250K – $50MM+',
    collateral: 'The government contract itself + AR against it',
    alternativeTo: ['invoice-factoring', 'asset-based-lending'],
    narrative:
      'Government clients (federal, state, local) routinely pay net-60, net-90, or quarterly. That timing gap kills growing contractors and subcontractors who fronted the materials and payroll. Government contract financing advances up to 90% of contract value against your award, structured around quirks unique to the sector (retainage, prime/sub payment flow, GSA terms). It\'s a specialized cousin of invoice factoring with underwriting that understands the contract structure.',
    pickIf: [
      'You hold federal (GSA, DoD), state, or local government contracts',
      'You\'re a subcontractor waiting on a prime contractor\'s payment',
      'You need to fund payroll and materials before the government pays',
    ],
    skipIf: [
      'Your customer is commercial, so standard invoice factoring is cheaper',
    ],
    proof:
      'A federal GSA contractor closed $500K in 20 business days when payroll was due before the government payment cycle completed.',
  },
  {
    id: 'real-estate-lending',
    name: 'Real Estate Lending (Bridge & Cash-Out)',
    positioning: 'Long-term capital priced like long-term capital, for property purchases or to extract equity for working capital.',
    speed: '2–6 weeks',
    cost: 'Prime + 2–7%',
    range: '$500K – $100MM+',
    collateral: 'The commercial property (or personal real estate for some products)',
    alternativeTo: ['unsecured-debt', 'sba-loans', 'asset-based-lending'],
    narrative:
      'When the business need is property, whether buying, refinancing, or cashing out equity for working capital, real estate lending is the right structure. Bridge loans (12–36 months, interest-only) cover acquisition timing gaps; permanent loans (25–30 year amortization) replace them once the deal closes. Cash-out refinances are how owner-operators turn dead equity into deployable capital for the operating business.',
    pickIf: [
      'You\'re buying or refinancing commercial property',
      'You have equity in commercial or personal real estate to extract',
      'You need a long-amortization payment to match a long-term need',
    ],
    skipIf: [
      'You need cash this week (bridge funding is faster)',
      'You don\'t own real estate (this isn\'t the product)',
    ],
    proof:
      'A surgeon used a $550K second mortgage on personal real estate as the third layer of a $1.79MM capital stack that funded both year-end operations and a hospital-system acquisition.',
  },
  {
    id: 'unsecured-debt',
    name: 'Subordinated & Unsecured Credit',
    positioning: 'Stretch capital that sits on top of every other layer: no collateral, no UCC on some products, fast close.',
    speed: '1–3 weeks',
    cost: 'Prime + 4–8%',
    range: '$50K – $20MM+',
    collateral: 'None on unsecured products; 2nd lien on subordinated debt',
    alternativeTo: ['bridge-funding', 'working-capital-loans', 'real-estate-lending'],
    narrative:
      'Unsecured and subordinated credit fills the gap when you\'ve already pledged everything that can be pledged but still need more runway. Unsecured term loans (no UCC, no collateral) work for growing companies with strong revenue but thin asset bases. Subordinated debt sits behind a senior lender at 1–5× EBITDA and is how layered-capital strategies actually get built. You stack it on top of an AR revolver and a real-estate lien to maximize total deployable capital.',
    pickIf: [
      'You\'ve maxed bank and ABL but still have growth opportunities',
      'You don\'t want another UCC filing on your business',
      'You\'re structuring a layered capital stack for an acquisition or expansion',
    ],
    skipIf: [
      'You have unused asset collateral, and secured products will cost less',
    ],
    proof:
      'A medical device company combined a $1MM AR revolver, a $240K unsecured term loan, and a $550K second mortgage into a $1.79MM stack that funded 30%+ growth in ten months.',
  },
  {
    id: 'bridge-funding',
    name: 'Bridge Funding',
    positioning: 'Pure timing capital: interest-only, exits when the larger deal closes.',
    speed: '3–7 business days',
    cost: 'Prime + 4–8% (interest-only typical)',
    range: '$50K – $5MM+',
    collateral: 'Varies, often unsecured for short terms',
    alternativeTo: ['unsecured-debt', 'working-capital-loans'],
    narrative:
      'Bridge funding is the right product when you know the exit: a contract is about to close, an acquisition is about to fund, a property is about to sell. Interest-only payments preserve cash while you wait, and an aggressive early-payoff discount means you only pay for the days you actually use the money. It\'s expensive per month but cheap in absolute terms because you\'re only in the loan for 30–180 days.',
    pickIf: [
      'You can identify the specific event that will pay off the loan',
      'You need cash before that event in days, not weeks',
      'Interest-only payments matter more than absolute rate',
    ],
    skipIf: [
      'You don\'t have a clear payoff event, and bridge debt becomes permanent debt at painful rates',
    ],
    proof:
      'A surgeon closed $1.475MM in M&A bridge capital in weeks to cover year-end operations while a hospital-system acquisition finalized, then refinanced into permanent capital at closing.',
  },
  {
    id: 'sba-loans',
    name: 'SBA Loans',
    positioning: 'The cheapest capital available, if you can wait 4–12 weeks and your business fits the SBA box.',
    speed: '4–12 weeks',
    cost: 'Prime + 2–3%',
    range: '$250K – $5MM+',
    collateral: 'Varies by program (7a, 504, Express)',
    alternativeTo: ['working-capital-loans', 'asset-based-lending', 'real-estate-lending'],
    narrative:
      'SBA loans are the cheapest capital most growing businesses will ever access. Government-backed guarantees let banks lend at Prime + 2–3% over up to 10 years. The cost is time and paperwork: 4–12 weeks of underwriting, full tax returns, full personal financials, and a credit box that excludes a lot of fast-growing companies. When the timeline allows it and the business qualifies, SBA is almost always the right first stop.',
    pickIf: [
      'You can wait 4–12 weeks for closing',
      'You have 2+ years of clean financials and decent credit',
      'You want the longest amortization possible',
    ],
    skipIf: [
      'You need cash in days',
      'Your tax return shows a loss or your credit is mid-500s',
    ],
    proof:
      'SBA pricing sits 5–10 percentage points below working capital loans, making it the right destination after you refinance out of expensive bridge debt.',
  },
  {
    id: 'debt-refinance',
    name: 'Consolidation & Recapitalization',
    positioning: 'Not really a product. It\'s the strategy that uses the products above to replace expensive debt with cheaper debt.',
    speed: '10–20 business days',
    cost: 'Depends on the product you refinance into',
    range: '$250K – $10MM+',
    collateral: 'Whatever the new product requires',
    alternativeTo: ['working-capital-loans', 'asset-based-lending', 'invoice-factoring'],
    narrative:
      'Debt refinance is what you do *with* the other eleven products on this page. Most often it means taking a borrower trapped in daily-pull MCA debt and consolidating into a single monthly working-capital loan or an ABL line, freeing up 30–50% of cash flow and dropping the all-in rate by 5–10 percentage points. The "product" being shopped is whichever of the above eleven the borrower\'s assets, revenue, and timeline qualify them for.',
    pickIf: [
      'You have stacked MCAs eating daily cash flow',
      'You have multiple loans with different payments',
      'Your current debt was priced for a worse version of your business',
    ],
    skipIf: [
      'You\'re not paying above market, so there\'s nothing to refinance',
    ],
    proof:
      'A staffing agency paying $15K/month in MCA fees refinanced into an $8K/month term loan, freeing $7K monthly for growth.',
  },
]
