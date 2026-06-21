/**
 * SERVE FUNDING — HEAD-TO-HEAD COMPARISONS
 *
 * Structured comparison pages served from /compare/[comparison-id].
 *
 * Voice is Michael Kodinsky's: educational, warm, direct, never adversarial
 * toward a product type. Mike teaches the trade-offs; he doesn't bash
 * categories. Verbatim quotes are drawn from docs/mike-voice-patterns.md,
 * docs/product-explanations.md, and docs/objections-and-responses.md —
 * never invented.
 *
 * Last updated: 2026-05
 */

export interface ComparisonProduct {
  /** Funding-solution id from src/data/solutions.tsx, if it maps. Used for cross-linking. */
  solutionId?: string
  /** Display name */
  name: string
  /** One-sentence positioning */
  positioning: string
  /** Terse stats */
  speed: string
  cost: string
  range: string
  collateral: string
}

export interface ComparisonFeatureRow {
  feature: string
  productA: string
  productB: string
}

export interface ComparisonPage {
  /** URL slug. Will live at /compare/{id} */
  id: string
  /** Page title — keep title + " | Serve Funding" suffix ≤ 70 chars (so title ≤ 53 chars). */
  title: string
  /** Subtitle, no hard limit but keep ~100 chars for mobile. */
  subtitle: string
  /** Meta description and intro text — 120–160 chars EXACTLY (enforced by verify-seo). */
  excerpt: string
  productA: ComparisonProduct
  productB: ComparisonProduct
  /**
   * Answer-first intro — 2–3 paragraphs of plain-language opener.
   * First 50 words must directly answer "what's the difference between A and B
   * and which should I pick."
   */
  introduction: string
  /** 6–10 row comparison table — structured-data rows AI engines extract. */
  featureRows: ComparisonFeatureRow[]
  /** Narrative: when to pick product A. 2–3 paragraphs + 3–5 bullets. */
  whenToPickA: { narrative: string; bullets: string[] }
  /** Same for B. */
  whenToPickB: { narrative: string; bullets: string[] }
  /** A worked example using concrete numbers. No customer-identifying details. */
  workedExample: { scenario: string; math: string; takeaway: string }
  /** 2–3 verbatim Michael Kodinsky quotes from docs/, with context. */
  mikeQuotes: Array<{ quote: string; context: string }>
  /** 5–8 FAQs in the voice prospects actually use. */
  faqs: Array<{ question: string; answer: string }>
  /** Solution IDs to link back to (from src/data/solutions.tsx). */
  relatedSolutions: string[]
}

