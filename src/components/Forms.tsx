'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Calendar, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Section,
  Container,
  Heading,
  Text,
  Button,
  Card,
  FormInput,
  SelectButtons,
  MultiSelectButtons,
} from '@/components/ui'
import { useFormSubmit, FormSubmitData } from '@/hooks/useFormSubmit'
import { useDealInquiryForm } from '@/hooks/useDealInquiryForm'
import { formQuestions } from '@/data/form-questions'
import { COLORS } from '@/lib/colors'

// Basic guard that disables submit when the honeypot is touched or required fields are incomplete
function useHoneypotGuard() {
  const formRef = useRef<HTMLFormElement>(null)
  const [canSubmit, setCanSubmit] = useState(false)

  const recomputeGuard = React.useCallback(() => {
    const form = formRef.current
    if (!form) return

    const honeypotInput = form.querySelector('input[name="website_url"]') as HTMLInputElement | null
    const honeypotValue = honeypotInput?.value?.trim()
    const valid = form.checkValidity()

    setCanSubmit(valid && !honeypotValue)
  }, [])

  useEffect(() => {
    recomputeGuard()
  }, [recomputeGuard])

  return { formRef, canSubmit, recomputeGuard }
}

// Reusable Success Content Component
export interface FormSuccessContentProps {
  message: string | React.ReactNode
  formData: FormSubmitData
  calendlyUrl: string
  ctaText?: string
  showCTA?: boolean
}

export function FormSuccessContent({
  message,
  calendlyUrl,
  ctaText = 'Schedule a Call',
}: FormSuccessContentProps) {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex justify-center"
      >
        <CheckCircle className="w-12 h-12" style={{ color: COLORS.primary }} />
      </motion.div>
      <Text size="lg" className="mb-6">{message}</Text>
      <div className="space-y-3">
        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="default" size="lg">
            {ctaText}
          </Button>
        </a>
      </div>
    </div>
  )
}

// Re-export FormSubmitData for components that need it
export type { FormSubmitData } from '@/hooks/useFormSubmit'

// "or Schedule a Call" quick link shown below form buttons during triage questions
function ScheduleCallLink({ onClick }: { onClick?: () => void }) {
  return (
    <div className="text-center mt-4">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <Calendar size={14} />
        or schedule a call directly
      </button>
    </div>
  )
}

// Newsletter Modal Form (for use in modals)
interface NewsletterModalFormProps {
  success: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  formData: FormSubmitData
  isSubmitting: boolean
}

