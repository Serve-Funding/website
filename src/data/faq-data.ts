/**
 * SERVE FUNDING - FAQ DATA
 *
 * Simplified FAQ structure with concise 3-5 sentence answers
 * Optimized for GEO/AIEO (Generative Engine Optimization)
 * Last Updated: 2025-12-03
 *
 * VIDEO SUPPORT: Each FAQ can now include an optional video answer
 * To add a video to an FAQ, include these optional fields:
 *   - videoId: YouTube video ID (e.g., "dQw4w9WgXcQ")
 *   - videoTranscript: Full video transcript text for accessibility
 *
 * Example:
 * {
 *   id: 'example-faq',
 *   q: 'What is Asset-Based Lending?',
 *   a: 'Short text answer (2-3 sentences)...',
 *   videoId: 'dQw4w9WgXcQ',
 *   videoTranscript: 'Full transcript of the video...',
 *   relatedSolutions: ['asset-based-lending']
 * }
 */

import { FAQ, FAQCategory } from '@/types/faq'

// ============================================================================
// FAQ CATEGORIES
// ============================================================================

export const faqCategories: FAQCategory[] = [
  {
    id: 'about-serve-funding',
    name: 'About Serve Funding',
    description: 'Learn about our company, process, costs, and what makes us different from traditional lenders.'
  },
  {
    id: 'working-capital',
    name: 'Working Capital',
    description: 'Everything you need to know about working capital loans, costs, qualification, and when to use them.'
  }
]


// ============================================================================
// TOP-LEVEL FAQ FOR HOMEPAGE - AIEO OPTIMIZED
// ============================================================================

export const topLevelFAQs: FAQ[] = [
  {
    id: 'top-what-is-serve-funding',
    q: "What is Serve Funding?",
    a: "Serve Funding is a channel-neutral business financing advisory with access to an extensive network of alternative lenders for working capital from $250K to $100MM. We're not a lender. We're your advocate who compares options across multiple underwriting styles and negotiates on your behalf when traditional banks decline."
  },
  {
    id: 'top-when-banks-say-no',
    q: "What if my bank denied my loan application?",
    a: "Bank declines are our most common starting point. Bankers are our primary referral source. We specialize in non-bank financing including asset-based lending, invoice factoring, debt refinance, and MCA consolidation for businesses that don't fit traditional credit boxes. Alternative lenders evaluate whole businesses, not just DSCR or credit scores."
  },
  {
    id: 'top-how-fast-funding',
    q: "How fast can I get funding?",
    a: "Funding speed ranges from 24 hours to 8 weeks depending on the product: emergency payroll in 24-72 hours, working capital loans in 2-10 days, invoice factoring in 3-5 days, and asset-based lending in 4-8 weeks. Serve Funding has closed deals in as little as 3 business days when time was critical."
  },
  {
    id: 'top-debt-refinance',
    q: "Can you help refinance expensive debt?",
    a: "Yes, debt refinancing reduces monthly payments by 30-50% and lowers total cost of capital by 5-10 percentage points annually. We help businesses escape MCA debt traps, consolidate multiple daily/weekly payments into a single monthly payment, and often cash out additional working capital in the process."
  },
  {
    id: 'top-how-much-cost',
    q: "How much does Serve Funding cost?",
    a: "Serve Funding earns a success fee upon closing of a credit facility, loan or line of credit. No upfront costs, no retainers, no hidden fees. We are paid only when you receive financing, which aligns our incentives entirely with yours. We only get paid when you do."
  },
  {
    id: 'top-industries-served',
    q: "What industries do you serve?",
    a: "Serve Funding works with manufacturing, construction, staffing, healthcare, CPG, e-commerce, government contractors, and professional services. Based in Atlanta and primarily serving the Southeast, we work with clients nationwide for deals from $250K to $100MM."
  }
]

// ============================================================================
// ABOUT SERVE FUNDING FAQs
// ============================================================================

export const aboutServeFundingFAQs: FAQ[] = [
  {
    id: 'what-is-serve-funding',
    q: 'What is Serve Funding?',
    a: 'Serve Funding is a boutique business financing advisory that provides strategic guidance and access to an extensive network of lenders for alternative financing from $250K to $100MM. As a channel-neutral advisor, we\'re not limited by a single lender\'s "credit box". We tap into multiple underwriting styles. We operate with servant leadership and 15+ years of experience in asset-based and cash-flow lending.'
  },
  {
    id: 'relationships-over-bots',
    q: 'What does "Relationships Over Bots" mean?',
    a: 'We believe tired of automated platforms and generic funding advice? We provide high-touch, relationship-based advisory, not algorithms or quick-fix bots. You work directly with our founder or senior team members who understand your story, fight for your best interests, and negotiate the best terms across our lender network. When you partner with us, a little part of your reputation goes with it, and we protect that trust.'
  },
  {
    id: 'how-does-serve-funding-work',
    q: 'How does Serve Funding work?',
    a: 'We follow a three-step process: Discovery (understanding your needs and goals), Diligence (evaluating financing options across our lender network), and Delivery (guiding you through closing and negotiating on your behalf). Most engagements start with referrals from bankers, CFOs, or CPAs. You\'ll work directly with experienced advisors throughout, with no handoffs to junior staff.'
  },
  {
    id: 'what-makes-serve-different',
    q: 'What makes Serve Funding different from other lenders or brokers?',
    a: 'We\'re not a lender. We\'re your trusted advisor with relationships across an extensive lender network and multiple underwriting styles. Unlike captive brokers tied to one lender, we provide unbiased guidance throughout your company\'s growth trajectory. We fight hard to negotiate 10-20 percentage point rate reductions compared to going direct.'
  },
  {
    id: 'can-you-help-if-bank-denied',
    q: 'Can you help if my bank denied me?',
    a: 'Absolutely. When banks say no, we say how. Bankers are our primary referral sources because we specialize in alternative financing that traditional banks don\'t offer. We leverage asset-based lending, invoice factoring, debt refinance, revenue-based financing, and PO funding. We have relationships with dozens of alternative lenders who evaluate businesses differently and often approve when banks decline.'
  },
  {
    id: 'channel-neutral-advisor',
    q: 'What is a channel-neutral advisor?',
    a: 'A channel-neutral advisor is not tied to any single lender or product. Unlike captive brokers who earn commissions from one lender, we maintain relationships across an extensive lender network with different underwriting styles, rate structures, and specialties. This means we can match you with the best lender for your situation, and negotiate aggressively because we\'re not beholden to any single relationship.'
  },
  {
    id: 'why-banks-first',
    q: 'Why do most businesses go to their bank first?',
    a: 'Banks are the cheapest capital source and offer the most favorable terms for businesses that fit their credit boxes. If your banker knows you and can help, that\'s always the right first step. When banks can\'t help, whether due to credit limitations, timing, growth rate, or business model, that\'s when alternative financing becomes the next logical choice. We specialize in solving the problems your bank can\'t.'
  },
  {
    id: 'spot-predatory-lender',
    q: 'How do I know if a lender is predatory?',
    a: 'Red flags include: high-pressure sales tactics ("this offer expires at 5 PM today"), unclear rate disclosures (advertising "6% rates" when APR is actually 80-120%), double-digit fees not explained upfront, claims of "guaranteed approval" without questions, and ads that seem too good to be true. Good lenders ask questions to understand your business, explain everything clearly, and let you shop around without pressure. Trust your gut. If something feels rushed or unclear, it probably is.'
  },
  {
    id: 'tax-return-vs-invoices',
    q: 'Why do some lenders focus on invoices instead of tax returns?',
    a: 'Invoice factoring and asset-based lending evaluate what you\'re earning NOW (invoices and assets), not what you earned last year (tax return). If your business is growing, had a startup year, or faced temporary headwinds, your tax return might not reflect current reality. Your invoices tell the true story: strong customers, reliable payment history, and actual cash flow. We can help even if your tax return shows a loss, as long as your customers are paying reliably.'
  },
  {
    id: 'profitable-need-capital',
    q: 'How much working capital do profitable companies actually need?',
    a: 'Profitability and cash flow are different. A $5M profitable company might need $2.5M+ in working capital to fulfill a $10M growth contract because that money funds materials, payroll, and inventory BEFORE customer payment arrives. A simple rule of thumb: maintain 2-3 months of operating expenses as working capital. For example, $500K monthly expenses suggests $1M-$1.5M in working capital. Growing companies and those with uneven payment terms need even more.'
  },
  {
    id: 'layered-capital-stacking',
    q: 'Can I combine multiple funding sources?',
    a: 'Absolutely. "Layered capital" stacks multiple products to maximize available funds for growth. Example: $1MM AR revolver + $240K unsecured term loan + $550K second mortgage on personal real estate = $1.79MM total capital. This approach gives growing companies more runway without over-leveraging any single source. Each layer serves a different purpose: AR covers working capital needs, term loans provide bridge capital, real estate provides long-term flexibility.'
  },
  {
    id: 'early-payoff-discount',
    q: 'What\'s an "early payoff discount" and how does it work?',
    a: 'When you need quick funding at a higher rate, we build aggressive early payoff discounts into the structure. Scenario: You fund at 18% for 90 days, but close on a customer contract after 2 weeks. Instead of paying 90 days of interest, the early payoff discount lets you exit the loan with only 2 weeks of interest owed. This lets you refinance into a cheaper product immediately. We structure deals expecting this. It rewards clients who get liquidity events quickly.'
  },
  {
    id: 'percentage-need-capital',
    q: 'What percentage of businesses actually need working capital?',
    a: 'Approximately 90%+ of growing companies need working capital at some point in their first 5 years. It might come from family, investors, or lenders, but capital is essential for growth. Some bootstrap it themselves (slower growth), but most need an infusion. Working capital can be a one-time need or ongoing. Either way, the vast majority of growing businesses face the need at some point.'
  },
  {
    id: 'maxed-bank-line-options',
    q: 'What if I\'ve maxed out my bank line but still need more capital?',
    a: 'This is where junior/subordinated lending and unsecured options come in. When you\'ve tapped traditional lenders, we have options: unsecured term loans, subordinated debt (mezzanine financing), invoice factoring backed by your AR, or asset-based lines secured by equipment and real estate. These products are designed for businesses that have outgrown their bank but have growth opportunities. They fit \"above\" your bank line in the capital stack.'
  },
  {
    id: 'emergency-payroll-speed',
    q: 'How fast can emergency payroll be funded?',
    a: 'In urgent situations (24-72 hours), we can secure bridge loans, invoice factoring, or lines of credit against upcoming receivables. Real example: $500K payroll emergency funded in 4 business days. Costs vary: bridge solutions typically 1-3% of payroll amount, or Prime + 4-12% annualized for term loans. The key is having assets or invoices to collateralize. Without collateral, speed increases but costs rise accordingly.'
  },
  {
    id: 'why-use-serve-vs-direct',
    q: 'Why should I use Serve Funding instead of going direct to a lender?',
    a: 'Working with a channel-neutral advisor typically reduces your cost of capital by 10-20 percentage points vs. going direct. Here\'s why: we have relationships across an extensive lender network and can negotiate aggressively on your behalf because we\'re not committed to any one relationship. We also guide you away from predatory products and help you avoid costly mistakes. Our 65% repeat client rate shows we deliver value. We succeed only when you do.'
  }
]

