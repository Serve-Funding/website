export interface Question {
  id: string
  title: string
  partnerTitle?: string // Alternate title shown when user is a Banker / Business Advisor
  answers: string[]
  type?: 'single' | 'multi' | 'single_with_other' | 'contact-info'
  placeholder?: string
  helpHtml?: string
}

/**
 * single_with_other type explanation:
 * - Displays options as button group (like 'single' type)
 * - Automatically adds "Other" option if not in the answers array
 * - When "Other" is selected, shows an input field for custom response
 * - Both the selected option and custom text are submitted
 *
 * Example:
 * {
 *   id: 'industry',
 *   title: 'What is your business industry?',
 *   answers: ['Healthcare', 'Manufacturing', 'Retail'],
 *   type: 'single_with_other'
 * }
 * This will display: [Healthcare] [Manufacturing] [Retail] [Other]
 * And show an input field when "Other" is clicked
 */

/**
 * ORDER IS LOAD-BEARING — see src/lib/triage-rules.ts before moving anything.
 *
 * Four constraints:
 *  1. `annual_revenue` must come AFTER `funding_amount`. The two Mike-routing
 *     rules are keyed on `annual_revenue` and read `funding_amount`, so the
 *     amount has to already be on the form state when revenue is answered.
 *  2. `financing_needs` must stay LAST. Its two rules read revenue, amount,
 *     time in business and industry, so all four have to precede it.
 *  3. `annual_revenue` must stay SECOND-TO-LAST. A rule returning `mike` calls
 *     setShowChoicePoint and returns, so every question after the one that
 *     fires it is skipped. Revenue carries the two Mike rules, so moving it
 *     earlier silently costs the highest-value leads the fields behind it.
 *     One question is lost today (financing_needs), same as before this
 *     reorder — keep it that way.
 *  4. `financing_type` must stay ABOVE `annual_revenue`, for the same reason
 *     constraint 3 exists. It is the field the lender count depends on, and a
 *     Mike rule firing on revenue would skip it for exactly the leads
 *     ($10MM+ revenue, or $3MM+ with a $1MM+ ask) where the count matters
 *     most. Position 2 also keeps it a no-PII tap, which is what screen one
 *     and two are for.
 *
 * Why `funding_amount` opens: 90 days of Umami to 2026-09-08 says 128 people
 * loaded this form and 34 answered the first question. Of those 34, 26 handed
 * over contact details and 22 submitted — once someone starts, they finish.
 * The entire loss was screen one, which used to ask a stranger to classify
 * themselves before offering anything. Opening with the question they arrived
 * with is one tap, no typing, no PII, and it is the single most useful field
 * to have if they answer nothing else.
 */
export const formQuestions: Question[] = [
  {
    id: 'funding_amount',
    title: 'How much funding are you looking for?',
    answers: ['$100K-$250K', '$250K-$500K', '$500K-$1MM', '$1MM-$5MM', '$5MM-$10MM', '$10MM+'],
    type: 'single'
  },
  {
    id: 'financing_type',
    title: 'And what would the money be doing?',
    partnerTitle: "And what would the money be doing for your client?",
    // WHY THIS EXISTS, AND WHY THE WORDING IS NOT OUR PRODUCT NAMES.
    //
    // This is the only field that makes a lender count mean anything. Measured
    // against production on 2026-09-09: the ask alone matches 126-144 of 166
    // lenders (a number worth showing nobody), and product selection is what
    // narrows it to 20-38. Every field after that moves it by ~0. So without
    // this question there is no honest "we have lenders for this" screen —
    // see docs/portal-integrated-intake-spec.md.
    //
    // `financing_needs` does NOT do this job. It asks what the money is FOR
    // (working capital, refinance) and lands on `use_of_proceeds`; this asks
    // what SHAPE the facility is, and is what maps to `products_offered`.
    //
    // The labels describe the mechanic in the visitor's words on purpose. A
    // stranger does not know whether they want a "Revenue-Based Term Loan",
    // and asking them to self-classify into our vocabulary is the same mistake
    // the old `user_role` opener made (see #81). The portal owns the
    // label -> CANONICAL_PRODUCTS mapping, in the same place it already parses
    // our bucket strings (`src/lib/leads/facts.ts`) — one side of a cross-repo
    // contract, not two copies of a product list.
    //
    // Multi-select, and "Not sure yet" is a real answer: it carries no product
    // filter rather than a wrong one, which follows Sarah's onboarding brief
    // that an unsure client still gets their basics saved.
    answers: [
      'Borrow against inventory, receivables or equipment',
      'Get paid now on unpaid invoices',
      'Buy or lease equipment',
      'Funding based on monthly revenue',
      'Pay suppliers for a purchase order',
      'Commercial real estate',
      'An SBA loan',
      'Not sure yet',
    ],
    type: 'multi'
  },
  {
    id: 'user_role',
    // Not the welcome screen any more, and the old wording said "funding
    // partner" while the buttons say "Banker / Business Advisor".
    title: "And are you the business owner, or an advisor working with one?",
    answers: ['A Business Owner or Operator Seeking Funding', 'A Banker / Business Advisor'],
    type: 'single'
  },
  {
    id: 'contact_info',
    title: "Great. Let's get to know you. What's your name and how can we reach you?",
    partnerTitle: "Great. Let's get to know you. What's your name and how can we reach you?",
    answers: [],
    type: 'contact-info'
  },
  {
    id: 'business_industry',
    title: 'What industry is the business in?',
    partnerTitle: "What industry is your client in?",
    answers: [
      'Manufacturing',
      'Wholesale & Distribution',
      'Construction',
      'Healthcare Services',
      'Government Contractors',
      'Staffing Agency',
      'Food & Beverage',
      'Advertising & Media',
      'E-Commerce & Retail',
      'Consumer Products',
      'Software & SaaS',
      'Consulting & IT Services',
      'Cleaning & Janitorial',
      'Security Guard Services',
      'Telecommunications & IoT',
      'Other'
    ],
    type: 'single'
  },
  {
    id: 'time_in_business',
    title: 'How long has the business been operating?',
    answers: ['< 1 year', '1-2 years', '2-3 years', '3-4 years', '5+ years'],
    type: 'single'
  },
  {
    id: 'annual_revenue',
    title: "What's the approximate annual revenue?",
    partnerTitle: "What's your client's approximate annual revenue?",
    answers: ['$500K-$1MM', '$1MM-$3MM', '$3MM-$10MM', '$10MM-$20MM', '$20MM-$50MM', '$50MM-$100MM', '$100MM+'],
    type: 'single'
  },
  {
    id: 'financing_needs',
    title: 'What do you need the financing for?',
    answers: [
      'Working capital to support growth',
      'Short term bridge capital',
      'Equipment or asset purchase',
      'Business acquisition or partner buyout',
      'Refinance existing debt',
      'Growth / expansion',
      'Other'
    ],
    type: 'multi'
  },
]
