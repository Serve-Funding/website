'use client'

/**
 * Name + email gate in front of a partner one-pager (see src/data/downloads.ts).
 *
 * On submit it does three things, none of which can stop the download:
 *  - emails the team through /api/notify, with the LinkedIn id from an outreach
 *    link when the visitor arrived on one, so "Mia sent them, they downloaded
 *    it" is one email rather than a cross-reference;
 *  - hands the form to HubSpot's native-form tracking, the same route every
 *    other form on the site uses, so the contact lands in HubSpot;
 *  - records an Umami event.
 * Then it starts the download. A visitor who has unlocked a file before skips
 * the form next time; the gate is lead capture, not access control.
 */

import { useEffect, useState } from 'react'
import { Download, CheckCircle } from 'lucide-react'
import { Button, Card, FormInput, Heading, Text } from '@/components/ui'
import { DOWNLOADS, type DownloadKey } from '@/data/downloads'
import { recallCampaignId } from '@/lib/campaign-visitor'
import { trackFormSubmission, trackHubSpotNativeForm } from '@/lib/tracking'

const UNLOCKED_KEY = 'sf-downloads-unlocked'

function readUnlocked(): string[] {
  try {
    const raw = window.localStorage.getItem(UNLOCKED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function rememberUnlocked(asset: DownloadKey) {
  try {
    const next = Array.from(new Set([...readUnlocked(), asset]))
    window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(next))
  } catch {
    // Storage disabled: they'll see the form again next visit, which is fine.
  }
}

function startDownload(href: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = ''
  document.body.appendChild(link)
  link.click()
  link.remove()
}

interface GatedDownloadProps {
  asset: DownloadKey
  heading: string
  description: React.ReactNode
  /** What the PDF covers, shown beside the form. */
  highlights: string[]
}

export function GatedDownload({ asset, heading, description, highlights }: GatedDownloadProps) {
  const { title, file } = DOWNLOADS[asset]
  const formType = `download_${asset}`
  const [unlocked, setUnlocked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setUnlocked(readUnlocked().includes(asset))
  }, [asset])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot filled: pretend nothing happened.
    if (String(data.get('website_url') || '').trim()) {
      form.setAttribute('data-spam-detected', 'true')
      return
    }

    setIsSubmitting(true)
    trackFormSubmission(formType)
    trackHubSpotNativeForm(formType, form)

    // keepalive so the notification survives the download starting.
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        type: 'download',
        asset,
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        company: String(data.get('company') || '').trim(),
        pageUrl: window.location.origin + window.location.pathname,
        campaign_id: recallCampaignId() ?? '',
      }),
    }).catch((error) => console.error('Download notification failed:', error))

    rememberUnlocked(asset)
    // Started inside the submit handler so the browser treats it as user-initiated.
    startDownload(file)
    setUnlocked(true)
    setIsSubmitting(false)
  }

  return (
    <Card noHover padding="lg" className="max-w-5xl mx-auto">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading size="h3" className="mb-3 text-olive-900">{heading}</Heading>
          <Text className="text-gray-700 mb-5">{description}</Text>
          <ul className="space-y-2 text-gray-700 text-sm">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-gold-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {unlocked ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <CheckCircle size={40} className="text-gold-500" />
            <Text className="text-gray-700">
              Your copy of <strong>{title}</strong> should be downloading now.
            </Text>
            <a href={file} download>
              <Button variant="default" size="lg">
                <Download size={18} className="mr-2" />
                Download the PDF
              </Button>
            </a>
          </div>
        ) : (
          <form className={`form-${formType} flex flex-col gap-4`} onSubmit={handleSubmit}>
            <FormInput id={`${asset}-name`} type="text" name="name" label="Name" placeholder="Your name" autoComplete="name" required />
            <FormInput id={`${asset}-email`} type="email" name="email" label="Work email" placeholder="you@company.com" autoComplete="email" required />
            <FormInput id={`${asset}-company`} type="text" name="company" label="Company (optional)" placeholder="Your bank or firm" autoComplete="organization" />

            {/* Honeypot - hidden from humans, filled by bots */}
            <input type="text" name="website_url" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <Button variant="default" size="lg" type="submit" disabled={isSubmitting}>
              <Download size={18} className="mr-2" />
              Get the PDF
            </Button>
            <Text size="sm" className="text-gray-500 text-center">
              We&apos;ll only use this to follow up about working together.
            </Text>
          </form>
        )}
      </div>
    </Card>
  )
}
