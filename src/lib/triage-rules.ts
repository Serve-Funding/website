export type TriageAction = 'mike' | 'mike_with_chat' | 'kyler_with_chat' | 'skip_question'
export type LogicalOperator = 'AND' | 'OR'

export interface TriageCondition {
  [key: string]: string | string[]
}

export interface TriageRule {
  question_id: string // Which question triggers this rule (after it's answered)
  if: TriageCondition // Conditions to check
  type: LogicalOperator // AND = all conditions must match, OR = any condition can match
  then: {
    action: TriageAction
    skipQuestionId?: string // If action is 'skip_question', which question to skip
  }
}

export const triageRules: TriageRule[] = [
  // Keyed on annual_revenue, not funding_amount: funding_amount is now the
  // form's first question, so revenue is the later of the two and is what
  // completes the pair these rules need. Reordering the questions without
  // re-keying these would leave both rules permanently unmatched.
  // After annual_revenue: Route to Mike if revenue >= $10M
  {
    question_id: 'annual_revenue',
    if: {
      annual_revenue: ['$10MM-$20MM', '$20MM-$50MM', '$50MM-$100MM', '$100MM+']
    },
    type: 'AND',
    then: {
      action: 'mike'
    }
  },

  // After annual_revenue: Route to Mike if revenue >= $3M AND funding >= $1M
  {
    question_id: 'annual_revenue',
    if: {
      annual_revenue: ['$3MM-$10MM', '$10MM-$20MM', '$20MM-$50MM', '$50MM-$100MM', '$100MM+'],
      funding_amount: ['$1MM-$5MM', '$5MM-$10MM', '$10MM+']
    },
    type: 'AND',
    then: {
      action: 'mike'
    }
  },

  // After financing_needs: Route to Mike if revenue >= $3M AND funding >= $250K AND 2+ years in business AND priority industry
  {
    question_id: 'financing_needs',
    if: {
      annual_revenue: ['$3MM-$10MM', '$10MM-$20MM', '$20MM-$50MM', '$50MM-$100MM', '$100MM+'],
      funding_amount: ['$250K-$500K', '$500K-$1MM', '$1MM-$5MM', '$5MM-$10MM', '$10MM+'],
      time_in_business: ['2-3 years', '3-4 years', '5+ years'],
      business_industry: ['Manufacturing', 'Wholesale & Distribution', 'Healthcare Services', 'Government Contractors', 'Staffing Agency', 'Software & SaaS', 'E-Commerce & Retail']
    },
    type: 'AND',
    then: {
      action: 'mike'
    }
  },

  // After financing_needs: Route to Kyler if revenue < $1M OR funding < $250K OR time_in_business < 1yr
  {
    question_id: 'financing_needs',
    if: {
      annual_revenue: ['$500K-$1MM'],
      funding_amount: ['$100K-$250K'],
      time_in_business: ['< 1 year']
    },
    type: 'OR',
    then: {
      action: 'kyler_with_chat'
    }
  }
]

// Helper function to check if a value matches a condition
export function matchesCondition(
  actualValue: string | string[] | undefined,
  expectedValue: string | string[]
): boolean {
  if (actualValue === undefined) return false

  const actualValues = Array.isArray(actualValue) ? actualValue : [actualValue]
  const expectedValues = Array.isArray(expectedValue) ? expectedValue : [expectedValue]

  return actualValues.some(av => expectedValues.includes(av))
}

// Function to evaluate a rule against current form state
export function evaluateRule(
  rule: TriageRule,
  formData: Record<string, string | string[] | undefined>
): boolean {
  const conditions = Object.entries(rule.if)

  if (rule.type === 'AND') {
    // All conditions must match
    return conditions.every(([key, expectedValue]) => {
      return matchesCondition(formData[key], expectedValue)
    })
  } else {
    // OR: At least one condition must match
    return conditions.some(([key, expectedValue]) => {
      return matchesCondition(formData[key], expectedValue)
    })
  }
}

// Function to find applicable rules after a question is answered
export function checkTriageRules(
  questionId: string,
  formData: Record<string, string | string[] | undefined>
): TriageRule | null {
  // Find rules that apply to this question
  const applicableRules = triageRules.filter(rule => rule.question_id === questionId)

  // Return first matching rule
  for (const rule of applicableRules) {
    if (evaluateRule(rule, formData)) {
      return rule
    }
  }

  return null
}

// Default behavior: if no triage rules matched, continue through form and then go to mike_with_chat
export const DEFAULT_ACTION: TriageAction = 'mike_with_chat'
