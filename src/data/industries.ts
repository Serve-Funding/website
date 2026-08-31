/**
 * SERVE FUNDING - INDUSTRIES DATA
 *
 * Industry-specific landing page content, written in Mike Kodinsky's voice.
 * Six industries, one dynamic route at /industries/[industry-id].
 *
 * Source material for Mike voice and analogies: docs/mike-voice-patterns.md,
 * docs/product-explanations.md, docs/qualifying-questions.md.
 *
 * Customer-identifying detail is anonymized unless the case study already
 * lives in src/data/fundingData.ts (which is public-facing).
 *
 * Last Updated: 2026-05-27
 */

export interface RecommendedSolution {
  /** ID from src/data/solutions.tsx */
  solutionId: string
  /** Why this works for this industry, in 1-2 sentences */
  why: string
  /** Rank within this industry (1 = primary recommendation) */
  rank: number
}

export interface IndustryPage {
  id: string
  /** Display name, e.g. "Staffing Agencies" */
  name: string
  /** Title for the page — title + " | Serve Funding" must be ≤ 70 chars (so title ≤ 54 chars) */
  title: string
  /** Meta description / excerpt — must be 120–160 chars */
  excerpt: string
  /** One-line problem statement that names the industry's specific cash-flow challenge */
  hook: string
  /** Hero image path (from existing /public images — don't invent paths) */
  image: string
  /**
   * 3-5 paragraphs of plain-language explanation of how funding works for THIS industry.
   * Answer-first: lead with the typical product fit, the typical cost range, and the
   * typical timing.
   */
  introduction: string
  /** 4-7 industry-specific challenges */
  challenges: string[]
  /** Ranked recommended solutions for this industry */
  recommendedSolutions: RecommendedSolution[]
  /** Products that DON'T typically fit this industry, with one sentence why */
  whatDoesntFit: Array<{ solutionId: string; why: string }>
  /**
   * Advance rates and eligibility for THIS industry, as a quotable table.
   * Industry-specific exclusions belong here; rates true of the product
   * generally belong on the /solutions page for that product.
   */
  terms?: Array<{ label: string; value: string }>
  /** Generic-sized worked example (no customer identification). 3 paragraphs: scenario, structure, outcome. */
  workedExample: string
  /** 2-3 Mike quotes from docs/ */
  mikeQuotes: Array<{ quote: string; context: string }>
  /** 5-7 industry-specific FAQs in the voice prospects actually use */
  faqs: Array<{ question: string; answer: string }>
  /** Public fundingData.ts case study title that matches this industry, if any */
  publicCaseStudyTitle?: string
}