// ============================================================================
// WORKING CAPITAL FAQs
// ============================================================================

export const workingCapitalFAQs: FAQ[] = [
  {
    id: 'what-is-working-capital',
    q: 'What is working capital?',
    a: 'Working capital is the funds available to meet day-to-day operational needs, calculated as current assets minus current liabilities (cash, AR, inventory minus AP and short-term debt). When businesses need "working capital," they\'re seeking additional liquidity to grow without running out of money, meet obligations, and scale operations. Positive working capital means you have enough liquid assets to cover short-term obligations.'
  },
  {
    id: 'how-to-refinance-business-debt',
    q: 'How do I refinance high-cost business debt?',
    a: 'Debt refinancing replaces expensive debt (MCAs, high-interest loans, multiple payments) with a single, more affordable solution. We help you consolidate debt, reduce monthly payments by 30-50%, and often cash out additional working capital. Most refinances close in 10-20 business days using asset-based lending or term loans. The key is having sufficient revenue ($1MM+ annually) and ideally some collateral (AR, inventory, equipment, or real estate).'
  },
  {
    id: 'how-to-escape-mca-debt',
    q: 'How do I escape merchant cash advance (MCA) debt?',
    a: 'MCA consolidation refinances daily or weekly MCA payments into a single monthly term loan or line of credit with significantly lower costs. We\'ve helped dozens of businesses escape MCA debt traps by securing asset-based lending, term loans, or revenue-based financing that costs 10-20 percentage points less annually. The key is acting before cash flow becomes too constrained. Contact us as soon as you realize MCA payments are unsustainable.'
  },
  {
    id: 'emergency-payroll-financing',
    q: 'How fast can I get emergency payroll financing?',
    a: 'Emergency payroll financing can fund in 24-72 hours in many cases. Our fastest payroll solution closed in 4 business days, ensuring every employee was paid on time with zero disruption. We structure payroll financing through short-term bridge loans, invoice factoring, or lines of credit against upcoming receivables. Costs range from 1-3% of payroll amount for bridge solutions or Prime + 4-12% annualized for term loans.'
  },
  {
    id: 'how-much-working-capital-needed',
    q: 'How much working capital do I need?',
    a: 'The amount varies by business size, growth rate, industry, and operating costs. Heavier overhead industries need more, while asset-light businesses need less. A common rule of thumb is maintaining 2-3 months of operating expenses. For example, $500K in monthly expenses suggests $1M-$1.5M in working capital. Rapidly growing companies and those with uneven payment terms need more to bridge cash flow gaps.'
  },
  {
    id: 'what-is-working-capital-loan',
    q: 'What is a working capital loan?',
    a: 'A working capital loan is short-term financing ($100K to $5MM+) that provides cash for payroll, inventory, and expenses, typically approved in 1-3 business days. These loans are based on revenue and growth potential rather than credit scores alone, with terms of 6-24 months. Modern working capital loans are often called merchant cash advances (MCAs) and can be used for inventory, marketing, hiring, or bridging payment term gaps.'
  },
  {
    id: 'how-much-cost-wc-loan',
    q: 'What is the cost of working capital loans?',
    a: 'Costs typically range from 1.5-4% per month (18-48% annualized) depending on creditworthiness, revenue, and who negotiates on your behalf. Strong credit (700+), established businesses (3+ years), and growing revenues get lower rates (18-25% APR), while newer businesses or cash flow challenges face higher rates. Serve Funding fights hard to negotiate 10-20 percentage point reductions compared to going direct to lenders.'
  },
  {
    id: 'can-use-wc-for-growth',
    q: 'Can I use working capital loans for growth investments?',
    a: 'Absolutely. Working capital loans are ideally suited for growth. It takes money to make money. Businesses use them to fund inventory buildup, hire ahead of revenue, invest in marketing and sales, enter new markets, and purchase equipment. A $500K loan invested in inventory, marketing, and staff can generate $2MM in new revenue with strong ROI when the business model is proven and market demand is validated.'
  },
  {
    id: 'what-if-cash-flow-irregular',
    q: 'What if my cash flow is irregular or seasonal?',
    a: 'Seasonal and irregular cash flow don\'t disqualify you. They\'re actually perfect reasons to seek working capital. Businesses need financing to maintain payroll and inventory during slow periods while preparing for busy ones. Revolving lines of credit, working capital loans, and invoice factoring all work well for seasonal businesses. Landscaping, retail, hospitality, and tourism companies commonly use working capital to bridge seasonal gaps.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring', 'asset-based-lending']
  },
  {
    id: 'can-get-wc-for-payroll',
    q: 'Can I get working capital for payroll emergencies?',
    a: 'Absolutely. Payroll emergencies from delayed customer payments, depleted cash reserves, or unexpected expenses are common drivers for working capital. When payroll is due but cash flow hasn\'t caught up, time isn\'t just money. It\'s team trust and operational stability. We can fund payroll emergencies in 1-2 business days through short-term bridge loans or invoice factoring without exploiting your urgency.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring', 'bridge-funding']
  },
  {
    id: 'what-credit-score-needed',
    q: 'What credit score do I need for business financing?',
    a: 'Credit score requirements vary by solution. Asset-based lending and invoice factoring focus on collateral value (550+ credit often acceptable). Term loans and lines of credit typically require 600-650+ for approval. Debt refinancing and MCA consolidation can work with 550+ if you have strong revenue and assets. The key advantage of alternative financing is that credit score is just one factor: revenue, assets, and business trajectory matter more.',
    relatedSolutions: ['asset-based-lending', 'invoice-factoring', 'working-capital-loans', 'debt-refinance']
  },

  // RBF/MCA Critical Questions
  {
    id: 'mca-vs-rbf-which-to-use',
    q: 'Should I use MCA or RBF, and what\'s the difference?',
    a: 'The core difference: MCAs take daily or weekly cuts from your card sales (typically 10-20%), while RBF takes a fixed monthly percentage (typically 5-15%) that scales with revenue. MCA hits hardest on slow days and weekends when you need cash most; RBF is predictable regardless of daily fluctuations. Working capital loans (RBF) at 1.25%-4% per month typically cost 30-50% less than MCA, making them the better choice for sustainable growth.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring', 'debt-refinance']
  },

  {
    id: 'mca-factor-rate-real-cost',
    q: 'What is an MCA factor rate, and how much will it actually cost me?',
    a: 'Factor rates hide true costs. A "1.3 factor rate" means you owe $130K on a $100K advance, which looks like 30% but is actually much higher depending on repayment speed. Over 5-6 months, that 1.3x factor rate translates to roughly 50-80%+ APR; over 3 months, it\'s significantly higher. By comparison, invoice factoring at Prime + 1-6% or working capital loans at 1.25%-4% monthly give you transparent pricing you can actually compare.',
    relatedSolutions: ['debt-refinance', 'invoice-factoring', 'working-capital-loans']
  },

  {
    id: 'mca-daily-payments-cash-flow',
    q: 'Why do MCA daily payments destroy cash flow?',
    a: 'Because MCA pulls from revenue you haven\'t stabilized yet. If 15% of daily card sales goes to MCA, slow days still require full pulls even when you\'re short on cash. Real scenario: staffing agencies need cash on Monday before weekend payroll, but if Monday is light, they\'re still short. This creates a debt spiral where you take a second or third MCA just to cover payroll, and suddenly you\'re extracting 60%+ of revenue just to service debt. We\'ve helped dozens escape this trap through debt refinancing into single monthly payments that free up 30-50% of what they were paying.',
    relatedSolutions: ['debt-refinance', 'working-capital-loans', 'invoice-factoring']
  },

  {
    id: 'how-to-escape-mca-process',
    q: 'How do I actually escape MCA debt?',
    a: 'Stop taking new advances immediately, then refinance your balance into a term loan, asset-based line, or invoice factoring, typically closing in 10-20 business days. We shop your situation across an extensive lender network because your invoices, AR, and revenue are real collateral; most clients qualify for solutions that cost 10-20 percentage points less annually than their current MCA. Real example: a staffing company paying $15K/month in MCA fees refinanced into an $8K/month term loan, freeing up $7K monthly for growth.',
    relatedSolutions: ['debt-refinance', 'asset-based-lending', 'invoice-factoring']
  },

  {
    id: 'mca-red-flags-predatory-lender',
    q: 'How do I spot a predatory MCA lender?',
    a: 'Red flags include high-pressure sales ("offer expires at 5 PM"), refusing to explain factor rate math or APR, non-negotiable daily pulls, prepayment penalties, and confession of judgment clauses. Good lenders ask about your business, disclose APR upfront, and let you shop around without pressure. When in doubt, have us review the terms before you sign. We spot predatory language regularly.',
    relatedSolutions: ['debt-refinance']
  },

  {
    id: 'rbf-vs-traditional-loan-when-use',
    q: 'When should I use RBF instead of a bank loan?',
    a: 'Use RBF when you\'re growing faster than banks can approve, your tax return doesn\'t match current revenue, or you\'ve maxed your bank line but are still scaling. Banks typically approve in 4-8 weeks; RBF closes in 1-2 weeks and adapts to revenue growth. RBF costs more (1.25%-4% monthly) than bank loans (typically 6-12% APR), so our advice is always bank first if your banker can help, but RBF when they can\'t keep up with your growth.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring']
  },

  {
    id: 'mca-consolidation-what-happens',
    q: 'If I consolidate MCA debt, what happens to my daily payments?',
    a: 'They stop immediately. You pay off the MCA and refinance into a single monthly term payment, typically 30-50% lower than what you were paying in daily MCA fees. Real example: $150K MCA balance with daily extractions owed roughly $195K total; refinanced to a term loan that costs $7K/month instead of $32K/month. The key is acting before cash flow becomes too constrained. Contact us as soon as you realize MCA payments are unsustainable.',
    relatedSolutions: ['debt-refinance', 'asset-based-lending', 'working-capital-loans']
  }
]

