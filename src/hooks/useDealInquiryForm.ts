'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useFormSubmit, FormSubmitData } from './useFormSubmit'
import { formQuestions } from '@/data/form-questions'
import { trackEvent, trackFormSubmission, trackHubSpotNativeForm } from '@/lib/tracking'
import { checkTriageRules, triageRules, type TriageAction } from '@/lib/triage-rules'
import type { ContactVerdict } from '@/lib/verify-contact'


// Calendly URLs - split by person and owner vs partner role
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

// Quick schedule link always goes to Kyler's owner calendar
export const QUICK_SCHEDULE_URL = CALENDLY_URLS.kyler.owner

/**
 * Only the explicit partner answer means partner; everything else, including an
 * unanswered question, means owner.
 *
 * This read `=== OWNER ? 'owner' : 'partner'`, which sends every value it does
 * not recognise to Michael's PARTNER calendar. On this form `user_role` is
 * question 2 and unskippable, so the value is always one of the two and the
 * default never showed. It is still the wrong default to leave in a shared
 * helper — any caller that treats the question as optional silently books
 * business owners onto the partner calendar, which is exactly what happened
 * while the one-page form existed. Sarah, 2026-09-08: "We have rarely or never
 * had a partner come through the website."
 */
function getRoleType(userRole: string): 'owner' | 'partner' {
  return userRole === 'A Banker / Business Advisor' ? 'partner' : 'owner'
}

