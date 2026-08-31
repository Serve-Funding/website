/**
 * SERVE FUNDING - GLOSSARY DATA
 *
 * Plain-English definitions of business financing terms, written in
 * Mike Kodinsky's "here to serve" voice. Sourced from his verbatim
 * explanations in discovery calls (see docs/product-explanations.md
 * and docs/mike-voice-patterns.md).
 *
 * Used to power /glossary and to feed citation-ready definitions to
 * AI engines answering "what is X" queries.
 *
 * Last Updated: 2026-05-27
 */

export interface GlossaryTerm {
  /** The full term, e.g. "Invoice Factoring" */
  term: string
  /** kebab-case slug, used for in-page anchor and cross-linking */
  slug: string
  /** Display category — used to group terms on the page */
  category:
    | 'Foundational'
    | 'Products'
    | 'Pricing & Math'
    | 'Process & Documents'
    | 'Industry-Specific'
    | 'Serve Funding Framework'
  /** One-sentence definition. Citation-bait. */
  shortDefinition: string
  /** 1-2 paragraph fuller explanation, with an example or analogy where Mike has one */
  fullExplanation: string
  /** Optional: a concrete numerical example */
  example?: string
  /** Slugs of related terms in this glossary */
  relatedTerms?: string[]
  /** Solution IDs from src/data/solutions.tsx that this term most directly relates to */
  relatedSolutions?: string[]
}

