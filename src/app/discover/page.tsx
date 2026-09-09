'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FormSubmitData } from '@/components/Forms'
import { DealInquiryChat } from '@/components/DealInquiryChat'
import { CalendlyWidget } from '@/components/CalendlyWidget'
import { ConversationalForm } from '@/components/ConversationalForm'
import { Section, Container, Heading, Text, Card, FadeIn, SocialIcons } from '@/components/ui'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { formQuestions } from '@/data/form-questions'
import { trackEvent } from '@/lib/tracking'

function DiscoverContent() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const initialRole = roleParam === 'partner'
    ? 'A Banker / Business Advisor'
    : undefined

  const [view, setView] = useState<'form' | 'chat' | 'calendly'>('form')
  const [formData, setFormData] = useState<FormSubmitData>({})
  const [dealContext, setDealContext] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (view === 'calendly' || view === 'chat') {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [view])

  useEffect(() => {
    trackEvent('discover_started', { role: roleParam ?? 'unspecified' })
  }, [roleParam])

  const buildDealContext = (data: FormSubmitData): string => {
    const questionMap = formQuestions.reduce((acc, q) => {
      acc[q.id] = q.title
      return acc
    }, {} as Record<string, string>)

    const answers = [
      data.user_role ? `${questionMap.user_role} ${data.user_role}` : null,
      data.annual_revenue ? `${questionMap.annual_revenue} ${data.annual_revenue}` : null,
      data.funding_amount ? `${questionMap.funding_amount} ${data.funding_amount}` : null,
      data.time_in_business ? `${questionMap.time_in_business} ${data.time_in_business}` : null,
      data.owner_credit_score ? `${questionMap.owner_credit_score} ${data.owner_credit_score}` : null,
      data.business_industry ? `${questionMap.business_industry} ${data.business_industry}` : null,
      data.financing_needs && Array.isArray(data.financing_needs) && data.financing_needs.length > 0 ? `${questionMap.financing_needs} ${data.financing_needs.join(', ')}` : null,
    ].filter(Boolean).join('\n')

    return answers
  }

  const buildCalendlyCustomAnswers = (data: FormSubmitData): Record<string, string> => {
    const isOwner = data.user_role === 'A Business Owner or Operator Seeking Funding'

    if (isOwner) {
      const businessDesc = [
        data.company,
        data.business_industry,
        data.time_in_business ? `${data.time_in_business} in business` : '',
        data.annual_revenue ? `${data.annual_revenue} annual revenue` : '',
      ].filter(Boolean).join(', ')

      const monthlyRevenueMap: Record<string, string> = {
        '$500K-$1MM': '$50K-100K',
        '$1MM-$3MM': '$100K-$500K',
        '$3MM-$10MM': '$100K-$500K',
        '$10MM-$20MM': '$500K+',
        '$20MM-$50MM': '$500K+',
        '$50MM-$100MM': '$500K+',
        '$100MM+': '$500K+',
      }
      const monthlyRevenue = data.annual_revenue ? monthlyRevenueMap[data.annual_revenue] || '' : ''

      const fundingGoal = [
        data.funding_amount,
        data.financing_needs?.length ? `for ${data.financing_needs.join(', ')}` : '',
      ].filter(Boolean).join(' ')

      return {
        ...(businessDesc && { a1: businessDesc }),
        ...(monthlyRevenue && { a2: monthlyRevenue }),
        ...(fundingGoal && { a3: fundingGoal }),
      }
    } else {
      const roleDesc = data.user_role || ''
      return {
        ...(roleDesc && { a1: roleDesc }),
      }
    }
  }

  const sendNotification = (data: FormSubmitData, context: string, source: string, chatTranscript?: string) => {
    const payload = {
      ...data,
      formType: 'deal_inquiry_calendly',
      deal_context: context,
      chat_transcript: chatTranscript || '',
      transition_source: source,
      submittedAt: new Date().toISOString(),
    }

    try {
      fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'inquiry', ...payload }),
      })
    } catch (error) {
      console.error('Webhook error:', error)
    }

    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type: 'calendly' }),
      })
    } catch (error) {
      console.error('Email error:', error)
    }
  }

  const handleFormComplete = (data: FormSubmitData, path: 'schedule' | 'ai_chat') => {
    setFormData(data)
    const context = buildDealContext(data)
    setDealContext(context)

    // Notification email is fired from useDealInquiryForm.submitFinalForm
    // ai_chat & schedule both continue inline within the ConversationalForm
  }

  const handleScheduleClick = (context: string, chatTranscript?: string) => {
    setDealContext(context)
    sendNotification(formData, context, 'ai_chat', chatTranscript)
    setView('calendly')
  }

  return (
    <main>
      {/* Hero */}
      <HeroFadeIn
        title="Discover Your Funding Options"
        subtitle={<>Take a few minutes to share some high-level details.<br />We&#39;ll show you what credit options may be available.</>}
        compact
      />

      {/* Conversational Form / Chat / Calendly */}
      <Section className="overflow-visible" background="white">
        <Container className="flex flex-col items-center !max-w-5xl">
          {view === 'form' && (
            <ConversationalForm
              initialRole={initialRole}
              onComplete={handleFormComplete}
            />
          )}

          {view === 'chat' && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <Card className="md:p-12" noHover>
                <DealInquiryChat formData={formData} onScheduleClick={handleScheduleClick} />
              </Card>
            </motion.div>
          )}

          {view === 'calendly' && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <Card className="md:p-12" noHover>
                <div className="flex flex-col gap-6">
                  <Heading size="h3" color="primary" className="text-center">
                    Let&#39;s schedule a time to talk!
                  </Heading>
                  <CalendlyWidget
                    name={formData.name || ''}
                    email={formData.email || ''}
                    dealContext={dealContext || ''}
                    height="700px"
                    calendlyUrl={formData.calendly_url || 'https://calendly.com/michael_kodinsky/30-minute-funding-call'}
                    customAnswers={buildCalendlyCustomAnswers(formData)}
                  />
                </div>
              </Card>
            </motion.div>
          )}

        </Container>
      </Section>

      {/* Built on Relationships */}
      <Section background="primary">
        <Container>
          <FadeIn className="text-center max-w-3xl mx-auto">
            <Heading size="h2" color="white" className="mb-6">
              Built on Relationships.<br />Operated With Integrity.
            </Heading>
            <Text color="white" size="2xl" className="mb-6 leading-relaxed">
              Serve Funding is a relationship-based advisory, not an algorithm-driven &quot;marketplace&quot;. We do not sell leads or shop deals indiscriminately. Every client is handled with care by members of our dedicated, experienced team.
            </Text>
            <Text color="white" size="lg" className="leading-relaxed italic">
              We treat every relationship and every client&#39;s financing opportunity as if it were our own.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* Social Media Section */}
      <Section background="background">
        <Container>
          <FadeIn className="text-center max-w-xl mx-auto">
            <Heading size="h3" className="mb-4 text-olive-900">
              Connect With Us On Social Media
            </Heading>
            <Text size="lg" className="text-gray-700 mb-6">
              Stay up-to-date with the latest news,<br />funding tips, and success stories.
            </Text>
            <div className="flex justify-center">
              <SocialIcons />
            </div>
          </FadeIn>
        </Container>
      </Section>
    </main>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" aria-hidden="true" />}>
      <DiscoverContent />
    </Suspense>
  )
}
