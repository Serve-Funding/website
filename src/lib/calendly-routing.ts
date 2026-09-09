/**
 * Which calendar a triaged lead is sent to.
 *
 * Extracted from `useDealInquiryForm` when the one-page form arrived: two forms
 * routing to two copies of these URLs is how one of them ends up still pointing
 * at a retired calendar. The hook re-exports `CALENDLY_URLS` so existing
 * importers are unaffected.
 */

// Split by person and by owner-vs-partner role.
export const CALENDLY_URLS = {
  michael: {
    owner: 'https://calendly.com/michael_kodinsky/30-minute-funding-call',
    partner: 'https://calendly.com/michael_kodinsky/partner-strategy-call',
  },
  kyler: {
    // TODO: Kyler to create matching Calendly links with same intake questions
    owner: 'https://calendly.com/d/cxqk-t6s-72q/30-minute-funding-strategy-call',
    partner: 'https://calendly.com/d/cxqk-t6s-72q/30-minute-funding-strategy-call',
  },
}

/** Quick schedule link always goes to Kyler's owner calendar. */
export const QUICK_SCHEDULE_URL = CALENDLY_URLS.kyler.owner

export const OWNER_ROLE = 'A Business Owner or Operator Seeking Funding'
export const PARTNER_ROLE = 'A Banker / Business Advisor'

/**
 * Only the explicit partner answer means partner; everything else, including
 * an unanswered question, means owner.
 *
 * This used to read `=== OWNER_ROLE ? 'owner' : 'partner'`, which is the same
 * thing on the conversational form — `user_role` is question 3 there and you
 * cannot advance past it, so the value is always one of the two. On the
 * one-page form the question is OPTIONAL, and that default quietly sent every
 * visitor who skipped it to Michael's PARTNER calendar. Sarah, 2026-09-08: "We
 * have rarely or never had a partner come through the website." So the unknown
 * case belongs on the owner side.
 */
export function getRoleType(userRole: string): 'owner' | 'partner' {
  return userRole === PARTNER_ROLE ? 'partner' : 'owner'
}

export function getCalendlyUrlForAction(action: string, userRole: string): string {
  const roleType = getRoleType(userRole)

  if (action === 'mike' || action === 'mike_with_chat') {
    return CALENDLY_URLS.michael[roleType]
  }

  if (action === 'kyler_with_chat') {
    return CALENDLY_URLS.kyler[roleType]
  }

  // Default: Michael
  return CALENDLY_URLS.michael[roleType]
}