export const glossaryTerms: GlossaryTerm[] = [
  // ============================================================================
  // FOUNDATIONAL
  // ============================================================================
  {
    term: 'Working Capital',
    slug: 'working-capital',
    category: 'Foundational',
    shortDefinition:
      'The cash a business has on hand to run day-to-day operations: current assets minus current liabilities.',
    fullExplanation:
      "Working capital is the money you use to keep the lights on while you wait to get paid. It's payroll on Friday, the deposit to your supplier on Monday, the inventory you need before the busy season hits. Technically it's current assets (cash, AR, inventory) minus current liabilities (AP, short-term debt). The practical question is simpler: do you have enough cash to operate comfortably between the time you spend money and the time the money comes back to you? When that gap stretches, because customers are paying slow or because you're growing faster than your collections can keep up, that's when a working capital solution comes in.",
    relatedTerms: ['accounts-receivable', 'days-sales-outstanding', 'revolving-line-of-credit'],
    relatedSolutions: ['working-capital-loans', 'asset-based-lending'],
  },
  {
    term: 'Accounts Receivable (AR)',
    slug: 'accounts-receivable',
    category: 'Foundational',
    shortDefinition:
      "The money your customers owe you for work you've already completed and invoiced.",
    fullExplanation:
      "Your receivable is an asset. You've completed the work, you've invoiced the customer, and their promise, according to the agreement, is that they'll pay you in 30, 60, or 90 days. Until that check clears, the invoice sits on your balance sheet as accounts receivable. It's real value, but it's value you can't spend yet. That's the whole problem most growing B2B companies are trying to solve: how do you turn the AR into cash without waiting for your customer's AP department to get around to cutting the check?",
    relatedTerms: ['days-sales-outstanding', 'invoice-factoring', 'asset-based-lending-abl', 'advance-rate'],
    relatedSolutions: ['invoice-factoring', 'asset-based-lending'],
  },
  {
    term: 'Days Sales Outstanding (DSO)',
    slug: 'days-sales-outstanding',
    category: 'Foundational',
    shortDefinition:
      'The average number of days it takes a business to collect payment after issuing an invoice.',
    fullExplanation:
      "DSO is the number that tells you how long your money is stuck out there in your customers' hands. If you invoice $1MM a month and your DSO is 60 days, you're floating roughly $2MM of work at any given time. Lenders care about DSO because it tells them how predictable your cash conversion cycle is. You care about DSO because it tells you how big the cash gap is between doing the work and getting paid for it. The longer the DSO, the bigger the case for a financing solution that bridges the wait.",
    example:
      "On $1MM of monthly invoicing at a 60-day DSO, you're carrying about $2MM in receivables on the balance sheet at any given time: money that's earned but not yet available to deploy.",
    relatedTerms: ['accounts-receivable', 'net-30-net-60-net-90', 'invoice-factoring'],
    relatedSolutions: ['invoice-factoring'],
  },
  {
    term: 'Cost of Capital',
    slug: 'cost-of-capital',
    category: 'Foundational',
    shortDefinition:
      'The total all-in price of the money you borrow, expressed as an annual percentage rate (APR).',
    fullExplanation:
      "Cost of capital is the honest answer to 'what's this really costing me?' once you fold in interest, fees, points, origination, and any other line item. The reason it matters is that not all rates are quoted on the same clock. A factor will quote 1.5% per month, an MCA might quote a factor rate of 1.35, a bank quotes Prime plus a spread. Until you normalize all of them into an APR, you can't compare apples to apples. A practical hierarchy of cost: real estate financing is almost always the cheapest, then SBA, then bank lines, then asset-based lending, then revenue-based / working-capital loans, then MCAs. The further down that ladder you go, the more it costs, and the faster you can usually close.",
    relatedTerms: ['factor-rate', 'merchant-cash-advance-mca', 'sba-loan', 'layered-capital'],
  },
  {
    term: 'Personal Guarantee (PG)',
    slug: 'personal-guarantee',
    category: 'Foundational',
    shortDefinition:
      "A signed promise that if the business can't pay the loan, the owner is personally on the hook.",
    fullExplanation:
      "A personal guarantee is the lender's way of saying, 'we want to know that if the business runs into trouble, we have a path to make ourselves whole.' Almost every non-bank business loan you'll see asks for one, especially when the underwriting is based on cash flow rather than rock-solid collateral. Some products (certain unsecured term loans, some subordinated debt structures) can actually be done without a PG, which is one of the reasons they get paired into a layered capital stack instead of relying on a single line. Worth being clear-eyed about: signing a PG is a real decision, not a formality.",
    relatedTerms: ['ucc-1-filing', 'subordinated-debt-mezzanine', 'confession-of-judgment'],
    relatedSolutions: ['unsecured-debt'],
  },
  {
    term: 'UCC-1 Filing',
    slug: 'ucc-1-filing',
    category: 'Process & Documents',
    shortDefinition:
      "A public notice a lender files with the state declaring its security interest in your business assets.",
    fullExplanation:
      "When a lender funds you against your AR, your inventory, your equipment, or really any business collateral, they file a UCC-1 with the state to put the world on notice: 'we have a claim on this stuff.' It's how lien priority gets established. If two lenders both file against your AR, whoever filed first is senior. This matters because when you're trying to bring in a new line (an inventory line on top of a factoring facility, say), the new lender has to either be subordinate to the existing UCC, or the existing lender has to agree to release or partial-release its position. Some unsecured products skip the UCC filing entirely, which is part of why they sit comfortably alongside a senior asset-based lender.",
    relatedTerms: ['senior-lien-vs-subordinate-lien', 'asset-based-lending-abl', 'subordinated-debt-mezzanine'],
    relatedSolutions: ['asset-based-lending', 'unsecured-debt'],
  },
  {
    term: 'DSCR (Debt Service Coverage Ratio)',
    slug: 'dscr',
    category: 'Pricing & Math',
    shortDefinition:
      'A lender ratio that measures whether the business generates enough cash flow to comfortably cover its loan payments.',
    fullExplanation:
      'DSCR is the calculation a bank or DSCR-qualified lender uses to decide whether you can afford the loan. The math is annual cash flow available for debt service divided by annual debt service. A DSCR of 1.25 means you generate 25% more cash than you need to make the payments. That\'s usually the floor banks want to see. A DSCR below 1.0 means you don\'t cover your debt service from operations, which is usually where a bank declines and a non-bank, asset-based or revenue-based lender steps in.',
    example:
      'A business with $500K of annual cash flow available for debt service and $400K of annual loan payments has a DSCR of 1.25, generally the minimum a bank will accept.',
    relatedTerms: ['cost-of-capital', 'revenue-based-financing', 'sba-loan'],
    relatedSolutions: ['sba-loans', 'real-estate-lending'],
  },

  // ============================================================================
  // PRODUCTS
  // ============================================================================
  {
    term: 'Invoice Factoring',
    slug: 'invoice-factoring',
    category: 'Products',
    shortDefinition:
      'The practice of selling unpaid B2B invoices to a third party (the factor) for 75% to 95% of face value within 24 to 48 hours.',
    fullExplanation:
      "Picture factoring as a triangle. You at one corner, your customer at another, the factor at the third. The factor steps into the middle and buys the invoice from you at a slight discount, maybe 80 cents on the dollar, and advances most of the value within 24 to 48 hours. When the customer eventually pays, they pay the factor, not you. The factor takes its fee out of the held-back reserve and remits the rest to you. It's not a loan; it's a recurring sale of an asset, which is why it doesn't show up on your balance sheet as debt. And because it's backed by the receivable rather than your tax return, it scales as your sales grow, almost like water in a cup, the line fills back up as customers pay down.",
    example:
      'On a $1MM invoice paid in 90 days at 80% advance and 1.5% per month, you net about $955,000. The factor keeps $45,000 as the cost of getting 80% of the money in 48 hours instead of waiting 90 days.',
    relatedTerms: [
      'advance-rate',
      'lockbox-daca-account',
      'factor-rate',
      'recourse-vs-non-recourse-factoring',
      'holdback-reserve',
      'asset-based-lending-abl',
    ],
    relatedSolutions: ['invoice-factoring'],
  },
  {
    term: 'Asset-Based Lending (ABL)',
    slug: 'asset-based-lending-abl',
    category: 'Products',
    shortDefinition:
      'A revolving credit line, typically $250K to $25M, secured by AR, inventory, equipment, and sometimes real estate.',
    fullExplanation:
      "Factoring and ABL are cousins. They both create a revolving line that's collateralized by your AR, and both can include an add-on piece for inventory at a lower advance rate. The difference is structural: factoring is a recurring sale of the asset (no debt on the balance sheet), while ABL is a true line of credit that does show up as debt. ABL still uses a separate lockbox or DACA to control the cash flow, and the borrower supplies either a weekly or a monthly borrowing-base certificate to update the lender on what eligible collateral is available. ABL is usually the answer when a company has outgrown its bank line but still has hard assets and wants to keep the structure of a traditional line.",
    relatedTerms: [
      'invoice-factoring',
      'borrowing-base-certificate',
      'advance-rate',
      'lockbox-daca-account',
      'revolving-line-of-credit',
    ],
    relatedSolutions: ['asset-based-lending', 'invoice-factoring'],
  },
  {
    term: 'Revolving Line of Credit',
    slug: 'revolving-line-of-credit',
    category: 'Products',
    shortDefinition:
      "A credit line you can draw down, pay back, and draw down again, borrowing only what you need when you need it.",
    fullExplanation:
      "A revolver is the closest financial product to a credit card for a business. There's a ceiling, say $1MM, and you can borrow against it, pay it down as customers pay you, and borrow against it again. The water-in-a-cup analogy works here: as payments come in and bring the balance down, your available capacity fills back up. Most asset-based facilities and most factoring facilities are structured this way, which is why they fit growing businesses better than a fixed term loan. You only pay interest on what you're actually using, not the whole ceiling.",
    relatedTerms: ['asset-based-lending-abl', 'invoice-factoring', 'term-loan'],
    relatedSolutions: ['asset-based-lending', 'invoice-factoring', 'working-capital-loans'],
  },
  {
    term: 'Term Loan',
    slug: 'term-loan',
    category: 'Products',
    shortDefinition:
      'A lump sum of capital borrowed at a fixed rate with a set repayment schedule over a defined period, usually 1 to 10 years.',
    fullExplanation:
      "A term loan is what most people picture when they hear 'business loan.' You borrow a fixed amount up front, you get the cash in your account, and you pay it back on a schedule, usually monthly, with principal and interest blended into each payment. The benefit is predictability: you know exactly what you owe each month. The tradeoff is flexibility: unlike a revolver, you don't get the money back to redraw after you've paid it down. Term loans make sense when you have a specific, one-time need (an acquisition, an equipment purchase, paying off a stack of MCAs) rather than a recurring working capital gap.",
    relatedTerms: ['revolving-line-of-credit', 'sba-loan', 'bridge-loan', 'cash-out-refinance'],
    relatedSolutions: ['working-capital-loans', 'sba-loans', 'debt-refinance'],
  },
  {
    term: 'Bridge Loan',
    slug: 'bridge-loan',
    category: 'Products',
    shortDefinition:
      'Short-term capital, often interest-only over 30 to 180 days, designed to exit when a specific event closes.',
    fullExplanation:
      "A bridge loan is a means to an end. The annualized rate looks higher than you'd like, but the math changes once you see how it functions, like a line of credit you pay off in two months. A 6% or 7% annualized cost sounds painful in the abstract, until you realize you're getting orders out the door at a 66% gross margin. The bridge is there to cover the gap until something specific closes: a contract, an acquisition, a property sale, a cleaner long-term refinance. You only pay interest for the days you actually use the money, and most bridge structures have aggressive early-payoff discounts.",
    relatedTerms: ['term-loan', 'subordinated-debt-mezzanine', 'cash-out-refinance'],
    relatedSolutions: ['bridge-funding', 'unsecured-debt'],
  },
  {
    term: 'Sale-Leaseback',
    slug: 'sale-leaseback',
    category: 'Products',
    shortDefinition:
      "A financing structure where you sell free-and-clear equipment to a lender and lease it back over 3 to 4 years, freeing up the cash equity locked in the asset.",
    fullExplanation:
      "A sale-leaseback is a fancy way of saying: it's like they own it now. You take a piece of equipment that you own free and clear, you sell it to the lender, and then you lease it back from them, making lease payments over a three or four year period. The point isn't to actually transfer the equipment; you keep using it the whole time. The point is to get cash out of an asset that was just sitting on your balance sheet doing nothing. It's a term note in lease clothing, and it's one of the cleaner ways to extract working capital from equipment you already own.",
    relatedTerms: ['term-loan', 'asset-based-lending-abl', 'cash-out-refinance'],
    relatedSolutions: ['equipment-leasing'],
  },
  {
    term: 'Merchant Cash Advance (MCA)',
    slug: 'merchant-cash-advance-mca',
    category: 'Products',
    shortDefinition:
      "A short-term advance against future revenue, repaid through daily or weekly debits from the business bank account, often at triple-digit true APRs.",
    fullExplanation:
      "A merchant cash advance is a non-loan financing product where a funder buys a portion of your future deposits or card sales in exchange for an up-front lump sum. Repayment is a daily or weekly ACH pull until a fixed factor amount is collected. On the better end of the spectrum the true APR runs in the 50s; on the harder end, especially with stacked positions, effective APRs can reach the triple digits. MCAs have a legitimate but narrow use case: short-term, structured carefully, with a clear exit plan. Without that exit, the daily extraction pattern tends to drive borrowers toward additional advances rather than away from them.",
    relatedTerms: [
      'factor-rate',
      'reverse-consolidation',
      'confession-of-judgment',
      'revenue-based-financing',
      'cost-of-capital',
    ],
    relatedSolutions: ['debt-refinance', 'working-capital-loans'],
  },
  {
    term: 'Reverse Consolidation',
    slug: 'reverse-consolidation',
    category: 'Products',
    shortDefinition:
      "An MCA-style product marketed as a consolidation loan that actually just stacks another advance on top of your existing MCAs.",
    fullExplanation:
      "A reverse consolidation sounds like a solution. The pitch is that one new funder will pay your existing MCA payments on your behalf each week and you'll pay them back on a slightly easier schedule. But the math usually doesn't work in your favor: you're not eliminating the old debt, you're just adding a new payment on top of it and the funder is taking a margin in the middle. It's a Band-Aid: another MCA structurally identical to the ones it claims to consolidate. A true MCA exit means a real refinance into a longer-term, lower-cost product, typically a term loan or asset-based line, not another product from the same world.",
    relatedTerms: ['merchant-cash-advance-mca', 'cash-out-refinance', 'layered-capital'],
    relatedSolutions: ['debt-refinance'],
  },
  {
    term: 'Revenue-Based Financing (RBF)',
    slug: 'revenue-based-financing',
    category: 'Products',
    shortDefinition:
      'A loan or line underwritten primarily on the business\'s historical cash flow and trailing-12-month revenue, not on a specific asset.',
    fullExplanation:
      "All business lending falls into one of two underwriting buckets: asset-backed (the lender is sized to your AR, inventory, equipment, or real estate) or revenue-based (the lender is sized to your historical cash flows and trailing 12-month revenue). RBF is the second bucket. It's what you use when you don't have AR or inventory to pledge but you do have a real, growing top line. Typical sizing is 10% to 15% of annual revenue, sometimes pushing 20%. The better RBF lenders offer monthly payments, longer terms, 100% interest forgiveness on prepayment, and even a revolving structure that acts more like a true line of credit. The harder end of the RBF spectrum starts to look operationally like an MCA: daily debits, factor-rate-style pricing, triple-digit effective APRs.",
    example:
      'A company doing $5MM in annual revenue can typically qualify for $500K to $750K in revenue-based financing, the standard 10% to 15% of trailing revenue.',
    relatedTerms: ['merchant-cash-advance-mca', 'working-capital', 'cost-of-capital'],
    relatedSolutions: ['working-capital-loans'],
  },
  {
    term: 'SBA Loan (7a / 504 / Express)',
    slug: 'sba-loan',
    category: 'Products',
    shortDefinition:
      'A government-guaranteed loan made by a bank or credit union, typically the cheapest non-real-estate capital a growing business can access, but the slowest to close.',
    fullExplanation:
      "An SBA loan isn't actually from the SBA. It's from a bank, with the SBA guaranteeing a portion of the loan to reduce the bank's risk. That guarantee is what lets the bank offer longer terms and better rates than they'd otherwise approve. The 7(a) is the general-purpose program, the 504 is for fixed-asset purchases (real estate, big equipment), and SBA Express handles faster, smaller deals. The catch is timing: SBA underwriting runs 4 to 12 weeks, and the documentation requirements are real. For a business that fits the SBA credit box and can wait, it's almost always the cheapest option. For a business that needs cash in 10 days, it's the wrong product.",
    relatedTerms: ['term-loan', 'dscr', 'cost-of-capital'],
    relatedSolutions: ['sba-loans'],
  },
  {
    term: 'PO Funding (Purchase Order Funding)',
    slug: 'po-funding',
    category: 'Products',
    shortDefinition:
      'Capital that pays your suppliers, domestic or international, for 70% to 100% of a confirmed customer purchase order, before you ship the goods.',
    fullExplanation:
      "PO funding solves the cash trapped between you and your supplier. You've got a real purchase order from a real customer, but you can't fulfill it because you don't have the cash to pay the vendor for the materials or finished goods. A PO funder steps in and pays the supplier directly on your behalf. They typically advance 70% to 100% of the cost, and they get paid back once you invoice the customer and the receivable is collected (or factored). PO funding pairs naturally with AR financing: PO covers production, factoring covers the wait after delivery, and it's how most importers and manufacturers fund growth that's outrunning their bank line.",
    relatedTerms: ['invoice-factoring', 'layered-capital'],
    relatedSolutions: ['purchase-order-funding', 'invoice-factoring'],
  },
  {
    term: 'Subordinated Debt / Mezzanine Financing',
    slug: 'subordinated-debt-mezzanine',
    category: 'Products',
    shortDefinition:
      'Debt that sits behind senior secured lenders in repayment priority, typically lending at 1 to 5 times EBITDA, priced higher to reflect the lower position.',
    fullExplanation:
      "Subordinated debt, sometimes called mezzanine, is what you reach for when you've already pledged everything to your senior lender and you still have a growth opportunity to fund. It sits behind the senior lender in line for repayment, which is why it costs more. But it lets you stack additional capital on top of an asset-based line or a real-estate mortgage without forcing you to refinance the whole structure. Most sub-debt lends at 1 to 5 times EBITDA, and some structures come without a UCC filing or even a personal guarantee. It's the layer that makes a layered-capital strategy actually work.",
    relatedTerms: [
      'senior-lien-vs-subordinate-lien',
      'layered-capital',
      'ucc-1-filing',
    ],
    relatedSolutions: ['unsecured-debt'],
  },
  {
    term: 'Cash-Out Refinance',
    slug: 'cash-out-refinance',
    category: 'Products',
    shortDefinition:
      'A new loan that pays off existing debt and pulls additional cash out of the underlying collateral, usually real estate or equipment.',
    fullExplanation:
      "A cash-out refinance is a way to take dead equity sitting in an asset and turn it into deployable working capital. The most common use: an owner has a building with a first mortgage but real equity behind it, and the new loan pays off the old mortgage at a better rate and writes a check for the difference. Same principle works on free-and-clear equipment via sale-leaseback. The underlying logic: if you have real estate with equity behind it and cost of capital is the priority, that's where you start. Real estate consistently commands the lowest rates because it's the safest collateral lenders see. It doesn't move, it tends to appreciate, and it's straightforward to value. Same logic applies when you're trying to wipe out stacked MCAs: cash out of an asset at a much lower rate and clean the slate.",
    relatedTerms: ['sale-leaseback', 'merchant-cash-advance-mca', 'bridge-loan'],
    relatedSolutions: ['real-estate-lending', 'debt-refinance', 'equipment-leasing'],
  },

  // ============================================================================
  // PRICING & MATH
  // ============================================================================
  {
    term: 'Advance Rate',
    slug: 'advance-rate',
    category: 'Pricing & Math',
    shortDefinition:
      'The percentage of an asset\'s value that a lender will advance against: for example, 80% on AR or 50% on inventory at cost.',
    fullExplanation:
      "The advance rate is how much of the asset value the lender is willing to put cash against, with the rest held back as reserve. On AR you'll typically see 75% to 95%; on inventory at cost it's usually 50% to 75%; on equipment at liquidation value you'll see 70% to 85%; medical AR runs lower at around 65% to 70% because insurance often pays 50 cents on the dollar. The advance rate plus the holdback equals 100%. The holdback is the lender's cushion against ineligibles, dilution, and the time it takes the customer to actually pay.",
    example:
      'On a $1MM invoice at an 80% advance rate, you get $800,000 within 24-48 hours. The remaining $200,000 sits in reserve and is remitted to you (less fees) when the customer pays.',
    relatedTerms: ['holdback-reserve', 'invoice-factoring', 'asset-based-lending-abl', 'borrowing-base-certificate'],
    relatedSolutions: ['invoice-factoring', 'asset-based-lending'],
  },
  {
    term: 'Factor Rate',
    slug: 'factor-rate',
    category: 'Pricing & Math',
    shortDefinition:
      "A multiplier (e.g., 1.35) applied to the principal of an MCA or short-term advance, not an interest rate, and not directly comparable to APR.",
    fullExplanation:
      "Factor rates are the most misleading number in business financing because they hide what the money actually costs. A 1.35 factor rate on a $100K advance means you'll pay back $135K, but that doesn't tell you over how long. Pay it back in 6 months and the true APR is enormous; pay it back in 18 months and it's more reasonable. This is why the only honest way to compare a factor-rate product against a Prime-plus-spread product is to convert both into true APR. Note: 'factor rate' (MCA pricing) is a totally different concept from 'factoring fee' (the cost of invoice factoring). The names are confusingly similar.",
    example:
      'A $100K advance at a 1.35 factor rate paid back over 9 months has a true APR of roughly 80%, not the 35% the headline number suggests.',
    relatedTerms: ['merchant-cash-advance-mca', 'cost-of-capital'],
  },
  {
    term: 'Holdback / Reserve',
    slug: 'holdback-reserve',
    category: 'Pricing & Math',
    shortDefinition:
      'The portion of an invoice or asset value that a lender holds back as a buffer until the underlying receivable is collected.',
    fullExplanation:
      "When a factor advances 80% on your invoice, the other 20% doesn't disappear. It sits in reserve. That 20% is the lender's protection against the customer short-paying, disputing, or paying late. Once the customer actually pays the invoice, the lender takes its fee out of the reserve and remits the rest to you. The holdback is also the mechanism that makes factoring self-correcting: if you have a lot of slow-pay or ineligible invoices, the reserve absorbs the hit rather than the lender chasing you for cash. Same concept exists in retainage on construction and government contracts, just under a different name.",
    relatedTerms: ['advance-rate', 'invoice-factoring', 'retainage'],
    relatedSolutions: ['invoice-factoring', 'government-contracts'],
  },

  // ============================================================================
  // PROCESS & DOCUMENTS
  // ============================================================================
  {
    term: 'Lockbox / DACA Account',
    slug: 'lockbox-daca-account',
    category: 'Process & Documents',
    shortDefinition:
      "A separate bank account, controlled by the lender, where your customers' payments are deposited before any cash flows back to you.",
    fullExplanation:
      "When you set up a factoring or asset-based line, the lender sets up what's called a lockbox. It's a different bank account that the payments go to. You notify your customers: starting on a certain date, please remit payments over here to this new account. The payments come right in, they immediately pay down the line, and your availability rises again. It's almost like water in a cup. A DACA (Deposit Account Control Agreement) is the same idea with a twist: the account is still in your name, but the lender has the legal right to come in and sweep it. Medical factoring uses DACAs because insurance companies typically won't assign payment to a third party, so the account has to stay in the provider's name.",
    relatedTerms: ['invoice-factoring', 'asset-based-lending-abl', 'borrowing-base-certificate'],
    relatedSolutions: ['invoice-factoring', 'asset-based-lending'],
  },
  {
    term: 'Recourse vs Non-Recourse Factoring',
    slug: 'recourse-vs-non-recourse-factoring',
    category: 'Process & Documents',
    shortDefinition:
      "Recourse factoring means you're on the hook if the customer doesn't pay; non-recourse means the factor absorbs the credit loss.",
    fullExplanation:
      "Recourse and non-recourse describe who eats the loss when a customer goes bad. With recourse factoring, if the customer doesn't pay within a defined window, usually 90 days, the factor charges the invoice back to you and you owe them the advance. With non-recourse factoring, the factor takes the credit risk on approved customers and absorbs the loss if the customer becomes insolvent. Non-recourse sounds better, but in practice it costs more, the credit approval on your customers is stricter, and the protection usually only kicks in for actual insolvency, not slow pay or disputed invoices. Most facilities are recourse with credit insurance layered in for the riskier customers.",
    relatedTerms: ['invoice-factoring', 'advance-rate', 'holdback-reserve'],
    relatedSolutions: ['invoice-factoring'],
  },
  {
    term: 'Borrowing Base Certificate',
    slug: 'borrowing-base-certificate',
    category: 'Process & Documents',
    shortDefinition:
      'A report a borrower submits, weekly or monthly, showing the current eligible AR, inventory, and other collateral against which an ABL line can be drawn.',
    fullExplanation:
      "On an asset-based line, the borrowing base certificate is how the lender knows what you can borrow against today. You report your current AR, your inventory at cost, sometimes your equipment values, and you apply the negotiated advance rates to each category. Out comes a number: 'this is the line you have available right now.' Eligibility rules matter: invoices over 90 days past due drop out, concentration limits on any one customer kick in, intercompany sales are excluded. The certificate gets submitted weekly or monthly depending on the deal, and it's the primary mechanism the lender uses to control risk between full field exams.",
    relatedTerms: ['asset-based-lending-abl', 'advance-rate', 'revolving-line-of-credit'],
    relatedSolutions: ['asset-based-lending'],
  },
  {
    term: 'Confession of Judgment (COJ)',
    slug: 'confession-of-judgment',
    category: 'Process & Documents',
    shortDefinition:
      "A clause in some loan documents (most commonly aggressive MCAs) that lets the lender obtain a court judgment against the borrower without a trial.",
    fullExplanation:
      "A confession of judgment is a clause worth slowing down for if you see it in a term sheet. It's a legal document the borrower signs, often buried in MCA paperwork, that essentially pre-authorizes the lender to walk into court and get a judgment entered against the business, and sometimes the personal guarantor, without ever having to prove their case in front of a judge. New York has cracked down on COJs in recent years, but the practice still exists in other forms. If you see one in a term sheet, slow down. It's a signal you're in the wrong neighborhood of lender.",
    relatedTerms: ['merchant-cash-advance-mca', 'personal-guarantee'],
  },
  {
    term: 'Senior Lien vs Subordinate Lien',
    slug: 'senior-lien-vs-subordinate-lien',
    category: 'Process & Documents',
    shortDefinition:
      'A senior lien is the first claim on a piece of collateral; a subordinate lien sits behind the senior in line for repayment.',
    fullExplanation:
      "Lien priority is just the pecking order. Whoever filed their UCC first usually has senior position on that collateral. They get paid first if things go bad. Anyone who comes in after that is subordinate, and they have to either accept that subordinate spot or work out an inter-creditor agreement with the senior. This is why a factoring lender almost always requires senior position on AR, and why a sub-debt lender willingly takes second position behind the senior asset-based line. Knowing the lien stack is how you figure out whether a new piece of capital can actually be added on top of what you already have, or whether the whole structure needs to be refinanced.",
    relatedTerms: ['ucc-1-filing', 'subordinated-debt-mezzanine', 'layered-capital'],
    relatedSolutions: ['asset-based-lending', 'unsecured-debt'],
  },

  // ============================================================================
  // INDUSTRY-SPECIFIC
  // ============================================================================
  {
    term: 'Retainage',
    slug: 'retainage',
    category: 'Industry-Specific',
    shortDefinition:
      'A portion of a contract payment, often 5% to 10%, held back by the customer until the project is complete and accepted.',
    fullExplanation:
      "Retainage is standard practice in construction and a lot of government contracting. The customer pays you on each progress invoice but holds back a slice, usually 5% to 10%, as a cushion to make sure the job gets finished correctly. That holdback can sit out there for months after substantial completion, and it's a real working capital drag. Some factoring and government-contract financing facilities are structured specifically to advance against retainage balances, or at least to not penalize you for them sitting on the AR aging report longer than a normal invoice would.",
    relatedTerms: ['holdback-reserve', 'invoice-factoring', 'accounts-receivable'],
    relatedSolutions: ['government-contracts', 'invoice-factoring'],
  },
  {
    term: 'Net-30 / Net-60 / Net-90 Terms',
    slug: 'net-30-net-60-net-90',
    category: 'Industry-Specific',
    shortDefinition:
      'Standard B2B payment terms specifying that an invoice is due 30, 60, or 90 days after the invoice date.',
    fullExplanation:
      "Net-30, net-60, net-90 are the payment terms you negotiate with your customers: the contractual promise that the invoice will be paid by a certain number of days after the invoice date. Big-company AP departments love net-60 and net-90 because it improves their working capital position. Yours, of course, gets worse. Every additional 30 days of terms means another month of revenue floating out there as receivables, which is the entire reason factoring and ABL exist as products. Knowing your weighted-average customer terms is the first step in deciding whether you have a working capital problem or a working capital opportunity.",
    relatedTerms: ['days-sales-outstanding', 'accounts-receivable', 'invoice-factoring'],
    relatedSolutions: ['invoice-factoring'],
  },

  // ============================================================================
  // SERVE FUNDING FRAMEWORK
  // ============================================================================
  {
    term: 'Channel-Neutral Advisor',
    slug: 'channel-neutral-advisor',
    category: 'Serve Funding Framework',
    shortDefinition:
      "A financing advisor who isn't tied to any single lender or product type, free to recommend whichever structure actually fits the client best.",
    fullExplanation:
      "Channel-neutral, product-neutral advisory is what Serve Funding actually does, meaning we're not just trying to do AR financing or inventory financing or equipment leasing. We do it all, so when we meet a client, any way we can structure a solution, we have multiple ways to get it done. The opposite of channel-neutral is a captive broker who only works with one or two lenders and is going to push whatever product those lenders pay them on, whether or not it's the right fit. The point of being channel-neutral is to let the client's situation drive the structure, not the other way around.",
    relatedTerms: ['layered-capital'],
  },
  {
    term: 'Layered Capital',
    slug: 'layered-capital',
    category: 'Serve Funding Framework',
    shortDefinition:
      'A financing strategy that stacks multiple complementary products (senior, subordinate, secured, unsecured) to assemble more capital than any single product could provide.',
    fullExplanation:
      "Most growing businesses don't have a single-product solution. They have a layered one. A senior asset-based line on the AR, a subordinate inventory piece, an unsecured term loan stacked on top, maybe a sale-leaseback pulling cash out of equipment. Each layer does something a different layer can't, and together they assemble more capital than any one lender would write on its own. The biggest layered structures are almost always multi-prong: PO plus AR, factoring plus a subordinate revenue-based line, real-estate cash-out plus a working capital revolver. The point isn't to be clever; it's that a layered stack usually delivers more capital at a better blended cost than trying to force a single lender to solve the whole problem.",
    relatedTerms: [
      'subordinated-debt-mezzanine',
      'senior-lien-vs-subordinate-lien',
      'po-funding',
      'channel-neutral-advisor',
      'cash-out-refinance',
    ],
    relatedSolutions: ['unsecured-debt', 'asset-based-lending', 'purchase-order-funding'],
  },
]

// ============================================================================
// HELPERS
// ============================================================================

/** Helper: terms grouped by category, for rendering. */
export function getTermsByCategory(): Record<string, GlossaryTerm[]> {
  return glossaryTerms.reduce(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = []
      acc[t.category].push(t)
      return acc
    },
    {} as Record<string, GlossaryTerm[]>,
  )
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug)
}
