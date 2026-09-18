'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MessageCircle, ChevronRight, Send, Check, CheckCircle2, ArrowRight } from 'lucide-react'
import { useDealInquiryForm, type ChosenPath } from '@/hooks/useDealInquiryForm'
import { formQuestions } from '@/data/form-questions'
import { FormSubmitData } from '@/hooks/useFormSubmit'
import { COLORS } from '@/lib/colors'
import { Button, Text } from '@/components/ui'
import { CalendlyWidget } from '@/components/CalendlyWidget'
import { CALENDLY_URLS } from '@/hooks/useDealInquiryForm'
import { getAIDealResponse } from '@/lib/ai'
import { trackEvent } from '@/lib/tracking'

interface ConversationalFormProps {
  initialRole?: string
  onComplete: (data: FormSubmitData, path: 'schedule' | 'ai_chat') => void
}

// Help text is hardcoded in form-questions.ts (not user input), safe to render
function HelpText({ html }: { html: string }) {
  return <div className="mt-1 text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: html }} />
}

// Question row — left-aligned, 80% width container
function QuestionRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className="px-8 py-4 inline-block text-center" style={{ maxWidth: '820px' }}>
        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed" style={{ color: COLORS.dark }}>{children}</p>
      </div>
    </div>
  )
}

// Answer row — centered, constrained max-width so options wrap into balanced rows
function AnswerRow({ children, maxWidth = 900, fill = false }: { children: React.ReactNode; maxWidth?: number; fill?: boolean }) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: `${maxWidth}px`, width: fill ? '100%' : undefined }}>
        {children}
      </div>
    </div>
  )
}

// Compute a balanced max-width for an answer row based on the option labels
function computeAnswerRowWidth(options: string[]): number {
  if (options.length === 0) return 900
  const maxLen = Math.max(...options.map(o => o.length))
  // approx pill width: ~11px per char + 80px horizontal padding (px-8 + buffer)
  const pillWidth = maxLen * 11 + 80
  // aim for ~floor(sqrt(n)) rows so the grid feels balanced; small sets stay on one row
  const targetRows = options.length <= 5 ? 1 : Math.max(2, Math.floor(Math.sqrt(options.length)))
  const itemsPerRow = Math.ceil(options.length / targetRows)
  return Math.round(itemsPerRow * pillWidth + (itemsPerRow - 1) * 12)
}

// Right-aligned chat bubble (answer from user)
function AnswerBubble({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="group"
      >
        <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tr-sm px-5 py-3 font-medium text-base transition-all group-hover:bg-gray-200 group-hover:scale-[1.01] flex items-center gap-2" style={{ color: COLORS.dark }}>
          {children}
          <span className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
        </div>
      </button>
    </div>
  )
}

