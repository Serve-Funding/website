/**
 * Contact verification for form intake — is this email deliverable and is this
 * phone a real, reachable line?
 *
 * Fails OPEN: any missing key, API error, or timeout yields "unchecked" rather
 * than rejecting a lead. The only verdict that blocks a submission is an email
 * NeverBounce confirms is undeliverable.
 */

const NEVERBOUNCE_KEY = process.env.NEVERBOUNCE_API_KEY
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN

// ponytail: line_type_intelligence catches burner/VoIP lines and, via a missing
// carrier record, numbers no carrier has ever claimed. It will NOT catch a
// number that a carrier still owns but has since disconnected. Append
// ',line_status' here for that — billed as a second lookup, mobile-only.
const TWILIO_FIELDS = 'line_type_intelligence'

const TIMEOUT_MS = 5000

export type EmailResult = 'valid' | 'invalid' | 'disposable' | 'catchall' | 'unknown' | 'unchecked'

export interface ContactVerdict {
  email: { result: EmailResult; suggestion?: string }
  phone: { valid: boolean | null; type?: string; carrier?: string; country?: string; errorCode?: number }
  /** Human-readable warnings, rendered into the lead notification email. */
  flags: string[]
  /** Set only when the submission should be sent back for correction. */
  hardFail: 'email' | null
}

async function fetchJson(url: string, init?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function verifyEmail(email: string): Promise<ContactVerdict['email']> {
  if (!NEVERBOUNCE_KEY) return { result: 'unchecked' }

  const url = `https://api.neverbounce.com/v4.2/single/check?key=${encodeURIComponent(
    NEVERBOUNCE_KEY
  )}&email=${encodeURIComponent(email)}&timeout=4`

  const data = await fetchJson(url)
  if (!data || data.status !== 'success') return { result: 'unchecked' }

  return {
    result: (data.result as EmailResult) || 'unchecked',
    ...(data.suggested_correction ? { suggestion: data.suggested_correction } : {}),
  }
}

async function verifyPhone(phone: string): Promise<ContactVerdict['phone']> {
  if (!TWILIO_SID || !TWILIO_TOKEN) return { valid: null }

  // CountryCode lets Twilio normalize a nationally-formatted number like
  // "(704) 555-1234"; an E.164 number with a leading + is honored as given.
  const url =
    `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phone.trim())}` +
    `?Fields=${TWILIO_FIELDS}&CountryCode=US`

  const data = await fetchJson(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64')}`,
    },
  })
  if (!data) return { valid: null }

  return {
    valid: data.valid === true,
    type: data.line_type_intelligence?.type,
    carrier: data.line_type_intelligence?.carrier_name,
    country: data.country_code,
    errorCode: data.line_type_intelligence?.error_code ?? undefined,
  }
}

const EMAIL_FLAGS: Partial<Record<EmailResult, string>> = {
  invalid: 'Email is undeliverable — this mailbox does not exist',
  disposable: 'Disposable / throwaway email domain',
  catchall: 'Domain accepts all mail — the mailbox itself could not be confirmed',
  unknown: 'Email server did not respond — deliverability unconfirmed',
}

// Lines a real business owner is unlikely to be reachable on.
const SUSPECT_LINE_TYPES: Record<string, string> = {
  nonFixedVoip: 'Non-fixed VoIP line (Google Voice / TextNow / burner-style)',
  voicemail: 'Voicemail-only line',
  pager: 'Pager line',
  premium: 'Premium-rate line',
  sharedCost: 'Shared-cost line',
}

export async function verifyContact({
  email,
  phone,
}: {
  email?: string
  phone?: string
}): Promise<ContactVerdict> {
  const [emailVerdict, phoneVerdict] = await Promise.all([
    email ? verifyEmail(email) : Promise.resolve<ContactVerdict['email']>({ result: 'unchecked' }),
    phone?.trim() ? verifyPhone(phone) : Promise.resolve<ContactVerdict['phone']>({ valid: null }),
  ])

  const flags: string[] = []

  const emailFlag = EMAIL_FLAGS[emailVerdict.result]
  if (emailFlag) {
    flags.push(
      emailVerdict.suggestion ? `${emailFlag} — did they mean ${emailVerdict.suggestion}?` : emailFlag
    )
  }

  if (phoneVerdict.valid === false) {
    flags.push('Phone is not a valid number')
  } else if (phoneVerdict.valid === true) {
    const suspect = phoneVerdict.type ? SUSPECT_LINE_TYPES[phoneVerdict.type] : undefined
    if (suspect) flags.push(`Phone: ${suspect}`)

    // Twilio's `valid` only means the number is well-formed for its country, not
    // that anyone can answer it. A US number that no carrier claims is either
    // unassigned or disconnected — which is what a fake contact number looks
    // like. Scoped to US because line type coverage is spotty abroad, and a
    // foreign number already gets its own flag below.
    if (phoneVerdict.country === 'US' && !phoneVerdict.carrier && !phoneVerdict.type) {
      flags.push('Phone has no carrier record — the number is unassigned or disconnected')
    }

    if (phoneVerdict.country && phoneVerdict.country !== 'US') {
      flags.push(`Phone is registered in ${phoneVerdict.country}, not the US`)
    }
  }

  if (emailVerdict.result === 'unchecked' && !NEVERBOUNCE_KEY) {
    flags.push('Email verification not configured (NEVERBOUNCE_API_KEY missing)')
  }
  if (phone?.trim() && phoneVerdict.valid === null && !TWILIO_SID) {
    flags.push('Phone verification not configured (TWILIO_ACCOUNT_SID missing)')
  }
  if (!phone?.trim()) {
    flags.push('No phone number given')
  }

  return {
    email: emailVerdict,
    phone: phoneVerdict,
    flags,
    hardFail: emailVerdict.result === 'invalid' ? 'email' : null,
  }
}