export const industries: IndustryPage[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. STAFFING & RECRUITING
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "staffing",
    name: "Staffing & Recruiting Agencies",
    title: "Staffing Agency Financing: Factoring & ABL Options",
    excerpt: "Staffing agencies run a weekly payroll against customers who pay net-30 to net-60+. Here is the funding logic that actually closes that gap.",
    hook: "You pay your people every Friday. Your customers pay you in 45 days. That math is the entire problem, and the entire reason invoice factoring exists.",
    image: "/blog/staffing-rbf-vs-factoring.webp",
    introduction:
      "Staffing is the textbook factoring industry. The mechanics are simple and they have been the same for decades: you bill a customer net-30 or net-60, your placements expect to be paid that week, and someone has to hold the cash in between. Invoice factoring is the product that was built to solve exactly that gap. The typical structure is an 85%–90% advance against eligible AR, factor fees of roughly 1%–2% per month the invoice is outstanding, and funding in 24–48 hours after onboarding. Approval generally lands in three to four weeks once a clean AR aging and a top customer list are in hand.\n\nThe right way to think about a factoring line is that it grows with you. It is not a fixed-amount loan. As your weekly billings climb, the availability climbs with them. We have seen agencies start at a $500K facility and scale past $5MM inside a year because that is how the product is designed. It tracks the sales, not the balance sheet. That is also why factoring tolerates the kind of tax returns that make a bank squint. The lender is underwriting your customers' credit, not yours.\n\nAt scale, the conversation usually shifts from factoring to asset-based lending. ABL is factoring's close cousin, with the same lockbox mechanics and the same AR collateral, but it sits on the balance sheet as debt and prices cheaper, typically Prime + 1–4%. Most ABL desks start at $3MM minimums, which is why the cleanest move is to factor first, build a couple of years of clean reporting, then graduate. The other common layer is a revenue-based working capital loan sitting subordinate to the factoring line, useful when you have a payroll spike that runs ahead of billings, like onboarding a new shift or a new contract.\n\nWhat staffing usually does *not* need: MCAs. The product fit is so clean for factoring that taking a daily-debit advance to bridge payroll is almost always the wrong call. If the AR is there, factor it.",
    challenges: [
      "Weekly payroll against net-30 to net-60+ customer payment cycles ties up 8%–20% of annual revenue in working AR at any time",
      "Large enterprise customers (logistics, healthcare systems, government primes) often dictate net-60 to net-90 terms with no negotiation",
      "Bank lines of credit ceiling out as the agency grows. Banks don't size to weekly payroll demand the way factoring does",
      "Tax returns that show low net income (because labor is a pass-through cost) don't tell the credit story banks want to see",
      "Onboarding a new contract or shift creates a payroll spike that hits before the first invoice clears",
      "Workers comp and payroll tax timing creates additional cash drag a week or two before billings clean up",
      "Verifying timecards and invoice eligibility. Most factors require detailed invoice support before advancing"
    ],
    recommendedSolutions: [
      {
        solutionId: "invoice-factoring",
        rank: 1,
        why: "The textbook fit. Advances 85%–90% against AR within 24–48 hours, scales automatically as you grow, and underwrites against your customers rather than your tax returns."
      },
      {
        solutionId: "asset-based-lending",
        rank: 2,
        why: "Cousin to factoring. Same AR collateral and lockbox mechanics, but priced cheaper at scale. Most ABL desks start at $3MM minimums, usually a year or two after factoring kicks in."
      },
      {
        solutionId: "working-capital-loans",
        rank: 3,
        why: "Useful as a subordinate layer behind a factoring line when a new contract creates a payroll spike that runs ahead of billings. Funded in days, sized at 10%–15% of annual revenue."
      },
      {
        solutionId: "debt-refinance",
        rank: 4,
        why: "For agencies that took on stacked MCAs during a slow quarter and now need to climb out. A factoring line is usually the consolidation product. It generates the cash to retire the daily debits."
      }
    ],
    whatDoesntFit: [
      {
        solutionId: "purchase-order-funding",
        why: "PO funding pays suppliers for hard goods. Staffing is a labor business with no purchase order to finance. The cost being financed is payroll, which is what factoring handles."
      },
      {
        solutionId: "inventory-financing",
        why: "There is no inventory in a staffing business. The asset is the receivable, which is why factoring (or ABL on AR) is the right answer."
      },
      {
        solutionId: "equipment-leasing",
        why: "Staffing is asset-light. The capital need is almost always payroll timing, not equipment, so an AR-based product carries more leverage and lower friction."
      }
    ],
    workedExample:
      "A $4MM commercial staffing agency, paying weekly across roughly 80 placements at large logistics customers, has $600K–$700K of AR open at any time on net-45 terms. Payroll runs about $55K per week. The bank has them on a $250K line of credit that is permanently maxed and gets renewed reluctantly. Tax returns show $80K of net income against $4MM in revenue, which makes every bank conversation slow.\n\nThe structure is a $1MM revolving factoring line at an 88% advance rate, factor fee of 1.5% per month, no personal guarantee on the facility itself. Approval runs about three weeks. Once onboarded, the agency uploads invoices into the factor's portal, the factor advances 88% the next business day, and the remaining 12% (less the factor fee) is released when the customer pays. The factor sets up a lockbox in the agency's name so the customer relationship doesn't change.\n\nThe outcome: weekly payroll is no longer a fire drill. There is roughly $600K of immediate availability against current AR on day one. Six months in, the agency takes on a new logistics contract that adds $1.5MM of annual revenue and the line scales with it. Eighteen months in, with cleaner financials, the conversation shifts to converting to an ABL structure at Prime + 2%.",
    mikeQuotes: [
      {
        quote:
          "Invoice Financing is probably your best tool for what you're describing. It's actually not a debt product. It's a recurring sale of an asset. Your receivable is an asset. You've completed the work and you've invoiced the client and the customer and their promise, according to the agreement, is that they'll pay you in 60 days.",
        context: "Mike explaining factoring mechanics, the cleanest version of his factoring pitch."
      },
      {
        quote:
          "The lender sets up what's called a lockbox. It's like a different bank account that the payments will go to. So you would inform your customers, look, starting on January the 23rd or whenever, please remit payments over here. It's almost like water in a cup. As they pay down the line, it fills up again and you can borrow down again as you need to.",
        context: "Mike's signature water-in-a-cup analogy for how a factoring line replenishes."
      },
      {
        quote:
          "We specialize in being generalists, if you will, which is kind of an oxymoron, but we do that because we're here to serve. Like, that's our slogan. We want to come through for the client.",
        context: "Mike's framing of why a channel-neutral advisor matters when the lender universe in factoring alone runs to 700+ players."
      }
    ],
    faqs: [
      {
        question: "How fast can a new staffing agency get a factoring line in place?",
        answer:
          "From clean docs to first funding is typically three to four weeks. Underwriting wants the last two years of financials, a recent AR aging, a customer list with credit profile, and your articles. Once you are onboarded the actual advance on a given invoice is 24–48 hours. Mike's framing: under-promise and over-deliver. Plan for a month, but don't be surprised if a clean file goes faster."
      },
      {
        question: "Will my customers know I'm factoring my invoices?",
        answer:
          "Yes, and that is by design, not by accident. The factor sends a one-time notification of assignment letter to your customer's AP department telling them where to send payment, and they will usually verify the invoice on the front end of the relationship. After that it is a quiet operational change. In staffing this is so common that most enterprise AP departments process notice-of-assignment letters as routine paperwork."
      },
      {
        question: "What advance rate should I expect for a staffing factoring line?",
        answer:
          "Typically 85%–90% of the eligible AR balance, with 90% as a common ceiling for clean staffing books. The 10%–15% holdback is released, less the factor fee, when your customer pays. Ineligibility usually means invoices over 60 to 90 days past due. Those get pulled out of the borrowing base because the lender can't count on collection."
      },
      {
        question: "Is factoring a sign that my business is in trouble?",
        answer:
          "In staffing, no. It is closer to standard operating equipment. Factoring exists because the timing gap between weekly payroll and net-45 customer payment is structural, not a sign of distress. Bank lines simply do not size to weekly payroll demand the way factoring does. The companies using factoring are usually the ones growing fastest."
      },
      {
        question: "When do we graduate from factoring to ABL?",
        answer:
          "Usually somewhere between $5MM and $15MM in annual revenue, paired with two years of clean financials and a CFO or controller in seat. ABL prices cheaper, Prime + 1–4% versus the all-in cost of factoring, but most ABL desks start at $3MM minimum facility size, which is why factoring is almost always the first step. We can run the math on the breakpoint when the time comes."
      },
      {
        question: "Can a staffing agency with stacked MCAs still get a factoring line?",
        answer:
          "Sometimes, but the MCAs almost always have to be retired in the same transaction. Most factors will not advance behind a daily-debit lender because the debits compete with the lockbox for cash. The structure is usually: factoring line closes, advance is sized to pay off the MCAs at closing, and you exit the daily-debit cycle on day one. We will be honest with you about whether the math works before you spend the diligence cycle."
      },
      {
        question: "How is factoring priced compared to a working capital loan?",
        answer:
          "Factor fees typically run 1%–2% per month an invoice is outstanding, so on a net-45 book the effective cost is roughly 1.5%–3% of invoice value. That is more expensive than an ABL line (Prime + 1–4%) and cheaper than a fast working capital loan (1.25%–4% per month). The right product is usually the one that matches the cash flow shape: factoring tracks AR, working capital tracks revenue, ABL is the cheaper version of factoring once you can qualify."
      }
    ],
    publicCaseStudyTitle: "Strategic Acquisition" // Telecom Engineering Staffing, OH — $515K
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. HEALTHCARE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "healthcare",
    name: "Healthcare & Medical Practices",
    title: "Healthcare Financing: Medical AR Factoring & ABL",
    excerpt: "Healthcare funding splits into two products. Medical AR factoring (insurance receivables) is its own specialty. Supply and equipment use standard tools.",
    hook: "If you bill insurance, your funding options are smaller and more specialized than you'd guess. If you bill businesses, the standard playbook applies.",
    image: "/blog/Meeting 3.webp",
    introduction:
      "Healthcare is two different funding worlds inside one industry, and the first question we ask is which side you live on. If your receivable is owed by an insurance company, Medicare, Medicaid, or a managed care plan, you are in medical AR factoring territory, a specialized product. If your receivable is owed by a hospital, a clinic, a distributor, or another business, you are in standard B2B factoring or ABL territory. The product fit, the pricing, and the lender universe are different.\n\nMedical AR factoring exists because of one structural fact: insurers will not assign payment to a third party. They have to pay you. So instead of a true assignment, the lender sets up a DACA, a deposit account control agreement, where the account is in your name but the lender has visibility and sweep authority. Advance rates are lower than commercial factoring, typically 65%–75% rather than 85%–90%, because insurance reimbursement is uncertain (the provider often collects 40–60 cents on the dollar of billed charges, and that variability has to be priced in). Pricing runs around 2% per month. The universe of lenders is small. Out of roughly 700 factoring companies in the U.S., only 10–15 actually do medical. That scarcity is exactly why advisors matter here.\n\nHealthcare supply companies, home health agencies that bill private pay, medical device distributors, equipment providers. These run on standard commercial AR. The factoring product looks like staffing's: 85%–90% advance, lockbox, scaling line. Equipment financing covers capital purchases (imaging, infusion, mobile units, fleet) on 60–84 month terms at single-digit to low-double-digit rates. Larger healthcare supply businesses with inventory plus AR plus equipment usually graduate to ABL.\n\nThe right move depends entirely on the receivable mix. We ask first, then recommend.",
    challenges: [
      "Insurance reimbursement timing: 30 to 90+ days from claim submission to payment, often longer for disputed claims",
      "Reimbursement uncertainty: providers commonly collect 40–60 cents on the dollar of billed charges, which depresses advance rates",
      "Medical factoring is a small lender universe (10–15 specialty lenders in the U.S.), making negotiation difficult without an advisor",
      "Self-pay and private-pay receivables behave differently than insurance, sometimes financeable separately, sometimes not financeable at all",
      "Equipment-heavy practices (imaging, surgical, mobile units) need capital that fits depreciation schedules and tax treatment",
      "HIPAA and compliance requirements on lockbox and DACA structures add diligence time on the lender side",
      "Practice acquisitions and roll-ups need bridge capital that traditional bank financing won't move fast enough to cover"
    ],
    recommendedSolutions: [
      {
        solutionId: "invoice-factoring",
        rank: 1,
        why: "For medical AR specifically, this is a specialized variant: DACA account instead of true lockbox, advances of 65%–85% set against net collectible value rather than billed charges, around 2% per month pricing. For non-insurance healthcare receivables, the standard commercial structure applies."
      },
      {
        solutionId: "asset-based-lending",
        rank: 2,
        why: "Fits healthcare supply, distribution, and device companies with multiple collateral types: AR plus inventory plus sometimes equipment. Prime + 1–5% pricing once you clear the $3MM facility threshold."
      },
      {
        solutionId: "equipment-leasing",
        rank: 3,
        why: "Imaging, infusion equipment, mobile units, and fleet on 60–84 month terms at single-digit to low-double-digit rates. Sale-leaseback is the standard move to extract equity from equipment you already own."
      },
      {
        solutionId: "working-capital-loans",
        rank: 4,
        why: "Revenue-based capital for practices where the AR is too small or too self-pay-heavy to factor. Sized at 10%–15% of annual revenue, funded in days."
      },
      {
        solutionId: "unsecured-debt",
        rank: 5,
        why: "Bridge and sub-debt for M&A timing gaps in physician group roll-ups and dental support organization (DSO) consolidations. 6–36 month interest-only structures."
      }
    ],
    whatDoesntFit: [
      {
        solutionId: "purchase-order-funding",
        why: "PO funding finances inventory production against a hard purchase order from a business buyer. Insurance claims do not work that way. The receivable doesn't exist until the service is rendered."
      },
      {
        solutionId: "sba-loans",
        why: "SBA can fit healthcare practice acquisitions, but it's a 4–12 week underwrite that we usually refer out. For working capital timing in a live practice, faster non-SBA products almost always make more sense."
      }
    ],
    workedExample:
      "A healthcare equipment supplier doing $6MM in annual revenue carries about $850K of AR on net-45 to net-60 terms with hospital systems and surgical centers (commercial receivables, not insurance). They also hold roughly $700K in inventory at cost: proprietary disposables and a handful of consigned units at customer sites. The bank line is $400K and capped. They have one large new customer (a regional hospital network) waiting on a $1.2MM PO that will ship in tranches over six months.\n\nThe structure is a $1.5MM AR-based facility at an 88% advance rate, plus a $500K inventory sublimit at 50% advance on finished goods at cost. Pricing comes in around Prime + 3.5% on the AR portion. To bridge the production cycle on the hospital network PO, we lay in a separate PO financing facility that pays the manufacturer directly for 80% of the cost, settled when the invoice gets factored into the AR line on shipment.\n\nThe outcome: working AR availability roughly triples versus the old bank line. The new hospital network contract becomes deliverable because production cash is now sourced. Twelve months later, with the supplier at $9MM in revenue, the whole stack rolls into a single ABL facility at Prime + 2%.",
    mikeQuotes: [
      {
        quote:
          "There's only a handful of companies that do medical receivables factoring because it's trickier. There's probably 700 factors in the US and maybe 10 or 15 of them do medical. That's how specialized it is. Insurances won't do what's called an assignment. They won't pay another third party. They have to pay you directly. So they set up typically what's called a DACA account, the control account where the lender has visibility and sweep, but it's still in your name.",
        context: "Mike explaining medical factoring, the cleanest articulation of why medical AR is its own specialty."
      },
      {
        quote:
          "You'll have an advance rate, obviously, of, could be 65, 70%. It's on the lower side of medical because, as you know, you get paid oftentimes 50 cents on the dollar.",
        context: "Mike on the structural reason medical advance rates run lower than commercial factoring."
      },
      {
        quote:
          "We're here to serve is our mantra. That's kind of a biblical nod to a servant leadership approach that we take to the way we operate.",
        context: "Mike on the philosophy that drives Serve Funding, particularly relevant in healthcare, where the lender universe is small and prospects often arrive frustrated after being shopped to the wrong specialty."
      }
    ],
    faqs: [
      {
        question: "Can I factor my insurance receivables?",
        answer:
          "Yes, but through a specialized product. The structure is a DACA, a deposit account control agreement, rather than a traditional lockbox, because insurers will not assign payments to a third party. Advance rates are typically 65%–75% (lower than commercial factoring) and pricing runs around 2% per month. The lender universe is small: only 10 to 15 of the roughly 700 U.S. factors do medical, which is why we usually go straight to the relationships that actually close these deals."
      },
      {
        question: "Why are medical factoring advance rates lower than commercial?",
        answer:
          "Because of reimbursement uncertainty. A provider commonly collects 40–60 cents on the dollar of billed charges from insurers, depending on payor mix and contract terms. The factor has to price that variability in, so advance rates land at 65%–75% rather than the 85%–90% you'd see on a clean commercial book. It's the same conceptual product, just risk-adjusted for the insurance dynamic."
      },
      {
        question: "How do healthcare supply and distribution companies get financed?",
        answer:
          "Like any other B2B commercial business: standard AR factoring or asset-based lending. If you're invoicing hospitals, surgical centers, distributors, or other businesses on net-30 to net-60 terms, you're in standard commercial territory. Pricing and advance rates look like staffing or manufacturing: 85%–90% advance, factor fees of 1%–2% per month, or Prime + 1–5% on an ABL line at scale."
      },
      {
        question: "What about equipment financing for imaging, mobile units, or infusion centers?",
        answer:
          "Equipment financing is its own product and usually the right tool for these capital purchases. Terms typically run 60–84 months. You can go as short as 24–36 months for a lower total cost, or stretch longer to lower your monthly debt service. Rates land anywhere from single digits up into the low double digits depending on credit, asset type, and lender. Sale-leaseback structures let you extract 50%–70% of the equity from equipment you already own."
      },
      {
        question: "I'm rolling up several practices. What's the right capital stack?",
        answer:
          "Usually a layered approach: SBA or non-SBA term debt against the core operating business and real estate, bridge capital for acquisition timing gaps, and an AR or ABL line on the consolidated entity once it's stitched together. We are honest about what we do and don't underwrite directly. SBA we usually refer out to non-bank SBA lenders, then handle the bridge and the working capital line ourselves."
      },
      {
        question: "My practice does mostly self-pay and private-pay. Can that be factored?",
        answer:
          "Sometimes, but more often we move you toward a revenue-based working capital line instead. Self-pay receivables are harder to underwrite as a borrowing base because the customer is an individual, not a business or an insurer, so collectibility risk is higher. If your AR is small or scattered across individuals, a 10%–15%-of-revenue working capital line usually carries more leverage than trying to force a factoring product on it."
      }
    ],
    publicCaseStudyTitle: "Total Working Capital" // Medical Device Manufacturer, FL — $3.1MM
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. MANUFACTURING
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "manufacturing",
    name: "Manufacturing",
    title: "Manufacturing Financing: ABL, PO Funding & Equipment",
    excerpt: "Manufacturers usually have AR, inventory, and equipment all on one balance sheet. That collateral mix is exactly what ABL was built to leverage.",
    hook: "When a manufacturer needs capital, the question is rarely 'which product?', it's 'how do we stack three products against four collateral types into one facility?'",
    image: "/blog/Walking.webp",
    introduction:
      "Manufacturing is where the asset-based playbook really shines, because you usually have more than one collateral type on the balance sheet. There's AR from your commercial customers, inventory at cost (raw materials, work-in-process, and finished goods), equipment you own free-and-clear or partly financed, and sometimes real estate. ABL was built for exactly this picture: a single revolving line that advances against the whole stack: typically 80%–90% on AR, 50%–60% on inventory, plus an equipment and sometimes real estate piece. Facility sizes generally start at $3MM and run up to $25MM and beyond, priced at Prime + 1–4%, with funding in 6–8 weeks once full diligence runs.\n\nUnder the ABL minimum threshold, the default is invoice factoring on the AR alone, typically with an inventory sublimit added on a case-by-case basis. There are also a handful of specialty inventory lenders who will do standalone deals, usually two or three lenders we know of will advance roughly 40%–50% of inventory at cost, on top of a 13-week cash flow forecast and a math story (not a sales story) for how the inventory turns. That product is harder to source and pricier than ABL, but it can be the right answer when AR is too lumpy to anchor a deal.\n\nWhen a large purchase order lands, especially one with international suppliers, long lead times, or tariff exposure, PO funding becomes the right tool. PO funding pays your vendors for 70%–100% of confirmed order cost at roughly 1.5%–3% per 30 days. It pairs cleanly with factoring on the back end: PO funds production, factoring funds the wait after delivery, and you don't burn equity capital on materials.\n\nEquipment financing rounds out the stack for capacity expansion. Terms run 24–84 months, rates from single digits to low double digits depending on collateral and credit. Sale-leaseback is the move when you have free-and-clear equipment and need to pull cash without taking on covenanted bank debt.",
    challenges: [
      "Multiple collateral types (AR, inventory, equipment, real estate), usually under-leveraged on a single bank line",
      "Net-30 to net-90 payment terms from large customers create predictable but painful AR aging",
      "Inventory builds ahead of large orders tie up significant working capital, especially when raw materials are imported or tariff-affected",
      "Large purchase orders from new customers create production cash needs the existing bank line can't size to",
      "Bank lines often cap at a multiple of revenue rather than scaling with the actual collateral on the balance sheet",
      "Equipment purchases for capacity expansion compete with working capital needs for the same dollars",
      "Tax returns showing modest net income (after depreciation and aggressive cost accounting) don't reflect the real cash story banks want"
    ],
    recommendedSolutions: [
      {
        solutionId: "asset-based-lending",
        rank: 1,
        why: "The right structure once a manufacturer has $3MM+ facility need and multiple collateral types. Combines AR (80%–90% advance), inventory (50%–60% advance), and sometimes equipment into one revolving line at Prime + 1–4%."
      },
      {
        solutionId: "invoice-factoring",
        rank: 2,
        why: "Below ABL minimums or when financials don't yet support a full asset-based facility. 85%–90% advance against AR, scales with sales, funded 24–48 hours after onboarding."
      },
      {
        solutionId: "purchase-order-funding",
        rank: 3,
        why: "When a large PO requires production cash before the customer pays. Pays suppliers 70%–100% of confirmed order cost. Pairs naturally with factoring or ABL on the back end."
      },
      {
        solutionId: "equipment-leasing",
        rank: 4,
        why: "For capacity expansion, fleet, or new capital equipment. 60–84 month terms typical, rates from single digits to low double digits. Sale-leaseback extracts equity from equipment already owned."
      },
      {
        solutionId: "inventory-financing",
        rank: 5,
        why: "Standalone inventory financing when AR is too lumpy to anchor a deal. Small lender universe (two or three lenders do real standalone inventory), typically advances 40%–50% on inventory at cost."
      },
      {
        solutionId: "real-estate-lending",
        rank: 6,
        why: "If you own the building free-and-clear or with significant equity, a cash-out refinance is often the cheapest capital you'll access, Prime + 2–7%, and frees working capital for the operating business."
      }
    ],
    whatDoesntFit: [
      {
        solutionId: "sba-loans",
        why: "SBA can work for acquisition or real estate purchase, but the 4–12 week underwriting cycle and credit-box requirements rarely match the speed a growing manufacturer needs for working capital. We refer SBA out when it fits and use faster non-bank tools for the rest."
      },
      {
        solutionId: "working-capital-loans",
        why: "Revenue-based working capital is fine as a small subordinate layer, but it ignores the collateral sitting on a manufacturer's balance sheet. Leading with an asset-based product almost always lowers the all-in cost."
      }
    ],
    workedExample:
      "A $12MM specialty manufacturer carries roughly $1.8MM in AR at any given time (net-45 customer terms), $2.5MM of inventory at cost (a mix of raw materials and finished goods), and roughly $1MM of owned equipment. The current bank has them on a $1.5MM line, capped, with a personal guarantee and a tight DSCR covenant. A new customer just placed a $2.4MM purchase order requiring 90 days of production cash and imported components.\n\nThe structure is a $6MM asset-based facility: 85% advance on eligible AR, 55% advance on finished goods inventory, plus a $750K equipment add-on. Pricing comes in at Prime + 2.5%. The bank is paid out at closing and walks away from the covenant. To bridge the new customer's $2.4MM PO, a separate PO facility funds the overseas supplier for 80% of cost at 2% per 30 days; once the goods ship and the invoice generates, the AR line picks up the receivable and the PO facility self-liquidates.\n\nThe outcome: total revolving availability roughly triples versus the old bank line. The $2.4MM order ships on time without the manufacturer touching equity capital. Eighteen months in, with revenue at $18MM, the facility resizes to $10MM at slightly tighter pricing and the equipment add-on is rolled into a separate term structure for tax efficiency.",
    mikeQuotes: [
      {
        quote:
          "Factoring, invoice factoring, and asset-based lending are cousins. They both create a revolving line that's collateralized by your AR. Both can sometimes include an add-on piece for inventory, at a lower advance rate, and as a secondary to the AR. The difference is factoring is not an actual debt product. It doesn't show up on your balance sheet as debt. ABL is very similar in most respects. It is a true piece of debt on the balance sheet.",
        context: "Mike's framing of the ABL/factoring relationship, the cleanest comparison of the two products."
      },
      {
        quote:
          "You could potentially take a purchase order, finance that at cost for the materials, and then pair that with accounts receivable financing, because you're presumably going to invoice this business entity. You could do a PO plus AR, kind of a combination deal.",
        context: "Mike on the PO + AR stack, the canonical multi-product approach for manufacturers landing a large new customer order."
      },
      {
        quote:
          "I sort of put underwriting, I define it by being in one of two buckets. Either an asset-backed or asset-based approach, whether that be receivables or inventory or real estate or equipment, or a revenue-based approach where they're just underwriting based on historical cash flows.",
        context: "Mike's two-bucket mental model. For most manufacturers, you live in the first bucket, which is good news, because it's cheaper."
      }
    ],
    faqs: [
      {
        question: "What's the difference between factoring and ABL for a manufacturer?",
        answer:
          "They are cousins. Both run a revolving line against AR, both use a lockbox, both can include inventory as a secondary collateral piece. The difference is factoring isn't debt on your balance sheet, it's a recurring sale of an asset, while ABL is a true line of credit. ABL prices cheaper (Prime + 1–4% versus factoring's 1%–2% per month) but generally requires $3MM+ facility size and cleaner financials. Most manufacturers start in factoring and graduate to ABL."
      },
      {
        question: "How does PO funding actually work alongside factoring?",
        answer:
          "PO funding pays your supplier 70%–100% of the cost of goods on a confirmed customer purchase order, at roughly 1.5%–3% per 30 days. Once you ship the goods and invoice the customer, the factoring line (or ABL line) advances against the new receivable and uses that advance to pay off the PO facility. The two products are designed to hand off cleanly. The combined cost is real, but so is the alternative of turning away the order."
      },
      {
        question: "Can I get inventory-only financing without an AR line?",
        answer:
          "Sometimes, but it's a small lender universe and a harder product. Maybe two or three lenders nationally will do a true standalone inventory deal. They typically advance 40%–50% on inventory at cost (a perfect-world example would be 50%) and they require a 13-week cash flow forecast plus a math-driven explanation for how the inventory turns into cash. It is not a story. It's a math story. Most manufacturers are better served by pairing inventory with AR in one facility."
      },
      {
        question: "What do I need to qualify for an asset-based line?",
        answer:
          "At minimum: $3MM in commercial AR, two years of clean financials, a field exam (the ABL lender will count your inventory and audit your AR aging in person), and a borrowing base certificate you can produce weekly or monthly. ABL desks underwrite the collateral first and the operating performance second, so a year of tax losses doesn't kill the deal the way it would at a bank. Personal credit matters far less here than in revenue-based products."
      },
      {
        question: "I have free-and-clear equipment. Can I pull cash from it?",
        answer:
          "Yes, through a sale-leaseback. It is almost like you're selling the equipment to the lender and then leasing it back, which is just a fancy way of saying that's how you get cash out of it. Terms run three to four years on most structures, sometimes longer. Useful when you need working capital without taking on a covenanted bank line or burning equity."
      },
      {
        question: "Real estate too: should I tap it before borrowing against AR or inventory?",
        answer:
          "Cost-wise, usually yes. Real estate is always going to command the lowest rates because it's lenders' favorite asset from a security standpoint. It's not going anywhere and it generally appreciates. If you have a building free-and-clear or with significant equity behind a first mortgage, a cash-out refinance is often the cheapest capital you'll access. But it's slower than an AR line, so the right answer depends on timing."
      },
      {
        question: "How do bank and non-bank financing work together for manufacturers?",
        answer:
          "Banks have specific regulatory and credit-box constraints (net income thresholds, leverage limits, DSCR ratios) that many growing or recovering manufacturers don't fit cleanly even when the underlying business is sound. The right structure is usually a partnership: the bank keeps the depository and treasury relationship, an asset-based or factoring lender handles the credit need that falls outside the bank's box, and the manufacturer ends up better served than either lender could deliver alone. Most of our manufacturing deals start with a banker referral and the depository relationship stays with the bank throughout."
      }
    ],
    publicCaseStudyTitle: "Total Working Capital" // Labels Manufacturer, TX — $1.2MM
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. GOVERNMENT CONTRACTORS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "government-contractors",
    name: "Government Contractors",
    title: "Government Contract Financing: Federal, State & Local",
    excerpt: "Government contracts pay net-30 to net-90+, and subs wait even longer. Specialized factoring underwrites against the contract, not your balance sheet.",
    hook: "The U.S. government is one of the best-credit customers on earth. It is also one of the slowest-paying. Specialized contract factoring is what bridges those two facts.",
    image: "/blog/Meeting 4.webp",
    introduction:
      "Government contractors live with a particular tension: your customer's creditworthiness is essentially perfect, and your payment cycle is essentially terrible. Net-30 turns into net-60 turns into net-90 once you factor in invoice processing, prime-to-sub flow, and the occasional government shutdown. The right product is a specialized variant of factoring, government contract financing, that advances up to 90% of contract value, prices at Prime + 2–8%, and funds in 10–20 business days. It's a cousin to commercial factoring but underwritten differently, because the lender is reading the contract itself, not just your AR aging.\n\nThis matters most for subcontractors. If you're a sub waiting on a prime to get paid by the government, standard commercial factoring often will not touch the deal: too many handoffs, too much dependency on someone else's paperwork. Specialized contract financing reads through that structure and underwrites against the underlying federal, state, or local award. Subs on GSA, DoD, and state contracts who can't get conventional factoring can usually get this.\n\nDeals run from $250K up to $50MM and beyond. Approval typically lands in 5–10 business days, funding inside 20. Retainage structures (where the government holds back 5%–10% of contract value until completion) are common and lenders price for them; they do not break the deal but they do tighten the borrowing base. We also see prime contractors on long-cycle awards layer in bridge capital and equipment financing for the upfront materials and labor before the first invoice generates.\n\nFor smaller contractors, a revenue-based working capital line sometimes makes more sense than contract factoring. It's faster, it's cheaper for short bursts, and it doesn't require the contract assignment paperwork. The cleanest answer depends on the size of the award, how long the cycle is, and how clean the contract documentation reads.",
    challenges: [
      "Net-30 to net-90+ payment cycles on government contracts, often stretching to 120+ days with processing time and disputes",
      "Subcontractors waiting on prime contractor payment add another full payment cycle on top of the government's",
      "Retainage structures (5%–10% withheld until contract completion) tie up working capital for months after the work is done",
      "Upfront materials, labor, and mobilization costs hit before the first invoice can be generated",
      "Standard commercial factoring often won't touch subcontractor deals because of prime-to-sub payment dependency",
      "Government shutdowns and continuing resolutions create payment delays that bank lines aren't designed to absorb",
      "Bid bond and performance bond requirements compete with working capital for the same dollars"
    ],
    recommendedSolutions: [
      {
        solutionId: "government-contracts",
        rank: 1,
        why: "Purpose-built for this. Advances up to 90% of contract value against federal (GSA, DoD), state, or local awards. Prime + 2–8%. Underwrites against the contract itself, which is why subcontractors can qualify here even when standard factoring won't touch the deal."
      },
      {
        solutionId: "invoice-factoring",
        rank: 2,
        why: "For prime contractors with clean commercial-style invoicing and shorter cycles, standard factoring still fits. 85%–90% advance, 24–48 hour funding once onboarded."
      },
      {
        solutionId: "working-capital-loans",
        rank: 3,
        why: "For smaller contractors or short-burst capital needs (covering mobilization, payroll on a new task order), revenue-based capital funded in days at 10%–15% of revenue beats the paperwork cycle of true contract financing."
      },
      {
        solutionId: "asset-based-lending",
        rank: 4,
        why: "At scale, established government contractors with multiple awards, AR, and equipment graduate to a single ABL line covering the whole picture at Prime + 1–4%."
      },
      {
        solutionId: "bridge-funding",
        rank: 5,
        why: "Short-term, often interest-only capital to cover upfront materials, labor, and mobilization before the first contract invoice generates. Closes in days, exits when the contract pays."
      },
      {
        solutionId: "equipment-leasing",
        rank: 6,
        why: "For specialized equipment required by a specific contract: generators, vehicles, IT infrastructure. 60–84 month terms typical so monthly debt service matches the contract life."
      }
    ],
    whatDoesntFit: [
      {
        solutionId: "inventory-financing",
        why: "Most government contracts aren't inventory-heavy. The cost being carried is labor, services, and materials consumed in performance, which is what contract financing handles directly."
      },
      {
        solutionId: "purchase-order-funding",
        why: "PO funding is built for commercial purchase orders with a finished-goods delivery and an invoice cycle. Government task orders and IDIQ structures don't usually fit that mold cleanly."
      }
    ],
    workedExample:
      "A federal subcontractor doing $5MM in annual revenue across a handful of DoD task orders runs on net-60 payment terms from a prime, who in turn waits net-30 to net-45 from the government, so the effective payment cycle to the sub stretches 90 to 120 days. Payroll is weekly. The bank declined a line of credit because the contract concentration looked too risky and the sub's tax returns showed losses two years ago during a slow period.\n\nThe structure is a $2MM specialized contract financing facility advancing 85% against the eligible task order receivables, priced at Prime + 5%. Approval lands in eight business days, first funding inside three weeks. The lender takes assignment of the receivables (via a federal Assignment of Claims Act filing for the DoD work), sets up a controlled account for payments, and works directly with the prime's AP team to confirm invoice acceptance.\n\nThe outcome: the 90-to-120-day cycle becomes a 48-hour cash conversion on each accepted invoice. The sub takes on two additional task orders inside the first six months because the cash flow finally supports the staffing ramp. Two years later, with cleaner financials and a more diversified contract base, the facility resizes and migrates to a conventional ABL structure at lower pricing.",
    mikeQuotes: [
      {
        quote:
          "We are like a broker that represents our clients to the lending world, alternative from banks, because there's a lot of players out there, good players, bad players, different kinds of players, and different kinds of solutions, of course.",
        context: "Mike on why an advisor matters in a specialized corner like government contract financing. The lender universe is small, the structures are technical, and the players vary widely in quality."
      },
      {
        quote:
          "I'd rather under promise and over deliver and not the other way around.",
        context: "Mike on managing expectations through government contract diligence cycles, which often run longer than commercial deals because of contract assignment paperwork and federal documentation."
      },
      {
        quote:
          "We're a, sort of funding is our own, my wife and I work it together. It's a business financing advisory. We're not a direct lender. We are like a broker that represents our clients. Bankers that we partner with are often introducing us when a client has a need that the bank can't fulfill for one reason or another.",
        context: "Mike's company intro. Government contractors are one of the most common bank referrals. Banks like the credit quality of the customer but can't size to the payment timing."
      }
    ],
    faqs: [
      {
        question: "Why is government contract financing different from standard factoring?",
        answer:
          "Two reasons. First, the lender underwrites the contract itself (the agency, the task order, the assignment paperwork), not just your AR aging. Second, federal contracts require a formal Assignment of Claims Act filing for the lender to receive payment directly. Standard factors often don't have the infrastructure for that. Specialized contract financiers do, which is why they can handle subcontractor deals and longer-cycle awards that wouldn't fit a commercial factor."
      },
      {
        question: "I'm a subcontractor. Can I still get financing?",
        answer:
          "Often, yes, through specialized contract financing rather than standard commercial factoring. The lender reads through to the prime's contract with the government and structures around that. Most commercial factors won't take a sub-tier position because there are too many points of failure in the payment chain. The specialty lenders are built for it."
      },
      {
        question: "What advance rate should I expect on a government contract?",
        answer:
          "Up to 90% of contract value on strong federal and state awards, sometimes a bit lower for smaller agencies or longer cycles. Pricing runs Prime + 2–8% depending on contract type, term, and your performance history. Approval is generally 5–10 business days; funding inside 20 once the assignment paperwork is in place."
      },
      {
        question: "How does retainage affect the facility?",
        answer:
          "Retainage, the 5%–10% the government withholds until contract completion, usually gets excluded from the borrowing base while it sits in retention. It is not lost, but it's not financeable until it's released. Lenders price the rest of the contract accounting for the retention, so a 10% retainage facility on a $2MM contract effectively works against $1.8MM of borrowing base."
      },
      {
        question: "What happens to my facility during a government shutdown?",
        answer:
          "It depends on the lender. Specialized contract financiers tend to ride through short shutdowns because they know the payment will resume, and adjust the eligible AR aging buckets accordingly. Some lenders will allow extensions on past-due invoices specifically for shutdown-related delays. The conversation we always have on the front end is what happens if payment stretches past 90 days for reasons unrelated to your performance."
      },
      {
        question: "Can I layer in bridge capital for mobilization on a new task order?",
        answer:
          "Yes, and it's a common move. Bridge funding closes in days, sized for upfront materials, labor, and mobilization, then exits as soon as the contract financing line picks up the first invoice. Interest-only structures are typical, with aggressive early-payoff discounts so you only pay for the days you actually use the capital."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. CONSTRUCTION
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "construction",
    name: "Construction & Contracting",
    title: "Construction Financing: Progress Billing & Equipment",
    excerpt: "Progress billings, retainage, and equipment-heavy balance sheets define construction funding. The right answer almost always layers three products.",
    hook: "Construction cash flow has three timing problems (billings, retainage, and equipment) and one funding stack that solves all three.",
    image: "/blog/Construciton meeting.webp",
    introduction:
      "Construction is where the layered-capital approach earns its keep. The cash flow has structural timing gaps in three places: progress billings (you bill against work completed, but payment lags by 30–60 days), retainage (5%–10% of contract value held back until completion, sometimes for months after substantial completion), and equipment carrying costs (the gear has to be on the job before the first dollar invoices). No single product solves all three. The right answer is usually a combination.\n\nThe primary tool for general contractors and subs with progress billings against commercial or government owners is AR-based financing: either standard factoring on the commercial side or government contract financing for federal, state, and local work. Advance rates land at 80%–90% on eligible billings, with retainage carved out of the borrowing base until release. Specialty trades (electrical, mechanical, framing, roofing, foundation) often start in factoring and graduate to ABL once revenue passes $5MM and financials clean up.\n\nEquipment financing is the second pillar. Construction is equipment-heavy by definition, and the right answer for capacity expansion is rarely a working-capital draw. It's a 60–84 month equipment loan or lease against the specific asset, often at single-digit to low-double-digit rates. Sale-leaseback is the move when you need to pull cash from gear you already own (free-and-clear loaders, trucks, tooling) without taking on a new bank covenant.\n\nBridge capital is the third pillar: short, interest-only money to cover bid-to-award timing gaps, mobilization, payroll bumps on a new contract, or to clean up a maxed bank line ahead of bonding renewals. Closes in days, typically exits in 6–12 months with aggressive early-payoff discounts. For contractors trapped in MCAs (a depressingly common situation when a slow quarter hits), debt refinancing is the path back to standard products.",
    challenges: [
      "Progress billings paid net-30 to net-60 from owners or GCs, often longer once disputes and change orders enter the picture",
      "Retainage of 5%–10% held back until substantial completion ties up significant working capital for months after the work is done",
      "Equipment-heavy operations require capital that ties to asset life (loaders, trucks, tooling), not to month-to-month working capital",
      "Bid-to-award timing gaps require upfront cash for mobilization, payroll, and materials before the first billing posts",
      "Bonding renewals create periodic credit pressure that can squeeze the working capital line at the worst moment",
      "Tax returns showing low net income (because of depreciation and aggressive cost accounting) underrepresent the actual cash position to banks",
      "MCAs taken on during a slow quarter can compound quickly into a daily-debit problem that competes with payroll for cash"
    ],
    recommendedSolutions: [
      {
        solutionId: "invoice-factoring",
        rank: 1,
        why: "Standard commercial factoring on progress billings and completed-work invoices. 85%–90% advance on eligible AR, retainage carved out until release. Fits subs and general contractors with commercial or private-owner customers."
      },
      {
        solutionId: "government-contracts",
        rank: 2,
        why: "For contractors with federal, state, or local government awards. Advances up to 90% of contract value; underwrites the contract itself, which is what makes subcontractor deals viable here."
      },
      {
        solutionId: "equipment-leasing",
        rank: 3,
        why: "60–84 month terms on loaders, trucks, tooling, fleet. Sale-leaseback extracts cash from free-and-clear equipment without adding a bank covenant. Rates from single digits to low double digits depending on asset and credit."
      },
      {
        solutionId: "bridge-funding",
        rank: 4,
        why: "Short, interest-only money for bid-to-award timing, mobilization, or bonding renewals. Closes in days, exits in 6–12 months with aggressive early-payoff discounts."
      },
      {
        solutionId: "asset-based-lending",
        rank: 5,
        why: "At $5MM+ revenue with clean financials, an ABL line combining AR, equipment, and sometimes inventory replaces multiple smaller facilities at Prime + 1–4%."
      },
      {
        solutionId: "debt-refinance",
        rank: 6,
        why: "For contractors stacked with MCAs after a slow quarter. The path out is usually a longer-term asset-based product that pays off the daily-debit advances at closing and reduces monthly debt service 30%–50%."
      },
      {
        solutionId: "real-estate-lending",
        rank: 7,
        why: "If the contractor owns the yard, shop, or office, a cash-out refinance is almost always the cheapest capital, Prime + 2–7%, and frees working capital for the business."
      }
    ],
    whatDoesntFit: [
      {
        solutionId: "purchase-order-funding",
        why: "Construction work isn't structured around finished-goods POs the way manufacturing is. The cost being carried is labor, equipment time, and consumable materials performed on the project, which AR-based financing handles directly."
      },
      {
        solutionId: "inventory-financing",
        why: "Most contractors don't carry inventory at cost in a way an inventory lender can underwrite. Materials are typically consumed on the job, not held on a shelf."
      }
    ],
    workedExample:
      "A specialty contractor with $4MM in revenue and a husband-and-wife ownership team carries $600K in progress billings on net-45 terms with two general contractors. The bank line is $250K and they just got notice it won't renew. The previous tax year showed a loss after one large dispute pushed an invoice past 90 days. They have $400K of free-and-clear equipment (loaders, trucks, a few specialty tools) and an upcoming bonding renewal that requires demonstrating working capital.\n\nThe structure layers three products. First, a $750K commercial factoring line at an 87% advance rate on eligible billings, retainage carved out until release; this clears the existing bank line at closing and gives ongoing working capital that tracks the AR. Second, a $250K sale-leaseback on the free-and-clear equipment over 48 months, pulling cash out of equity sitting on equipment that wasn't generating leverage. Third, a $150K bridge with aggressive early-payoff terms to clean up a pair of MCAs taken on during the previous slow quarter.\n\nThe outcome: monthly debt service drops sharply versus the pre-restructure picture because the MCA daily debits are gone. Working capital availability roughly triples. The bonding renewal lands clean. Twelve months later, with the factoring line seasoned and the books cleaner, the contractor refinances the sale-leaseback into a longer-term equipment note at a better rate.",
    mikeQuotes: [
      {
        quote:
          "There are a number of avenues to explore, but I definitely don't want to make any promises. I'd rather under promise and over deliver and not the other way around.",
        context: "Mike on managing expectations through construction deal structuring, where retainage, change orders, and bonding requirements often add complications that come into focus only mid-diligence."
      },
      {
        quote:
          "If you had real estate, with either free-and-clear or with a first mortgage where there's some equity behind it, if your biggest driver, for instance, was cost of capital, I'd start with let's talk about any real estate assets you have, because real estate is always going to command the lowest rates.",
        context: "Mike on the layered-capital framework, relevant for contractors who own their yard, shop, or office and want to pull the cheapest dollars first."
      },
      {
        quote:
          "The problem with MCAs is, the most logical way to describe it is, it's like a drug, that people get addicted to. They sell it real cleverly.",
        context: "Mike on the MCA spiral. Painfully common in construction during slow quarters, and the reason debt refinance shows up so often in the recommended stack."
      }
    ],
    faqs: [
      {
        question: "How does factoring work with progress billings?",
        answer:
          "The factor reads the contract and your billing schedule, advances 85%–90% against eligible invoices once the work is signed off, and carves retainage out of the borrowing base until it's released. Funding on a given accepted invoice is 24–48 hours. The lender will typically want to see the AIA forms (or your equivalent) and confirm acceptance with the GC or owner before funding the first time."
      },
      {
        question: "What happens to retainage in a factoring line?",
        answer:
          "Retainage isn't financeable while it's being held. The lender treats it as ineligible until it's released. So if your contracts have 10% retainage on a $1MM project, the lender is sizing the borrowing base off the $900K that's actually due, not the full $1MM. Once retainage releases at substantial completion, it flows through the lockbox normally and the holdback is refunded."
      },
      {
        question: "I have free-and-clear equipment. How much can I pull out of it?",
        answer:
          "Through a sale-leaseback, typically 50%–70% of the appraised value, over a 3 to 5 year term, sometimes longer. It's almost like you're selling the equipment to the lender and then leasing it back from them, just a fancy way of saying that's how you get cash out of it. Useful when you need working capital and don't want to add a bank covenant."
      },
      {
        question: "We took on two MCAs during a slow quarter and now they're killing our cash flow. What's the path out?",
        answer:
          "Honest assessment first. Sometimes the math doesn't work and we'll tell you that. When it does, the structure is usually a longer-term asset-based product (factoring against your billings, sale-leaseback against your equipment, or an ABL line if you're at the right size) that pays off the daily-debit advances at closing and replaces them with a single monthly payment. The path out is rarely in one leap. It's a few steps up the ladder, but moving in the right direction matters."
      },
      {
        question: "How does this interact with my bonding capacity?",
        answer:
          "Surety carriers care about working capital and net worth, not specifically how you finance your receivables. A factoring line that gives you predictable cash flow against your billings often improves your bonding picture because the working capital ratio cleans up. We've had multiple construction clients use a new financing structure as part of the conversation with their surety to expand bonding capacity."
      },
      {
        question: "Are residential contractors covered too, or just commercial?",
        answer:
          "Mostly commercial and government, because residential receivables are typically owed by individuals rather than businesses, and that doesn't underwrite well as a borrowing base. Residential general contractors with consistent draw schedules through banks or institutional owners can sometimes get there. The honest answer is we'd ask about your customer mix before promising fit."
      },
      {
        question: "What about an SBA loan for buying out a partner or acquiring a competitor?",
        answer:
          "SBA can fit, particularly the 7(a) for partner buyouts and the 504 for real estate or fixed assets. We typically refer SBA out to non-bank SBA lenders who have more flexibility than traditional banks and can sometimes get a deal done without a personal residence lien. While that runs, we usually structure a short-term bridge to hit the deadline and convert to SBA later."
      }
    ],
    publicCaseStudyTitle: "Refi Of Termed Bank Line" // Steel Framing Contractor, GA — $300K
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. E-COMMERCE / DTC
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ecommerce-dtc",
    name: "E-commerce & Direct-to-Consumer",
    title: "E-commerce & DTC Financing: Inventory & Revenue-Based",
    excerpt: "Without B2B invoices, classic factoring usually doesn't fit DTC. The real tools are inventory financing, revenue-based capital, and PO funding for big launches.",
    hook: "No B2B invoices means no factoring. The real DTC question is whether your capital need lives in inventory, in customer acquisition spend, or in supplier production.",
    image: "/blog/Cofee.webp",
    introduction:
      "Direct-to-consumer is the one industry on this list where invoice factoring usually doesn't fit. The reason is simple: you're selling to individuals, not to businesses, and there is no commercial receivable to advance against. Payments hit your Stripe or Shopify account in 1–3 days, which is great for cash flow but doesn't generate the kind of asset that a factoring line is built around. So the funding playbook is different, and the right tools are inventory financing, revenue-based working capital, and (for big production runs and international suppliers) PO funding.\n\nInventory financing is the closest analog to factoring for an inventory-heavy DTC brand. We know of a small handful of specialty lenders who do e-commerce inventory specifically, including one of our asset-based lenders who runs a standalone inventory financing program for e-commerce sellers. Structures look like a revolving line backed by inventory at cost, with advance rates typically 40%–50% on finished goods, and pricing landing in a Prime + 6–12% range. The lender wants senior position on inventory, a clear picture of how the goods move (Amazon FBA warehouses, 3PL inventory, on-site stock), and a math-backed forecast.\n\nRevenue-based working capital is the most common tool for DTC brands under $5MM in revenue or for brands whose inventory mix is too dispersed to anchor a true asset-based deal. It underwrites against historical Shopify, Amazon, or Stripe revenue, typically sizing the line at 10%–15% of trailing 12-month revenue. The best lenders price in the mid-teens APR, better than most people expect, and operate as a true revolving line where you pay it off and re-borrow. Weaker lenders (and most of the MCA universe) take a daily debit and structure as fixed-cost factor-rate advances; we're transparent about which is which and steer people away from the predatory end.\n\nPO funding kicks in for big production runs, international suppliers, and tariff-impacted launches, paying overseas factories 70%–100% of confirmed order cost so you don't have to burn equity capital on raw materials. The exit on a DTC PO deal usually isn't a factoring line (no B2B invoice). It's the inventory financing facility once the goods land, or the revenue cycle once the launch hits market.",
    challenges: [
      "No B2B receivables means classic invoice factoring usually isn't an option. The capital tools are inventory-based or revenue-based instead",
      "Inventory builds ahead of seasonal launches tie up significant working capital, especially with international suppliers and tariff exposure",
      "Customer acquisition spend on Meta, Google, and TikTok competes with inventory dollars for the same cash",
      "Amazon FBA and 3PL inventory complicates lender diligence because the goods are physically held by a third party",
      "Bank lines often don't size to DTC growth because the financials look unconventional (heavy ad spend, gross-margin variability, seasonal swings)",
      "Many DTC brands get pushed into MCAs because the speed of capital matches the speed of opportunity, but the daily debits crush the gross margin",
      "Returns and chargebacks create AR-like uncertainty that inventory lenders price for"
    ],
    recommendedSolutions: [
      {
        solutionId: "inventory-financing",
        rank: 1,
        why: "The closest analog to factoring for a DTC brand. Revolving line backed by inventory at cost, typically 40%–50% advance on finished goods. A small lender universe does this specifically for e-commerce; we know one ABL lender with a standalone e-commerce inventory program."
      },
      {
        solutionId: "working-capital-loans",
        rank: 2,
        why: "Revenue-based capital underwriting against Shopify, Amazon, or Stripe revenue. Sized at 10%–15% of trailing revenue. The best lenders run a true revolving line in the mid-teens APR; we steer people away from the predatory daily-debit end of the market."
      },
      {
        solutionId: "purchase-order-funding",
        rank: 3,
        why: "For large production runs and international suppliers. Pays overseas factories 70%–100% of confirmed order cost so you don't burn equity on materials. Especially useful for tariff-impacted launches where bulk-order discounts offset the cost of the PO facility."
      },
      {
        solutionId: "asset-based-lending",
        rank: 4,
        why: "For DTC brands at $10MM+ with substantial inventory positions, an ABL structure combining inventory plus any commercial AR (wholesale, Amazon Vendor Central) can replace stacked smaller facilities at Prime + 1–5%."
      },
      {
        solutionId: "debt-refinance",
        rank: 5,
        why: "Painfully common for DTC brands: MCAs taken on for ad spend during a launch that didn't return. The path out is usually a longer-term inventory-backed or revenue-based product that pays off the daily debits at closing."
      }
    ],
    whatDoesntFit: [
      {
        solutionId: "invoice-factoring",
        why: "DTC sells to individuals, not businesses, so there's no B2B receivable to factor. The cash from a sale hits your Stripe or Shopify account in 1–3 days, fast but not a financeable asset in the factoring sense. The only exception is wholesale or Amazon Vendor Central revenue, which carries a real commercial invoice."
      },
      {
        solutionId: "government-contracts",
        why: "By definition, not applicable. DTC sells to consumers, not government agencies."
      },
      {
        solutionId: "sba-loans",
        why: "SBA can fit some DTC acquisitions or real estate, but the 4–12 week underwriting cycle rarely matches the speed at which a DTC brand needs to react to seasonality, launches, or ad-spend windows. We refer SBA out when it fits and use faster tools for the rest."
      }
    ],
    workedExample:
      "A DTC beverage brand doing $7MM in trailing 12-month revenue on Shopify and Amazon carries about $1.2MM of inventory at cost: finished goods split between a 3PL warehouse in Pennsylvania and Amazon FBA. They have a Q4 launch coming up that requires producing 40% more units than usual, sourced overseas, with a tariff window that closes in 90 days. The bank declined working capital because the financials look unconventional (heavy ad spend, modest net income, seasonal swing).\n\nThe structure layers two products. First, a $600K inventory financing line at a 45% advance on finished goods at cost, with the 3PL signing a bailment letter giving the lender visibility into inventory at the warehouse; pricing comes in at Prime + 8%. Second, a $900K PO funding facility for the overseas production run, paying the supplier 80% of cost at 2.25% per 30 days, with the exit happening as the goods land and roll into the inventory facility.\n\nThe outcome: the Q4 launch ships on time, ahead of the tariff change, with the bulk-order discount more than offsetting the cost of the PO facility. The brand keeps its equity capital free for ad spend through the launch window. Twelve months later, with the inventory line seasoned and revenue at $11MM, the conversation shifts to whether a full ABL structure makes sense as the next step.",
    mikeQuotes: [
      {
        quote:
          "One of our asset-based lenders has a standalone inventory financing program, but only for e-commerce inventory. We're talking prime plus two kind of rate, revolving line type of structure. But they need to have a senior on inventory.",
        context: "Mike on the e-commerce inventory product, one of the few specialty lenders running a true standalone inventory facility for DTC brands."
      },
      {
        quote:
          "There's a great lender that we have that does a revolving line and can go up to 350k. Their rate is actually lower, like their true APR rate is like in the mid teens. So it's actually even lower than 2% a month. They don't have to be senior lien, so you could have a factor line, and if you needed access to more capital, they could come in as a subordinate to that.",
        context: "Mike on the better end of the revenue-based market, the lenders that look like a working capital line rather than a daily-debit MCA. Particularly relevant for DTC brands sized below the inventory-financing threshold."
      },
      {
        quote:
          "The problem with MCAs is, the most logical way to describe it is, it's like a drug, that people get addicted to. They prey on people who are just naive or desperate or both.",
        context: "Mike on the MCA trap. DTC brands are particularly vulnerable because the speed of capital matches the speed of launches and ad windows. The path in is fast, the path out usually isn't."
      }
    ],
    faqs: [
      {
        question: "Why doesn't classic invoice factoring work for my DTC brand?",
        answer:
          "Because factoring advances against a B2B invoice, a commercial receivable owed by another business, and you're selling to individuals. When a customer buys through your Shopify checkout, the cash hits your account in 1–3 days. That's faster than any factor could advance, but it also means there's no aging receivable to finance. The exception is wholesale revenue, Amazon Vendor Central, or other true B2B channels you may have on top of your DTC business. Those carry real commercial invoices and can be factored normally."
      },
      {
        question: "What inventory financing actually exists for e-commerce?",
        answer:
          "A small specialty market. We know of a couple of ABL-style lenders running standalone e-commerce inventory programs: revolving lines at roughly 40%–50% advance on finished goods at cost, structured around senior position on inventory and a clear picture of how goods move through your 3PL or FBA. Pricing typically lands in a Prime + 6–12% range. The diligence is more involved than a working capital line because the lender needs visibility into inventory they often can't physically touch (FBA, 3PL)."
      },
      {
        question: "What's the difference between a working capital line and an MCA for my brand?",
        answer:
          "The repayment structure and the true cost. A real working capital line, the kind we steer people toward, is a revolving facility with monthly payments at an APR in the mid-teens, sometimes pushing low 20s. An MCA is a fixed-cost advance with a daily or weekly debit and a true APR that can climb into the 50s or higher, sometimes triple digits on the worst end. We are transparent about which lender does which structure before any deal moves forward."
      },
      {
        question: "When does PO funding make sense for a DTC brand?",
        answer:
          "For large production runs with overseas suppliers, especially when there's a tariff window, a launch deadline, or a bulk-order discount that justifies the cost. The PO lender pays your supplier 70%–100% of confirmed order cost at roughly 1.5%–3% per 30 days, and the exit happens when the goods land and roll into your inventory financing facility (or, less cleanly, when the launch revenue comes in). It's a way to preserve your equity capital for ad spend through the launch."
      },
      {
        question: "I took on multiple MCAs to fund ad spend on a launch that didn't return. What now?",
        answer:
          "We start with honest assessment. Sometimes the math doesn't work and we'll tell you that. Better to know early than spend three weeks chasing a deal that won't close. When it does work, the structure is usually a longer-term inventory-backed or revenue-based product that pays off the MCAs at closing and replaces them with one manageable monthly payment. The move out of MCAs is rarely one leap from the basement to the first floor. It's a few steps up the ladder, but the direction is what matters."
      },
      {
        question: "How fast can a revenue-based line close for a DTC brand?",
        answer:
          "Faster than most other products. A clean revenue-based working capital deal can close in days once the lender has bank statements, processor statements, and a basic data package. Inventory financing takes longer, typically 4 to 6 weeks because of the diligence involved in inventory visibility and 3PL or FBA structure. PO funding lands somewhere in between, usually 2 to 4 weeks for approval and 5–10 business days for first funding once the structure is in place."
      },
      {
        question: "Do I need wholesale revenue to qualify for anything besides revenue-based capital?",
        answer:
          "Not necessarily. Inventory financing underwrites against inventory at cost, regardless of whether you sell DTC or wholesale, so a pure DTC brand with $1MM+ of inventory can qualify on that basis. Wholesale revenue helps because it adds a commercial receivable component that some lenders like seeing, and at scale a hybrid DTC-plus-wholesale brand can qualify for ABL covering both inventory and AR in a single facility. The exact mix dictates the product fit."
      }
    ]
  }
]

export function getIndustryIds(): string[] {
  return industries.map((i) => i.id)
}

export function getIndustry(id: string): IndustryPage | undefined {
  return industries.find((i) => i.id === id)
}
