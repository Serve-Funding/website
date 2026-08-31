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

export const formQuestions: Question[] = [
  {
    id: 'user_role',
    title: "Welcome! Are you a business owner or a funding partner?",
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
    id: 'annual_revenue',
    title: "What's the approximate annual revenue?",
    partnerTitle: "What's your client's approximate annual revenue?",
    answers: ['$500K-$1MM', '$1MM-$3MM', '$3MM-$10MM', '$10MM-$20MM', '$20MM-$50MM', '$50MM-$100MM', '$100MM+'],
    type: 'single'
  },
  {
    id: 'time_in_business',
    title: 'How long has the business been operating?',
    answers: ['< 1 year', '1-2 years', '2-3 years', '3-4 years', '5+ years'],
    type: 'single'
  },
  {
    id: 'funding_amount',
    title: 'How much funding are you looking for?',
    answers: ['$100K-$250K', '$250K-$500K', '$500K-$1MM', '$1MM-$5MM', '$5MM-$10MM', '$10MM+'],
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
