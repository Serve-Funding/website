'use client'

import { useState, useEffect } from 'react'
import {
  ChevronRight
} from 'lucide-react'
import {
  Section,
  Container,
  Heading,
  Text,
  StaggerContainer,
  Card
} from '@/components/ui'
import { fundingCases } from '@/data/fundingData'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { CaseStudyModal } from '@/components/CaseStudyModal'
import { CTA } from '@/components/cta'
import { Breadcrumb } from '@/components/breadcrumb'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { getReviewSchema } from '@/lib/schema-generators'
import { COLORS as BRAND_COLORS } from '@/lib/colors'
import { hashSlug } from '@/lib/campaign-visitor'

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-')
}

const caseStudies = fundingCases.map(c => ({
  amount: c.amount,
  title: c.title,
  company: c.company,
  description: c.description,
  fullStory: c.fullStory
}))

export default function Fundings() {
  const [selectedStudy, setSelectedStudy] = useState<typeof caseStudies[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      // Not `hash.slice(1)`: campaign links are built as
      // `/fundings#payroll-rescue?id=jimtingler`, whose fragment is the slug AND
      // the id. Matching the raw fragment finds no funding and silently opens
      // nothing — the exact link we are asking bankers to click. hashSlug keeps
      // only the slug, so either ordering opens the card.
      const hash = hashSlug(window.location.hash)
      if (hash) {
        // Find the matching case study by slug
        const matchingStudy = caseStudies.find(study => generateSlug(study.title) === hash)
        if (matchingStudy) {
          // Open modal for the matching study
          setSelectedStudy(matchingStudy)
          setIsModalOpen(true)
        } else {
          // Fallback: scroll to element if it exists
          const element = document.getElementById(hash)
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
          }
        }
      }
    }

    // Handle initial load with hash
    handleHashChange()

    // Listen for hash changes while on the page
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const openModal = (study: typeof caseStudies[0]) => {
    setSelectedStudy(study)
    setIsModalOpen(true)
    // Put the card in the address bar. replaceState rather than `location.hash =`:
    // every card below carries id={slug}, so assigning the hash would scroll the
    // grid behind the modal. replaceState fires no hashchange, so one is
    // dispatched by hand — CampaignVisitorTracker records which card was opened
    // from that event, and without it a banker who browses five deals from a
    // campaign link is recorded as having read one.
    const slug = generateSlug(study.title)
    if (hashSlug(window.location.hash) !== slug) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}#${slug}`
      )
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Leave the URL clean once the card is closed, so a copied or refreshed
    // address does not reopen a card the visitor already dismissed.
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`
      )
    }
  }

  return (
    <div className="overflow-x-hidden">
      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'Fundings' }]} />

      {/* Hero Section */}
      <HeroFadeIn
        title="Client Success Stories"
        subtitle={<>At Serve Funding, we provide flexible, customized working capital solutions<br />to help businesses overcome financial challenges and seize new growth opportunities. From acquisition funding to payroll financing and beyond,<br />we deliver fast, reliable financial solutions that drive success.</>}
        compact
      />

      {/* Recent Fundings Grid */}
      <Section background='primary'>
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => {
              const slug = generateSlug(study.title)

              return (
                <button
                  key={index}
                  id={slug}
                  onClick={() => openModal(study)}
                  className="w-full h-full text-left focus:outline-none scroll-mt-32"
                >
                  <Card className="cursor-pointer group">
                    <Heading size="h4" className="mb-4 text-olive-900 group-hover:text-gold-500 transition-colors">
                      <span
                        className="bg-gradient-to-b bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(to bottom, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.dark})` }}
                      >
                        {study.amount}
                      </span>{' '}
                      {study.title}
                    </Heading>

                    <Text className="text-sm text-gray-500 mb-4">
                      {study.company}
                    </Text>

                    <div className='flex-1'>
                      <Text className="line-clamp-5">
                        {study.description}
                      </Text>
                    </div>

                    <div className="flex items-center gap-2 mt-6 text-gold-500 group-hover:text-olive-900 transition-colors font-semibold">
                      Read More
                      <ChevronRight size={18} />
                    </div>
                  </Card>
                </button>
              )
            })}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Schema Markup for AI/SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Table",
          "name": "2024-2025 Serve Funding Results",
          "description": "Structured data of funding transactions facilitated by Serve Funding across multiple industries",
          "rows": fundingCases.map(result => ({
            "@type": "TableRow",
            "cells": [
              { "@type": "TableCell", "text": result.industry },
              { "@type": "TableCell", "text": result.fundingType },
              { "@type": "TableCell", "text": result.amount },
              { "@type": "TableCell", "text": result.challengeResolved },
              { "@type": "TableCell", "text": result.timeline }
            ]
          }))
        })}
      </script>

      {/* Review Schemas for Each Case Study */}
      {fundingCases.map((caseStudy, index) => (
        <SchemaRenderer
          key={index}
          schema={getReviewSchema({
            companyName: caseStudy.company,
            title: caseStudy.title,
            description: caseStudy.description,
            fullStory: caseStudy.fullStory,
            amount: caseStudy.amount,
            ratingValue: 5
          })}
        />
      ))}

      {/* Contact Section */}
      <CTA
        title="Ready to explore your financing options?"
        text="Let's discuss how we can help your business grow with the right working capital solution."
        buttonText="Let's Talk!"
      />

      {/* Case Study Modal */}
      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        caseStudy={selectedStudy}
      />
    </div>
  )
}
