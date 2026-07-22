'use client'

import { useState } from 'react'
import { trackFormSubmission, trackHubSpotNativeForm } from '@/lib/tracking'

const CLAY_WEBHOOK_URL = process.env.NEXT_PUBLIC_CLAY_WEBHOOK_URL || ''

export interface FormSubmitData {
  name?: string
  email?: string
  phone?: string
  company?: string
  business_name?: string
  capital_for?: string
  contact_us_details?: string
  partnership_for__commercial_banking__advisory_?: string
  // Deal inquiry expanded fields
  user_role?: string
  business_industry?: string
  time_in_business?: string
  annual_revenue?: string
  financing_needs?: string[]
  funding_amount?: string
  owner_credit_score?: string
  company_state?: string
  calendly_url?: string
  triage_action?: string
  sms_consent?: string
}

export function useFormSubmit(
  formType: string,
  webhookUrl?: string,
  calendlyUrl?: string,
  onAfterSubmit?: (data: FormSubmitData) => void
) {
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<FormSubmitData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Stop the event from propagating to HubSpot's global listeners
    if (e.nativeEvent) {
      (e.nativeEvent as Event).stopImmediatePropagation?.()
    }

    const form = e.currentTarget
    setIsSubmitting(true)

    // Capture form data
    const rawFormData = new FormData(form)
    const data: Record<string, any> = {}
    const webhookData: Record<string, any> = {} // Complete data for webhook (includes honeypot)
    const financingNeeds: string[] = []
    const honeypot = rawFormData.get('website_url') as string

    // Check honeypot - if filled, it's likely a bot
    // Send to webhook for logging/visibility, but skip HubSpot
    if (honeypot) {
      // Mark form as spam to prevent HubSpot from picking it up
      form.setAttribute('data-spam-detected', 'true')
      
      // Build webhook payload for spam detection
      if (webhookUrl) {
        try {
          const spamPayload = {
            ...webhookData,
            formType,
            is_spam: true,
            submittedAt: new Date().toISOString(),
          }
          await fetch('/api/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              webhookUrl,
              ...spamPayload,
            }),
          })
        } catch (error) {
          console.error('Spam webhook submission error:', error)
        }
      }
      form.reset()
      setIsSubmitting(false)
      // Silently fail - no success state, no HubSpot tracking
      return
    }

    rawFormData.forEach((value, key) => {
      // Build webhook data with all fields including honeypot
      if (key === 'financing_needs') {
        financingNeeds.push(value as string)
        webhookData[key] = webhookData[key] ? [...webhookData[key], value] : [value]
      } else {
        webhookData[key] = value as string
        // Skip honeypot for HubSpot data
        if (key !== 'website_url') {
          data[key] = value as string
        }
      }
    })

    const submittedFormData: FormSubmitData = {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      company: data.company || '',
      capital_for: data.capital_for || '',
      contact_us_details: data.contact_us_details || '',
      partnership_for__commercial_banking__advisory_: data.partnership_for__commercial_banking__advisory_ || '',
      // Deal inquiry expanded fields
      user_role: data.user_role || '',
      business_industry: data.business_industry || '',
      time_in_business: data.time_in_business || '',
      annual_revenue: data.annual_revenue || '',
      financing_needs: financingNeeds,
      funding_amount: data.funding_amount || '',
      owner_credit_score: data.owner_credit_score || '',
      company_state: data.company_state || '',
      calendly_url: data.calendly_url || '',
      triage_action: data.triage_action || '',
    }

    setFormData(submittedFormData)

    // Track form submission to Umami
    trackFormSubmission(formType)
    // Track non-HubSpot form submission so it appears in HubSpot
    trackHubSpotNativeForm(formType, form)

    // HubSpot: The tracking code in layout.tsx automatically captures this form submission
    // Webhook: Send to primary webhook and Clay
    const webhookPayload = {
      ...webhookData,
      formType,
      financing_needs: financingNeeds, // Ensure financing_needs is an array
      submittedAt: new Date().toISOString(),
    }

    const webhookDestinations = [
      ...(webhookUrl ? [{ url: webhookUrl }] : []),
      ...(CLAY_WEBHOOK_URL ? [{ url: CLAY_WEBHOOK_URL }] : []),
    ]

    if (webhookDestinations.length) {
      try {
        await Promise.allSettled(
          webhookDestinations.map(({ url }) =>
            fetch('/api/webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                webhookUrl: url,
                ...webhookPayload,
              }),
            })
          )
        )
      } catch (error) {
        console.error('Webhook submission error:', error)
      }
    }

    // Small delay to ensure tracking completes, then proceed
    setTimeout(() => {
      if (onAfterSubmit) {
        onAfterSubmit(submittedFormData)
      }

      if (calendlyUrl) {
        // Open Calendly in new tab for intro/partner forms
        window.open(calendlyUrl, '_blank')
      } else {
        // Show success page for other forms
        setSuccess(true)
      }
      form.reset()
      setIsSubmitting(false)
    }, 300)
  }

  return { success, handleSubmit, formData, isSubmitting }
}
