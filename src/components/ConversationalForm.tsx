'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MessageCircle, ChevronRight, Send } from 'lucide-react'
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
    chosenPath,
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

  const handlePathChoice = (path: 'schedule' | 'ai_chat') => {
    trackEvent('discover_path_choice', { path })
    hookHandlePathChoice(path)
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
  }, [currentQuestionIndex, showChoicePoint])

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

        {/* Choice Point */}
        {showChoicePoint && !chosenPath && (
          <motion.div
            ref={activeQuestionRef}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <QuestionRow>Thanks for sharing! Would you like to speak with our team or explore options with our Funding Navigator?</QuestionRow>

            <AnswerRow>
              <OptionPill
                label="Schedule a Call"
                isSelected={false}
                onClick={() => handlePathChoice('schedule')}
              />
              <motion.button
                type="button"
                onClick={() => handlePathChoice('ai_chat')}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl font-medium text-[15px]"
                style={{ backgroundColor: COLORS.gray, color: COLORS.dark, border: 'none' }}
              >
                Explore with our{' '}
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
              </motion.button>
            </AnswerRow>
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
