'use client'

/**
 * The one-page intake — every question visible at once.
 *
 * Sarah's brief, 2026-09-08: "I think the user might answer them all if they
 * could SEE them all instead of one at a time. The One at a Time approach
 * leaves the user wondering when it will end."
 *
 * WHAT THIS IS AND IS NOT MEASURED AGAINST. The honest version of that brief,
 * from #81's funnel: over the 90 days to 2026-09-08, 128 people loaded
 * /discover, 34 answered the first question, 26 handed over contact details and
 * 22 submitted. The whole loss is screen one — once someone starts, they
 * finish. So this page is NOT a completion-rate fix; length was never the
 * measured problem. What it buys is that the visitor can see the scope before
 * investing, which is a bet on the 34/128 who START, not on the 22/26 who
 * finish. Judge it there.
 *
 * It reads the SAME `formQuestions` and the SAME `triageRules` as
 * ConversationalForm, deliberately — the two have to route a given lead to the
 * same calendar, and a second copy of either is how that stops being true.
 *
 * THE ONE REAL DIFFERENCE IS WHEN TRIAGE RUNS. In the question-at-a-time form a
 * `mike` rule fires the moment revenue is answered, stops the form, and skips
 * every question behind it. Here everything arrives together, so routing is
 * decided once at submit by `triageCompleteAnswers`. Two things follow:
 *   - Question ORDER stops being load-bearing (see the header in
 *     src/data/form-questions.ts, still authoritative for the other form).
 *   - No question is sacrificed any more. High-revenue leads currently drop out
 *     at `annual_revenue` and never reach `financing_needs`; here they answer
 *     both.
 */

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import {
  Section,
  Container,
  Heading,
  Text,
  Button,
  Card,
  FormInput,
  FormSelect,
  SelectButtons,
  MultiSelectButtons,
} from '@/components/ui'
import { formQuestions, type Question } from '@/data/form-questions'
import { US_STATES } from '@/data/us-states'
import { triageCompleteAnswers } from '@/lib/triage-rules'
import { getCalendlyUrlForAction, PARTNER_ROLE } from '@/lib/calendly-routing'
import { trackEvent } from '@/lib/tracking'
import type { ContactVerdict } from '@/lib/verify-contact'
import { COLORS } from '@/lib/colors'

/** Answers keyed by question id, plus the contact block and state. */
type Answers = Record<string, string | string[]>

/**
 * What the portal will tell us we may say. `eligible: false` is the normal
 * case, not an error — see the gate in Serve-Platform's `program-fit`.
 */
interface ProgramFit {
  eligible: boolean
  blocked: string | null
  programs: string[]
  band: string | null
  /** One-time portal handoff for "Upload documents". Absent until the
   *  magic-link mint lands on the portal side. */
  documentsUrl?: string | null
}

/** "A, B and C" — the programs read as a sentence, not a comma list. */
function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** The questions rendered as choice blocks — contact-info is its own section. */
const CHOICE_QUESTIONS = formQuestions.filter((q) => q.type !== 'contact-info')

/** Everything the visitor must answer before the button enables. Contact
 *  details and the ask; the rest is genuinely optional, because a partial
 *  answer set still projects to a usable deal and still scores (points only
 *  add — an unanswered axis is not a zero). */
const REQUIRED_QUESTION_IDS = ['funding_amount']