// Answer option pill button
function OptionPill({ label, isSelected, onClick, disabled }: {
  label: string
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      animate={isSelected
        ? { backgroundColor: COLORS.primary, color: COLORS.white }
        : { backgroundColor: COLORS.gray, color: '#1f2937' }
      }
      transition={{ duration: 0.15 }}
      className="px-8 py-4 rounded-2xl font-medium text-[15px]"
      disabled={disabled}
    >
      {label}
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Result screen — the "analyzing" pause and the card that replaces it.
//
// The pause is deliberate product, not a loading state we are waiting on: the
// portal link was minted back at the contact step (Q2), so nothing here is
// actually pending. Kyler, 2026-09-15: the old end screen was a plain text
// bubble that read like any other question, and "you're a great fit" landed
// flat. A few seconds of visible review, then a formatted verdict with the
// doors spelled out, is what makes the outcome feel earned and the choice
// obvious. Kept under six seconds; past that it reads as broken, not thorough.
//
// The steps describe what the form's own triage looked at (industry, years in
// business, revenue, ask). They promise no lender count — Kyler killed the
// match count on 2026-09-09 and the copy here still promises no number.
// ---------------------------------------------------------------------------

const ANALYSIS_STEPS = [
  'Reviewing industry and time in business',
  'Checking against lender criteria',
  'Preparing your next step',
]
const ANALYSIS_STEP_MS = 1700
const ANALYSIS_TOTAL_MS = ANALYSIS_STEP_MS * ANALYSIS_STEPS.length + 400 // ≈ 5.5s

function AnalyzingCard({ stepsDone }: { stepsDone: number }) {
  return (
    <div
      className="mx-auto w-full rounded-3xl border border-gray-200 bg-white px-6 py-8 sm:px-10"
      style={{ maxWidth: 640 }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <motion.span
          aria-hidden
          className="inline-block h-9 w-9 shrink-0 rounded-full border-[3px]"
          style={{ borderColor: `${COLORS.primary}33`, borderTopColor: COLORS.primary }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
        <div>
          <p className="text-lg font-semibold" style={{ color: COLORS.dark }}>Reviewing your answers</p>
          <p className="text-sm text-gray-500">This takes a few seconds.</p>
        </div>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {ANALYSIS_STEPS.map((label, i) => {
          const done = i < stepsDone
          const active = i === stepsDone
          return (
            <motion.li
              key={label}
              className="flex items-center gap-3 text-[15px]"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: done || active ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: done ? COLORS.primary : COLORS.gray }}
              >
                {done
                  ? <Check size={14} strokeWidth={3} color="#fff" />
                  : <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: active ? COLORS.primary : '#d1d5db' }} />}
              </span>
              <span style={{ color: done || active ? COLORS.dark : '#9ca3af' }}>{label}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

// One door on the result card. An <a> when it leaves the site (the portal
// handoff): the browser owns that navigation and the `final` event fired by
// handlePathChoice uses keepalive so it survives leaving the page.
function Door({ primary, title, sub, href, onClick }: {
  primary?: boolean
  title: React.ReactNode
  sub: string
  href?: string
  onClick: () => void
}) {
  const className = 'flex-1 min-w-[240px] rounded-2xl px-6 py-5 text-left'
  const style = primary
    ? { backgroundColor: COLORS.primary, color: '#fff', border: `1px solid ${COLORS.primary}` }
    : { backgroundColor: '#fff', color: COLORS.dark, border: '1px solid #d1d5db' }
  const inner = (
    <>
      <span className="flex items-center justify-between gap-3 text-[16px] font-semibold">
        <span>{title}</span>
        <ArrowRight size={18} className="shrink-0" />
      </span>
      <span className="mt-1 block text-sm leading-snug" style={{ opacity: primary ? 0.85 : 0.7 }}>{sub}</span>
    </>
  )
  const motionProps = {
    whileHover: { scale: 1.01, y: -1 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.15 },
  }
  return href ? (
    <motion.a href={href} onClick={onClick} className={className} style={style} {...motionProps}>{inner}</motion.a>
  ) : (
    <motion.button type="button" onClick={onClick} className={className} style={style} {...motionProps}>{inner}</motion.button>
  )
}

function NavigatorName() {
  return (
    <span
      style={{
        background: 'linear-gradient(135deg, #c99c42 0%, #e8c170 35%, #6b8e23 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 4s ease infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
      }}
    >
      Funding Navigator
    </span>
  )
}

function ContactInfoFields({
  isPartner,
  name, email, phone, company, smsConsent,
  setFieldValue,
  onContinue,
}: {
  isPartner: boolean
  name: string
  email: string
  phone: string
  company: string
  smsConsent: boolean
  setFieldValue: (id: string, value: any) => void
  onContinue: () => void
}) {
  return (
    <form
      className="form-deal_inquiry"
      onSubmit={(e) => {
        e.preventDefault()
        onContinue()
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {[
          { name: 'name_field', value: name, field: 'name', placeholder: isPartner ? 'Your name *' : 'Your name *', required: true, type: 'text' },
          { name: 'company_field', value: company, field: 'company', placeholder: isPartner ? 'Your firm' : 'Business name', required: false, type: 'text' },
          { name: 'email_field', value: email, field: 'email', placeholder: 'Email *', required: true, type: 'email' },
          { name: 'phone_field', value: phone, field: 'phone', placeholder: 'Phone (optional)', required: false, type: 'tel' },
        ].map((input) => (
          <input
            key={input.name}
            type={input.type}
            name={input.name}
            value={input.value}
            onChange={(e) => setFieldValue(input.field, e.target.value)}
            required={input.required}
            placeholder={input.placeholder}
            style={{
              backgroundColor: COLORS.gray,
              color: '#1f2937',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
              border: 'none',
              outline: 'none',
              width: '100%',
            }}
          />
        ))}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginLeft: '4px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="sms_consent_field"
            checked={smsConsent}
            onChange={(e) => setFieldValue('sms_consent', e.target.checked)}
            style={{ marginTop: '2px', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            I agree to receive text messages from Serve Funding about my inquiry. Message frequency
            varies; message and data rates may apply. Reply STOP to cancel. See our{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>Privacy Policy</a>
            {' '}and{' '}
            <a href="/sms-terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>SMS Terms</a>.
          </span>
        </label>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>We respect your privacy. No spam, ever.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={!name || !email}
        >
          Continue
          <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>
    </form>
  )
}

export function ConversationalForm({ initialRole, onComplete }: ConversationalFormProps) {
  const activeQuestionRef = useRef<HTMLDivElement>(null)

  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    userRole,
    name,
    email,
    phone,
    company,
    smsConsent,
    success,
    showChoicePoint,
    triageAction,
    chosenPath,
    handoffUrl,
    answeredQuestions,
    isContactInfoStep,
    getFieldValue,
    setFieldValue,
    handleAnswer,
    moveToNextQuestion,
    handleGoBack: hookHandleGoBack,
    handlePathChoice: hookHandlePathChoice,
    handleContactInfoContinue,
    notifyScheduleTransition,
    getCurrentFormData,
    getCalendlyCustomAnswers,
  } = useDealInquiryForm(undefined, initialRole)

  const [showCalendlyInline, setShowCalendlyInline] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)

  // The visible "reviewing your answers" pause before the result card. Reset
  // whenever the choice point closes (editing an earlier answer reopens it and
  // should replay the review, since the verdict may have changed).
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisDone, setAnalysisDone] = useState(false)
  useEffect(() => {
    if (!showChoicePoint) {
      setAnalysisStep(0)
      setAnalysisDone(false)
      return
    }
    const timers = ANALYSIS_STEPS.map((_, i) =>
      setTimeout(() => setAnalysisStep(i + 1), ANALYSIS_STEP_MS * (i + 1))
    )
    timers.push(setTimeout(() => setAnalysisDone(true), ANALYSIS_TOTAL_MS))
    return () => timers.forEach(clearTimeout)
  }, [showChoicePoint])

  const isStrongFit = triageAction !== 'kyler_with_chat'
  useEffect(() => {
    if (!analysisDone) return
    trackEvent('discover_result_shown', {
      fit: isStrongFit ? 'strong' : 'neutral',
      apply_door: Boolean(handoffUrl),
    })
  }, [analysisDone]) // eslint-disable-line react-hooks/exhaustive-deps
  const [aiMessages, setAiMessages] = useState<Array<{ text: string; sender: 'bot' | 'user' }>>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const aiInputRef = useRef<HTMLInputElement>(null)
  const calendlyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showCalendlyInline) {
      setTimeout(() => {
        calendlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [showCalendlyInline])

  const handleGoBack = (answeredIndex: number) => {
    setShowCalendlyInline(false)
    setShowAIChat(false)
    setAiMessages([])
    setAiInput('')
    setAiLoading(false)
    hookHandleGoBack(answeredIndex)
  }

  const handlePathChoice = (path: 'schedule' | 'ai_chat' | 'documents') => {
    trackEvent('discover_path_choice', { path })
    hookHandlePathChoice(path)
    // `documents` sets no view and does not call onComplete: the anchor is
    // navigating to the portal, so switching the parent's view would only
    // render a screen nobody sees. The hook's submitFinalForm has already sent
    // the webhook and the `final` portal event, both with keepalive.
    if (path === 'documents') return
    if (path === 'schedule') {
      setShowCalendlyInline(true)
      onComplete(getCurrentFormData(), 'schedule')
    } else if (path === 'ai_chat') {
      setShowAIChat(true)
      startAIChat()
      onComplete(getCurrentFormData(), 'ai_chat')
    }
  }

  const startAIChat = async () => {
    setAiLoading(true)
    try {
      const formData = getCurrentFormData()
      const reply = await getAIDealResponse(
        'I just shared my deal details and would like to explore options.',
        [{ text: `Hi ${name || 'there'}!`, sender: 'bot' }],
        formData
      )
      const parsed = JSON.parse(reply)
      setAiMessages([{ text: parsed.message, sender: 'bot' }])
    } catch {
      setAiMessages([{ text: "Hi! I'd love to help you explore your funding options. What questions do you have?", sender: 'bot' }])
    } finally {
      setAiLoading(false)
    }
  }

  const sendAIMessage = async () => {
    if (!aiInput.trim() || aiLoading) return
    const userMsg = aiInput.trim()
    setAiInput('')
    setAiMessages(prev => [...prev, { text: userMsg, sender: 'user' }])
    setAiLoading(true)

    try {
      const reply = await getAIDealResponse(userMsg, aiMessages, getCurrentFormData())
      const parsed = JSON.parse(reply)
      setAiMessages(prev => [...prev, { text: parsed.message, sender: 'bot' }])
    } catch {
      setAiMessages(prev => [...prev, { text: "Sorry, I'm having trouble right now. Please try again.", sender: 'bot' }])
    } finally {
      setAiLoading(false)
    }
  }

  // Auto-scroll to active question
  useEffect(() => {
    if (activeQuestionRef.current) {
      setTimeout(() => {
        activeQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [currentQuestionIndex, showChoicePoint, analysisDone])

  const isPartner = userRole === 'A Banker / Business Advisor'

  const getDisplayTitle = (question: typeof formQuestions[0]) => {
    return (isPartner && question.partnerTitle) ? question.partnerTitle : question.title
  }

  if (success) return null

  return (
    <div className="py-8 w-full relative z-10">
      <div className="flex flex-col gap-5">

        {/* Answered Questions Thread — chat style */}
        <AnimatePresence mode="popLayout">
          {answeredQuestions.map((aq, index) => (
            <motion.div
              key={`answered-${aq.questionId}-${index}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              {/* Question — left aligned */}
              <QuestionRow>{aq.displayTitle}</QuestionRow>

              {/* All options — right aligned, selected one highlighted */}
              <AnswerRow maxWidth={computeAnswerRowWidth(aq.options)}>
                {aq.options.length > 0 ? (
                  aq.options.map((option) => {
                    const isSelected = Array.isArray(aq.answer)
                      ? aq.answer.includes(option)
                      : aq.answer === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleGoBack(index)}
                        className="px-8 py-4 rounded-2xl font-medium text-[15px] transition-all hover:scale-[1.01]"
                        style={{
                          backgroundColor: isSelected ? COLORS.primary : '#f3f4f6',
                          color: isSelected ? '#ffffff' : '#9ca3af',
                        }}
                      >
                        {option}
                      </button>
                    )
                  })
                ) : (
                  <AnswerBubble onClick={() => handleGoBack(index)}>
                    {Array.isArray(aq.answer) ? aq.answer.join(', ') : aq.answer}
                  </AnswerBubble>
                )}
              </AnswerRow>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Choice Point — a short visible review, then the result card. */}
        {showChoicePoint && !chosenPath && (
          <motion.div
            ref={activeQuestionRef}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {!analysisDone ? (
              <AnalyzingCard stepsDone={analysisStep} />
            ) : (() => {
              // Copy matrix. Two axes: the form's own triage (the cold
              // `kyler_with_chat` path — revenue < $1M, ask < $250K, or under a
              // year in business — never hears "strong fit", because an advisor
              // is about to say otherwise), and whether the portal minted an
              // application link for this lead.
              //
              // Cold path gets ONE door, the application, and no call. Kyler,
              // 2026-09-15: with the application in hand the team can route a
              // thin file to lenders or consolidators and reply quickly,
              // instead of booking a call, waiting a week for documents, and
              // only then seeing the picture. When no link exists there is no
              // application to send them to, so the Navigator is the one door.
              const firstName = name.trim().split(/\s+/)[0] || ''
              const greet = firstName ? `, ${firstName}` : ''
              // What they told us, as chips. Revenue and ask are both bare
              // dollar ranges, so each carries a word to tell them apart.
              const factOf = (id: string, suffix = '') => {
                const v = getFieldValue(id)
                return typeof v === 'string' && v.length > 0 ? `${v}${suffix}` : null
              }
              const facts = [
                factOf('business_industry'),
                factOf('time_in_business', ' in business'),
                factOf('annual_revenue', ' revenue'),
                factOf('funding_amount', ' requested'),
              ].filter((v): v is string => v !== null)

              const headline = isStrongFit
                ? `Good news${greet}. This looks like a strong fit.`
                : `Thanks for sharing${greet}.`
              const body = isStrongFit
                ? handoffUrl
                  ? 'We already have lenders in mind who work deals like this. To get you to soft terms we need a few documents, and there are two ways to get there.'
                  : 'We already have lenders in mind who work deals like this. The next step is a quick call with an advisor.'
                : handoffUrl
                  ? 'We have your details. Complete your application and someone from our team will reach out shortly with next steps.'
                  : 'We have your details, and someone from our team will reach out shortly.'
              const doorsLabel = isStrongFit && handoffUrl ? 'Choose your next step' : 'Your next step'

              return (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto w-full rounded-3xl border bg-white px-6 py-8 sm:px-10"
                  style={{ maxWidth: 720, borderColor: isStrongFit ? `${COLORS.primary}66` : '#e5e7eb' }}
                >
                  {isStrongFit && (
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: COLORS.background, color: COLORS.dark }}
                    >
                      <CheckCircle2 size={14} color={COLORS.primary} />
                      Strong fit
                    </span>
                  )}
                  <h3
                    className={`${isStrongFit ? 'mt-3' : ''} text-2xl font-semibold leading-tight sm:text-3xl`}
                    style={{ color: COLORS.dark }}
                  >
                    {headline}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">{body}</p>
                  {facts.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="What you told us">
                      {facts.map(f => (
                        <li key={f} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{f}</li>
                      ))}
                    </ul>
                  )}

                  <div className="my-6 h-px bg-gray-200" />

                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{doorsLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {/* The portal handoff, and ONLY when the portal actually
                        minted a link for this lead. Rendered conditionally
                        rather than disabled: portal.servefunding.com/apply is
                        retired and redirects to a login page, which is worse
                        than no button. */}
                    {handoffUrl && (
                      <Door
                        primary
                        href={handoffUrl}
                        onClick={() => handlePathChoice('documents')}
                        title="Complete your application"
                        sub={isStrongFit
                          ? 'The fastest path to a term sheet. Finish in our secure portal.'
                          : 'Finish in our secure portal. Our team follows up from there.'}
                      />
                    )}
                    {isStrongFit && (
                      <Door
                        primary={!handoffUrl}
                        onClick={() => handlePathChoice('schedule')}
                        title={handoffUrl ? 'Talk to an advisor first' : 'Schedule a call with an advisor'}
                        sub={handoffUrl
                          ? 'Prefer to walk through it? Pick a time and we take it from there.'
                          : 'Pick a time that works for you.'}
                      />
                    )}
                    {!handoffUrl && (
                      <Door
                        primary={!isStrongFit}
                        onClick={() => handlePathChoice('ai_chat')}
                        title={<>Explore with our <NavigatorName /></>}
                        sub={isStrongFit
                          ? 'Ask questions about your options first.'
                          : 'Ask questions about your options while you wait.'}
                      />
                    )}
                  </div>
                </motion.div>
              )
            })()}
          </motion.div>
        )}

        {/* Active Question */}
        {!showChoicePoint && !showCalendlyInline && !showAIChat && currentQuestion && !isContactInfoStep && (
          <motion.div
            ref={activeQuestionRef}
            key={`active-${currentQuestion.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* Question — left aligned */}
            {currentQuestion.title && (
              <div>
                <QuestionRow>{getDisplayTitle(currentQuestion)}</QuestionRow>
                {currentQuestion.helpHtml && (
                  <div className="ml-1 mt-1">
                    <HelpText html={currentQuestion.helpHtml} />
                  </div>
                )}
              </div>
            )}

            {/* Answer options — right aligned */}
            {currentQuestion.type === 'single' && (
              <AnswerRow maxWidth={computeAnswerRowWidth(currentQuestion.answers)}>
                {currentQuestion.answers.map((option) => {
                  const isSelected = selectedAnswer === option || getFieldValue(currentQuestion.id) === option
                  return (
                    <OptionPill
                      key={option}
                      label={option}
                      isSelected={isSelected}
                      onClick={() => {
                        trackEvent('discover_step_answered', {
                          question: currentQuestion.id,
                          step: currentQuestionIndex + 1,
                          answer: option,
                        })
                        handleAnswer(option)
                      }}
                      disabled={selectedAnswer !== null}
                    />
                  )
                })}
              </AnswerRow>
            )}

            {currentQuestion.type === 'multi' && (
              <div style={{ width: '100%', maxWidth: `${computeAnswerRowWidth(currentQuestion.answers)}px`, marginLeft: 'auto', marginRight: 'auto' }} className="flex flex-col items-center gap-3">
                <p className="text-gray-500 text-xs">Select all that apply</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {currentQuestion.answers.map((option) => {
                    const currentValues = (getFieldValue(currentQuestion.id) as string[]) || []
                    const isSelected = currentValues.includes(option)
                    return (
                      <OptionPill
                        key={option}
                        label={option}
                        isSelected={isSelected}
                        onClick={() => {
                          const values = currentValues.includes(option)
                            ? currentValues.filter(v => v !== option)
                            : [...currentValues, option]
                          setFieldValue(currentQuestion.id, values)
                        }}
                      />
                    )
                  })}
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={() => {
                    trackEvent('discover_step_answered', {
                      question: currentQuestion.id,
                      step: currentQuestionIndex + 1,
                      answer: ((getFieldValue(currentQuestion.id) as string[]) || []).join(', '),
                    })
                    moveToNextQuestion()
                  }}
                  disabled={(getFieldValue(currentQuestion.id) as string[])?.length === 0}
                >
                  Continue <ChevronRight size={18} className="ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Contact Info (after choice point) */}
        {isContactInfoStep && !showChoicePoint && !chosenPath && !showCalendlyInline && !showAIChat && (
          <motion.div
            ref={activeQuestionRef}
            key="contact-info"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <QuestionRow>{getDisplayTitle(currentQuestion!)}</QuestionRow>

            <div style={{ width: '100%', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              <ContactInfoFields
                isPartner={isPartner}
                name={name}
                email={email}
                phone={phone}
                company={company}
                smsConsent={smsConsent}
                setFieldValue={setFieldValue}
                onContinue={handleContactInfoContinue}
              />
            </div>
          </motion.div>
        )}

        {/* Inline AI Chat — continues the conversation */}
        {showAIChat && (
          <motion.div
            ref={activeQuestionRef}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* AI Messages */}
            {aiMessages.map((msg, i) => (
              <div key={i}>
                {msg.sender === 'bot' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <div
                      className="rounded-2xl inline-block text-center transition-all duration-[400ms]"
                      style={{
                        maxWidth: '820px',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #c99c42 0%, #e8c170 35%, #6b8e23 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradient-shift 6s ease infinite',
                      }}
                    >
                      <div
                        className="px-8 py-8 rounded-2xl"
                        style={{ backgroundColor: '#fdfaf0' }}
                      >
                        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed" style={{ color: COLORS.dark }}>
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <AnswerRow>
                    <div style={{
                      backgroundColor: COLORS.primary,
                      borderRadius: '16px',
                      padding: '14px 20px',
                      color: COLORS.white,
                      fontSize: '15px',
                      fontWeight: 500,
                    }}>
                      {msg.text}
                    </div>
                  </AnswerRow>
                )}
              </div>
            ))}

            {/* Loading indicator — pending AI bubble while waiting */}
            {aiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <div
                  className="rounded-2xl inline-block"
                  style={{
                    padding: '2px',
                    background: 'linear-gradient(135deg, #c99c42 0%, #e8c170 35%, #6b8e23 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 6s ease infinite',
                  }}
                >
                  <div className="px-8 py-8 rounded-2xl" style={{ backgroundColor: '#fdfaf0' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                      <motion.div
                        style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.primary }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                      />
                      <motion.div
                        style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.primary }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                      />
                      <motion.div
                        style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.primary }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Input — only show when bot is done responding */}
            {!aiLoading && aiMessages.length > 0 && !showCalendlyInline && (
            <div style={{ width: '100%', maxWidth: '824px', marginLeft: 'auto', marginRight: 'auto', marginTop: '16px' }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                width: '100%',
                alignItems: 'center',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    const transcript = aiMessages
                      .map(m => `${m.sender === 'bot' ? 'Serve Funding' : name || 'User'}: ${m.text}`)
                      .join('\n')
                    notifyScheduleTransition('ai_chat', transcript)
                    setShowCalendlyInline(true)
                  }}
                  style={{
                    backgroundColor: COLORS.gray,
                    color: COLORS.dark,
                    borderRadius: '16px',
                    padding: '14px 20px',
                    fontSize: '15px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Schedule a Call
                </button>
                <input
                  ref={aiInputRef}
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendAIMessage()
                    }
                  }}
                  placeholder="Type your response..."
                  disabled={aiLoading}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    backgroundColor: COLORS.gray,
                    color: COLORS.dark,
                    borderRadius: '16px',
                    padding: '14px 20px',
                    fontSize: '15px',
                    border: 'none',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={sendAIMessage}
                  disabled={aiLoading || !aiInput.trim()}
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: aiLoading || !aiInput.trim() ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            )}
          </motion.div>
        )}

        {/* Inline Calendly — appears below the AI chat after choosing Schedule */}
        {showCalendlyInline && (
          <motion.div
            ref={calendlyRef}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <QuestionRow>Pick a time that works for you</QuestionRow>

            <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
              <CalendlyWidget
                name={name}
                email={email}
                dealContext=""
                height="1100px"
                calendlyUrl={getCurrentFormData().calendly_url || CALENDLY_URLS.michael.owner}
                customAnswers={getCalendlyCustomAnswers()}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