function getCalendlyUrlForAction(action: string, userRole: string): string {
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

/**
 * `documents` is the third door, offered only when the portal actually minted
 * an upload link for this lead. It records on `chosen_path` like the other two,
 * so it lands on `lead_source_detail` as "Discover form → documents" and the
 * three paths stay comparable.
 */
export type ChosenPath = 'schedule' | 'ai_chat' | 'documents' | null

export interface AnsweredQuestion {
  questionIndex: number
  questionId: string
  displayTitle: string
  answer: string | string[]
  options: string[]
}

export function useDealInquiryForm(
  onSubmitSuccess?: (formData: FormSubmitData) => void,
  initialRole?: string
) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialRole ? 1 : 0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set())
  const [triageAction, setTriageAction] = useState<TriageAction | null>(null)
  const [questionHistory, setQuestionHistory] = useState<number[]>(initialRole ? [0] : [])
  const [showChoicePoint, setShowChoicePoint] = useState(false)
  const [chosenPath, setChosenPath] = useState<ChosenPath>(null)
  /**
   * The portal's document-upload link for this lead, when it minted one.
   *
   * Arrives on the `early` event — the one fired at the contact step — because
   * that event already creates the deal ("makes a deal out of the person
   * alone"), so there is something to attach a link to well before the visitor
   * reaches the choice point. Null is the common case and means no button:
   * the portal declines to mint unless its verifier confirmed the address
   * accepts mail, which is what stops the public form provisioning accounts
   * for junk submissions.
   */
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])

  // Form field states
  const [userRole, setUserRole] = useState(initialRole || '')
  const [businessIndustry, setBusinessIndustry] = useState('')
  const [timeInBusiness, setTimeInBusiness] = useState('')
  const [annualRevenue, setAnnualRevenue] = useState('')
  const [financingNeeds, setFinancingNeeds] = useState<string[]>([])
  const [fundingAmount, setFundingAmount] = useState('')
  const [ownerCreditScore, setOwnerCreditScore] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [smsConsent, setSmsConsent] = useState(false)

  // Email/phone verification on the contact-info step
  const [isVerifying, setIsVerifying] = useState(false)
  const [verification, setVerification] = useState<ContactVerdict | null>(null)

  // Dynamic "other" field responses (for single_with_other questions)
  const [otherResponses, setOtherResponses] = useState<Record<string, string>>({})

  // The form page loaded. This is a view, not intent: it fires whether or not
  // the visitor ever touches a question, which is why it used to read as ~128
  // "starts" against 22 submissions. `deal_inquiry_form_started` below is the
  // engagement signal, fired on the first answer. Keeping both is what makes
  // the view -> start -> submit funnel readable.
  useEffect(() => {
    trackEvent('deal_inquiry_form_viewed')
  }, [])

  // Guards `deal_inquiry_form_started` so it fires once per form, not per answer.
  const hasStartedRef = useRef(false)

  // Get visible questions (excluding skipped ones)
  const visibleQuestions = useMemo(() => {
    return formQuestions.filter(q => !skippedQuestions.has(q.id))
  }, [skippedQuestions])

  const currentQuestion = visibleQuestions[currentQuestionIndex]
  const totalVisibleQuestions = visibleQuestions.length
  const isLastQuestion = currentQuestionIndex === totalVisibleQuestions - 1

  // Check if current question is the contact_info question
  const isContactInfoStep = currentQuestion?.type === 'contact-info'

  // The triage questions are everything between user_role and contact_info
  const isTriageQuestion = currentQuestion?.type !== 'contact-info' && currentQuestion?.id !== 'user_role'

  const getFieldValue = (fieldId: string) => {
    if (fieldId.endsWith('_other')) {
      return otherResponses[fieldId] || ''
    }

    switch (fieldId) {
      case 'user_role': return userRole
      case 'business_industry': return businessIndustry
      case 'time_in_business': return timeInBusiness
      case 'annual_revenue': return annualRevenue
      case 'financing_needs': return financingNeeds
      case 'funding_amount': return fundingAmount
      case 'owner_credit_score': return ownerCreditScore
      case 'name': return name
      case 'email': return email
      case 'phone': return phone
      case 'company': return company
      case 'sms_consent': return smsConsent ? 'yes' : ''
      default: return ''
    }
  }

  const setFieldValue = (fieldId: string, value: any) => {
    if (fieldId.endsWith('_other')) {
      setOtherResponses(prev => ({
        ...prev,
        [fieldId]: value
      }))
      return
    }

    switch (fieldId) {
      case 'user_role': setUserRole(value); break
      case 'business_industry': setBusinessIndustry(value); break
      case 'time_in_business': setTimeInBusiness(value); break
      case 'annual_revenue': setAnnualRevenue(value); break
      case 'financing_needs': setFinancingNeeds(value); break
      case 'funding_amount': setFundingAmount(value); break
      case 'owner_credit_score': setOwnerCreditScore(value); break
      case 'name': setName(value); break
      case 'email': setEmail(value); break
      case 'phone': setPhone(value); break
      case 'company': setCompany(value); break
      case 'sms_consent': setSmsConsent(Boolean(value)); break
    }
  }

  // Build current form state for triage evaluation
  const getCurrentFormState = () => ({
    user_role: userRole,
    business_industry: businessIndustry,
    time_in_business: timeInBusiness,
    annual_revenue: annualRevenue,
    financing_needs: financingNeeds,
    funding_amount: fundingAmount,
    owner_credit_score: ownerCreditScore,
    sms_consent: smsConsent ? 'yes' : 'no',
  })

  // Helper to send data to webhooks
  const sendToWebhooks = async (data: Record<string, any>, formType: string) => {
    const payload = { ...data, formType, submittedAt: new Date().toISOString() }

    try {
      await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'inquiry', ...payload }),
      })
    } catch (error) {
      console.error('Webhook submission error:', error)
    }
  }

  // Parallel stream: mirror the lead to the Serve portal inbound log.
  // Fire-and-forget, dark until PORTAL_LEAD_ENABLED=true on the server, and
  // fully swallowed here — a failure never reaches the visitor. keepalive lets
  // the request survive the navigation to Calendly on the final event.
  const sendToPortal = (eventType: 'early' | 'final', extra?: Record<string, any>) => {
    const payload = {
      source: 'website_discover',
      event_type: eventType,
      ...getCurrentFormState(),
      name,
      email,
      phone,
      company,
      ...extra,
      submittedAt: new Date().toISOString(),
    }
    try {
      // The response carries the upload link on the `early` event. Still
      // fire-and-forget: nothing awaits this, a rejection is swallowed, and a
      // failure means one fewer button rather than anything the visitor sees.
      fetch('/api/portal-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })
        .then(async (res) => {
          if (!res.ok) return
          const body = await res.json().catch(() => null)
          if (typeof body?.handoffUrl === 'string' && body.handoffUrl) {
            setHandoffUrl(body.handoffUrl)
          }
        })
        .catch(() => {})
    } catch {
      // never surface to the visitor
    }
  }

  // Send current form state to webhook after each question (for Google Sheets upsert)
  const sendAnswerWebhook = (questionId: string, answerValue: any) => {
    const formState = {
      ...getCurrentFormState(),
      [questionId]: answerValue,
      name,
      email,
      phone,
      company,
    }
    sendToWebhooks(formState, 'deal_inquiry_answer')
  }

  const handleAnswer = (value: any) => {
    if (!currentQuestion) return

    setFieldValue(currentQuestion.id, value)
    setSelectedAnswer(value)

    // Send webhook with updated form state
    sendAnswerWebhook(currentQuestion.id, value)

    // First answered question is the real start of the form.
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackEvent('deal_inquiry_form_started', {
        first_question_id: currentQuestion.id,
      })
    }

    // Track question answered
    trackEvent('deal_inquiry_question_answered', {
      question_id: currentQuestion.id,
      answer: value,
    })

    // Resolve display title
    const isPartner = userRole === 'A Banker / Business Advisor'
    const displayTitle = (isPartner && currentQuestion.partnerTitle)
      ? currentQuestion.partnerTitle
      : currentQuestion.title

    // Auto-advance for single-choice questions (not multi-select)
    if (currentQuestion?.type !== 'multi') {
      setTimeout(() => {
        // Add to answered questions thread
        setAnsweredQuestions(prev => [...prev, {
          questionIndex: currentQuestionIndex,
          questionId: currentQuestion.id,
          displayTitle,
          answer: value,
          options: currentQuestion.answers || [],
        }])
        checkAndAdvance(currentQuestion.id, value)
        setSelectedAnswer(null)
      }, 600)
    }
  }

  // For multi-select, advance is manual via moveToNextQuestion
  const moveToNextQuestionManual = () => {
    if (!currentQuestion) return

    const isPartner = userRole === 'A Banker / Business Advisor'
    const displayTitle = (isPartner && currentQuestion.partnerTitle)
      ? currentQuestion.partnerTitle
      : currentQuestion.title

    const value = getFieldValue(currentQuestion.id)

    setAnsweredQuestions(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      questionId: currentQuestion.id,
      displayTitle,
      answer: value as string | string[],
      options: currentQuestion.answers || [],
    }])

    sendAnswerWebhook(currentQuestion.id, value)

    checkAndAdvance(currentQuestion.id, value)
  }

  const checkAndAdvance = (justAnsweredQuestionId?: string, justAnsweredValue?: any) => {
    const baseFormState = getCurrentFormState()
    const formState = justAnsweredQuestionId
      ? { ...baseFormState, [justAnsweredQuestionId]: justAnsweredValue }
      : baseFormState

    const currentQuestionId = justAnsweredQuestionId || currentQuestion?.id

    // Recalculate skip rules
    const newSkippedQuestions = new Set<string>()
    triageRules.forEach(rule => {
      if (rule.then.action === 'skip_question' && rule.then.skipQuestionId) {
        if (checkTriageRules(rule.question_id, formState)?.then.skipQuestionId === rule.then.skipQuestionId) {
          newSkippedQuestions.add(rule.then.skipQuestionId)
        }
      }
    })
    setSkippedQuestions(newSkippedQuestions)

    // Check triage rules for this question
    const applicableRule = checkTriageRules(currentQuestionId || '', formState)

    if (applicableRule?.then.action === 'mike') {
      setTriageAction(applicableRule.then.action)
      setShowChoicePoint(true)
      return
    }

    if (applicableRule?.then.action === 'kyler_with_chat') {
      setTriageAction(applicableRule.then.action)
    }

    // If no more questions, show choice point
    const nextIndex = currentQuestionIndex + 1
    const updatedVisible = formQuestions.filter(q => !newSkippedQuestions.has(q.id))

    if (nextIndex >= updatedVisible.length) {
      setShowChoicePoint(true)
      return
    }

    moveToNextQuestion()
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < totalVisibleQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1
      setQuestionHistory(prev => [...prev, currentQuestionIndex])
      setCurrentQuestionIndex(nextIndex)

      trackEvent('deal_inquiry_question_advanced', {
        from_question: currentQuestionIndex + 1,
        to_question: nextIndex + 1,
      })
    }
  }

  const moveToPreviousQuestion = () => {
    if (questionHistory.length > 0) {
      const previousIndex = questionHistory[questionHistory.length - 1]
      setQuestionHistory(prev => prev.slice(0, -1))
      setCurrentQuestionIndex(previousIndex)
    }
  }

  // Go back to a specific answered question (resets everything after it)
  const handleGoBack = (answeredIndex: number) => {
    const targetAnswered = answeredQuestions[answeredIndex]
    if (!targetAnswered) return

    // Clear answers after this point
    const removedAnswers = answeredQuestions.slice(answeredIndex)
    removedAnswers.forEach(aq => {
      if (aq.questionId === 'financing_needs') {
        setFieldValue(aq.questionId, [])
      } else {
        setFieldValue(aq.questionId, '')
      }
    })

    // Reset state
    setAnsweredQuestions(prev => prev.slice(0, answeredIndex))
    setCurrentQuestionIndex(targetAnswered.questionIndex)
    setQuestionHistory(prev => prev.slice(0, answeredIndex))
    setShowChoicePoint(false)
    setChosenPath(null)
    setTriageAction(null)
    setSelectedAnswer(null)
  }

  // Handle path choice (Schedule or AI Chat)
  const handlePathChoice = (path: ChosenPath) => {
    setChosenPath(path)
    setShowChoicePoint(false)

    // Add the choice as an answered question in the thread
    const choiceLabel =
      path === 'schedule'
        ? 'Schedule a Call'
        : path === 'documents'
          ? 'Upload documents'
          : 'Explore with our Funding Navigator'
    setAnsweredQuestions(prev => [...prev, {
      questionIndex: -1,
      questionId: 'path_choice',
      displayTitle: 'Thanks for sharing! Would you like to speak with our team or explore options with our Funding Navigator?',
      answer: choiceLabel,
      options: ['Schedule a Call', 'Explore with our Funding Navigator'],
    }])

    // Fire final submission (contact info already collected at Q2)
    void submitFinalForm(path)
  }

  const submitFinalForm = async (path: ChosenPath) => {
    const triagedCalendlyUrl = getTriagedCalendlyUrl()

    trackEvent('deal_inquiry_form_submitted', {
      triage_action: triageAction || 'default',
      calendly_url: triagedCalendlyUrl,
      user_role: userRole,
      chosen_path: path || '',
    })

    const contactData = {
      ...getCurrentFormState(),
      name,
      email,
      phone,
      company,
      chosen_path: path,
    }
    sendToWebhooks(contactData, 'deal_inquiry')
    // Verification rides along here too, so a link can still be minted if the
    // early event was lost. `verification` is state by now; the early call uses
    // the fresh verdict because state has not settled at that point.
    sendToPortal('final', {
      chosen_path: path,
      triage_action: triageAction || '',
      verification,
    })

    // Only send the "scheduling a call" email when they actually pick scheduling
    if (path === 'schedule') {
      notifyScheduleTransition('schedule_directly')
    }
  }

  const notifyScheduleTransition = (source: 'schedule_directly' | 'ai_chat', chatTranscript?: string) => {
    const contactData = {
      ...getCurrentFormState(),
      name,
      email,
      phone,
      company,
    }
    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactData,
          verification,
          type: 'calendly',
          transition_source: source,
          chat_transcript: chatTranscript || '',
        }),
      })
    } catch (error) {
      console.error('Notify email error:', error)
    }
  }

  // Continue from contact-info step (Q2) to next triage question without final submission
  const handleContactInfoContinue = async () => {
    if (!name || !email || isVerifying) return

    // Check whether the email is deliverable and the phone is a real, reachable
    // line. Nothing blocks the lead: the verdict rides along on the notification
    // email as flags, and an undeliverable address is tracked so we can measure
    // how often NeverBounce is wrong before ever considering a hard stop.
    setIsVerifying(true)
    let verdict: ContactVerdict | null = null
    try {
      const res = await fetch('/api/verify-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })
      verdict = await res.json()
    } catch (error) {
      console.error('Contact verification error:', error)
    }
    setIsVerifying(false)
    setVerification(verdict)

    if (verdict?.email.result === 'invalid') {
      trackEvent('deal_inquiry_email_undeliverable', {
        has_suggestion: Boolean(verdict.email.suggestion),
      })
    }

    const isPartner = userRole === 'A Banker / Business Advisor'
    const displayTitle = (isPartner && currentQuestion?.partnerTitle)
      ? currentQuestion.partnerTitle
      : currentQuestion?.title || ''

    setAnsweredQuestions(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      questionId: 'contact_info',
      displayTitle,
      answer: `${name} · ${email}`,
      options: [],
    }])

    sendAnswerWebhook('contact_info', { name, email, phone, company, verification: verdict })

    // Fire instant notify email so we hear about the lead even if they abandon mid-triage
    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getCurrentFormState(),
          name,
          email,
          phone,
          company,
          verification: verdict,
          type: 'early',
        }),
      })
    } catch (error) {
      console.error('Notify email error:', error)
    }

    // The verdict has to travel with this event, not just with /api/notify:
    // the portal mints the document-upload link only for an address its
    // verifier confirmed, and reads that verdict off THIS payload. Without it
    // `mintLeadHandoff` skips every lead as `email_not_verified` and the
    // handoff is silently inert — which is exactly how it behaved until this
    // line changed.
    sendToPortal('early', { verification: verdict })

    trackEvent('deal_inquiry_question_answered', {
      question_id: 'contact_info',
      answer: 'submitted',
    })

    checkAndAdvance('contact_info', { name, email, phone, company })
  }

  const getTriagedCalendlyUrl = (): string => {
    if (triageAction) {
      return getCalendlyUrlForAction(triageAction, userRole)
    }
    return getCalendlyUrlForAction('mike_with_chat', userRole)
  }

  const getCalendlyCustomAnswers = (): Record<string, string> => {
    const roleType = getRoleType(userRole)

    if (roleType === 'owner') {
      const businessDesc = [
        company,
        businessIndustry ? `${businessIndustry} business` : '',
        timeInBusiness ? `${timeInBusiness} in operation` : '',
        annualRevenue ? `${annualRevenue} annual revenue` : '',
      ].filter(Boolean).join(', ')

      // Map annual revenue to Calendly's monthly revenue dropdown options
      const monthlyRevenueMap: Record<string, string> = {
        '$500K-$1MM': '$50K-100K',
        '$1MM-$3MM': '$100K-$500K',
        '$3MM-$10MM': '$100K-$500K',
        '$10MM-$20MM': '$500K+',
        '$20MM-$50MM': '$500K+',
        '$50MM-$100MM': '$500K+',
        '$100MM+': '$500K+',
      }
      const monthlyRevenue = annualRevenue ? monthlyRevenueMap[annualRevenue] || '' : ''

      const fundingGoal = [
        fundingAmount,
        financingNeeds.length > 0 ? `for ${financingNeeds.join(', ')}` : '',
      ].filter(Boolean).join(' ')

      return {
        ...(businessDesc && { a1: businessDesc }),
        ...(monthlyRevenue && { a2: monthlyRevenue }),
        ...(fundingGoal && { a3: fundingGoal }),
      }
    } else {
      const roleDesc = userRole
      return {
        ...(roleDesc && { a1: roleDesc }),
      }
    }
  }

  // Build current partial form data
  const getCurrentFormData = (): FormSubmitData => {
    const calendlyUrl = getTriagedCalendlyUrl()
    return {
      name,
      email,
      phone,
      company,
      sms_consent: smsConsent ? 'yes' : 'no',
      user_role: userRole,
      business_industry: businessIndustry,
      time_in_business: timeInBusiness,
      annual_revenue: annualRevenue,
      financing_needs: financingNeeds,
      funding_amount: fundingAmount,
      owner_credit_score: ownerCreditScore,
      calendly_url: calendlyUrl,
      triage_action: triageAction || 'mike_with_chat',
    }
  }

  const { success, handleSubmit: baseHandleSubmit, formData } = useFormSubmit(
    'deal_inquiry',
    'inquiry',
    '',
    (data) => {
      if (onSubmitSuccess) {
        onSubmitSuccess(data)
      }
    }
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (e.nativeEvent) {
      (e.nativeEvent as Event).stopImmediatePropagation?.()
    }

    const triagedCalendlyUrl = getTriagedCalendlyUrl()

    trackEvent('deal_inquiry_form_submitted', {
      triage_action: triageAction || 'default',
      calendly_url: triagedCalendlyUrl,
      user_role: userRole,
      chosen_path: chosenPath || '',
    })

    // Track in HubSpot
    const form = e.currentTarget
    trackHubSpotNativeForm('deal_inquiry', form)

    // Send contact info to webhooks
    const contactData = {
      ...getCurrentFormState(),
      name,
      email,
      phone,
      company,
      chosen_path: chosenPath,
    }
    sendToWebhooks(contactData, 'deal_inquiry')

    // Send email notification
    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactData, type: 'discover' }),
      })
    } catch (error) {
      console.error('Notify email error:', error)
    }

    // Add calendly URL and triage action as hidden inputs
    const calendlyInput = document.createElement('input')
    calendlyInput.type = 'hidden'
    calendlyInput.name = 'calendly_url'
    calendlyInput.value = triagedCalendlyUrl
    form.appendChild(calendlyInput)

    const triageActionInput = document.createElement('input')
    triageActionInput.type = 'hidden'
    triageActionInput.name = 'triage_action'
    triageActionInput.value = triageAction || ''
    form.appendChild(triageActionInput)

    await baseHandleSubmit(e)
    form.removeChild(calendlyInput)
    form.removeChild(triageActionInput)
  }

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: totalVisibleQuestions,
    selectedAnswer,
    userRole,
    businessIndustry,
    timeInBusiness,
    annualRevenue,
    financingNeeds,
    fundingAmount,
    ownerCreditScore,
    name,
    email,
    phone,
    company,
    smsConsent,
    success,
    formData,
    triageAction,
    otherResponses,
    isLastQuestion,
    isContactInfoStep,
    isTriageQuestion,
    isVerifying,
    showChoicePoint,
    chosenPath,
    answeredQuestions,
    getFieldValue,
    setFieldValue,
    handleAnswer,
    moveToNextQuestion: moveToNextQuestionManual,
    moveToPreviousQuestion,
    handleGoBack,
    handlePathChoice,
    handoffUrl,
    handleSubmit,
    handleContactInfoContinue,
    notifyScheduleTransition,
    getCalendlyCustomAnswers,
    getCurrentFormData,
  }
}
