'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useFormSubmit, FormSubmitData } from './useFormSubmit'
import { formQuestions } from '@/data/form-questions'
import { trackEvent, trackFormSubmission, trackHubSpotNativeForm } from '@/lib/tracking'
import { checkTriageRules, triageRules, type TriageAction } from '@/lib/triage-rules'

const WEBHOOK_URL = 'https://aiascend.app.n8n.cloud/webhook/sf-inquiry'
const CLAY_WEBHOOK_URL = process.env.NEXT_PUBLIC_CLAY_WEBHOOK_URL || ''

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

function getRoleType(userRole: string): 'owner' | 'partner' {
  return userRole === 'A Business Owner or Operator Seeking Funding' ? 'owner' : 'partner'
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

export type ChosenPath = 'schedule' | 'ai_chat' | null

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

  // Dynamic "other" field responses (for single_with_other questions)
  const [otherResponses, setOtherResponses] = useState<Record<string, string>>({})

  // Track form initialization
  useEffect(() => {
    trackEvent('deal_inquiry_form_started')
  }, [])

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
  })

  // Helper to send data to webhooks
  const sendToWebhooks = async (data: Record<string, any>, formType: string) => {
    const payload = { ...data, formType, submittedAt: new Date().toISOString() }
    const urls = [WEBHOOK_URL, ...(CLAY_WEBHOOK_URL ? [CLAY_WEBHOOK_URL] : [])]

    try {
      await Promise.allSettled(
        urls.map(url =>
          fetch('/api/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ webhookUrl: url, ...payload }),
          })
        )
      )
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
      fetch('/api/portal-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
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
    const choiceLabel = path === 'schedule' ? 'Schedule a Call' : 'Explore with our Funding Navigator'
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
    sendToPortal('final', { chosen_path: path, triage_action: triageAction || '' })

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
  const handleContactInfoContinue = () => {
    if (!name || !email) return

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

    sendAnswerWebhook('contact_info', { name, email, phone, company })

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
          type: 'early',
        }),
      })
    } catch (error) {
      console.error('Notify email error:', error)
    }

    sendToPortal('early')

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
    'https://aiascend.app.n8n.cloud/webhook/sf-inquiry',
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
    success,
    formData,
    triageAction,
    otherResponses,
    isLastQuestion,
    isContactInfoStep,
    isTriageQuestion,
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
    handleSubmit,
    handleContactInfoContinue,
    notifyScheduleTransition,
    getCalendlyCustomAnswers,
    getCurrentFormData,
  }
}