export const comparisons: ComparisonPage[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. INVOICE FACTORING vs ASSET-BASED LENDING — the "cousins" comparison
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'invoice-factoring-vs-asset-based-lending',
    title: 'Invoice Factoring vs Asset-Based Lending',
    subtitle: 'Two close cousins. Both revolve against your AR. One is a recurring sale of an asset, one is a true line of debt.',
    excerpt:
      'Invoice factoring and asset-based lending are close cousins — both revolving lines against AR with a lockbox. Here is how to choose, with real numbers.',
    productA: {
      solutionId: 'invoice-factoring',
      name: 'Invoice Factoring',
      positioning:
        'A recurring sale of your receivables to a third party. Off balance sheet. Customer credit underwritten.',
      speed: '2–3 week setup, then 24–48 hours per invoice',
      cost: 'Prime + 1–6% + 0.25–1% per invoice',
      range: '$250K – $100MM',
      collateral: 'B2B invoices only (customer credit is the real test)',
    },
    productB: {
      solutionId: 'asset-based-lending',
      name: 'Asset-Based Lending (ABL)',
      positioning:
        'A revolving credit line on your balance sheet, secured by AR plus inventory plus equipment.',
      speed: '4–8 weeks to close',
      cost: 'Prime + 1–5%',
      range: '$250K – $25M',
      collateral: 'AR + inventory + equipment + sometimes real estate',
    },
    introduction:
      'Invoice factoring and asset-based lending are close cousins. Both create a revolving line collateralized by your receivables, both set up a lockbox or controlled bank account where customer payments land, and both scale availability up and down as you invoice and collect. The difference comes down to balance-sheet treatment and how much of your business is being used as collateral. Factoring is a recurring sale of an asset — your invoices — so it does not show up on your balance sheet as debt and the lender mostly underwrites your customers, not you. ABL is a true debt line that sits on the balance sheet, blends underwriting between your AR and your other hard assets, and typically gives you more borrowing power per dollar of receivable because inventory and equipment can be folded in.\n\nThe short answer most prospects need: if your receivables are strong but your tax return is not, factoring is usually the right tool, because the factor is leaning on your customers\' credit rather than yours. If you have a meaningful inventory or equipment base alongside the AR, you can usually borrow more total dollars under ABL and read more like a bank line on your statements — at the cost of a longer underwrite and a more involved monthly borrowing-base certificate.\n\nNeither product is a sign of distress. Both are the standard answer when a growing company has outrun the bank box and needs more working capital than a traditional line can deliver.',
    featureRows: [
      {
        feature: 'Underwriting focus',
        productA: 'Your customers\' credit (and the invoice itself)',
        productB: 'Blended — your AR, your other assets, and your financials',
      },
      {
        feature: 'Balance-sheet treatment',
        productA: 'Off balance sheet — it is a sale, not debt',
        productB: 'On balance sheet — a true revolving debt facility',
      },
      {
        feature: 'Advance categories',
        productA: 'Receivables only (sometimes a small inventory add-on)',
        productB: 'AR + inventory + equipment + sometimes real estate',
      },
      {
        feature: 'Typical AR advance rate',
        productA: '75% – 95% of face value',
        productB: '70% – 90% of eligible AR',
      },
      {
        feature: 'Typical inventory advance',
        productA: 'Limited or none (rarely capped at 50% of eligible AR)',
        productB: '50% – 75% of liquidation value of finished goods',
      },
      {
        feature: 'Speed to first dollar',
        productA: '2–3 week setup, then 24–48 hours per invoice',
        productB: '4–8 weeks from term sheet to first draw',
      },
      {
        feature: 'Pricing (as of 2026)',
        productA: 'Prime + 1–6% plus 0.25–1% factor fee per invoice',
        productB: 'Prime + 1–5%, monthly interest only on drawn balance',
      },
      {
        feature: 'Reporting cadence',
        productA: 'Invoice upload (often daily) and aging report',
        productB: 'Weekly or monthly borrowing-base certificate',
      },
      {
        feature: 'Customer notification',
        productA: 'Yes — customers remit to a new lockbox account',
        productB: 'Yes, in most ABL structures — payments still route to a lockbox or DACA',
      },
      {
        feature: 'Best fit',
        productA: 'Loss tax return but strong B2B customers and growing sales',
        productB: 'Healthy financials, mixed asset base, want a single revolver',
      },
    ],
    whenToPickA: {
      narrative:
        'Pick factoring when the strongest thing on your balance sheet is your receivable — and especially when your tax return understates your real business. Factors are not really lending against you; they are buying your receivable at a small discount, and the credit risk they care about is your customer\'s ability to pay. That is the wedge. A staffing agency with three years of growth but a loss-year tax return cannot get a $2M bank line — but if the agency is invoicing creditworthy commercial customers on net-30 to net-60 terms, a factor will buy those invoices all day. The setup runs 2–3 weeks, advances on individual invoices clear in 24–48 hours, and the line scales automatically as you invoice more.\n\nFactoring also wins when AR is the only collateral story you have. There is no minimum inventory requirement, no equipment audit, no real-estate appraisal. The underwriting is the receivable itself — the verification call, the aging, and the customer\'s payment history. You do give up some flexibility: the factor sets up a separate lockbox so customer payments come straight to them, and you have to be comfortable with your customers knowing the bank account changed. In our experience most B2B customers do not notice or care. The notification letter goes to AP, they update the remittance, and life goes on.',
      bullets: [
        'Your tax return shows a loss but sales are growing and customers pay on time',
        'You are a staffing, commercial construction, manufacturing, or government-contracting business with net-30 to net-90 terms',
        'You do not have meaningful inventory or equipment to fold into the collateral pool',
        'You need the line to scale with sales without re-underwriting every quarter',
        'You are comfortable with customers remitting to a new lockbox account',
      ],
    },
    whenToPickB: {
      narrative:
        'Pick ABL when you have receivables and at least one other meaningful asset category — inventory at cost, equipment, sometimes commercial real estate — and the combined collateral pool lets you borrow more than a pure factoring line would deliver. ABL is also the right answer when balance-sheet optics matter: it reads as a debt facility, which is what investors, surety bond providers, and senior lenders expect to see on a growing company\'s statements. It is the standard replacement for a maxed-out bank line.\n\nThe trade-off is the underwrite. ABL closes in 4–8 weeks, not days, because the lender is sizing every collateral bucket — AR aging, inventory turn, equipment liquidation value — and building a borrowing base around them. After close, you supply a weekly or monthly borrowing-base certificate so the lender can track availability. That is more reporting than factoring requires, but you pay less per dollar borrowed (Prime + 1–5% vs. factoring\'s blended cost) and you get to count inventory and equipment toward your line, not just receivables. Most bank ABL desks start at $3–5M minimums, which is why deals below that threshold usually need an advisor with multiple non-bank ABL relationships.',
      bullets: [
        'You have $250K+ in AR plus inventory and/or equipment to pledge',
        'Your financials are clean enough to support a real debt facility',
        'You want a single revolver rather than stitching factoring + inventory + equipment',
        'You can wait 4–8 weeks to close in exchange for lower all-in cost',
        'Balance-sheet treatment as a credit line (not a sale) matters for your stakeholders',
      ],
    },
    workedExample: {
      scenario:
        'A $4MM commercial manufacturer with $800K in eligible AR (net-45 terms, blue-chip OEM customers), $600K in finished-goods inventory at cost, and $400K in free-and-clear production equipment needs a revolving facility to fund a 40% growth year.',
      math:
        'Factoring path: 85% advance on the $800K AR = $680K of working availability. Cost: roughly 1.5% per month all-in on drawn balance, with the line growing automatically as sales grow. Setup in 2–3 weeks.\n\nABL path: 85% on the $800K AR ($680K) plus 50% on the $600K inventory ($300K) plus 60% on the $400K of equipment ($240K) = $1.22MM of total availability. Cost: Prime + 2.5% on drawn balance. Close in 6–8 weeks plus a weekly borrowing-base certificate going forward.',
      takeaway:
        'Factoring is faster and works on the AR alone. ABL gives this borrower roughly 80% more total availability — $1.22MM vs. $680K — by folding inventory and equipment into the same revolver. For a company growing 40% with real inventory turn, that extra room is worth the extra four weeks of underwriting.',
    },
    mikeQuotes: [
      {
        quote:
          'factoring, invoice factoring, and asset-based lending are cousins. They both. Or created a revolving line that\'s collateralized by your AR, both can sometimes, oftentimes, also include an add-on piece for inventory, at a lower advance rate, and as a sort of a secondary to the AR, but meaning sometimes it\'s capped at 50% of eligible AR, etc. The difference is factoring is not, it\'s not an actual debt product, it doesn\'t show up on your balance sheet as debt. It is a recurring sale of an asset to the factory… ABL is very similar to that in most respects. They\'re still going to set up a separate lockbox, or a DACA, or a sweep account, but it is a true piece of debt on the balance sheet. It is a line where you supply either a weekly or a monthly borrowing-based certificate.',
        context:
          'Mike\'s side-by-side framing — the cleanest plain-English statement of how these two products relate.',
      },
      {
        quote:
          'the lender sets up what\'s called a lockbox. It\'s like a different bank account that the payments will go to that account. So you would inform your customers, look, starting on January the 23rd or whenever…please remit payments over here to this Bank of America account… So it\'s not like you\'re making payments to the line. The payments come right into them and it immediately pays down… more availability is, the availability rises for you. It\'s almost like water in a cup, you know. It\'s like as, as they pay down the line, it fills up again and you can borrow down again as you need to.',
        context:
          'Mike\'s water-in-a-cup analogy for how the revolving mechanic actually works — applies equally to factoring and ABL.',
      },
      {
        quote:
          'factors don\'t take personal credit into account very much they\'re because they\'re getting there they\'re relying on the strength of the receivable… in the case. In of these cash flow-based underwriting models, revenue-based, you know, and so forth, which MCAs fall into that world, too, credit score, it does matter a lot, a lot more so than in asset-based lending.',
        context:
          'Mike on the underwriting difference — why factoring works for borrowers whose own credit story is imperfect.',
      },
    ],
    faqs: [
      {
        question: 'Will my customers know I am using factoring or ABL?',
        answer:
          'Yes, in most structures. Both products set up a lockbox (or a DACA / controlled bank account in the ABL case), and customers receive a notification letter telling them to remit payments to the new account. In practice your AP contact updates the remittance and life goes on — the lender will also place a verification call or two at the start of the relationship to confirm the invoice is real. Mike\'s framing on this exact question: "they\'ll make a few phone calls to verify at the very beginning of the relationship… because I can make an invoice today, right, for whatever amount, and it\'s a piece paper, worth nothing."',
      },
      {
        question: 'Why does factoring not show up as debt?',
        answer:
          'Because it is structured as a recurring sale of an asset, not a loan. The factor buys your invoice at a discount; you assign the receivable to them; they collect from your customer; and the difference between face value and what they paid you is their margin. There is no principal balance accruing interest on your balance sheet. ABL is the opposite — it is a true revolving line of credit, so the drawn balance is reported as debt and the lender wants a weekly or monthly borrowing-base certificate to track availability.',
      },
      {
        question: 'Can I borrow against inventory under a factoring line?',
        answer:
          'Sometimes, but it is usually small and secondary. Most factors will fold in an inventory advance as an add-on to the AR line, often capped at 50% of eligible AR rather than priced as a separate inventory facility. If inventory is a meaningful piece of your collateral story, ABL is structurally the better tool — the lender will size a real inventory bucket (typically 50–75% advance on liquidation value of finished goods) inside the same revolver as the AR.',
      },
      {
        question: 'How fast can I get money under each one?',
        answer:
          'Factoring setup runs 2–3 weeks, and once the line is live each invoice you upload typically funds in 24–48 hours. ABL takes 4–8 weeks to close because the lender is underwriting multiple asset categories at once and building a borrowing base around them. If speed is the binding constraint, factoring almost always wins; if availability and cost matter more than the next four weeks, ABL is usually the better tool.',
      },
      {
        question: 'What does each one actually cost in 2026?',
        answer:
          'Factoring is typically priced at Prime + 1–6% on the drawn balance, plus a factor fee of roughly 0.25%–1% per invoice. Blended all-in cost on a well-run facility runs 1–1.5% per month. ABL is priced at Prime + 1–5% as straight interest on the drawn balance with no per-invoice fee, so for the same average drawn balance ABL tends to cost a half-point to a full point less per year. The wedge widens as the facility scales.',
      },
      {
        question: 'Can I start with one and graduate to the other?',
        answer:
          'Yes, and we see this regularly. A growing company will start on factoring while the tax returns catch up to current revenue, then refinance into ABL once the financials support a true debt facility. The lockbox infrastructure largely transfers, customers are already trained to remit to a lockbox, and the AR aging and customer-payment data the factor has built up makes the ABL underwrite materially easier.',
      },
      {
        question: 'My bank says they have an ABL desk. Should I just go there?',
        answer:
          'If your facility is $3–5M or larger and your financials are clean, a bank ABL desk is often the cheapest answer and you should pursue it. Bank ABL desks rarely look at deals below $3M, though, and they are stricter on financial covenants than non-bank ABL lenders. For deals in the $250K–$3M range, or for borrowers whose financials are growing into the credit box rather than already sitting in it, non-bank ABL lenders and factors are typically where the deal actually closes.',
      },
    ],
    relatedSolutions: ['invoice-factoring', 'asset-based-lending', 'inventory-financing'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SBA LOAN vs WORKING CAPITAL LOAN — cheap-but-slow vs fast-but-expensive
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'sba-loan-vs-working-capital-loan',
    title: 'SBA Loan vs Working Capital Loan',
    subtitle: 'The cheapest capital small businesses can get versus the fastest. Both are real answers — but rarely to the same question.',
    excerpt:
      'SBA loans are the cheapest small-business capital out there at Prime + 2–3%. Working capital loans fund in days at 1.25–4% per month. Here is how to choose.',
    productA: {
      solutionId: 'sba-loans',
      name: 'SBA 7(a) Loan',
      positioning:
        'Government-guaranteed bank loan. Cheapest capital most small businesses will ever access, in exchange for the longest underwrite.',
      speed: '4–12 weeks to close',
      cost: 'Prime + 2–3% (variable, capped by SBA)',
      range: '$250K – $5MM+',
      collateral: 'Blanket UCC, personal guarantee, often real-estate or home-equity lien',
    },
    productB: {
      solutionId: 'working-capital-loans',
      name: 'Working Capital Loan (Revenue-Based)',
      positioning:
        'Fast, monthly-payment financing underwritten to your bank deposits. The closest competitor to an MCA, at roughly half the cost.',
      speed: '2–10 business days',
      cost: '1.25%–4% per month (18%–48% APR equivalent)',
      range: '$100K – $10M+',
      collateral: 'None — revenue-based underwriting',
    },
    introduction:
      'An SBA 7(a) loan and a working capital loan solve the same general problem — a business that needs cash to grow or stabilize — but they sit at opposite ends of the speed/cost trade-off. The SBA loan is the cheapest dollar a small business will typically ever borrow: government-guaranteed, capped at Prime + 2–3%, amortized over up to 10 years for working capital and 25 years for real estate. The cost of that price is time. Expect 4–12 weeks to close, two years of clean financial statements, complete personal financial disclosures, and in most cases a lien on your home or other personal assets.\n\nA working capital loan inverts every one of those trade-offs. The underwriting is done off your last 3–6 months of bank statements, the term is short (6–24 months), payments are monthly, the rate is 1.25%–4% per month rather than per year, and the money is in your account in 2–10 business days. There is no SBA paperwork, no two-year financial review, no home lien.\n\nThe short answer: if you can wait, take the SBA every time — the rate alone justifies the patience. If you cannot wait, or the bank has already passed because your financials do not fit their credit box, a working capital loan is the structurally honest fast option. It is not cheap. It is also not predatory the way a daily-pull MCA can be — the monthly payment structure keeps cash flow predictable, which is the difference that matters.',
    featureRows: [
      {
        feature: 'Time to fund',
        productA: '4–12 weeks (sometimes longer)',
        productB: '2–10 business days',
      },
      {
        feature: 'Pricing (as of 2026)',
        productA: 'Prime + 2–3% annually (variable, SBA-capped)',
        productB: '1.25%–4% per month (roughly 18%–48% APR equivalent)',
      },
      {
        feature: 'Amortization',
        productA: 'Up to 10 years working capital, 25 years real estate',
        productB: '6–24 months typical, fully amortizing',
      },
      {
        feature: 'Underwriting basis',
        productA: 'Two years of financials, tax returns, personal credit, asset review',
        productB: 'Last 3–6 months of business bank statements, revenue trend',
      },
      {
        feature: 'Personal guarantee',
        productA: 'Always, plus often a home or real-estate lien',
        productB: 'Personal guarantee typical, no real-estate lien',
      },
      {
        feature: 'Use of funds',
        productA: 'Working capital, equipment, real estate, acquisitions',
        productB: 'Working capital, payroll, inventory, seasonal gaps',
      },
      {
        feature: 'Loan size',
        productA: '$250K – $5MM (7(a) cap is $5MM)',
        productB: '$100K – $10M+',
      },
      {
        feature: 'Prepayment',
        productA: 'Prepayment penalties on loans > 15 years',
        productB: 'Often early-payoff discounts (interest forgiveness on prepay with some lenders)',
      },
      {
        feature: 'Best fit',
        productA: 'Profitable business with 2+ years of clean financials and time to wait',
        productB: 'Business with strong revenue but bank just said no, or needs cash this month',
      },
    ],
    whenToPickA: {
      narrative:
        'Pick an SBA loan when the math of the rate matters more than the speed of the close. The SBA 7(a) is the cheapest capital most small businesses will ever access — Prime + 2–3%, amortized over up to a decade — and on a multi-year hold the difference between SBA pricing and revenue-based pricing is enormous. A $1MM SBA loan at Prime + 2.5% over 10 years costs a fraction of the same $1MM borrowed at 2% per month for 18 months and then refinanced. If the use of funds is acquisition, real estate, or a capital expenditure with a long payback, SBA is almost always the right answer.\n\nThe price of that rate is patience and paperwork. Expect 4–12 weeks to close, sometimes longer if the deal involves real estate. You will need two years of business tax returns, two years of personal tax returns, year-to-date financials, a personal financial statement from every 20%+ owner, and in most cases a lien on your home or other personal real estate. SBA Express (loans of $500K and below) moves faster, and there are non-bank SBA lenders that will sometimes find structures without a home lien — but the underwriting depth is the same. If the business is not yet two years old, has loss years on the tax return, or the owner cannot pledge personal real estate, the SBA path usually does not work.',
      bullets: [
        'You have 2+ years of profitable financials and clean tax returns',
        'You can wait 4–12 weeks for the cheapest available capital',
        'The use of funds has a long payback — acquisition, real estate, equipment, recapitalization',
        'You are willing to put a personal guarantee and (often) a home lien against the deal',
        'You want the longest amortization possible to keep monthly debt service down',
      ],
    },
    whenToPickB: {
      narrative:
        'Pick a working capital loan when speed is the binding constraint, or when your financials do not yet fit a bank or SBA credit box. The underwriting is done off your bank statements, not your tax return, which is exactly why it funds in days when a bank would take weeks. That same speed is also the trade-off: the rate is 1.25%–4% per month, not per year, and the term is short (6–24 months typical) with fixed monthly payments.\n\nThe most important thing to understand about this product is that it is structurally safer than a merchant cash advance even though it sits in roughly the same speed-and-cost neighborhood. MCAs pull payments daily out of your operating account; working capital loans bill monthly. That single difference — monthly vs. daily — is the difference between a product you can manage and a product that erodes cash flow every business day. At the same speed as an MCA, a well-structured working capital loan typically costs roughly half as much because the payment is monthly rather than a daily extraction from sales. Use this product the way you would use any short-term loan: with a clear use of funds, a clear payback plan, and a refinance strategy if the use of funds turns into a longer-term need.',
      bullets: [
        'You need money in days, not weeks',
        'Your bank line is maxed but revenue is trending up',
        'You want a fixed monthly payment, not daily MCA-style extractions',
        'Your last 3–6 months of bank statements tell a stronger story than your tax return',
        'The use of funds has a near-term payback (inventory, payroll, a contract about to close)',
      ],
    },
    workedExample: {
      scenario:
        'A $3.5MM regional services business needs $750K to fund a contract that just closed. The business is profitable, has two years of clean financials, and the owner has a home with roughly $400K of equity.',
      math:
        'SBA 7(a) path: $750K at Prime + 2.5% (assume 10.5% all-in in 2026) amortized over 10 years ≈ $10,100 per month in P&I, total interest over the life of the loan ~$462K. Close in 8–10 weeks. Lien on the home likely required.\n\nWorking capital loan path: $750K at 1.75% per month (interest on declining balance, 18-month amortization) ≈ $48,800 per month in P&I, total interest cost ~$128K, no real-estate lien.\n\nA note on rate format: working capital loans are quoted as a monthly rate rather than APR because the term is short and the comparison is only honest on the actual monthly payment schedule. 1.75% per month on declining balance annualizes to roughly 23% APR effective. Confirm with your term sheet whether the rate is interest on declining balance or a flat fee on the original principal — the same headline number means very different total cost under each.',
      takeaway:
        'For a contract with a 60–90 day payback, the working capital loan funds in time to actually capture the contract — that is the whole point. For a recapitalization or longer-term growth use, the SBA loan costs four times less per dollar borrowed over the life of the deal. Pick the product that matches the timeline of the use of funds, not the urgency of the moment.',
    },
    mikeQuotes: [
      {
        quote:
          'there\'s a solid chance that we can get you one of these very, very SBA-like deals, 10-year. You probably wouldn\'t need an SBA. technically an SBA, because, but it\'ll be, there might be priced a point higher, but they\'re still going to be kind of like prime plus a cut, you know?',
        context:
          'Mike explaining the non-bank SBA-like product — same long amortization, slightly higher rate, less paperwork.',
      },
      {
        quote:
          'I want to explore with several non-bank SBA lenders because they have some more flexibility and potentially find one that, you know, that sees enough value in the business assets of the two businesses combined to be able to do it without, you know, without having to take a lien on any personal properties.',
        context:
          'Mike, on an HVAC-acquisition call, framing how a non-bank SBA lender can sometimes structure around a home lien.',
      },
      {
        quote:
          'I don\'t think we would be trying to beat that from a cost. What we\'re going to deliver is going to be a higher cost of capital, which will come with more flexibility, you know, there\'s no two ways about it.',
        context:
          'Mike being direct about the trade-off when a borrower has a real bank or SBA offer in hand: cheaper bank capital wins on cost, working capital wins on speed and flexibility.',
      },
    ],
    faqs: [
      {
        question: 'Can I do both at the same time?',
        answer:
          'Yes, and we see this regularly. Run the SBA application in the background, take a working capital loan now to fund the immediate need, and refinance into the SBA when it closes. The working capital loan typically has no prepayment penalty (some lenders even offer interest forgiveness on prepay), so the only cost is the months of interest you actually use. The math has to work — the cost of the bridge has to be smaller than the cost of waiting for the SBA — but on the right deal this is a clean stack.',
      },
      {
        question: 'Will the SBA take a lien on my house?',
        answer:
          'In most cases, yes — if you have available equity in personal real estate, the SBA generally expects it to be pledged. There are exceptions: non-bank SBA lenders sometimes find structures where the business assets alone carry the deal, especially in acquisition cases where the combined business assets of the buyer and the target are substantial. If a home lien is a hard no for you, say so at the start; it changes the lender shortlist materially.',
      },
      {
        question: 'Why is a working capital loan priced per month and not per year?',
        answer:
          'Because the term is short and the underwriting is done off recent bank activity rather than years of financials. Monthly pricing is also how the product is structurally honest about what it is — a short-term loan you should pay off in 6–24 months, not a 10-year facility. If you annualize 1.25%–4% per month, the APR equivalent is roughly 18%–48%. That is more expensive than an SBA loan and less expensive than almost any MCA.',
      },
      {
        question: 'Is a working capital loan the same as an MCA?',
        answer:
          'No, and the difference matters more than the names suggest. An MCA pulls a fixed daily or weekly amount directly out of your operating account, which means every business day there is a hit to cash flow whether you had a strong sales day or not. A working capital loan is structured as a term loan with a fixed monthly payment — predictable, manageable, and you can plan a payroll cycle around it. At roughly the same funding speed, a well-structured working capital loan costs about half what a comparable MCA does in true APR terms.',
      },
      {
        question: 'How long does the SBA actually take?',
        answer:
          'The honest answer is: depends on the lender, the program, and the completeness of the file. SBA Express (loans of $500K and below) can close in 4–6 weeks. A standard 7(a) for a $1–3MM working-capital deal runs 6–10 weeks. A 7(a) with a real-estate component or an SBA 504 typically runs 10–16 weeks. The fastest closes are the ones where the borrower has every document ready on day one.',
      },
      {
        question: 'Can I refinance MCA debt with an SBA loan?',
        answer:
          'Sometimes, but the SBA has specific rules about refinancing existing debt — generally the debt has to be in good standing, the new SBA loan has to provide a meaningful improvement in terms, and the original loan typically has to have been for a permissible SBA use. Stacked MCAs are often hard to refinance directly into an SBA loan; a more common path is to consolidate the MCAs into a working capital loan or asset-based facility first, get 12 months of clean payments, then refinance the consolidated loan into the SBA.',
      },
      {
        question: 'Which one should I shop first?',
        answer:
          'If you have time and clean financials, shop the SBA first — you will not find cheaper capital anywhere else. If you do not have time, or if the bank has already passed, shop the working capital loan and keep the SBA option alive in the background. Mike\'s posture on a real bank or SBA offer is consistent: if the bank price is cheaper, take the bank. Working capital is the answer when speed or fit makes the cheaper option unavailable.',
      },
    ],
    relatedSolutions: ['sba-loans', 'working-capital-loans', 'debt-refinance'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. WORKING CAPITAL LOAN vs LINE OF CREDIT — lump sum vs revolving draw
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'working-capital-loan-vs-line-of-credit',
    title: 'Working Capital Loan vs Line of Credit',
    subtitle: 'One funds a single use at a fixed monthly payment. The other lets you draw against availability as needs come up. The right answer depends on the shape of the cash gap.',
    excerpt:
      'A working capital loan is a one-shot lump sum on a monthly payment. A line of credit revolves so you only pay for what you draw. Here is how to choose.',
    productA: {
      solutionId: 'working-capital-loans',
      name: 'Working Capital Loan',
      positioning:
        'A lump-sum term loan with a fixed monthly payment. Fast, simple, structured for a specific use of funds with a clear payback.',
      speed: '2–10 business days',
      cost: '1.25%–4% per month (18%–48% APR equivalent)',
      range: '$100K – $10M+',
      collateral: 'None — revenue-based',
    },
    productB: {
      name: 'Revolving Line of Credit',
      positioning:
        'A pool of approved capital you draw against as needed. Pay interest only on what is outstanding; redraw as the line refills.',
      speed: '2–4 weeks for non-bank revolving; 4–8 weeks for bank LOC',
      cost: 'Prime + 2–8% on drawn balance (varies by lender type)',
      range: '$100K – $25M+',
      collateral: 'Varies — revenue-based, AR-backed, or blanket UCC depending on structure',
    },
    introduction:
      'A working capital loan and a line of credit are both general-purpose answers to a working-capital gap, but they have very different shapes. A working capital loan is a single lump sum that lands in your account on day one and amortizes back over a fixed term, typically 6–24 months, on a fixed monthly payment. You take it, you use it, you pay it back. A line of credit is a pool of approved capital that sits there available; you draw against it as needs come up, you only pay interest on what is currently outstanding, and as you pay it down the availability refills — what Mike calls "water in a cup."\n\nThe short decision: if you have one clear use of funds with a clear payback (a contract about to close, a six-month inventory build, a known seasonal spike), a working capital loan is simpler and cheaper than carrying an unused line. If your cash needs are episodic — payroll some weeks, vendor payments other weeks, an unpredictable rhythm of working-capital gaps — a line of credit costs less in aggregate because you are not paying interest on dollars you are not currently using.\n\nLines of credit also come in two flavors that matter for this comparison. A traditional bank or non-bank revolver sits there indefinitely and gets renewed annually. A revenue-based revolving line is the fast-funding cousin — typically a non-bank product, available in 2–4 weeks, priced higher than a bank line but lower than a working capital loan if you actually use it lightly.',
    featureRows: [
      {
        feature: 'Structure',
        productA: 'One-time lump sum, monthly amortization',
        productB: 'Revolving pool — draw, pay down, redraw',
      },
      {
        feature: 'Interest you pay',
        productA: 'On the full original balance for the life of the term',
        productB: 'Only on the currently drawn balance',
      },
      {
        feature: 'Speed to first dollar',
        productA: '2–10 business days',
        productB: '2–4 weeks (non-bank revolver) or 4–8 weeks (bank LOC)',
      },
      {
        feature: 'Pricing (as of 2026)',
        productA: '1.25%–4% per month on the original balance',
        productB: 'Prime + 2–8% per year on drawn balance',
      },
      {
        feature: 'Typical term',
        productA: '6–24 months, fully amortizing',
        productB: '12 months renewable, often multi-year',
      },
      {
        feature: 'Best for',
        productA: 'One known use of funds with a clear payback timeline',
        productB: 'Recurring, episodic, or unpredictable working-capital needs',
      },
      {
        feature: 'Carrying cost when unused',
        productA: 'N/A — you got the lump sum on day one',
        productB: 'Sometimes a small unused-line fee; usually zero',
      },
      {
        feature: 'Underwriting',
        productA: 'Bank statements, revenue trend',
        productB: 'Bank statements + revenue (RBF revolver) or AR/assets (ABL revolver)',
      },
    ],
    whenToPickA: {
      narrative:
        'Pick a working capital loan when you can name the use of funds in one sentence and the payback timeline in another. A contract just closed and you need $400K to fund delivery. A specific inventory build needs $250K over four months and recovers as sales come in. Payroll needs to be covered for two months while a slow-paying customer catches up. In all of these cases, the math is clean: take a lump sum, deploy it, pay it back on a monthly schedule that fits the recovery curve of the use of funds. The simplicity is the product.\n\nThe other reason to pick a working capital loan is speed. A line of credit — even a fast revenue-based revolver — typically takes 2–4 weeks to set up. A working capital loan can be funded in 2–10 business days. If the use of funds has a deadline (a vendor needs to be paid Friday, a contract needs material ordered next week), the lump-sum product is the only realistic option. The trade-off is that you pay interest on the full balance from day one — there is no concept of "I only need half of it for the first month." You took the whole thing; you pay on the whole thing.',
      bullets: [
        'You can name the use of funds and the payback timeline in one sentence each',
        'You need the money in days, not weeks',
        'The recovery curve of the use of funds matches a 6–24 month amortization',
        'You want a fixed monthly payment with no draw discipline required',
        'You do not need ongoing availability after the use of funds is done',
      ],
    },
    whenToPickB: {
      narrative:
        'Pick a line of credit when your cash-flow shape is episodic rather than event-driven. Payroll Fridays where deposits run a little behind. Vendor payment days where you front the cash before customer payments land. A seasonal business that ramps inventory in Q3 and unwinds it in Q4. In these cases, you are not solving a single problem — you are smoothing a recurring rhythm — and the right tool is a pool of capital you can draw against as needs come up, only paying interest on what is currently out.\n\nThe key discipline of a line of credit is that you have to actually pay it down when you have cash. The water-in-a-cup mechanic only works if you keep refilling the cup. Borrowers who treat a line as a permanent draw end up paying full-balance interest indefinitely and lose the entire structural advantage. The product rewards borrowers who use it the way it was designed: in and out. For businesses with strong AR, an AR-backed revolver (factoring or ABL) is typically the cheapest version of this product. For businesses without strong AR — services firms, SaaS, recurring-revenue businesses — a revenue-based revolving line is the non-bank alternative, sized at roughly 10–15% of annual revenue, priced higher than a bank line but available in 2–4 weeks.',
      bullets: [
        'Your working-capital gaps are episodic, not one-time',
        'You have the discipline to pay the line down between draws',
        'You want to only pay interest on what is currently outstanding',
        'You can wait 2–8 weeks to set up the facility',
        'You have AR, assets, or revenue history to underwrite a real revolver',
      ],
    },
    workedExample: {
      scenario:
        'A $2.8MM HVAC contractor has seasonal payroll spikes — three months a year where weekly payroll runs roughly $80K higher than non-peak season. Total seasonal need is about $240K above the trough, but the contractor only needs all of it for about six weeks.',
      math:
        'Working capital loan path: $300K lump sum at 1.75% per month (interest on declining balance, 12-month amortization) ≈ $28,000 per month in P&I, total interest cost ~$42K. Even though peak need is six weeks, the loan terms force the cash out of the business in fixed monthly payments for the full year.\n\nLine of credit path: $300K revolver at Prime + 5% (assume 13% APR in 2026). Interest accrues only on the outstanding balance: about $3,250 per month while fully drawn, zero when paid down. If average utilization is roughly $90K over the year (six weeks fully drawn, the rest at zero), annual interest cost is around $11,700.\n\nThe comparison holds because the LOC lets the contractor pay down between peaks. If utilization were continuous, the LOC at ~13% APR would still beat the loan at ~23% APR effective — just by a narrower margin.',
      takeaway:
        'For an episodic cash-flow shape, the line of credit ends up costing roughly a quarter of the lump-sum loan — not because the rate is dramatically better, but because the line stops charging interest the moment the cash isn\'t needed. Flip the scenario to a single $300K equipment purchase with a 12-month payback and the lump-sum loan is the better structural fit: at continuous utilization, the rate advantage of the line narrows, and the predictability of fixed monthly payments matters more.',
    },
    mikeQuotes: [
      {
        quote:
          'the lender sets up what\'s called a lockbox. It\'s like a different bank account that the payments will go to that account. So you would inform your customers, look, starting on January the 23rd or whenever…please remit payments over here to this Bank of America account… So it\'s not like you\'re making payments to the line. The payments come right into them and it immediately pays down… more availability is, the availability rises for you. It\'s almost like water in a cup, you know.',
        context:
          'Mike\'s water-in-a-cup analogy for how a revolving line actually works — applies whether the line is factoring, ABL, or a revenue-based revolver.',
      },
      {
        quote:
          'there\'s a great lender that we have that does a revolving line and go up to 350k, which is usually one of my gripes about them that I wish they did a bigger… their rate is actually lower, like their true APR rate is like in the mid teens. So it\'s actually even lower than 2% a month.',
        context:
          'Mike on the non-bank revenue-based revolver — fast to set up, priced between a bank line and a working capital loan, sized to about 10–15% of annual revenue.',
      },
      {
        quote:
          'In that case, we\'d be looking at more of like a revenue-based – in other words, underwritten cash flows, not tied to a specific asset such as AR, but like a revenue-based revolving line. We have a great lender that will probably qualify you, maybe $100,000 to $150,000, they\'re generally going to go kind of 10% to 15%, maybe pushing 20%, but more like 10% to 15% of annual revenues.',
        context:
          'Mike explaining how a revenue-based revolver gets sized when there is no AR to anchor the underwriting.',
      },
    ],
    faqs: [
      {
        question: 'If a line of credit is cheaper, why would I ever take the lump-sum loan?',
        answer:
          'Speed and simplicity. A working capital loan funds in 2–10 business days; a line of credit typically takes 2–4 weeks (non-bank revolver) or 4–8 weeks (bank or ABL revolver). If the use of funds has a deadline, the lump-sum product is often the only option. The line also requires discipline: you only realize its cost advantage if you actually pay it down between draws. Borrowers who carry a full balance indefinitely lose the structural benefit of the revolver.',
      },
      {
        question: 'Can I have both?',
        answer:
          'Yes, and it is a common stack for businesses with both an event-driven need and a recurring rhythm. Take a working capital loan to fund the one-time event (a contract, an acquisition, a recapitalization) and keep a smaller line of credit available for the everyday smoothing. The two products serve different purposes and rarely conflict at the lender level — though if both are non-bank you will want to make sure no UCC priority issues create a problem.',
      },
      {
        question: 'How big a line of credit can I expect to qualify for?',
        answer:
          'It depends on the underwriting type. A revenue-based revolver typically sizes at 10%–15% of trailing annual revenue, sometimes up to 20%. An AR-backed revolver (factoring or ABL) sizes based on your eligible receivables, which can be far larger — 75%–95% of qualified AR. An equipment- or asset-backed revolver sizes off the liquidation value of the pledged collateral.',
      },
      {
        question: 'What happens if I draw the whole line and never pay it down?',
        answer:
          'You end up effectively paying for a term loan at line-of-credit pricing, which is usually fine but means you have lost the structural advantage of the revolver. Most lenders will flag a fully-drawn line that does not move and ask questions at renewal. If the use of funds turned into a permanent need, the honest conversation is to refinance the drawn balance into a term loan and reset the line for episodic use.',
      },
      {
        question: 'Does the line of credit show up on my balance sheet?',
        answer:
          'Yes, the drawn balance appears as debt. The undrawn portion is generally a disclosure rather than a liability on the face of the statements. This is different from factoring, which is structured as a sale and does not appear as debt at all; if balance-sheet treatment matters to you, factor that into the choice between products.',
      },
      {
        question: 'Can I prepay a working capital loan early without penalty?',
        answer:
          'Most reputable non-bank working-capital lenders allow prepayment without penalty, and a meaningful subset offer interest forgiveness on prepay — meaning if you pay off the loan early you get a discount on the remaining interest charges. Always confirm prepay terms in writing before signing. If a lender will not put the prepay terms in writing, that is a sign you are not dealing with the right lender.',
      },
      {
        question: 'Is a credit-card line the same as a business line of credit?',
        answer:
          'No. A business credit card is unsecured personal-credit-driven revolving capital at consumer-style rates (often 20%+ APR), with credit limits typically capped at $50K–$100K. A real business line of credit is underwritten to the business — revenue, AR, or assets — sized in the hundreds of thousands to tens of millions, and priced in the Prime + 2–8% range. For anything beyond minor expense smoothing, the business line of credit is the right tool.',
      },
    ],
    relatedSolutions: ['working-capital-loans', 'asset-based-lending', 'invoice-factoring'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. BRIDGE LOAN vs TERM LOAN — short-term gap vs permanent debt
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'bridge-loan-vs-term-loan',
    title: 'Bridge Loan vs Term Loan',
    subtitle: 'A bridge loan exits on a specific event. A term loan lives on your balance sheet for years. Different tools for different timelines.',
    excerpt:
      'A bridge loan covers a specific timing gap and exits in 30–180 days. A term loan amortizes over 3–7 years. Here is how to choose between them.',
    productA: {
      solutionId: 'bridge-funding',
      name: 'Bridge Loan',
      positioning:
        'Short-term, often interest-only capital that exits when a specific event closes — a contract, an acquisition, a property sale.',
      speed: '3–7 business days',
      cost: 'Prime + 4–8% (annualized; effective cost lower if paid off early)',
      range: '$50K – $5MM+',
      collateral: 'Often the exit asset itself; sometimes unsecured for shorter terms',
    },
    productB: {
      name: 'Term Loan',
      positioning:
        'Permanent structured debt with full principal-and-interest amortization over 3–7 years. The standard answer when the use of funds has a long payback.',
      speed: '3–8 weeks',
      cost: 'Prime + 2–6% for non-SBA; lower for SBA 7(a) at Prime + 2–3%',
      range: '$100K – $25M+',
      collateral: 'Blanket UCC, personal guarantee, often specific asset lien',
    },
    introduction:
      'A bridge loan and a term loan look similar on the surface — both lump sums, both with a monthly payment, both unsecured-to-lightly-secured. The structural difference is the exit. A bridge loan is built to be paid off in 30–180 days when a specific event closes: a property sale, an acquisition, a contract payment, a permanent loan funding behind it. It is interest-only for most of its life, has aggressive early-payoff discounts so you only pay interest for the days you actually use the money, and the underwriter is mostly asking "what is the exit and how confident am I in it?"\n\nA term loan is built to live on your balance sheet for years. Three to seven year amortization, full principal-and-interest payments, the lender is underwriting your ability to service the debt out of operating cash flow over the entire term. The use of funds is something with a long payback — equipment, acquisition, recapitalization, multi-year growth investment — and the right way to think about the rate is the lifetime cost over the full amortization, not the monthly payment.\n\nThe short answer: if you can name the exit event and its expected close date, a bridge loan is the right tool because you only pay for the months you actually use. If the use of funds has a payback measured in years rather than months, a term loan is structurally cheaper because you spread the cost across the timeline of the recovery.',
    featureRows: [
      {
        feature: 'Term',
        productA: '30–180 days typical, sometimes up to 12 months',
        productB: '3–7 years (longer for SBA or real estate)',
      },
      {
        feature: 'Payment structure',
        productA: 'Interest-only with balloon at exit',
        productB: 'Fully amortizing principal and interest',
      },
      {
        feature: 'Speed to fund',
        productA: '3–7 business days',
        productB: '3–8 weeks',
      },
      {
        feature: 'Pricing (as of 2026)',
        productA: 'Prime + 4–8% annualized; aggressive early-payoff discounts',
        productB: 'Prime + 2–6% (non-SBA); Prime + 2–3% (SBA 7(a))',
      },
      {
        feature: 'How rate is best evaluated',
        productA: 'Total dollars paid over the actual holding period',
        productB: 'Lifetime cost over the full amortization',
      },
      {
        feature: 'Use of funds',
        productA: 'Timing gaps, acquisition bridge, contract pre-funding, permanent-loan bridge',
        productB: 'Equipment, acquisition, recapitalization, long-payback growth',
      },
      {
        feature: 'Exit',
        productA: 'A specific named event — sale, refinance, contract payment',
        productB: 'Amortizes to zero over the term',
      },
      {
        feature: 'Loan size',
        productA: '$50K – $5MM+',
        productB: '$100K – $25M+',
      },
    ],
    whenToPickA: {
      narrative:
        'Pick a bridge loan when you can name the exit and the expected close date. Mike\'s frame on this is exact: it is "means to an end" capital. You take a higher annualized rate because the actual holding period is short, the use of funds is specific, and the math works as soon as you measure it against the right timeframe. Six or seven percent annualized sounds horrible until you realize the loan is outstanding for two months — at which point the actual dollar cost is a small fraction of the deal it is enabling.\n\nThe classic uses are acquisition timing gaps (you have a closing date but a working-capital piece is not in place yet), permanent-loan bridges (the long-term financing is approved but cannot fund for six weeks), contract pre-funding (the contract has a payment milestone but you need to fund delivery first), and seasonal timing gaps. The bridge underwriter cares about exactly one thing: is the exit real, and how confident am I in the date? Bring documentation of the exit event — the term sheet on the permanent loan, the executed contract, the property sale agreement — and the structuring conversation gets fast.',
      bullets: [
        'You can name the exit event and its expected close date',
        'The use of funds has a payback measured in days or months, not years',
        'You want interest-only payments until the exit',
        'You want the option of an early-payoff discount if the exit closes faster than planned',
        'Speed matters — you need the money in days, not weeks',
      ],
    },
    whenToPickB: {
      narrative:
        'Pick a term loan when the use of funds has a long-tail payback and there is no specific exit event. Buying equipment that will produce revenue for five years. Funding an acquisition that will generate cash flow indefinitely. Recapitalizing the balance sheet so the business runs on a healthier debt structure. In all of these cases, the right way to spread the cost is over the timeline of the recovery, which is what a term loan does: full P&I amortization over three to seven years, fixed monthly payment, predictable budgeting.\n\nThe right comparison for term-loan pricing is the lifetime cost over the full amortization, not the monthly payment. A $1MM term loan at Prime + 4% over five years has a meaningfully different total cost than the same loan at Prime + 3% over seven years, even if the monthly payment on the longer term feels easier. Match the amortization to the recovery curve of the use of funds. Equipment that produces revenue for five years should be financed over roughly five years, not 18 months — financing it short forces the business to absorb the full cost on its operating cash flow before the asset has finished paying for itself.',
      bullets: [
        'The use of funds has a multi-year payback — equipment, acquisition, recapitalization',
        'There is no specific exit event you can underwrite around',
        'You want a predictable fixed monthly payment for years',
        'You can wait 3–8 weeks to close in exchange for lower lifetime cost',
        'The amortization can be matched to the recovery curve of the asset or use',
      ],
    },
    workedExample: {
      scenario:
        'A growing professional-services firm wins a $2MM contract that requires $400K of upfront staffing and licensing costs. The first contract payment is scheduled for 75 days after work begins.',
      math:
        'Bridge loan path: $400K bridge at 7% annualized, interest-only, 90-day term. Total interest cost over 90 days: roughly $7,000. The bridge is paid off in full when the first contract payment lands.\n\nTerm loan path: $400K term loan at Prime + 4% (assume 12% in 2026) amortized over 36 months. Monthly P&I: roughly $13,300. Total interest cost over 36 months: roughly $78,000.',
      takeaway:
        'For a use of funds with a known 75–90 day payback, the bridge loan costs about a tenth of what the term loan would cost over its full life — because the bridge exits as soon as the contract payment arrives, and the term loan keeps amortizing for 36 months on a need that disappeared after three. Flip the scenario to a $400K equipment purchase that will produce revenue for five years and the term loan wins decisively because the bridge would need to be refinanced into something longer anyway.',
    },
    mikeQuotes: [
      {
        quote:
          'we can get you short-term bridge money to fill orders that you\'re going to pay a higher rate from an annual standpoint than you would like to probably, but when you understand how it\'ll function, because it\'ll function like a line of credit where you can pay it off in two months, and you will have paid a total of 6%, 7% annualized, that sounds horrible, but if it\'s a means to an end until we clean up your balance sheet to go, okay, I\'ll give up 6% on my 66% margin, or whatever it is, these orders out the door to get this moving.',
        context:
          'Mike framing bridge capital as "means to an end" — the rate looks high annualized, but the actual dollar cost over a 60–90 day holding period is small relative to the deal it is enabling.',
      },
      {
        quote:
          'there\'s a solid chance that we can get you one of these very, very SBA-like deals, 10-year. You probably wouldn\'t need an SBA. technically an SBA, because, but it\'ll be, there might be priced a point higher, but they\'re still going to be kind of like prime plus a cut, you know?',
        context:
          'Mike framing the non-bank term-loan side — long amortization, slightly higher rate than SBA, but built to live on the balance sheet for years.',
      },
      {
        quote:
          'I\'d rather under promise and over deliver and not the other way around, if you know what I mean.',
        context:
          'Mike\'s standard posture on every bridge deal: he will not promise an exit date he is not confident the lender can deliver, because a bridge whose exit slips becomes a structural problem rather than a timing solution.',
      },
    ],
    faqs: [
      {
        question: 'Why does a bridge loan look so expensive annualized?',
        answer:
          'Because the annualized rate is a misleading way to measure a loan you are only going to hold for 60–180 days. A 7% annualized rate on a $400K bridge held for 90 days is roughly $7,000 in actual interest cost. The right way to evaluate a bridge is the total dollar cost over the actual holding period, measured against the value of the deal it is enabling. If the bridge unlocks a $2MM contract with a $400K margin, $7,000 of interest is a rounding error on the deal economics.',
      },
      {
        question: 'What happens if my exit event slips?',
        answer:
          'This is the question every bridge underwriter is asking. Most bridge lenders will extend the maturity for a fee if the exit slips by 30–60 days — but extensions get expensive and the lender will want to see the updated documentation supporting the new close date. The honest discipline is to size the bridge with a buffer (use the lender\'s 180-day option even if you only expect to need 90 days) and to have a Plan B refinance lined up if the primary exit cannot close.',
      },
      {
        question: 'Can I refinance a bridge loan into a term loan?',
        answer:
          'Yes, and this is sometimes the planned exit. A common stack is to take a bridge for the immediate funding need, use the time the bridge is outstanding to run a full term-loan or SBA underwrite, and refinance the bridge balance into the long-term product when it funds. This is also how acquisition bridges typically work: the bridge funds at close, the permanent debt funds 60–90 days later, and the bridge is paid off out of the permanent.',
      },
      {
        question: 'How much can I borrow on a bridge?',
        answer:
          'Bridge loans typically range from $50K to $5MM, with larger bridges available on real-estate-collateralized deals. The size is mostly driven by the exit — if the exit event is paying off $400K, the bridge will be sized at $400K. Bridge underwriters are conservative about lending more than the exit will fully retire, because that creates a refinancing risk they did not underwrite.',
      },
      {
        question: 'Is a bridge loan an MCA?',
        answer:
          'No. A bridge loan is structured as a term loan with a specific exit event, typically interest-only payments, and an annualized rate that is much lower than an MCA when measured over the actual holding period. An MCA is a daily-pull cash advance with no defined exit event other than the contract paying out over its full term. The two products solve different problems and have very different structural risk profiles.',
      },
      {
        question: 'Do term loans always have prepayment penalties?',
        answer:
          'Not always. SBA loans of longer than 15 years have prepayment penalties for the first three years. Conventional non-SBA term loans vary: some have step-down prepay penalties, some have no prepay penalty at all. Bridge loans are the opposite end of the spectrum — most have early-payoff discounts that reward you for exiting faster than planned. Always confirm prepay terms in writing during the term-sheet stage.',
      },
      {
        question: 'Can I do both — a bridge now and a term loan later?',
        answer:
          'Yes, and this is one of the cleanest stacks in capital structuring. Take the bridge to fund the immediate need, use the bridge period to run the longer underwrite for the term loan, and refinance the bridge into the term loan when it closes. The keys are making sure the bridge maturity gives the term loan enough runway to close, and confirming that the bridge does not have a UCC priority position that would block the term lender from taking the senior position they need.',
      },
    ],
    relatedSolutions: ['bridge-funding', 'unsecured-debt', 'sba-loans'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. EQUIPMENT FINANCING vs SALE-LEASEBACK — buy new vs extract from owned
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'equipment-financing-vs-sale-leaseback',
    title: 'Equipment Financing vs Sale-Leaseback',
    subtitle: 'Two ways to use equipment as capital. One finances a new purchase. The other unlocks the equity in equipment you already own.',
    excerpt:
      'Equipment financing funds a new purchase. A sale-leaseback extracts cash from gear you already own. Two products, two very different uses.',
    productA: {
      solutionId: 'equipment-leasing',
      name: 'Equipment Financing (New Purchase)',
      positioning:
        'Financing the acquisition of new machinery, vehicles, or technology. The lender advances against the cost of the asset; you pay it back over 3–7 years.',
      speed: '1–3 weeks',
      cost: 'Prime + 3–10% (single digits to low double digits in 2026)',
      range: '$100K – $50MM+',
      collateral: 'The financed equipment itself (UCC on the asset)',
    },
    productB: {
      solutionId: 'equipment-leasing',
      name: 'Sale-Leaseback',
      positioning:
        'Selling equipment you already own to a lender and leasing it back. Releases the trapped equity in the asset as working capital.',
      speed: '2–4 weeks',
      cost: 'Prime + 4–10% (priced as a lease, not a loan)',
      range: '$100K – $25MM+',
      collateral: 'The leased-back equipment itself',
    },
    introduction:
      'Equipment financing and a sale-leaseback both use equipment as the collateral story, but they solve opposite problems. Equipment financing funds a new purchase — the lender advances against the cost of the asset you are about to acquire, you pay it back over 3–7 years, and at the end of the term you own the equipment free and clear. The use of funds is forward-looking: you are buying something to produce revenue.\n\nA sale-leaseback is the reverse mechanic on equipment you already own. The lender buys the equipment from you (at a percentage of its fair-market or liquidation value), then immediately leases it back to you. You keep using the equipment exactly the same way; what changed is the cash. The equity that was trapped in the asset is now in your operating account, available as working capital, and you have lease payments over the next 3–4 years instead of an owned asset on the balance sheet. The use of funds is the cash you extract: payroll, growth investment, debt consolidation, whatever the operating business needs.\n\nThe short decision: if the question is "how do I pay for new equipment," it is equipment financing. If the question is "I have free-and-clear equipment but I need cash for the operating business," it is a sale-leaseback. The two products are not substitutes; they are different answers to different questions, even though they share the same collateral type.',
    featureRows: [
      {
        feature: 'Use case',
        productA: 'Buying new equipment (or used from a dealer)',
        productB: 'Extracting cash from equipment you already own',
      },
      {
        feature: 'Direction of cash flow',
        productA: 'Lender pays the vendor; you make payments to the lender',
        productB: 'Lender pays you a lump sum; you make lease payments back',
      },
      {
        feature: 'Ownership at the end',
        productA: 'You own the equipment free and clear',
        productB: 'You own it again (typical buyout) or extend the lease',
      },
      {
        feature: 'Speed to fund',
        productA: '1–3 weeks (faster for vendor-direct programs)',
        productB: '2–4 weeks (includes appraisal of the existing asset)',
      },
      {
        feature: 'Advance / valuation basis',
        productA: '70%–85% of equipment cost or liquidation value',
        productB: '50%–70% of fair-market or liquidation value of the owned asset',
      },
      {
        feature: 'Pricing (as of 2026)',
        productA: 'Prime + 3–10%, single digits to low double digits',
        productB: 'Prime + 4–10% (priced as a lease, not a loan)',
      },
      {
        feature: 'Typical term',
        productA: '36–84 months (most common in the 60–84 month range)',
        productB: '36–48 months typical',
      },
      {
        feature: 'Balance-sheet treatment',
        productA: 'Asset and matched debt on the balance sheet',
        productB: 'Operating lease (off balance sheet) or capital lease, depending on structure',
      },
      {
        feature: 'Best fit',
        productA: 'You are acquiring revenue-producing equipment',
        productB: 'You have free-and-clear equipment and need operating cash',
      },
    ],
    whenToPickA: {
      narrative:
        'Pick equipment financing when you are acquiring new equipment that will produce revenue. The math is straightforward: the lender advances 70%–85% of the cost of the asset, you pay roughly 15%–30% down (sometimes nothing, depending on credit and asset class), and the loan amortizes over the useful life of the equipment — most commonly 60–84 months. At the end of the term you own the equipment outright and have built a track record with the equipment lender that makes the next purchase faster.\n\nThe right comparison to make here is not equipment financing versus a sale-leaseback, but equipment financing versus drawing on your working-capital line to fund the purchase. Equipment financing is almost always cheaper for the same purchase because the lender has a specific asset to collateralize and a longer amortization to spread the payment across. Drawing on a revolver to buy a $400K machine costs you the line\'s interest rate on the full balance plus the opportunity cost of having the line tied up; financing it directly typically prices three to five points lower and matches the payment to the asset\'s useful life.',
      bullets: [
        'You are acquiring new (or used-from-dealer) revenue-producing equipment',
        'You want to match the financing term to the useful life of the asset',
        'You want to keep your working-capital line free for working-capital uses',
        'You can put 0%–30% down depending on credit and asset class',
        'You want to own the equipment outright at the end of the term',
      ],
    },
    whenToPickB: {
      narrative:
        'Pick a sale-leaseback when you have meaningful equipment on your balance sheet that is free and clear — meaning no existing UCC, no equipment loan, no lien — and the operating business needs cash. The equipment is doing its job; you are not selling it because you do not need it. You are selling it because the cash value is currently locked inside the asset and you want to deploy that cash for something the operating business needs more: payroll during a growth period, debt consolidation, working capital, a strategic acquisition.\n\nThe trade-off is that you turn an owned asset into a lease obligation. You still get to use the equipment exactly the same way — most sale-leaseback structures include a buyout option at the end of the lease so you can re-own the equipment — but for the duration of the lease you have a fixed monthly payment that did not exist before. The discipline this requires is matching the use of the freed-up cash to a clear payback. If you sale-leaseback $300K of equipment to fund a six-month inventory build that produces $400K of margin, the math works. If you sale-leaseback $300K to cover general operating losses, you have converted an owned asset into a monthly bill without a corresponding recovery — a sign the business needs a different conversation, not a different product.',
      bullets: [
        'You have free-and-clear equipment on the balance sheet (no existing lien)',
        'The operating business needs working capital and other sources are not available or are more expensive',
        'You can name the use of the freed-up cash and its expected payback',
        'You are comfortable with a 36–48 month lease obligation on equipment you currently own',
        'You want the option to buy the equipment back at end of lease',
      ],
    },
    workedExample: {
      scenario:
        'A $5MM manufacturer needs to add a $400K CNC machine to take on a new contract. Separately, the business owns $600K (fair-market value) of free-and-clear production equipment installed five years ago.',
      math:
        'Equipment financing path (the new CNC): $400K financed at Prime + 5% (assume 13% in 2026) amortized over 60 months, with a 15% down payment. Monthly P&I: roughly $7,750 on the financed $340K. The new asset is on the balance sheet matched against the new debt; the working-capital line is untouched.\n\nSale-leaseback path (the existing equipment): $600K of fair-market value, advance at 60% = $360K of cash released to the operating business. Lease payment at Prime + 6% over 48 months: roughly $9,200 per month. The $360K is now available for whatever the operating business needs — and the equipment continues to operate exactly the same way.',
      takeaway:
        'For the new equipment, equipment financing is the right tool — match the financing to the asset, keep the working-capital line free. For the operating-business cash need, the sale-leaseback unlocks $360K that was sitting in the asset, at a monthly cost the operating business can absorb. Done together, this is a classic two-product capital stack: finance the new growth asset, sale-leaseback the existing one to fund the working-capital piece.',
    },
    mikeQuotes: [
      {
        quote:
          'another one would be a term loan against your free and clear equipment, which is called a sale lease back, where you basically, it\'s almost like you\'re selling it back to the lender and then leasing it back from Which is just a fancy way of saying, that\'s how you\'re getting cash out of it. It\'s like, it\'s like they own it now. Which, you know, and that\'s how you get the cash out of it, is if you made a sale, but then you\'re leasing it back until you\'re making lease payments on it over a three or four year period. But that\'s a term note.',
        context:
          'Mike giving the cleanest plain-English definition of a sale-leaseback — selling the equipment back to the lender and leasing it back to release the cash trapped in the asset.',
      },
      {
        quote:
          'you can expect equipment deals, new equipment that you\'re purchasing, you can expect anywhere from, I mean, obviously you can go shorter term and you\'ll get a better rate, but your debt service would be a little higher, so you can go as short as, gosh, 24, 36 months if you want, most cases they live somewhere in the 60 to 84 month range, you know, and again, you can get rates in the single digits, up into the very low, very, very low doubles.',
        context:
          'Mike framing the term and rate ranges for new-equipment financing — single digits to low double digits, 60–84 months most common.',
      },
      {
        quote:
          'there\'s just a range, you can get really fast and flexible capital, but you\'re going to pay more for it, you\'re going to have something in the middle, like an inventory or asset-based, and then you can have, obviously, real estate also being an asset-based, but, you know, on the real estate side.',
        context:
          'Mike on the general principle that equipment-collateralized capital sits in the middle of the cost spectrum — cheaper than revenue-based, more expensive than real estate.',
      },
    ],
    faqs: [
      {
        question: 'Can I sale-leaseback equipment that still has a loan on it?',
        answer:
          'Usually not directly. The sale-leaseback lender needs to take a clean position on the asset, which means existing liens have to be paid off out of the proceeds. If your existing equipment loan is small and the sale-leaseback value is meaningfully larger, the structure can work: the proceeds first pay off the existing loan, the rest comes to the business as working capital. The lender will model this in advance and tell you exactly what the net cash to the business will look like.',
      },
      {
        question: 'What kind of equipment qualifies for either product?',
        answer:
          'Equipment financing works on almost any titled or serial-numbered business asset — production machinery, vehicles, technology hardware, medical equipment, restaurant equipment, construction equipment. Sale-leaseback is similar but the lender is more selective because they are taking a position on a used asset: they want equipment with a real secondary market, clear maintenance records, and a verifiable fair-market value. Specialty or highly customized equipment sometimes does not work for sale-leaseback even though it would work for new-purchase financing.',
      },
      {
        question: 'How is the value of my existing equipment determined for a sale-leaseback?',
        answer:
          'The lender will order an appraisal — typically a desktop appraisal for assets under $500K and a physical inspection for larger deals. The appraiser produces a fair-market value (what the equipment would sell for in an orderly sale) and a liquidation value (what it would sell for in a forced sale). The advance is typically 50%–70% of the liquidation value, sometimes higher on assets with strong secondary markets.',
      },
      {
        question: 'Will I lose ownership of my equipment in a sale-leaseback?',
        answer:
          'Technically yes during the lease — the lender owns the equipment and you lease it back. Practically, you keep using it exactly the same way, you are responsible for maintenance and insurance, and most structures include a buyout option at the end of the lease (often a $1 buyout or fair-market-value buyout, depending on the structure). At the end of the lease you can buy the equipment back and own it outright again.',
      },
      {
        question: 'Is equipment financing the same as leasing?',
        answer:
          'They are close cousins but not identical. Equipment financing is structured as a loan secured by the equipment — you own the asset, the lender has a UCC on it, you make principal-and-interest payments. A lease is structured as a rental — the lender owns the asset, you make lease payments, and at the end of the lease you either buy it out or return it. The economics are similar; the balance-sheet treatment and tax treatment differ, which is why the right answer often depends on your accountant\'s view of how the lease versus loan treatment affects your statements.',
      },
      {
        question: 'How fast can a sale-leaseback close?',
        answer:
          'Typically 2–4 weeks, with the appraisal being the main pacing item. Faster closes are possible on smaller deals with desktop appraisals, slower closes on larger deals or specialty equipment that needs a physical inspection. If the cash need has a deadline, tell the lender at the start so they can sequence the appraisal accordingly.',
      },
      {
        question: 'Can I do both — finance a new piece and sale-leaseback an existing piece?',
        answer:
          'Yes, and this is a common structure for a growing business. Finance the new growth asset on a 60–84 month equipment loan and sale-leaseback the existing free-and-clear equipment to fund the working-capital piece. Done together, the two products give you the new revenue-producing capacity plus the working capital to support it — without touching the bank line or AR-backed revolver.',
      },
    ],
    relatedSolutions: ['equipment-leasing', 'asset-based-lending', 'working-capital-loans'],
  },
]

/** Helper for the dynamic route's generateStaticParams */
export function getComparisonIds(): string[] {
  return comparisons.map((c) => c.id)
}

/** Helper for the dynamic route's data lookup */
export function getComparison(id: string): ComparisonPage | undefined {
  return comparisons.find((c) => c.id === id)
}
