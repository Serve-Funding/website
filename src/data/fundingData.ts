export interface FundingCase {
  amount: string
  title: string
  company: string
  description: string
  fullStory: string
  industry: string
  fundingType: string
  challengeResolved: string
  timeline: string
}

export const fundingCases: FundingCase[] = [
  {
    amount: '$650K',
    title: 'Subordinated Growth Capital',
    company: 'Commercial Excavation Contractor, CO',
    description: 'A Colorado commercial excavation company with more than a decade in business had nearly quadrupled revenue under current ownership, from just over $5MM to nearly $20MM, and was projecting another 20-25% growth. Its bank had just refinanced the SBA loan used to buy the company, which freed the owner\'s personal property from a blanket lien but left nothing behind it for working capital.',
    fullStory: 'The owners acquired the business five years ago with an SBA 7(a) loan. It was the right tool at the time, and it came with a blanket lien across both the business and the owner\'s personal property. Five years of scaling later, that structure had become the constraint rather than the support.\n\nThis year the owners refinanced the SBA debt into a conventional bank facility. That did the important work of releasing the personal property from the lien, but the new facility was sized only to retire the SBA balance. It left no room for the working capital the business needed to keep growing, and anything additional would have to sit behind the new senior lender as subordinated debt, which is a materially harder ask than a first-position loan.\n\nServe Funding sourced multiple competitive options and structured a $650,000 subordinated term loan behind the new bank facility: a 20-month term at simple interest in the mid-teens, with a prepay discount negotiated to waive all remaining interest on an early payoff at any point. That last term is what changes its character - it behaves like a line of credit rather than a fixed-cost term loan, so the client only pays for the time they actually use. The deal closed within a couple of weeks.\n\nFunding the next stage of growth took a different kind of capital: one built to sit responsibly behind a senior lender without slowing the business down.',
    industry: 'Commercial Excavation',
    fundingType: 'Subordinated Term Loan',
    challengeResolved: 'Added growth capital behind a new senior bank facility that had been sized only to retire an SBA 7(a) balance',
    timeline: 'A couple of weeks'
  },
  {
    amount: '$2.8MM',
    title: 'Portfolio Equity Unlock',
    company: 'Private Real Estate Investor, Multi-State',
    description: 'A seasoned high-net-worth investor had built a portfolio of income-producing properties across several states, each held in its own LLC. He came to Serve Funding to refinance higher-cost debt and unlock equity across key properties, but a complex multi-entity structure, variable property-level income, and a pending legal matter had disqualified him from the bank financing he was pursuing.',
    fullStory: 'The challenge was never the quality of the portfolio; it was the structure. The original request, a bank standby letter of credit for more than $11MM, had stalled completely, and multiple institutions had already passed. He needed a creative partner, not another no.\n\nServe Funding went to work identifying lenders equipped to underwrite against real equity rather than just clean tax returns and tidy entity charts. After an extensive market search, we sourced a preferred equity lender with the appetite to fund against the portfolio property-by-property. Instead of forcing a single large transaction that required every property to qualify at once, we structured the deal as six tranches across four properties, letting each asset close on its own timeline as underwriting completed.\n\nThat approach got capital moving immediately. The first two closings happened within weeks of engaging the lender, deal risk dropped because no single property\'s complexity could derail the program, and each tranche was right-sized to the property\'s specific equity and cash-flow profile. Over roughly 60 days from first close to final tranche, Serve Funding funded $2,820,000 in preferred equity, giving the investor meaningful liquidity against a portfolio conventional lenders had declined to touch, without a forced sale, a personal-guarantee blowout, or months of bank-committee timelines.',
    industry: 'Private Real Estate Investment',
    fundingType: 'Preferred Equity (Multi-Tranche)',
    challengeResolved: 'Unlocked $2.8MM of equity across 4 properties after banks declined an $11MM LOC request',
    timeline: '~60 days (6 tranches)'
  },
  {
    amount: '$1.475MM',
    title: 'Bridge To M&A Exit',
    company: 'Medical & Surgical Practice Group, Southeast',
    description: 'A successful surgeon running multiple medical and surgical practices in the Southeast accepted an offer from a large hospital system to acquire his companies. With a liquidity event pending but not yet closed, he needed substantial short-term capital to bridge the gap, and he needed it fast.',
    fullStory: 'Their private banker at a major national bank referred them to a counterpart on the bank\'s commercial team, a banker with a nine-year relationship with Serve Funding. After the introduction, we determined the doctor needed capital in excess of $1.25MM within a few short weeks to cover important year-end business expenses ahead of the sale.\n\nServe delivered multiple options, including an interest-only bridge loan tied to the doctor\'s property and several revenue-based business term loans. As usual, we negotiated terms aggressively on the client\'s behalf and secured the structure that best matched the required timing, cost of funds, and repayment profile.\n\nThe result: $1.475MM funded with a flexible bridge structure and aggressive prepayment discounts, delivered in under two weeks, well inside the client\'s tight timeframe. The deal didn\'t just solve for cash flow; it gave the founder peace of mind and protected their upside heading into the acquisition.',
    industry: 'Healthcare / Medical Practices',
    fundingType: 'Bridge Loan',
    challengeResolved: 'Bridged a pending hospital-system acquisition; funded a $1.25MM+ need in under 2 weeks',
    timeline: '< 2 weeks'
  },
  {
    amount: '$1.5MM',
    title: 'Post-Acquisition ABL',
    company: 'Commercial Roofing Contractor, GA',
    description: 'A 38-year-old commercial roofing contractor with roughly $16MM in annual revenue, acquired 15 months earlier by a private equity group, needed liquidity to pre-purchase materials, smooth receivable cycles, and support larger commercial contracts during its post-acquisition growth phase.',
    fullStory: 'Despite a strong track record, including nearly $20MM in revenue and $1.4MM in net income in 2023, the company\'s topline dipped in 2024 and it posted a roughly $600K net loss in 2025. That loss was driven by acquisition costs and some internal operational misalignment, not operational weakness, but it still placed the request just outside a conventional bank\'s box.\n\nServe Funding arranged a $1,500,000 asset-based revolving line of credit with an 85% advance rate on eligible receivables, Prime + 3% pricing, a 24-month facility with a 90-day exit option, and no unused line fee. The facility took a first-position lien on accounts receivable and working capital assets while remaining subordinate on equipment and fixed assets.\n\nThis structure allowed the business to scale contract volume without compressing cash flow or layering on high-cost short-term debt, exactly the kind of aligned growth capital a post-acquisition contractor needs.',
    industry: 'Commercial Roofing',
    fundingType: 'Asset-Based Line of Credit',
    challengeResolved: 'Funded post-PE-acquisition growth despite a 2025 net loss with a $1.5MM ABL revolver',
    timeline: 'Weeks'
  },
  {
    amount: '$1.5MM',
    title: 'Tier IV Data Center Bridge',
    company: 'Data Center Developer, FL',
    description: 'A seasoned developer with more than 20 years building mission-critical infrastructure was nearing completion of a flagship Tier IV data center at its new headquarters campus in Central Florida when expedited final-phase work created a short-term funding gap ahead of an anticipated equity close.',
    fullStory: 'To preserve commissioning timelines and Tier IV performance standards, the team accelerated key workstreams as the project entered its final phase. Those decisions, common in complex mission-critical builds, introduced incremental costs tied to expedited execution, scope refinement, and seasonal timing.\n\nRather than slow progress or take on long-term leverage at a critical moment, the company sought $1.5MM in short-term capital as a proactive bridge, ensuring uninterrupted momentum while preserving strategic flexibility ahead of the liquidity event.\n\nIn under two weeks, Serve Funding structured and closed a highly flexible bridge tailored to the sponsor\'s capital plan and project timeline. It provided immediate liquidity for final-stage execution, bridged cleanly to an upcoming equity injection, and included a performance-based interest-forgiveness mechanism tied to early payoff that materially reduced the total cost of capital once the liquidity event closed. Strong project controls and a clear path to takeout let the capital function as a strategic tool rather than a constraint.',
    industry: 'Data Center Infrastructure',
    fundingType: 'Bridge Loan',
    challengeResolved: 'Bridged final-phase construction costs to an equity close; funded in under 2 weeks',
    timeline: '< 2 weeks'
  },
  {
    amount: '$300K',
    title: 'Seasonal Working Capital',
    company: 'Corporate & Wedding Event Venue, Southeast',
    description: 'A high-end corporate and wedding event venue with strong demand but heavy seasonality, servicing 60-70% of its annual event volume in the last three months of the year, needed working capital to bridge receivables and protect a critical revenue window ahead of a planned sale.',
    fullStory: 'The referring bank already held an all-asset senior UCC-1 tied to an existing term loan, and had to decline the additional credit the client requested. The reason was historical losses that were a byproduct of seasonality and high fixed costs, not operational weakness.\n\nServe Funding secured a $300,000 term loan to provide the seasonal working capital in under one week, structured over a 22-month term with steady payments and an option to waive 100% of remaining interest upon prepayment. That gave the client immediate relief and a clean runway to exit the facility once cash flow normalized, without carrying unnecessary interest. It was a textbook example of smart money over fast money: a structure that worked today and didn\'t punish the owner tomorrow.',
    industry: 'Events & Hospitality',
    fundingType: 'Term Loan',
    challengeResolved: 'Funded Q4-concentrated seasonal cash flow ahead of a planned sale; closed in under a week',
    timeline: '< 1 week'
  },
  {
    amount: '$150K',
    title: 'Funded In 3 Days',
    company: 'Wedding & Events Venue, FL',
    description: 'When the owner of a Florida wedding venue realized they could not cover payroll before a packed schedule of 15 weddings booked across three consecutive weeks, panic set in, and their bank\'s credit box could not move quickly enough to help.',
    fullStory: 'Their commercial banker recognized the urgency immediately and, rather than walk away, introduced Serve Funding. Together we reviewed competing offers and identified better, fairer terms, educated the client on repayment options and prepayment discounts, and delivered $150,000 in 72 hours, fast, affordable, and transparent.\n\nThe result was more than a funded deal. Fifteen weddings stayed on schedule, staff stayed paid, and operations kept thriving through the busiest month of the year. The banker became the trusted advisor the client will never forget, a reminder that in high-pressure moments, the banker who brings the solution becomes the hero of the story.',
    industry: 'Events & Hospitality',
    fundingType: 'Working Capital Loan',
    challengeResolved: 'Covered payroll for 15 weddings in 3 weeks; $150K delivered in 72 hours',
    timeline: '3 business days'
  },
  {
    amount: '$1MM',
    title: 'PO Financing Line',
    company: 'Green Coffee Importer, TX',
    description: 'A family-owned international green coffee trader saw demand from corporate roasters surge almost overnight. The opportunity was real, but their existing purchase order facility was capped at $150,000 and that lender would not increase the line, leaving growth to outpace working capital.',
    fullStory: 'Serve Funding was introduced to the specialty coffee importer by one of our asset-based lending partners. Leveraging a nearly ten-year lender relationship, Serve secured a $1,000,000 purchase order financing facility.\n\nThe new line enabled the client to offset rising costs from tariffs through bulk-order discounts, pay overseas suppliers without delays, and keep production moving and customers happy. It was more than just a loan; it was the right structure at the right time, capital that scaled with the company\'s growth instead of capping it.',
    industry: 'Coffee Importing / Trading',
    fundingType: 'Purchase Order Financing',
    challengeResolved: 'Replaced a capped $150K PO line with a $1MM facility to capture surging roaster demand',
    timeline: 'Days'
  },
  {
    amount: '$2MM',
    title: 'Short-Term Cashflow',
    company: 'Transportation Company, FL',
    description: 'A Florida-based, commercial transportation company earning over $50MM in annual revenue found themselves in an unexpected situation when one of the largest online retailers appointed them as a direct delivery partner.',
    fullStory: 'Although it came as an honor, this sudden change brought a significant shift in their invoicing terms, moving from net-7 to net-60 overnight. This effectively tied up over $2MM in invoices for what would be 60+ days.\n\nFaced with an urgent cash flow shortage, the company\'s banker reached out to Serve Funding for a quick and effective solution. After considering various options, including invoice factoring, which wasn\'t viable due to the retailer\'s internal processes, Serve Funding sourced a short-term lender to come through quickly for this client. The lender underwrote the financing based on the company\'s cash flow and provided a $2MM bridge loan in a matter of days. This allowed the transportation company to smoothly navigate the 60-day gap without disrupting their operations.',
    industry: 'Transportation',
    fundingType: 'Bridge Loan',
    challengeResolved: 'Resolved $2MM cash flow gap from net-7 to net-60 term change with major retailer',
    timeline: 'Days'
  },
  {
    amount: '$150K',
    title: 'Fast Payroll Cover',
    company: 'Specialty Services Firm, GA',
    description: 'A growing niche services firm, based in GA and specializing in the interstate transport of private luxury items, faced an urgent cash flow crisis when a large receivable was unexpectedly delayed by a key customer.',
    fullStory: 'The risk was they would fall short on meeting their payroll funding requirement, so the firm\'s leadership needed a swift solution to avoid disrupting their operations and staff morale.\n\nTheir account executive, working with a new PEO partner, reached out to Serve Funding for immediate assistance. Understanding the urgency, we quickly sourced a $150,000 term loan with an 18-month repayment structure. The loan closed in just under four business days, allowing the firm to meet payroll on time and avoid any operational setbacks. Crisis averted!',
    industry: 'Specialty Services',
    fundingType: 'Term Loan',
    challengeResolved: 'Covered payroll gap from delayed receivable; prevented operations disruption',
    timeline: '4 business days'
  },
  {
    amount: '$750K',
    title: 'Resolve Aged AR',
    company: 'Oil & Gas Services, TX',
    description: 'A rapidly growing provider of solids control services in the oil and gas sector, specializing in managing solids during the drilling process, was facing financial strain due to $550,000+ in aged receivables that were ineligible for financing.',
    fullStory: 'The company, based in Texas, had built a reputation for reliability and environmental compliance, supporting some of the largest energy producers since its founding in 2018.\n\nTo continue its growth trajectory and manage these outstanding balances, the firm was referred to Serve Funding by a long-time partner in the ABL financing sector. Michael and his team collaborated with a second-lien lender to secure a $750,000 term loan over 24 months with monthly payments. This enabled the company to resolve the aged receivables and provide additional working capital during this critical transition.\n\nWith Serve Funding\'s assistance, the company stabilized its finances and was able to focus on capitalizing on new opportunities in the energy sector, continuing its rapid expansion while ensuring optimized drilling performance for its clients.',
    industry: 'Oil & Gas Services',
    fundingType: 'Term Loan',
    challengeResolved: 'Resolved $550K+ in aged receivables and provided working capital for growth',
    timeline: 'Days'
  },
  {
    amount: '$150K',
    title: 'Partner Buyout',
    company: 'Foundation Contractor, GA',
    description: 'Our client is a specialty contractor with offices in GA and SC.',
    fullStory: 'The owner-operators are a husband and wife team, specializing in residential and commercial foundation repair and build-outs. They had been operating over 12 years in business when they approached Serve Funding. The owners faced a time-sensitive partner buyout opportunity.\n\nYears prior, their company had merged with a complementary contractor, and the combined business thrived under a unified name. When the retiring partner decided to exit, he demanded a $150,000 buyout for his share of the business, placing the owner under immense pressure with a strict, 30-day deadline. They found Serve Funding directly on LinkedIn and turned to us for a quick solution to their pressing problem.\n\nMichael and his team moved swiftly, sourcing a lender and structuring the $150,000 as an 18-month bridge loan, designed with favorable early payoff discounts. This gave the client the breathing room it needed to settle the buyout without derailing the business operations. Six months later, the company was able to refinance the loan through a 10-year SBA facility, effectively converting the short-term debt into a more manageable long-term structure.',
    industry: 'Foundation Contracting',
    fundingType: 'Bridge Loan',
    challengeResolved: 'Funded urgent partner buyout with 30-day deadline; later refinanced to SBA',
    timeline: '30 days'
  },
  {
    amount: '$34MM',
    title: 'Equipment Financing',
    company: 'Plastics Recycling, FL / OH',
    description: 'A publicly traded plastics recycler, headquartered in Florida and with its first plant in Southern Ohio, went public via a SPAC in 2023.',
    fullStory: 'The company, utilizing proprietary technology to recycle polypropylene, raised an aggregate of nearly $1B through Ohio state revenue bonds as well as their stock offerings.\n\nAs a pre-revenue startup, they sought creative ways to extend their cash runway, especially after using equity to purchase equipment that was not yet installed. A banker in Central Florida introduced them to Serve Funding, and Michael worked to secure financing for tens of millions, a challenging task for a pre-revenue company.\n\nAfter a thorough seven-month process involving two term sheets and 2 corresponding site visits, $22MM million was funded against one equipment schedule. About a year later, another $12MM was closed for a second schedule by a separate equipment lender sourced by Serve Funding. As the company approaches revenue generation, Serve Funding\'s efforts have provided some additional liquidity needed to support their growth, positioning them as a future leader in sustainable plastics.',
    industry: 'Plastics Recycling',
    fundingType: 'Equipment Financing',
    challengeResolved: 'Funded equipment for pre-revenue SPAC; extended cash runway for growth stage company',
    timeline: '7 months (due diligence)'
  },
  {
    amount: '$515K',
    title: 'Strategic Acquisition',
    company: 'Telecom Engineering Staffing, OH',
    description: 'A service disabled veteran & minority-owned telecom engineering staffing firm was pursuing a strategic acquisition to expand its reach in the telecommunications sector.',
    fullStory: 'The target was a profitable staffing company in the same industry, poised to enhance their service offerings and market presence. However, after two failed attempts to secure financing from other lenders, the firm was at risk of losing the deal due to growing seller deal-fatigue.\n\nThat\'s when their investment banker reached out to Michael at Serve Funding for help. Michael acted quickly, securing a $515,000 short-term, revenue-based bridge loan that enabled the firm to meet the seller\'s deadline and close the acquisition.\n\nThe bridge loan was structured with an early-out clause, allowing the client to refinance at a lower interest rate soon after the deal was completed. This not only ensured the acquisition but also saved the company a significant amount in interest costs, highlighting Serve Funding\'s expertise in managing complex, time-sensitive transactions.',
    industry: 'Telecom Staffing',
    fundingType: 'Revenue-Based Bridge Loan',
    challengeResolved: 'Enabled strategic acquisition after 2 previous lender denials; avoided deal loss',
    timeline: 'Days'
  },
  {
    amount: '$3.1MM',
    title: 'Total Working Capital',
    company: 'Medical Device Manufacturer, FL',
    description: 'This medical device manufacturer, headquartered in Central Florida, was referred to Serve Funding by a banker after narrowly missing the bank\'s debt service coverage ratio requirements.',
    fullStory: 'They needed working capital to support longer payment terms as customers requested net-60-day terms, and to build deeper inventory for new, larger customer orders.\n\nOver a six-month span, Serve Funding closed four tranches of capital. The first was a $400K, 12-month unsecured working capital loan with monthly payments, primarily used for adding inventory and supporting extended payment terms. Two months later, they secured a $1MM revolving line of credit backed by accounts receivable, enabling faster onboarding of new, high-volume customers.\n\nThe following month, the original term loan was refinanced into a $500K facility, maintaining the same rate and terms, while still remaining unsecured. Shortly after, the company sought funds to repay friends and family investors. With existing assets tapped out, Serve Funding arranged a $550K second mortgage on the owner\'s home using a bank-statement-only approach. A month later, as sales surged, Serve Funding secured an increase in the AR line to $1.5MM.\n\nDECEMBER 2024 UPDATE: Serve closed another term loan for an additional $550k for our client. The company is closing out 2024 at over $5MM in revenue which represents 30% + YoY growth.',
    industry: 'Medical Device Manufacturing',
    fundingType: 'Working Capital + AR Line',
    challengeResolved: 'Supported 30%+ YoY growth; enabled net-60 customer terms and new customer onboarding',
    timeline: '6 months (4 tranches)'
  },
  {
    amount: '$300K',
    title: 'Refi Of Termed Bank Line',
    company: 'Steel Framing Contractor, GA',
    description: 'This specialty contractor, focusing on steel framing, was introduced to Serve Funding by a banker they approached for credit.',
    fullStory: 'Their current bank unexpectedly terminated their line of credit with a tight, 4-month deadline, forcing the company into large monthly payments to settle the balance by year-end. After seeking help from another banker, who was unable to extend credit due to the company\'s 2023 tax losses, they were referred to Michael at Serve Funding.\n\nRecognizing the urgency, Michael and his team swiftly developed a strategic, three-phase financing plan. The initial step was securing a $300,000 bridge loan, structured over 12 months with manageable monthly payments and a competitive interest rate in the mid-teens. This loan alleviated immediate pressure by paying off the bank line, significantly reducing the company\'s financial burden.\n\nThis bridge solution was the first step in a comprehensive strategy to stabilize the contractor\'s finances. Next, Serve Funding plans to arrange a cash-out refinance using the company\'s commercial property, followed by establishing an accounts receivable-based line of credit for long-term working capital needs. With this step-by-step plan, the client is now optimistic and relieved, confident that Serve Funding\'s tailored approach will keep their business on track and poised for future growth.',
    industry: 'Steel Framing',
    fundingType: 'Bridge Loan',
    challengeResolved: 'Replaced terminated bank line; restructured payments after 2023 tax losses',
    timeline: 'Days'
  },
  {
    amount: '$1.2MM',
    title: 'Total Working Capital',
    company: 'Labels Manufacturer, TX',
    description: 'This minority-owned company, based in Texas with operations in both Texas and Mexico, has been a loyal client of Serve Funding for over three years.',
    fullStory: 'With a 20-year history, the business manufactures industrial labels and has shown consistent growth and profitability. Like many expanding companies, they frequently faced cash flow challenges as they adapted to larger customer orders.\n\nIn mid-2023, Serve Funding secured a $500,000 revolving line of credit from a regional bank in TX, complemented by a $350,000 SBA loan to replace an existing facility, enabling the bank to hold a senior lien position. Additionally, over the past two years, Serve Funding arranged three tranches of unsecured working capital totaling $350,000.\n\nThe company remains a strong supporter of Serve Funding and is currently collaborating on transitioning the bank line into an AR-based facility. This adjustment will accommodate their expected surge in sales over the next 12 to 18 months, ensuring the facility can scale rapidly to support their growth.',
    industry: 'Labels Manufacturing',
    fundingType: 'Working Capital + SBA',
    challengeResolved: 'Supported 20-year growth trajectory; enabled larger customer orders and 3-year partnership',
    timeline: 'Multiple tranches'
  },
  {
    amount: '$205K',
    title: 'Total Funding For Inventory',
    company: 'Landscape Materials Co, OH',
    description: 'This small, family-owned business, led by a husband and wife team in Cincinnati, OH, has been in operation for over 20 years.',
    fullStory: 'They faced significant challenges after a family member in the same industry betrayed their trust, stealing key customers and accounts, which led to years of struggle. Determined to rebuild, they approached Serve Funding during their busy seasons seeking inventory solutions.\n\nDespite being highly leveraged personally and the company facing its own credit challenges, Serve Funding identified lenders willing to work with them and fought to negotiate reasonable terms and pricing, despite this client\'s high-risk profile. Over nine months, we secured four separate tranches of funding, totaling just over $205,000, helping the company sustain operations and support them through their off seasons.',
    industry: 'Landscape Materials',
    fundingType: 'Inventory Financing',
    challengeResolved: 'Sustained operations for high-risk, leveraged client after customer theft; 4 tranches',
    timeline: '9 months'
  },
  {
    amount: '$550K',
    title: 'Total Bridge Financing',
    company: 'Wine Transport & Storage Co, GA',
    description: 'A premier provider of climate-controlled wine transport and storage services faced a series of cash shortfalls that jeopardized their ability to meet payroll.',
    fullStory: 'Referred to Serve Funding by a long-time partner in the PEO sector, the company needed a swift solution to avoid serious disruption.\n\nIn January, Michael and his team secured a $200,000 bridge loan to cover the initial shortfall. When the company encountered the same issue in February, Serve Funding provided another $200,000 tranche from the same unsecured bridge lender. Operations continued smoothly until August, when a third shortfall occurred. This time, Serve Funding sourced $150,000 from a separate lender to ensure payroll was once again met on time.\n\nThanks to Serve Funding\'s timely interventions and strategic financial support, the company stabilized and has continued to grow without further capital needs.',
    industry: 'Wine Transport & Storage',
    fundingType: 'Bridge Financing',
    challengeResolved: 'Covered seasonal payroll shortfalls (Jan, Feb, Aug); stabilized operations',
    timeline: 'Multiple tranches'
  },
  {
    amount: '$500K',
    title: 'Working Capital',
    company: 'Oil & Gas PubCo, TX & NM',
    description: 'In late 2023, an experienced oil & gas executive team successfully completed a SPAC acquisition of a 30-year-old drilling operation based in Southeast New Mexico.',
    fullStory: 'With plans to restart up to 100 idle wells, they sought additional working capital through a sale-leaseback of equipment, initially approved as a subordination by their bank.\n\nThey had an offer from a well-known equipment financing company, but delays from that lender raised concerns. The CEO had worked with Michael previously on another venture, so he reached out for help. Michael and the Serve Funding team presented multiple term sheets within a few short weeks, positioning the deal to move forward. However, when the equipment appraisal revealed high value, the bank unexpectedly withdrew its agreement to subordinate the assets, creating an unforeseen obstacle.\n\nMichael acted swiftly, pivoting from the original plan and securing a $500,000 short-term working capital loan. This funding provided the necessary liquidity to proceed with equipment updates, while discussions with the bank continued to revisit the refinancing agreement.',
    industry: 'Oil & Gas PubCo',
    fundingType: 'Working Capital Loan',
    challengeResolved: 'Provided liquidity for equipment updates after bank subordination agreement fell through',
    timeline: 'Weeks'
  },
  {
    amount: '$135K',
    title: 'Payroll Cover',
    company: 'Cybersecurity Tech Firm, CA',
    description: 'This minority & veteran-owned company, based in Southern California, developed an innovative cybersecurity solution and was heading for significant growth.',
    fullStory: 'They had yet to achieve consistent revenues. They were speaking to an AR financing firm in hopes of securing a revolving line to support their unsteady revenues but that was simply not a fit. As they found themselves facing an upcoming payroll crunch, the AR lender introduced the owner to Michael of Serve Funding.\n\nWe went to bat for this awesome client and secured a $60,000 cash-advance tranche to cover their immediate payroll shortfall. A month and a half later, they returned facing a similar cash flow gap, and we arranged another $75,000 tranche under similar terms from the same lender.\n\nBoth advances included early payoff clauses, enabling the company to save on interest when they raised additional equity. Today, the firm is thriving, generating revenues at well over an 8-figure ARR, and is truly poised to become a leader in the cybersecurity sector.',
    industry: 'Cybersecurity Tech',
    fundingType: 'Payroll Bridge Loan',
    challengeResolved: 'Covered pre-revenue payroll gaps ($60K + $75K tranches); company now 8-figure ARR',
    timeline: '5 days (first tranche)'
  },
  {
    amount: '$75K',
    title: 'Asset Purchase',
    company: 'HVAC Contractor, GA',
    description: 'A Georgia-based HVAC technician, with over a decade of experience, initially acquired the assets of a 40-year-old company from a retiring owner.',
    fullStory: 'The following year, he sought to expand further by purchasing the customer list of another local competitor, consisting of over 3,500 valuable contacts. This strategic acquisition would significantly boost his client base and market reach, but securing financing was challenging due to his less-than-ideal credit and the business being less than two years old.\n\nRecognizing the opportunity, Michael structured a favorable short-term bridge loan with aggressive early payoff options. The loan was secured just in time for the peak summer season, enabling the technician to onboard new clients efficiently. Since acquiring these accounts, the company has grown steadily, moving closer to long-term profitability and a stronger foothold in the local HVAC market.',
    industry: 'HVAC Contractor',
    fundingType: 'Asset Purchase Loan',
    challengeResolved: 'Enabled customer list acquisition (3,500 contacts) despite poor credit and young company',
    timeline: 'Days'
  },
  {
    amount: '$55K',
    title: 'Refinance 2 MCA\'s',
    company: 'Welding Contractor, NJ',
    description: 'This specialty welding contractor, recognized for high-end metalwork projects throughout the Tri-State Area.',
    fullStory: 'The contractor was introduced to Serve Funding by an AR financing executive who trusted Michael\'s reputation. After being misled into two high-cost merchant cash advances (MCAs) by an unscrupulous broker, the company struggled with burdensome payments. Despite these challenges, the business showed steady post-COVID growth. Additionally, they faced modest tax liabilities and were working through a tax lien resolution.\n\nMichael structured a $55,000 term loan to refinance the 2 much higher priced cash advances. This loan also provided additional funds to support payroll and materials for ongoing projects. By refinancing and adding liquidity, Serve Funding positioned the contractor to manage immediate cash flow needs and focus on growth.',
    industry: 'Welding Contractor',
    fundingType: 'MCA Refinance',
    challengeResolved: 'Refinanced 2 predatory merchant cash advances; added payroll/materials liquidity',
    timeline: 'Days'
  }
]