// ============================================================================
// SOLUTION-SPECIFIC FAQs
// ============================================================================

export const solutionSpecificFAQs: FAQ[] = [
  // Asset-Based Lending
  {
    id: "what-is-abl",
    q: "What is asset-based lending?",
    a: "Asset-based lending (ABL) is a flexible credit line that lets you borrow against your company's assets like accounts receivable, inventory, equipment, and real estate.",
    relatedSolutions: ["asset-based-lending"]
  },
  {
    id: "how-much-can-borrow-abl",
    q: "How much can I borrow with ABL?",
    a: "Most typical ABL asset-based lenders start their facilities sizes from 3-5 million and up. However, at Serve Funding, we can facilitate ABL lines from as low as $250K. Advance rates are: 70-90% of accounts receivable, 50-75% of inventory, and 40-70% of equipment.",
    relatedSolutions: ["asset-based-lending"]
  },
  {
    id: "abl-rates",
    q: "What are typical ABL rates?",
    a: "Interest rates typically range from Prime + 1% to Prime + 5%. You may also pay a facility fee and monthly service fees.",
    relatedSolutions: ["asset-based-lending"]
  },

  // Invoice Factoring
  {
    id: "what-is-invoice-factoring",
    q: "What is invoice factoring?",
    a: "Invoice factoring is when you sell your unpaid B2B invoices to a factor for immediate cash. You get 75-95% of invoice value within 24-48 hours instead of waiting 30-90 days. Unlike a term loan, factoring is self-liquidating. As customers pay, the debt automatically decreases.",
    relatedSolutions: ["invoice-factoring"]
  },
  {
    id: "how-quickly-cash-factoring",
    q: "How quickly can I get cash?",
    a: "Approval typically takes 2-3 weeks. Once approved, you receive 75-95% of invoice value within 24-48 hours. Our real example: healthcare supply manufacturer approved and funded in 3 weeks, then expanded from $1MM to $1.5MM within 2 months as sales grew.",
    relatedSolutions: ["invoice-factoring"]
  },
  {
    id: "tax-return-factoring",
    q: "Can I get factoring if my tax return shows a loss?",
    a: "Yes! This is one of factoring's biggest advantages over traditional bank loans. Banks look at tax returns. We look at invoices. If your customers are paying reliably and your invoices are strong, your tax return doesn't disqualify you. Your invoice quality and customer creditworthiness are what matter.",
    relatedSolutions: ["invoice-factoring"]
  },
  {
    id: "factoring-vs-bank-loan",
    q: "Why is factoring better than a bank line of credit?",
    a: "Factoring is self-liquidating (debt decreases as customers pay), scales automatically with your sales, has no balance sheet impact, and doesn't require collateral beyond your invoices. Banks require strong credit, tax returns, and collateral. Their rates are often higher. A real example: one client got Prime + 2% on AR factoring (single-digit when combined), vs. traditional bank rates of 8-13%.",
    relatedSolutions: ["invoice-factoring"]
  },
  {
    id: "factoring-selective",
    q: "Do I have to factor all my invoices?",
    a: "No. Selective factoring lets you choose which invoices to factor and which to collect yourself. This flexibility is perfect for businesses with mixed payment terms or situations where you only need cash during specific periods.",
    relatedSolutions: ["invoice-factoring"]
  },

  // Working Capital Loans
  {
    id: "what-is-wc-loan",
    q: "What is a working capital loan?",
    a: "Short-term financing for day-to-day operational expenses: payroll, inventory, accounts payable. Working capital loans focus on a company's historical revenue, rather than credit scores and the company's assets.",
    relatedSolutions: ["working-capital-loans"]
  },
  {
    id: "how-fast-approval-wc",
    q: "How fast can I get approved and funded?",
    a: "Working capital loans are the fastest funding product. Approval typically takes 1–3 business days, with funding within 2–10 business days of approval.",
    relatedSolutions: ["working-capital-loans"]
  },
  {
    id: "wc-loan-cost",
    q: "What does it cost?",
    a: "You can expect to pay anywhere from 1.25% to 4% per month for these products. The rates vary depending upon a number of factors, such as industry, time in business, and profitability.",
    relatedSolutions: ["working-capital-loans"]
  },
  {
    id: "rbf-approval-funding",
    q: "What is the fastest timeline for RBF?",
    a: "Revenue-based financing is the fastest funding product. Approval typically takes 1–3 business days with funding within 1–5 business days of approval.",
    relatedSolutions: ["working-capital-loans"]
  },

  // Purchase Order Funding
  {
    id: "po-international-suppliers",
    q: "Can PO financing work with international suppliers?",
    a: "Yes. PO financing specifically supports payments to overseas suppliers (China, India, Vietnam, etc.). This is especially valuable when managing tariff costs. You can negotiate bulk discounts upfront and use PO financing to fund the larger order, offsetting tariff expenses.",
    relatedSolutions: ["purchase-order-funding"]
  },
  {
    id: "po-tariff-management",
    q: "How does PO financing help with tariff costs?",
    a: "When tariffs spike or change, bulk orders at lower per-unit costs can offset the tariff impact. PO financing lets you fund larger upfront orders without depleting working capital. Real example: an importer used their $1MM facility to bulk-order from suppliers before tariff changes, saving significantly on per-unit costs.",
    relatedSolutions: ["purchase-order-funding"]
  },
  {
    id: "po-wip-goods",
    q: "Does PO financing cover work-in-process (WIP) goods?",
    a: "Yes. PO financing covers work-in-process inventory, finished goods, and production materials. This is perfect for manufacturers who need to finance production before customer payment arrives.",
    relatedSolutions: ["purchase-order-funding"]
  },
  {
    id: "po-how-fast",
    q: "How quickly can I get PO financing?",
    a: "Approval typically takes 2-4 weeks. Once approved, funding releases in 5-10 business days for most orders. For established facilities, the process moves even faster, sometimes closing in 10-15 days total.",
    relatedSolutions: ["purchase-order-funding"]
  },

  // Government Contracts
  {
    id: "gov-contract-payment-timing",
    q: "How does government contract financing work with payment timing?",
    a: "Government contracts often have 30-90+ day payment terms (net-30, net-60, net-90, or quarterly). Contract financing covers your costs (materials, payroll, subcontractors) upfront, then is repaid when government payment arrives. Fast example: $500K in 20 business days for a contractor who won a federal GSA contract.",
    relatedSolutions: ["government-contracts"]
  },
  {
    id: "gov-contract-subcontractor",
    q: "Can subcontractors get government contract financing?",
    a: "Yes. Many subcontractors face the same timing gap. They perform work, then wait 30-60+ days for prime contractor or government payment. We fund subcontractors frequently. Qualification depends on strong POs and credit history of the paying entity.",
    relatedSolutions: ["government-contracts"]
  },
  {
    id: "gov-contract-retainage",
    q: "How do you handle retainage on government contracts?",
    a: "Government contracts often retain 5-10% of payments until project completion. Financing structures account for this. Some facilities factor the retainage separately or provide bridge coverage until final retainage payment arrives.",
    relatedSolutions: ["government-contracts"]
  },

  // Real Estate Lending
  {
    id: "cre-bridge-timing",
    q: "What is a bridge loan in real estate?",
    a: "A bridge loan is short-term real estate financing (12-36 months, interest-only common) used for timing gaps. Example: you're selling one property and need to close on another before the sale completes. Bridge financing covers the gap, then refinances from sale proceeds. Close in 2-3 weeks.",
    relatedSolutions: ["real-estate-lending"]
  },
  {
    id: "personal-asset-refi",
    q: "Can I refinance personal real estate for business needs?",
    a: "Yes. Business owners can use second mortgages on personal residences or real estate assets to fund business operations, provide stretch capital, or acquire real estate. We've structured $550K second mortgages using bank-statement-only approaches for business owners needing flexible qualification.",
    relatedSolutions: ["real-estate-lending"]
  },
  {
    id: "cre-cash-out",
    q: "Can I do a cash-out refinance and use it for working capital?",
    a: "Yes. Many business owners refinance commercial property at higher LTV to extract equity for working capital, acquisitions, or other business needs. LTV typically ranges 50-75% depending on property type and lender.",
    relatedSolutions: ["real-estate-lending"]
  },

  // Unsecured/Subordinated Debt
  {
    id: "bridge-vs-term-loan",
    q: "What's the difference between bridge capital and a term loan?",
    a: "Bridge capital is typically shorter-term (6-36 months), unsecured, and designed for specific timing gaps (acquisitions, M&A closings, seasonal needs). Term loans are longer (3-5 years), secured, and sit as permanent debt. Bridge is 'get in, get out' capital; terms loans are permanent structure. Real example: a surgeon used bridge financing for 90 days until hospital acquisition closed, then refinanced into permanent capital.",
    relatedSolutions: ["unsecured-debt"]
  },
  {
    id: "bridge-acquisition-timing",
    q: "How does bridge financing work for M&A?",
    a: "You need capital now but large payment arrives after closing. Bridge financing covers the gap. Interest-only options mean you pay interest during the bridge period, then refinance from deal proceeds. Typical timeframe: 90-180 days. We've closed $1.475MM M&A bridge in weeks.",
    relatedSolutions: ["unsecured-debt"]
  },
  {
    id: "unsecured-stretch-capital",
    q: "Can I get unsecured bridge capital without collateral?",
    a: "Yes, in many cases. Unsecured bridge loans don't require collateral, UCC filings, or (on some products) personal guarantees. Qualification depends on revenue history and growth trajectory. Growing companies with $1MM+ revenue often qualify for unsecured bridge capital.",
    relatedSolutions: ["unsecured-debt"]
  },
  {
    id: "layered-capital-strategy",
    q: "What is layered capital and how does it work?",
    a: "Layered capital combines multiple funding sources (e.g., AR revolver + unsecured term + second lien mortgage). This maximizes available capital for growth phases. Example: a medical device company used $1MM AR revolver + $240K unsecured term + $550K second mortgage = $1.79MM total capital over 10 months, enabling 30%+ growth.",
    relatedSolutions: ["unsecured-debt"]
  },

  // Bridge Funding
  {
    id: "bridge-when-use",
    q: "When should I use bridge funding?",
    a: "Bridge funding is ideal for timing gaps: awaiting contract closure, waiting for receivables, managing seasonal needs, or covering expenses before larger financing arrives.",
    relatedSolutions: ["bridge-funding"]
  },

  // Debt Refinance
  {
    id: "what-is-debt-refinance",
    q: "What is debt refinancing for businesses?",
    a: "Debt refinancing replaces your existing high-cost debt with new financing at better terms. It's commonly used to escape MCA debt traps, consolidate multiple loans, or simply reduce your total cost of borrowing.",
    relatedSolutions: ["debt-refinance"]
  },
  {
    id: "can-refinance-mca",
    q: "Can I refinance merchant cash advance debt?",
    a: "Yes. MCA refinancing is one of our most common solutions. We help businesses trapped in daily or weekly MCA payments consolidate into monthly term loans or lines of credit with significantly lower costs.",
    relatedSolutions: ["debt-refinance", "working-capital-loans"]
  },
  {
    id: "how-much-save-refinancing",
    q: "How much can I save by refinancing?",
    a: "Most clients reduce monthly payments by 30-50% and lower their total cost of capital by 5-10 percentage points annually. The exact savings depend on your current debt structure and available collateral.",
    relatedSolutions: ["debt-refinance"]
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Working Capital Loans
  // ==========================================================================
  {
    id: 'wc-loan-vs-mca',
    q: 'How is a working capital loan different from a merchant cash advance?',
    a: "A working capital loan from Serve Funding has monthly payments, real prepay discounts, and a true APR roughly half of a typical MCA. MCAs take daily or weekly extractions from your sales and have no meaningful prepay benefit, which is why they tend to stack. Businesses borrow another to pay the first. Our working capital product is designed to be paid off and walked away from, not refinanced into a worse position.",
    relatedSolutions: ['working-capital-loans']
  },
  {
    id: 'wc-loan-size',
    q: 'How much working capital can I borrow?',
    a: 'As of 2026, working capital loans typically size at 10–15% of your annual revenue, with a practical range of $100K to $10MM+. A $5MM revenue business should expect $500K–$750K of capacity on a clean profile. We always ask what the perfect-world ask is and what the minimum is to make it make sense. Those two numbers shape which lender we go to first.',
    relatedSolutions: ['working-capital-loans']
  },
  {
    id: 'wc-loan-speed',
    q: 'How fast can a working capital loan fund?',
    a: 'A typical working capital loan funds in 2–10 business days from approval. Emergency situations, like a payroll that has to clear in 72 hours, can close inside a week if the deposit history and documentation are clean. The fastest closings happen when the business has at least three months of consistent deposits and no recent MCA activity gumming up the picture.',
    relatedSolutions: ['working-capital-loans']
  },
  {
    id: 'wc-loan-credit-score',
    q: 'Do I need good personal credit for a working capital loan?',
    a: 'Personal credit matters more in cash-flow underwriting than it does in asset-based lending. A clean 680+ FICO opens meaningfully better pricing. That said, the primary gate is the strength and consistency of your trailing revenue, not the score alone. If credit is the only weak point and the business is solid, we still have lenders who will get the deal done.',
    relatedSolutions: ['working-capital-loans']
  },
  {
    id: 'wc-loan-bridge-to-abl',
    q: 'Can a working capital loan bridge to a cheaper facility later?',
    a: 'Yes. This is what we call the one-then-three approach. A fast revenue-based working capital loan stabilizes the business in under a week while we build out a permanent asset-based line, factoring facility, or SBA loan in parallel over the next 6–8 weeks. We negotiate the working capital terms so there is no prepayment penalty when the cheaper structure takes over.',
    relatedSolutions: ['working-capital-loans', 'asset-based-lending', 'invoice-factoring']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Invoice Factoring
  // ==========================================================================
  {
    id: 'factoring-vs-abl',
    q: 'What is the difference between invoice factoring and asset-based lending?',
    a: 'Factoring and ABL are cousins. Both are revolving lines secured by your receivables, often with an inventory add-on. The key difference is that factoring is not a debt product. It is a recurring sale of an asset, so it does not show up on your balance sheet as debt and personal guarantees are often replaced with a validity guarantee. ABL is a true line of credit on the balance sheet and tends to price lower for businesses that qualify, but it takes 6–8 weeks to set up versus 3–4 weeks for factoring.',
    relatedSolutions: ['invoice-factoring', 'asset-based-lending']
  },
  {
    id: 'factoring-customer-notification',
    q: 'Will my customers know I am factoring my invoices?',
    a: 'Your customer is aware in the sense that their A/P team will be told to send payments to a new bank account, typically still in your company name on the remit-to. Most factors do not require you to disclose that you are factoring; you can simply say you have a new collections partner. The factor will make a couple of verification calls at the start of the relationship to confirm the invoice is real, and then the operational change for your customer is essentially a different routing number.',
    relatedSolutions: ['invoice-factoring']
  },
  {
    id: 'factoring-cost-comparison',
    q: 'How much does invoice factoring actually cost on an annual basis?',
    a: 'As of 2026, a clean profile runs 12–14% all-in on an annualized basis; middle-of-the-road distressed companies sit at 18% or so; and harder cases can run into the mid-twenties. A common term-sheet structure is 1.5% for the first 30 days plus 0.5% every 10 days thereafter, which translates to roughly 18% APR if your customers pay in 30 days and higher if they stretch. Watch for layered fees. Some factors quote a low discount rate but add a separate rate on borrowed funds. We always do the all-in math before signing.',
    relatedSolutions: ['invoice-factoring']
  },
  {
    id: 'factoring-personal-credit',
    q: 'Does my personal credit score matter for invoice factoring?',
    a: 'Not nearly as much as it does in cash-flow lending. Factors underwrite on the credit of your account debtors, the customers who owe you money, because that is who actually pays them. Owners with bruised credit who got declined by a bank on FICO grounds can absolutely qualify for factoring if their customer mix is strong. This is the single most common bank-decline reframe we run.',
    relatedSolutions: ['invoice-factoring']
  },
  {
    id: 'factoring-for-construction',
    q: 'Does invoice factoring work for construction companies?',
    a: 'Often not as cleanly as people expect. Construction AR tends to be thin relative to revenue, concentrated in three or four large customers, with milestone billing and retainage holdbacks of 10% sitting out six to twelve months. A factor wants steady, recurring, lots-of-customers AR. Construction usually has the opposite shape. For construction, we more often pivot to MCA consolidation into a true-term product, a real-estate-backed bridge on owned land, or job-mobilization financing that covers upfront materials and labor.',
    relatedSolutions: ['invoice-factoring', 'debt-refinance', 'real-estate-lending']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Debt Refinance
  // ==========================================================================
  {
    id: 'mca-refi-qualify',
    q: 'How do I qualify for an MCA consolidation loan?',
    a: 'The honest gate is: real assets or real equity to underwrite against, plus a 13-week cash flow forecast that shows the math works going forward. Commercial receivables, free-and-clear equipment, or home equity are the most common anchors. We also look at how many MCA positions are open, how recently the last one was taken, and whether the underlying business is fundamentally healthy. Three or more MCAs deep with no collateral is the hardest case. Sometimes the right answer there is a Home Equity Advance instead of a conventional refi.',
    relatedSolutions: ['debt-refinance']
  },
  {
    id: 'mca-refi-cost-savings',
    q: 'How much can I save by refinancing my MCA debt?',
    a: 'As of 2026, our typical first-step refi cuts monthly debt service by 30%–50% and drops the all-in rate by 5–10 percentage points. A business paying $15K a month in MCA fees often ends up around $8K a month on a true-term loan, freeing up $7K monthly for actual operations. A second refi twelve months later, into an ABL or SBA structure, can take another 5–10 points off the rate.',
    relatedSolutions: ['debt-refinance']
  },
  {
    id: 'mca-refi-multiple-positions',
    q: 'Can you pay off all of my MCAs at once?',
    a: 'Usually we can take out two or three positions in a single refi tranche. Six positions deep is rare to clear in one move. That is where we use the basement-to-first-floor analogy. The first step is a few rungs up the ladder, not the whole climb. With six to twelve months of clean payment history on the new product, we can come back and refinance again into a meaningfully cheaper structure.',
    relatedSolutions: ['debt-refinance']
  },
  {
    id: 'mca-refi-vs-new-mca',
    q: 'How is a Serve Funding refinance different from another MCA reverse consolidation?',
    a: 'A reverse consolidation is just another MCA dressed up: same daily sweeps, same factor-rate math, often the same lenders behind the curtain. Our refinance products have monthly payments, real prepay forgiveness, longer terms (24+ months versus the typical MCA 6–12), and a true APR that is roughly half. The goal is to get you off the daily-sweep treadmill, not to extend it.',
    relatedSolutions: ['debt-refinance']
  },
  {
    id: 'mca-refi-credit-impact',
    q: 'Will refinancing my MCAs hurt my credit?',
    a: 'On its own, no. Most MCAs do not report to traditional credit bureaus, and the new term product we put in place is structured to be reportable in a healthy way. The bigger credit lever is what comes after: once you have 12 months of clean monthly payments on a real loan, you start to look refinanceable to bank-owned ABL desks, SBA lenders, and non-bank SBA programs. That second refi step is where the meaningful credit and cost improvement compounds.',
    relatedSolutions: ['debt-refinance']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Equipment Leasing
  // ==========================================================================
  {
    id: 'why-equipment-cheaper-than-working-capital',
    q: 'Why is equipment financing cheaper than a working capital loan?',
    a: 'Because the equipment is the collateral. If something happens in your business, the lender can repossess and sell the asset to recover their money. That hard-asset backstop is what makes the rate cheaper. Working capital is underwritten on revenue alone, so the lender is taking more risk and prices for it. As of 2026, we typically see equipment in the high single digits to low teens versus working capital in the mid-teens or higher.',
    relatedSolutions: ['equipment-leasing', 'working-capital-loans']
  },
  {
    id: 'what-is-equipment-sale-leaseback',
    q: 'What is a sale-leaseback and when does it make sense?',
    a: 'A sale-leaseback is a way to get cash out of equipment you already own free and clear. The lender effectively buys the equipment from you and leases it back over a 3-to-5-year period, so the asset stays in place and operating but the equity is unlocked as working capital. It makes sense when you want growth capital without touching real estate, taking on a personal guarantee, or running an MCA. The equipment was already paid for, so why leave that equity locked up?',
    relatedSolutions: ['equipment-leasing']
  },
  {
    id: 'equipment-international-customs',
    q: 'How does equipment financing work if the equipment is manufactured overseas?',
    a: 'That is pretty much par for the course in the equipment leasing space. The borrower pays for the equipment, ships it, and clears it through U.S. customs, and then the lender reimburses on the back end once it is delivered. You will want to plan for that bridge in your cash flow. We help structure the timing so the gap between deposit and reimbursement does not strangle the rest of operations.',
    relatedSolutions: ['equipment-leasing']
  },
  {
    id: 'equipment-deferred-payments',
    q: 'Can I defer payments while my equipment is being installed?',
    a: 'Often yes. Many of our equipment lenders will defer the first three payments so the asset can get installed, commissioned, and revenue-generating before the first invoice hits. That is especially useful for medical equipment, custom production lines, or anything with a meaningful ramp-up window. We negotiate that in upfront because it materially changes the cash impact in year one.',
    relatedSolutions: ['equipment-leasing']
  },
  {
    id: 'vendor-financing-vs-equipment-leasing',
    q: "Should I use the manufacturer's financing or a third-party equipment lender?",
    a: 'If the manufacturer offers direct financing and the terms are reasonable, take it. We will tell you that to your face. Our value then shifts to the working capital piece you still need alongside the equipment. When the vendor financing is mediocre or unavailable, we run the deal through several third-party equipment lessors and let them compete for your business.',
    relatedSolutions: ['equipment-leasing', 'working-capital-loans']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Asset-Based Lending
  // ==========================================================================
  {
    id: 'abl-vs-bank-line-of-credit',
    q: 'How is asset-based lending different from a bank line of credit?',
    a: 'A bank line is underwritten primarily on your financial statements and covenants: leverage ratios, debt service coverage, owner credit. ABL is underwritten on the live value of your assets, mostly receivables and inventory, certified weekly or monthly through a borrowing base. As of 2026, ABL is generally where companies go when they have real assets but no longer fit a bank credit box. Pricing runs Prime plus 1% to 5%, which is higher than a bank but still well below most non-bank alternatives.',
    relatedSolutions: ['asset-based-lending', 'working-capital-loans']
  },
  {
    id: 'abl-vs-factoring-difference',
    q: 'What is the difference between asset-based lending and factoring?',
    a: 'Factoring and ABL are cousins. Both are revolving structures collateralized by your receivables, with optional inventory layered underneath. The difference is that factoring is a recurring sale of an asset and does not show up on your balance sheet as debt, while ABL is true debt with a weekly or monthly borrowing-base certificate. ABL usually wins on cost for larger, well-run operators; factoring is often the right tool for smaller deals or businesses with rougher financials.',
    relatedSolutions: ['asset-based-lending', 'invoice-factoring']
  },
  {
    id: 'abl-minimum-deal-size',
    q: 'Is there a minimum deal size for asset-based lending?',
    a: 'Most bank-owned ABL desks start at $3M to $5M minimums, which is why we place most of our ABL in the $3M and up range. Below that, we usually steer clients to factoring or a structured revenue-based line because the underwriting cost of a true ABL does not pencil out for the lender on a smaller facility. We will tell you honestly if you are below the threshold and route you to the right product.',
    relatedSolutions: ['asset-based-lending', 'invoice-factoring']
  },
  {
    id: 'abl-setup-timeline',
    q: 'How long does it take to set up an ABL facility?',
    a: 'Six to eight weeks is typical from term sheet to funded. ABL involves a field exam, an asset audit, legal documents, lockbox setup, and a borrowing-base mechanics build-out, so it is not fast. That is why we often run a bridge first when timing is tight: a fast revenue-based line in week one, ABL home in week eight. We call it the one-then-three approach, and it keeps the business operating while the permanent structure is assembled.',
    relatedSolutions: ['asset-based-lending', 'working-capital-loans']
  },
  {
    id: 'abl-borrowing-base-explained',
    q: 'What is a borrowing base and how does it work?',
    a: 'A borrowing base is a weekly or monthly certificate where you tell the lender, in writing, exactly how much eligible receivable and inventory you have right now. The lender advances a percentage against each category, say 85% on AR and 60% on inventory, and that becomes the live ceiling on what you can borrow. As customers pay into the lockbox, the line pays down automatically, and as new invoices and inventory come on, your availability rises. It is the engine that lets ABL scale with your business in real time.',
    relatedSolutions: ['asset-based-lending']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Inventory Financing
  // ==========================================================================
  {
    id: 'inventory-financing-for-ecommerce',
    q: 'Why is inventory financing the right product for e-commerce brands?',
    a: 'Because e-commerce and direct-to-consumer brands typically have no B2B receivables to factor against. They sell to consumers, not businesses, so there is no commercial AR for a factoring line to attach to. The inventory itself is the asset. As of 2026, we place e-commerce inventory facilities as low as Prime plus 2% with one specialty lender, though most standalone inventory deals run higher. It is often the cheapest realistic capital for a DTC brand that does not own real estate.',
    relatedSolutions: ['inventory-financing']
  },
  {
    id: 'how-inventory-financing-pays-vendors',
    q: 'Does inventory financing give me cash or pay my suppliers directly?',
    a: 'In most cases the lender is paying your vendors directly rather than handing you cash. That is actually a feature, not a bug. Your operating cash stays untouched, the inventory ships into your warehouse or Amazon FBA, and you are only paying for the capital that is actively tied up in product. Most facilities give you a 90-day cycle to sell through and pay it back, then the next purchase can cycle through the line again.',
    relatedSolutions: ['inventory-financing']
  },
  {
    id: 'standalone-inventory-vs-abl-inventory',
    q: 'What is the difference between standalone inventory financing and inventory inside an ABL?',
    a: 'Inside an ABL, inventory is layered underneath your AR, usually at a 50% to 75% advance rate and capped at a percentage of eligible AR. Standalone inventory is a different animal: the inventory itself is the entire collateral package, advance rates are often lower (40% to 60% of cost), and only two or three lenders we work with will do a true standalone deal. Standalone is the answer when there is no B2B AR to anchor an ABL, which is exactly the situation most e-commerce and DTC brands are in.',
    relatedSolutions: ['inventory-financing', 'asset-based-lending']
  },
  {
    id: 'inventory-financing-cash-forecast',
    q: 'What does an inventory lender need to see to approve a deal?',
    a: 'On a standalone inventory facility, the lender will want a 13-week cash flow forecast and what I call a math-driven story, not a narrative but a numbers explanation, for why the inventory will turn into cash before the line term is up. They also want an inventory count or third-party verification, a senior lien position on inventory, and clean reporting on sell-through velocity. If you cannot put that math on paper, the deal will not go.',
    relatedSolutions: ['inventory-financing']
  },
  {
    id: 'inventory-financing-vs-real-estate-cashout',
    q: 'When should I use inventory financing versus a real estate cash-out for inventory?',
    a: 'If you own real estate free and clear or with significant equity behind it, that is almost always the cheapest capital: single-digit rates against the property versus Prime plus 6% to 12% on inventory. Rate-sensitive owners with property usually skip inventory financing entirely and pull working capital off the building. If there is no real estate to leverage, inventory financing is the realistic answer, and we will set that expectation honestly.',
    relatedSolutions: ['inventory-financing']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Purchase Order Funding
  // ==========================================================================
  {
    id: 'what-is-po-funding',
    q: 'What is purchase order (PO) funding and how does it work?',
    a: 'PO funding pays your supplier directly, domestic or overseas, so you can fulfill a confirmed customer order before you have customer cash in hand. The lender gets paid off the moment you invoice the end customer, which is why PO funding is almost always paired with a factoring or AR line as the takeout. As of 2026, expect 2%–3% per 30 days on the PO side and roughly half that on the AR back end.',
    relatedSolutions: ['purchase-order-funding', 'invoice-factoring']
  },
  {
    id: 'po-vs-factoring',
    q: "What's the difference between PO funding and invoice factoring?",
    a: "PO funding covers the period before you ship. It pays your supplier so you can build. Factoring covers the period after you ship and invoice. It advances cash against the receivable so you don't wait 60 or 90 days to get paid. They're not either-or; together they close the full cash-conversion cycle, and most growing manufacturers and importers use them as a pair.",
    relatedSolutions: ['purchase-order-funding', 'invoice-factoring']
  },
  {
    id: 'why-is-po-funding-more-expensive',
    q: 'Why does PO funding cost more than factoring?',
    a: "PO money is further from liquidity, which makes it riskier for the lender. With factoring, an invoice already exists and a creditworthy customer has agreed to pay; with PO, the product hasn't even been built yet. That extra risk and longer float time is why PO sits around 2%–3% per 30 days while AR financing on the same deal runs closer to 1%–1.5%.",
    relatedSolutions: ['purchase-order-funding', 'invoice-factoring']
  },
  {
    id: 'po-funding-international-suppliers',
    q: 'Can PO funding pay overseas suppliers?',
    a: "Yes. Paying international suppliers in their own terms is one of the most common use cases. The lender wires the supplier directly, often before the goods ship, which is exactly what an overseas vendor needs to release production. This is especially useful when tariffs or supply-chain timing push you toward bulk orders that your existing line can't cover.",
    relatedSolutions: ['purchase-order-funding']
  },
  {
    id: 'po-funding-credit-requirements',
    q: 'Do I need strong personal credit to qualify for PO funding?',
    a: "Not really. PO and AR lenders care most about the creditworthiness of the customer who issued the purchase order, not the owner's personal credit. If you're selling to a blue-chip customer, a national distributor, or a government entity, that anchors the deal. Mike's rule of thumb: bring us the PO, the supplier terms, and your last 12 months of revenue, and we can usually tell you on the first call whether it's workable.",
    relatedSolutions: ['purchase-order-funding', 'invoice-factoring']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Government Contracts
  // ==========================================================================
  {
    id: 'gov-contract-financing-basics',
    q: 'How does government contract financing work?',
    a: 'A lender advances against the value of a federal, state, or local contract or receivable, usually up to 90%, so you can fund production and payroll before the government pays. The structure normally combines a PO line (covers materials and labor before invoice) with an AR line (covers the wait from invoice to payment). As of 2026, the full cycle is typically 60 days PO plus 60 days AR, about 120 days of capital commitment per order.',
    relatedSolutions: ['government-contracts', 'purchase-order-funding', 'invoice-factoring']
  },
  {
    id: 'subcontractor-on-a-prime-financing',
    q: 'Can subcontractors on a prime contract get financing?',
    a: "Yes, and this is one of the most under-served corners of the market. Most traditional factors won't touch a sub-on-a-prime because the account debtor is another contractor rather than the government directly. Serve Funding works with lenders who specifically finance GovCon subcontractors against the prime's commitment, which opens up a category that's a hard no almost everywhere else.",
    relatedSolutions: ['government-contracts', 'invoice-factoring']
  },
  {
    id: 'why-government-payment-takes-so-long',
    q: 'Why does the government take so long to pay?',
    a: "The clock doesn't start when you deliver. It starts when the contracting officer formally accepts the work, often after inspection and document sign-off. Sixty days from acceptance is normal across DoD, GSA, and most state and local agencies, and net-30 contracts frequently pay in 45. That timing isn't a sign of a problem; it's just the rhythm of government work, which is exactly why a PO+AR facility exists.",
    relatedSolutions: ['government-contracts']
  },
  {
    id: 'assignment-of-claims-explained',
    q: 'What is assignment of claims and why does it slow GovCon financing?',
    a: "Assignment of claims is the legal process that lets a government payment be redirected from the contractor to a lender. It's the equivalent of a lockbox for commercial AR, but with federal paperwork attached. The contracting officer has to sign off, which typically adds three to four weeks of setup time. It's why government AR facilities are best set up before you desperately need them, with a small unused-line fee to keep the facility available for sporadic billing.",
    relatedSolutions: ['government-contracts']
  },
  {
    id: 'govcon-specialist-vs-generalist-lender',
    q: 'Should I use a GovCon-specialist lender or a generalist?',
    a: "It depends on the mix. If 100% of what you do is government work, a specialist lender is almost always the right call. They understand assignment of claims, CO procedures, and milestone billing in a way generalists don't. If GovCon is a slice of a mostly commercial book, say 10% to 30%, a generalist AR or ABL lender usually handles the whole portfolio, with the government receivables included.",
    relatedSolutions: ['government-contracts', 'invoice-factoring', 'asset-based-lending']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — SBA Loans
  // ==========================================================================
  {
    id: 'who-qualifies-for-sba',
    q: 'Who actually qualifies for an SBA loan?',
    a: "SBA underwriting looks a lot like bank underwriting: two years of profitable, clean financials, reasonable owner credit, demonstrable cash flow to service the debt, and a business that fits the SBA credit box. If you check those boxes, SBA is almost always the cheapest capital available. If you don't, say you had a rough trailing 12 months, or you need money in the next 30 days, there are better-fit products to look at first.",
    relatedSolutions: ['sba-loans']
  },
  {
    id: 'sba-vs-alternative-financing',
    q: "When is SBA better than alternative financing, and when isn't it?",
    a: "SBA wins on price and term: prime + 2%–3% over 10 to 25 years is hard to beat. It loses on speed and flexibility. As of 2026, SBA underwriting is 4 to 12 weeks; asset-based lending is 4 to 8 weeks; factoring is 2 to 4 weeks; a revenue-based bridge can fund in days. If your business is clean and profitable and you can wait, do SBA. If you need money sooner or your numbers aren't SBA-ready, alternative financing is the better answer.",
    relatedSolutions: ['sba-loans', 'asset-based-lending', 'invoice-factoring', 'working-capital-loans']
  },
  {
    id: 'sba-7a-vs-504',
    q: "What's the difference between SBA 7(a) and SBA 504?",
    a: 'The 7(a) is the workhorse: general business purposes including acquisitions, working capital, refinance, and equipment, up to the $5MM SBA cap. The 504 is structured around fixed-asset purchases (real estate, major equipment), with a bank loan paired with a CDC second and longer amortization on the property piece. Most operators looking at "an SBA loan" are looking at a 7(a); 504 is the right structure if the deal is anchored by a real-estate purchase.',
    relatedSolutions: ['sba-loans']
  },
  {
    id: 'why-serve-refers-sba-out',
    q: 'Why does Serve Funding refer all SBA loans out instead of doing them in-house?',
    a: "SBA is its own discipline: the underwriting, the disclosure rules, the program-by-program nuances, the SBA Form 159 process. The SBA also won't allow a broker to charge a success fee on the borrower side and collect lender compensation on the same deal, which makes generalist brokers a bad fit. Serve refers every SBA out to a former SBA banker who runs an SBA-only practice and stays close to make sure the client is served well.",
    relatedSolutions: ['sba-loans']
  },
  {
    id: 'can-i-get-a-bridge-while-sba-closes',
    q: 'Can I get a bridge loan while my SBA loan is underwriting?',
    a: 'Yes, and this is one of the more common SBA pairings we set up. Because SBA takes 4 to 12 weeks, a parallel bridge, usually a revenue-based line, factoring facility, or short-term asset-backed loan, can fund within days to weeks and tide you over until the SBA closes. The bridge gets paid off when the SBA funds, and you only pay interest for the days you actually used the money.',
    relatedSolutions: ['sba-loans', 'bridge-funding', 'working-capital-loans', 'invoice-factoring']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Real Estate Lending
  // ==========================================================================
  {
    id: 're-cash-out-working-capital',
    q: 'Can I use real estate I already own to fund the operating business?',
    a: "Yes, and for the right profile, it's usually the cheapest capital in your stack. If your commercial property is free and clear or has real equity behind a first mortgage, a cash-out refinance or second-position loan pulls that \"dead equity\" out at rates that almost always beat an asset-based line or inventory loan. Real estate is the lender's favorite asset, so the rates reflect that. The right structure depends on whether you're optimizing for lowest rate, lowest debt service, or maximum cash out.",
    relatedSolutions: ['real-estate-lending', 'asset-based-lending', 'unsecured-debt']
  },
  {
    id: 're-ltv-by-asset-type',
    q: 'What LTV can I actually borrow against commercial real estate?',
    a: 'It depends on the asset. Owner-occupied commercial property typically supports 65%+ LTV, and you can often layer a line of credit on top that pushes effective leverage closer to 80% when the operating business is underwritten alongside. Investment / non-owner-occupied is DSCR-driven and varies with rental income. Raw land is a different animal. 50% LTV is the practical ceiling, and these deals close slower because fewer lenders touch them.',
    relatedSolutions: ['real-estate-lending']
  },
  {
    id: 're-bridge-vs-permanent',
    q: 'Should I take a bridge loan or a permanent mortgage on my property?',
    a: "Depends on what you're optimizing for. A fully amortizing 25-year mortgage gives you the lowest rate but higher debt service because you're paying principal every month. A bridge is interest-only. The rate is a few points higher, but the monthly debt service is considerably lower, which matters a lot if cash is tight. If you can refinance into a permanent structure in 12-24 months at a better rate, the bridge often pencils out better in the meantime.",
    relatedSolutions: ['real-estate-lending', 'bridge-funding']
  },
  {
    id: 're-sell-leaseback',
    q: 'What is a sell-leaseback and when does it make sense?',
    a: "Sell-leaseback is when you sell your owner-occupied property to an investor and immediately lease it back, so operations continue uninterrupted. It extracts the maximum cash, close to 100% of the value versus 65-75% on a mortgage, but you give up the asset and take on a long-term lease obligation. It usually makes sense when an owner wants to pull the most capital possible to redeploy into the business and doesn't mind no longer owning the real estate.",
    relatedSolutions: ['real-estate-lending']
  },
  {
    id: 're-bad-years-can-i-still-qualify',
    q: 'My business had a few rough years. Can I still borrow against my real estate?',
    a: "Often yes. We work with real-estate-backed SBA lenders and private-credit groups that don't get scared off by a couple of negative years on the P&L if the property and the forward story support it. They'll do pro-forma underwrites, looking at where the business is going, not just trailing twelve months. The property carries most of the underwriting weight, which is why real-estate-backed structures are often the path for owners who don't fit a clean bank credit box.",
    relatedSolutions: ['real-estate-lending', 'sba-loans']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Unsecured / Subordinated Debt
  // ==========================================================================
  {
    id: 'what-is-stretch-capital',
    q: 'What is "stretch capital" and when do I need it?',
    a: "Stretch capital is the layer that sits on top of your senior secured debt, usually a subordinated or unsecured loan, when you've already pledged your obvious collateral but still need more dollars to get the deal done. It's how layered-capital stacks actually get built: senior secured first (cheapest), then stretch on top to reach the full number. You need it when the senior lender can't size the facility large enough on its own and the incremental dollars unlock real upside.",
    relatedSolutions: ['unsecured-debt', 'asset-based-lending', 'real-estate-lending']
  },
  {
    id: 'subordinated-vs-unsecured',
    q: "What's the difference between subordinated debt and unsecured debt?",
    a: "Subordinated debt is still secured. There's a lien, but it sits behind your senior lender in priority, so if anything goes sideways, the senior gets paid first. It typically lends at 1-5× EBITDA. Unsecured debt skips the lien entirely: no UCC filing, sometimes no personal guarantee, priced higher because the lender has no collateral. Subordinated is more common in M&A and larger growth deals; unsecured shows up more on smaller bridge and gap-fill situations.",
    relatedSolutions: ['unsecured-debt']
  },
  {
    id: 'will-stretch-capital-mess-up-senior-line',
    q: 'Will subordinated or unsecured debt interfere with my existing bank or ABL line?',
    a: "Not if it's structured correctly. That's the whole point. Subordinated lenders sign intercreditor agreements with your senior lender so the lien priority is documented and the bank stays comfortable. Some unsecured products carry no UCC filing at all, which makes them especially clean from the senior's perspective. The bank usually appreciates a well-structured stretch layer, because it lets them keep their senior position right-sized without having to overextend.",
    relatedSolutions: ['unsecured-debt', 'asset-based-lending']
  },
  {
    id: 'subordinated-debt-cost',
    q: 'How much does subordinated or unsecured stretch capital cost?',
    a: 'As of 2026, pricing typically runs Prime + 4-8% depending on cash-flow strength, lien position, and how subordinated the layer is. That\'s more expensive than the senior secured piece underneath, by design, because the lender is taking more risk. The honest question to ask isn\'t "is this cheap?" but "do the incremental dollars unlock enough upside to justify the cost?" When the answer is yes, this is the tool that gets the deal done.',
    relatedSolutions: ['unsecured-debt']
  },
  {
    id: 'unsecured-no-pg',
    q: 'Are there unsecured products with no personal guarantee?',
    a: "A few, yes. They exist but they're rare and the underwriting bar is higher. Most stretch-capital products will ask for a PG, especially if the structure is unsecured and there's no collateral to anchor it. When a no-PG option is on the table, it tends to be priced at the higher end of the range and the lender is leaning heavily on the historical cash flow and the strength of the senior secured structure underneath. We surface these options when they fit; we don't promise them blind.",
    relatedSolutions: ['unsecured-debt']
  },

  // ==========================================================================
  // 2026-05 EXPANSION — Bridge Funding
  // ==========================================================================
  {
    id: 'what-makes-a-good-bridge',
    q: 'What makes a "good" bridge loan vs. a bad one?',
    a: 'The single most important variable is the exit. A good bridge has a visible, time-bound take-out: an ABL closing in 60 days, a property under contract, a senior facility under written term sheet, a contract with assignment of claims signed. A bad bridge has no defined exit and ends up rolling into another bridge, then another. If the repayment source is "investors who are positively responding," that\'s not a bridge. That\'s expensive working capital pretending to be one. We walk away from those.',
    relatedSolutions: ['bridge-funding']
  },
  {
    id: 'bridge-cost-sounds-expensive',
    q: 'The annualized rate on a bridge looks high. Is it actually expensive?',
    a: "Not if you only carry it for the days you actually need it. Bridge products are built to exit fast, usually 30-180 days, and most carry aggressive early-payoff discounts so the effective cost scales with how long you hold the capital. A 6-7% annualized rate held for 60 days on a strong-margin deal is almost always worth it. The mistake is treating bridge like a long-term loan. That's when the annualized number actually hurts you.",
    relatedSolutions: ['bridge-funding']
  },
  {
    id: 'bridge-while-abl-set-up',
    q: 'Can I use a bridge while my asset-based line is being set up?',
    a: 'Yes. This is one of the most common ways we sequence capital. We call it a "one-then-three" approach: get a fast revenue-based or unsecured bridge in place in days, then run the asset-based facility in parallel knowing it takes 6-8 weeks to close. The bridge stabilizes operations during the gap; the ABL is the permanent structure. When the ABL funds, it takes out the bridge.',
    relatedSolutions: ['bridge-funding', 'asset-based-lending']
  },
  {
    id: 'how-fast-bridge',
    q: 'How fast can a bridge actually close?',
    a: 'As of 2026, typical bridge closes run 3-7 business days from a clean file. The variables that determine speed are how complete the financials are, whether the exit event is documented, and how clean the existing senior debt picture is. Truly fast (1-2 day) closes exist for established cash-flowing businesses with strong bank-statement history; complex collateral or thin documentation pushes closer to the two-week mark.',
    relatedSolutions: ['bridge-funding']
  },
  {
    id: 'bridge-vs-mca',
    q: 'Is bridge funding the same as a merchant cash advance?',
    a: 'No, and the distinction matters. A merchant cash advance is short-term capital with daily or weekly debits, typically no defined exit event, and pricing that gets dramatically worse if you stack multiple advances. A proper bridge is event-driven. It exits when a specific thing closes, and carries interest-only or monthly payment structures with aggressive early-payoff incentives. Bridge belongs in a layered-capital strategy; MCA usually doesn\'t.',
    relatedSolutions: ['bridge-funding', 'debt-refinance']
  }
]

// ============================================================================
// SOLUTION COMPARISON FAQs (General - for /solutions listing page)
// ============================================================================

export const solutionComparisonFAQs: FAQ[] = [
  {
    id: 'which-funding-fastest',
    q: 'Which funding solution is the fastest?',
    a: 'Working capital loans and revenue-based financing are the fastest, with approval in 1-3 business days and funding in 2-10 days. Bridge funding and invoice factoring (once approved) can also move quickly. Factoring releases cash within 24-48 hours per invoice. Asset-based lending and SBA loans take longer (4-8 weeks) but offer lower rates.',
    relatedSolutions: ['working-capital-loans', 'bridge-funding', 'invoice-factoring']
  },
  {
    id: 'bank-declined-options',
    q: 'What if my bank declined me?',
    a: 'When banks say no, we say how. Bank declines are actually our most common starting point. Bankers are our primary referral source. Alternative lenders evaluate businesses differently: invoice factoring looks at your customers\' credit (not yours), asset-based lending focuses on collateral value, and working capital loans weigh revenue trajectory. We have an extensive network of lender relationships to find the right fit.',
    relatedSolutions: ['asset-based-lending', 'invoice-factoring', 'working-capital-loans']
  },
  {
    id: 'combine-funding-types',
    q: 'Can I combine multiple funding types?',
    a: 'Yes. This is called "layered capital" and it\'s one of our specialties. Example: $1MM AR revolver + $240K unsecured term loan + $550K second mortgage = $1.79MM total capital. Each layer serves a different purpose and sits at a different position in the capital stack. This approach maximizes available funds without over-leveraging any single source.',
    relatedSolutions: ['asset-based-lending', 'unsecured-debt', 'real-estate-lending']
  },
  {
    id: 'how-much-qualify-for',
    q: 'How much can I qualify for?',
    a: 'Qualification depends on your assets, revenue, and the funding type. Working capital loans range from $100K-$10M+ based on revenue. Invoice factoring provides 75-95% of your AR value ($250K-$100MM). Asset-based lending offers $250K-$25M against receivables, inventory, and equipment. We typically find the right structure within your first consultation.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring', 'asset-based-lending']
  },
  {
    id: 'documents-needed-funding',
    q: 'What documents do I need to apply?',
    a: 'Most solutions require 3-6 months of bank statements, a recent accounts receivable aging report, and basic business financials (P&L, balance sheet). Some products like invoice factoring focus primarily on your AR and customer creditworthiness rather than tax returns. Working capital loans may only need bank statements and a simple application. We\'ll tell you exactly what\'s needed in our first call.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring', 'asset-based-lending']
  },
  {
    id: 'how-long-approval-takes',
    q: 'How long does approval take?',
    a: 'Timeline varies by product: working capital loans approve in 1-3 business days, invoice factoring in 2-3 weeks (then 24-48 hours per invoice), asset-based lending in 4-8 weeks, and SBA loans in 4-12 weeks. Bridge funding and emergency payroll can close in as few as 3-5 business days when time is critical.',
    relatedSolutions: ['working-capital-loans', 'invoice-factoring', 'asset-based-lending', 'bridge-funding']
  },
  {
    id: 'which-solution-cheapest',
    q: 'Which funding solution has the lowest cost?',
    a: 'SBA loans offer the lowest rates (Prime + 2-3%) but take the longest to close. Invoice factoring (Prime + 1-6%) and asset-based lending (Prime + 1-5%) are next, offering competitive rates with faster timelines. Working capital loans (1.25-4% monthly) cost more but close in days. The cheapest option depends on your timeline, collateral, and business profile. We help you find the best balance of cost and speed.',
    relatedSolutions: ['sba-loans', 'invoice-factoring', 'asset-based-lending', 'working-capital-loans']
  },
  {
    id: 'collateral-required',
    q: 'Do I need collateral to get business funding?',
    a: 'Not always. Working capital loans and unsecured bridge capital don\'t require traditional collateral. They\'re approved based on revenue and growth trajectory. Invoice factoring uses your unpaid invoices as collateral. Asset-based lending requires hard assets (AR, inventory, equipment). Real estate lending requires property. We match you to the right product based on what you have available.',
    relatedSolutions: ['working-capital-loans', 'unsecured-debt', 'invoice-factoring', 'asset-based-lending']
  }
]

// ============================================================================
// ALL FAQs COMBINED
// ============================================================================

export const allFAQs: FAQ[] = [
...aboutServeFundingFAQs,
...workingCapitalFAQs,
...solutionSpecificFAQs,
...solutionComparisonFAQs
]