export function NewsletterModalForm({
  success,
  handleSubmit,
  formData,
  isSubmitting,
}: NewsletterModalFormProps) {
  const { formRef, canSubmit, recomputeGuard } = useHoneypotGuard()

  return (
    <>
      {success ? (
        <FormSuccessContent
          message={<>You&#39;re in!<br /><br />You should see an email confirmation soon.<br /><br />We&#39;d love to talk to you as well.</>}
          formData={formData}
          calendlyUrl="/discover"
          ctaText="Let's Talk"
        />
      ) : (
        <form
          ref={formRef}
          className="form-newsletter flex flex-col gap-4"
          onSubmit={handleSubmit}
          onInput={recomputeGuard}
          onChange={recomputeGuard}
        >
          <FormInput
            type="text"
            name="firstname"
            label="First Name"
            placeholder="Your first name"
            required
          />

          <FormInput
            type="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
            required
          />

          {/* Honeypot field - hidden from humans, filled by bots */}
          <input
            type="text"
            name="company_phone"
            className="sr-only"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="flex justify-center pt-4">
            <Button
              variant="default"
              size="lg"
              type="submit"
              disabled={!canSubmit || isSubmitting}
            >
              Subscribe
            </Button>
          </div>

          <Text className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </Text>
        </form>
      )}
    </>
  )
}

// Deal Inquiry Form (for deal inquiry page with chat follow-up)
interface DealInquiryFormProps {
  onSubmitSuccess?: (formData: FormSubmitData) => void
  onScheduleDirectly?: (formData: FormSubmitData) => void
}


export function DealInquiryForm({
  onSubmitSuccess,
  onScheduleDirectly,
}: DealInquiryFormProps = {}) {
  const formRef = useRef<HTMLFormElement>(null)

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    userRole,
    name,
    email,
    phone,
    company,
    smsConsent,
    success,
    formData,
    getFieldValue,
    setFieldValue,
    handleAnswer,
    moveToNextQuestion,
    moveToPreviousQuestion,
    handleSubmit,
    otherResponses,
    isLastQuestion,
    getCurrentFormData,
  } = useDealInquiryForm(onSubmitSuccess)

  // Is the current step a triage question (after contact info)?
  const isTriageStep = currentQuestion?.type !== 'contact-info' && currentQuestionIndex > 0
    && currentQuestion?.id !== 'user_role'

  // Resolve the display title — use partnerTitle when the user is a Banker / Business Advisor
  const isPartner = userRole === 'A Banker / Business Advisor'
  const displayTitle = isPartner && currentQuestion?.partnerTitle
    ? currentQuestion.partnerTitle
    : currentQuestion?.title

  const handleScheduleDirectly = () => {
    if (onScheduleDirectly) {
      onScheduleDirectly(getCurrentFormData())
    }
  }


  return (
    <>
      {!success ? (
        <form ref={formRef} className="form-deal_inquiry flex flex-col gap-4 w-full max-w-2xl mx-auto min-h-[650px]" onSubmit={handleSubmit}>
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentQuestionIndex ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i <= currentQuestionIndex ? COLORS.primary : '#d1d5db',
                  borderRadius: '9999px',
                }}
              />
            ))}
          </div>

          {/* Question Label - only show if title exists */}
          {displayTitle && (
            <div className="mt-8">
              <Heading size="h3" color="primary" className="text-left !my-0">
                {displayTitle}
              </Heading>
              {currentQuestion?.helpHtml && (
                <div
                  className="mt-2 text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.helpHtml }}
                />
              )}
            </div>
          )}

          {/* Single choice or multi-choice with buttons */}
          {(currentQuestion?.type === 'single' || currentQuestion?.type === 'multi') && currentQuestion?.answers?.length! > 0 && (
            <div className="flex flex-col gap-8">
              {!currentQuestion?.title && <div className="mt-8" />}
              {currentQuestion?.type === 'multi' && (
                <Text size="sm" className="text-center text-gray-500">
                  You can select multiple options
                </Text>
              )}
              {currentQuestion?.type === 'single' ? (
                <SelectButtons
                  options={currentQuestion?.answers || []}
                  value={getFieldValue(currentQuestion?.id || '') as string}
                  onChange={handleAnswer}
                  disabled={selectedAnswer !== null}
                  selectedAnswer={selectedAnswer}
                  align="left"
                />
              ) : (
                <MultiSelectButtons
                  options={currentQuestion?.answers || []}
                  value={getFieldValue(currentQuestion?.id || '') as string[]}
                  onChange={(value) => setFieldValue(currentQuestion?.id || '', value)}
                  align="left"
                />
              )}
              <div className="flex items-center gap-3 mt-8">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="default"
                    size="lg"
                    type="button"
                    onClick={moveToPreviousQuestion}
                  >
                    &larr; Back
                  </Button>
                )}
                <Button
                  variant="default"
                  size="lg"
                  type={isLastQuestion ? "submit" : "button"}
                  onClick={isLastQuestion ? undefined : moveToNextQuestion}
                  disabled={!getFieldValue(currentQuestion?.id) || (Array.isArray(getFieldValue(currentQuestion?.id)) && (getFieldValue(currentQuestion?.id) as string[]).length === 0)}
                  className="flex-1"
                >
                  {isLastQuestion ? "Let's talk about your deal" : "Continue"}
                </Button>
              </div>
              {isTriageStep && <ScheduleCallLink onClick={handleScheduleDirectly} />}
            </div>
          )}

          {/* Single choice with "Other" option */}
          {currentQuestion?.type === 'single_with_other' && (
            <div className="flex flex-col gap-8">
              <SelectButtons
                options={currentQuestion?.answers || []}
                value={getFieldValue(currentQuestion?.id || '') as string}
                onChange={handleAnswer}
                disabled={selectedAnswer !== null}
                selectedAnswer={selectedAnswer}
                align="left"
              />

              {/* Show input when "Other" is selected */}
              {typeof getFieldValue(currentQuestion?.id || '') === 'string' && (getFieldValue(currentQuestion?.id || '') === 'Other' || (getFieldValue(currentQuestion?.id || '') as string).toLowerCase().includes('other')) && (
                <div className="mt-4 pl-0">
                  <FormInput
                    type="text"
                    name={`${currentQuestion?.id}_other`}
                    label="Please specify"
                    value={getFieldValue(`${currentQuestion?.id}_other`) || ''}
                    onChange={(e) => setFieldValue(`${currentQuestion?.id}_other`, e.currentTarget.value)}
                    placeholder="Enter your response"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 mt-8">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={moveToPreviousQuestion}
                  >
                    &larr; Back
                  </Button>
                )}
                <Button
                  variant="default"
                  size="lg"
                  type="button"
                  onClick={moveToNextQuestion}
                  disabled={
                    !getFieldValue(currentQuestion?.id) ||
                    (getFieldValue(currentQuestion?.id) === 'Other' && !getFieldValue(`${currentQuestion?.id}_other`))
                  }
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
              {isTriageStep && <ScheduleCallLink onClick={handleScheduleDirectly} />}
            </div>
          )}

          {/* Contact Info Collection */}
          {currentQuestion?.type === 'contact-info' && (
            <div className="flex flex-col gap-6 mt-4">
              {isPartner && (
                <Text size="sm" className="text-gray-600">
                  Answer a few questions and schedule a call at your convenience.
                  Takes a few minutes, and there&#39;s no obligation.
                </Text>
              )}
              <FormInput
                type="text"
                name="name"
                label={isPartner ? 'Your Name' : 'Name'}
                value={name}
                onChange={(e) => setFieldValue('name', e.currentTarget.value)}
                onInput={(e) => setFieldValue('name', e.currentTarget.value)}
                required
              />
              <FormInput
                type="text"
                name="company"
                label={isPartner ? 'Your Firm' : 'Business Name'}
                value={company}
                onChange={(e) => setFieldValue('company', e.currentTarget.value)}
                onInput={(e) => setFieldValue('company', e.currentTarget.value)}
              />
              <FormInput
                type="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setFieldValue('email', e.currentTarget.value)}
                onInput={(e) => setFieldValue('email', e.currentTarget.value)}
                required
              />
              <div>
                <FormInput
                  type="tel"
                  name="phone"
                  label="Phone (optional)"
                  value={phone}
                  onChange={(e) => setFieldValue('phone', e.currentTarget.value)}
                  onInput={(e) => setFieldValue('phone', e.currentTarget.value)}
                  placeholder="(555) 123-4567"
                />
                <label className="flex items-start gap-2 mt-3 ml-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setFieldValue('sms_consent', e.currentTarget.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-olive-900 cursor-pointer"
                  />
                  <Text className="text-xs text-gray-500">
                    I agree to receive text messages from Serve Funding about my inquiry. Message
                    frequency varies; message and data rates may apply. Reply STOP to cancel. See our{' '}
                    <a href="/privacy-policy" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    {' '}and{' '}
                    <a href="/sms-terms" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">SMS Terms</a>.
                  </Text>
                </label>
              </div>

              <div className="flex items-center gap-3 mt-4">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="default"
                    size="lg"
                    type="button"
                    onClick={moveToPreviousQuestion}
                  >
                    &larr; Back
                  </Button>
                )}
                <Button
                  variant="default"
                  size="lg"
                  type="submit"
                  disabled={!name || !email}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          {/* Hidden inputs for all form fields - dynamically generated from formQuestions */}
          {formQuestions.map((question) => {
            const fieldValue = getFieldValue(question.id)

            // Skip contact-info type questions as they're handled separately
            if (question.type === 'contact-info') return null

            // Handle multi-select questions (arrays)
            if (Array.isArray(fieldValue)) {
              return fieldValue.map((value) => (
                <input key={`${question.id}-${value}`} type="hidden" name={question.id} value={value} />
              ))
            }

            // Handle single-value questions
            return <input key={question.id} type="hidden" name={question.id} value={fieldValue as string} />
          })}

          {/* Contact info fields (handled separately as they're part of contact-info type) */}
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="company" value={company} />
          <input type="hidden" name="sms_consent" value={smsConsent ? 'yes' : 'no'} />
          {/* Hidden inputs for "other" responses */}
          {Object.entries(otherResponses).map(([fieldId, value]) => (
            <input key={fieldId} type="hidden" name={fieldId} value={String(value)} />
          ))}
        </form>
      ) : (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <CheckCircle className="w-12 h-12" style={{ color: COLORS.primary }} />
          </motion.div>
          <Text size="lg" className="mb-6">Thanks for sharing your details, {formData.name}! We&#39;re reviewing your information and will get back to you shortly with your personalized funding options.</Text>
        </div>
      )}
    </>
  )
}

// Newsletter Signup Form
export function NewsletterForm() {
  const { success, handleSubmit, formData, isSubmitting } = useFormSubmit(
    'newsletter',
    'newsletter'
  )

  return (
    <Section background="gray">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Logo */}
            <div className="relative w-full max-w-sm h-auto">
              <Image
                src="/newsletter-logo.webp"
                alt="Creative Working Capital Newsletter"
                width={1148}
                height={429}
                className="w-full h-auto"
              />
            </div>

            <Text className="text-olive-800/80 max-w-md text-lg">
              Receive exclusive access to monthly client success stories and detailed credit criteria from our preferred lender network.
            </Text>
          </div>

          {/* Original Form Column */}
          <div className="space-y-6">
            {/* Sign-up Text Above Form */}
            <Heading size="h3" className='text-center mb-8'>
              Sign-up for our newsletter
            </Heading>

            {/* Form Card */}
            <Card>
              <NewsletterModalForm
                success={success}
                handleSubmit={handleSubmit}
                formData={formData}
                isSubmitting={isSubmitting}
              />
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  )
}