export function OnePageForm() {
  const [answers, setAnswers] = useState<Answers>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [companyState, setCompanyState] = useState('')
  const [smsConsent, setSmsConsent] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactError, setContactError] = useState('')
  const [submitted, setSubmitted] = useState<{
    calendlyUrl: string
    fit: ProgramFit | null
    documentsUrl: string | null
  } | null>(null)

  /**
   * The reveal is held for a beat on purpose.
   *
   * The check is real — it round-trips to the portal's gate — but it returns in
   * ~200ms, and a verdict that appears instantly reads as a canned string
   * rather than as something we looked up. This is the minimum time the
   * "checking" state stays on screen, not a fake delay standing in for work
   * that isn't happening.
   */
  const REVEAL_MS = 1400

  const hasStartedRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const isPartner = answers.user_role === PARTNER_ROLE

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    // The first answer is the real start of the form. Firing on mount is what
    // made this metric count views instead of starts (#79).
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackEvent('one_page_form_started', { first_question_id: id })
    }
  }

  const missingRequired = useMemo(
    () =>
      REQUIRED_QUESTION_IDS.filter((id) => {
        const v = answers[id]
        return Array.isArray(v) ? v.length === 0 : !v
      }),
    [answers]
  )

  const canSubmit =
    !isSubmitting && !!name.trim() && !!email.trim() && missingRequired.length === 0

  /** The payload shape is a CONTRACT WITH THE PORTAL REPO — these keys are read
   *  by `readWebsiteLeadPayload` in Serve-Platform. Renaming one here silently
   *  drops it from the projection; it survives in `inbound_log.payload`. */
  const buildPayload = (verification: ContactVerdict | null) => ({
    name,
    email,
    phone,
    company,
    company_state: companyState,
    sms_consent: smsConsent ? 'yes' : 'no',
    user_role: (answers.user_role as string) || '',
    funding_amount: (answers.funding_amount as string) || '',
    financing_type: (answers.financing_type as string[]) || [],
    business_industry: (answers.business_industry as string) || '',
    time_in_business: (answers.time_in_business as string) || '',
    annual_revenue: (answers.annual_revenue as string) || '',
    financing_needs: (answers.financing_needs as string[]) || [],
    verification,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (e.nativeEvent) {
      ;(e.nativeEvent as Event).stopImmediatePropagation?.()
    }
    if (!canSubmit) return

    // A bot filling the hidden field submits nothing anywhere. Same guard the
    // other forms use; kept silent so a bot learns nothing from the response.
    const honeypot = (
      formRef.current?.querySelector('input[name="website_url"]') as HTMLInputElement | null
    )?.value?.trim()

    setContactError('')
    setIsSubmitting(true)
    const startedAt = Date.now()

    // #72's gate: an undeliverable address is the one thing that sends the
    // visitor back, because it means the magic link into the portal — and every
    // follow-up — silently never arrives. Everything else rides along as a flag
    // on the notification.
    let verification: ContactVerdict | null = null
    if (!honeypot) {
      try {
        const res = await fetch('/api/verify-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phone }),
        })
        verification = await res.json()
      } catch (error) {
        console.error('Contact verification error:', error)
      }

      if (verification?.hardFail === 'email') {
        setIsSubmitting(false)
        setContactError(
          verification.email.suggestion
            ? `We couldn't deliver to that address. Did you mean ${verification.email.suggestion}?`
            : "That email address doesn't appear to exist. Please double-check it so we can reach you."
        )
        trackEvent('one_page_form_contact_rejected', { reason: 'email_undeliverable' })
        return
      }
    }

    const payload = buildPayload(verification)
    const triageAction = triageCompleteAnswers(answers)
    const calendlyUrl = getCalendlyUrlForAction(triageAction, payload.user_role)
    const submittedAt = new Date().toISOString()

    if (honeypot) {
      // Logged for visibility, then treated as done — no notification, no deal.
      fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'inquiry',
          ...payload,
          formType: 'one_page_inquiry',
          is_spam: true,
          submittedAt,
        }),
      }).catch(() => {})
      setIsSubmitting(false)
      // A bot gets the plain confirmation and no fit call — the gate is not
      // free, and there is nothing to reassure here.
      setSubmitted({ calendlyUrl, fit: null, documentsUrl: null })
      return
    }

    // Three independent streams. None of them may cost us the lead, so each is
    // awaited-or-swallowed on its own rather than chained: the n8n sheet, the
    // instant notification email, and the portal's inbound log.
    await Promise.allSettled([
      fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'inquiry',
          ...payload,
          formType: 'one_page_inquiry',
          triage_action: triageAction,
          calendly_url: calendlyUrl,
          submittedAt,
        }),
      }),
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type: 'final' }),
      }),
      // `source` distinguishes this page from the conversational form in
      // `inbound_log`, so the two funnels stay separable. `event_type: final`
      // because a one-page form has no partial event to send — there is no
      // contact step to finish early.
      fetch('/api/portal-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'website_one_page',
          event_type: 'final',
          ...payload,
          submittedAt,
        }),
        keepalive: true,
      }),
    ])

    trackEvent('one_page_form_submitted', {
      triage_action: triageAction,
      user_role: payload.user_role,
      answered: Object.keys(answers).length,
    })

    // The lead is already captured above, so this is the only call whose
    // failure the visitor could notice — and it can't: the route answers 200
    // with `eligible: false` on every failure path, which renders the plain
    // confirmation. Deliberately AFTER the capture streams, never racing them.
    let fit: ProgramFit | null = null
    try {
      const res = await fetch('/api/program-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'website_one_page', event_type: 'final', ...payload }),
      })
      fit = await res.json()
    } catch (error) {
      console.error('Program fit error:', error)
    }

    if (fit) {
      trackEvent('one_page_form_fit', {
        eligible: String(fit.eligible),
        blocked: fit.blocked ?? '',
        programs: fit.programs.length,
      })
    }

    // Hold the reveal so the verdict reads as looked-up, not canned.
    const elapsed = Date.now() - startedAt
    if (elapsed < REVEAL_MS) await new Promise((r) => setTimeout(r, REVEAL_MS - elapsed))

    setIsSubmitting(false)
    setSubmitted({ calendlyUrl, fit, documentsUrl: fit?.documentsUrl ?? null })
  }

  if (submitted) {
    return (
      <Section>
        <Container>
          <Card className="max-w-2xl mx-auto text-center py-12">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex justify-center"
            >
              <CheckCircle className="w-12 h-12" style={{ color: COLORS.primary }} />
            </motion.div>
            <Heading size="h2" className="mb-3">
              Got it — thank you.
            </Heading>

            {/* Three outcomes. `eligible` is decided by the portal's gate,
                never here — the whole point is that this component cannot talk
                itself into reassurance the data doesn't support.

                NO COUNT, deliberately. The banded number was dropped after
                review: it read as a mail-merge, and because min/max funding is
                populated on only ~44% of products it barely moved with the size
                of the ask — so it was closer to "this facility has N lenders"
                than to anything about this business.

                What survives is the gate as a YES/NO, which is the part that was
                never over-engineering. `eligible` means a facility was named, the
                industry is one we can actually place, an ask is present, and
                enough lenders' published criteria fit to clear the floor. That is
                a real pre-check, and it is the only thing standing between this
                sentence and a cannabis dispensary reading it. The claim is sized
                to exactly what the gate establishes — lenders who work deals
                like this — and stops short of anything about terms or approval. */}
            {submitted.fit?.eligible ? (
              <>
                <Text size="lg" className="mb-2">
                  <strong>Good news — this looks like a strong fit.</strong>
                </Text>
                <Text size="lg" className="mb-6">
                  We already have lenders in mind who work deals like this
                  {submitted.fit.programs.length > 0 && (
                    <> on the {listOf(submitted.fit.programs)} side</>
                  )}
                  . To get soft terms from them, we need a few documents first.
                </Text>
                <Text size="sm" className="mb-8 text-gray-500">
                  Based on each lender&apos;s published criteria. Subject to underwriting — not an
                  offer or commitment to lend.
                </Text>
              </>
            ) : submitted.fit?.programs.length ? (
              <>
                {/* Blocked, but we still know which programs the answers point
                    at — so there is something true to say instead of a number.
                    This is the "Other" industry and the thin-count cases. */}
                <Text size="lg" className="mb-2">
                  Based on what you told us, we&apos;d start with{' '}
                  <strong>{listOf(submitted.fit.programs)}</strong>.
                </Text>
                <Text size="lg" className="mb-8">
                  There are a few things here an advisor should look at with you before we say
                  what&apos;s available.
                </Text>
              </>
            ) : (
              <Text size="lg" className="mb-8">
                An advisor is reviewing what you sent. Pick a time and we&apos;ll walk you through
                the options that fit.
              </Text>
            )}

            {/* Two doors when the gate cleared, one when it didn't.
                Documents lead ONLY on a cleared profile: sending someone to
                upload bank statements when an advisor still has to look at the
                deal wastes their afternoon and leaves us holding financials for
                something we may not place.

                `documentsUrl` is the portal handoff and is absent until that
                lands — see the spec. Until then a cleared visitor sees the call
                CTA alone, which is the current behaviour, not a broken button. */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {submitted.fit?.eligible && submitted.documentsUrl ? (
                <>
                  <a href={submitted.documentsUrl}>
                    <Button variant="default" size="lg">
                      Upload documents
                    </Button>
                  </a>
                  <a href={submitted.calendlyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Schedule a call first
                    </Button>
                  </a>
                </>
              ) : (
                <a href={submitted.calendlyUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="lg">
                    Schedule a Call
                  </Button>
                </a>
              )}
            </div>
          </Card>
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container>
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Bots fill hidden fields; people don't. Off-screen rather than
              display:none, which some bots skip. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="website_url">Website</label>
            <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-10">
            {CHOICE_QUESTIONS.map((question: Question) => {
              const title =
                isPartner && question.partnerTitle ? question.partnerTitle : question.title
              const isRequired = REQUIRED_QUESTION_IDS.includes(question.id)

              return (
                <div key={question.id}>
                  <Heading size="h4" className="mb-4">
                    {title}
                    {!isRequired && (
                      <span className="ml-2 text-sm font-normal text-gray-400">Optional</span>
                    )}
                  </Heading>

                  {question.type === 'multi' ? (
                    <MultiSelectButtons
                      options={question.answers}
                      value={(answers[question.id] as string[]) || []}
                      onChange={(value) => setAnswer(question.id, value)}
                      align="left"
                    />
                  ) : (
                    <SelectButtons
                      options={question.answers}
                      value={(answers[question.id] as string) || ''}
                      onChange={(value) => setAnswer(question.id, value)}
                      align="left"
                    />
                  )}
                </div>
              )
            })}

            {/* Contact block last: the visitor has seen the whole scope by the
                time they're asked for PII, which is the ordering #81 argued for
                on screen one and holds just as well here. */}
            <div>
              <Heading size="h4" className="mb-4">
                And how can we reach you?
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Your name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <FormInput
                  label="Work email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <FormInput
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
                <FormInput
                  label="Company"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="organization"
                />
                <FormSelect
                  label="State the business operates in"
                  name="company_state"
                  options={US_STATES}
                  placeholder="Select a state"
                  value={companyState}
                  onChange={(e) => setCompanyState(e.target.value)}
                />
              </div>

              <label className="mt-6 flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Text me about my funding options. Message frequency varies; reply STOP to opt
                  out.
                </span>
              </label>

              {contactError && (
                <Text className="mt-4 text-red-600" size="sm">
                  {contactError}
                </Text>
              )}
            </div>

            <div>
              <Button type="submit" variant="default" size="lg" disabled={!canSubmit}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking your profile against our lender network…
                  </span>
                ) : (
                  'See my options'
                )}
              </Button>
              <Text size="sm" className="mt-4 text-gray-500">
                No credit pull, and nothing is submitted to a lender until you say so.
              </Text>
            </div>
          </div>
        </form>
      </Container>
    </Section>
  )
}
