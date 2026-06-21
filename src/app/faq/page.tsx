import type { Metadata } from 'next'
import FAQClient, { type FAQSection } from './faq-client'
import { Section, Container, Heading, Text, FadeIn } from '@/components/ui'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { Breadcrumb } from '@/components/breadcrumb'
import { getFAQPageSchema } from '@/lib/schema-generators'
import {
  topLevelFAQs,
  aboutServeFundingFAQs,
  workingCapitalFAQs,
  solutionSpecificFAQs,
  solutionComparisonFAQs,
} from '@/data/faq-data'
import type { FAQ } from '@/types/faq'

export const metadata: Metadata = {
  title: 'Working Capital FAQ | Answers When Banks Decline Your Loan',
  description: 'Get quick answers to funding questions. How fast can you approve? What if banks declined me? How does invoice factoring work? Find answers here.',
  keywords: 'FAQ, working capital questions, when banks say no, invoice factoring, asset-based lending, business funding FAQ',
  alternates: { canonical: 'https://servefunding.com/faq' },
  openGraph: {
    title: 'Working Capital FAQ | Answers When Banks Decline Your Loan',
    description: 'Questions about working capital, alternative lending, or how fast you can get approved? See real answers to common funding questions from Serve Funding.',
    url: 'https://servefunding.com/faq',
    siteName: 'Serve Funding',
    type: 'website',
    images: [
      {
        url: "https://servefunding.com/Logo_Full-color_long_samecolor-1.webp",
        width: 1024,
        height: 728,
        alt: "FAQ - Frequently Asked Questions",
      },
    ],
  },
}

const toQA = (f: FAQ) => ({ question: f.q, answer: f.a })

// Dedupe by question text — some FAQ slices repeat the same question slightly differently;
// keep the first occurrence to keep schema clean for AI ingestion.
function dedupe(faqs: Array<{ question: string; answer: string }>) {
  const seen = new Set<string>()
  return faqs.filter(f => {
    const key = f.question.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const sections: FAQSection[] = [
  {
    title: 'Top Questions',
    description: 'The questions we get asked most often when business owners first reach out.',
    faqs: dedupe(topLevelFAQs.map(toQA)),
  },
  {
    title: 'About Serve Funding',
    description: 'How we work, what makes us different, and why bankers refer to us.',
    faqs: dedupe(aboutServeFundingFAQs.map(toQA)),
  },
  {
    title: 'Working Capital, MCA & Refinancing',
    description: 'Costs, timelines, and how to escape expensive debt structures.',
    faqs: dedupe(workingCapitalFAQs.map(toQA)),
  },
  {
    title: 'Funding Solutions in Detail',
    description: 'Product-specific questions across our 12 funding solutions.',
    faqs: dedupe(solutionSpecificFAQs.map(toQA)),
  },
  {
    title: 'Comparing Your Options',
    description: 'How to pick between alternatives when you have more than one path.',
    faqs: dedupe(solutionComparisonFAQs.map(toQA)),
  },
]

// FAQPage schema with EVERY question — major GEO win vs. previous 14-question slice.
const allFaqsForSchema = dedupe(sections.flatMap(s => s.faqs))
const faqSchema = getFAQPageSchema(allFaqsForSchema)

export default function FAQ() {
  return (
    <>
      <SchemaRenderer schema={faqSchema} />

      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="text-center mb-12">
            <Heading size="h1" className="mb-4 text-olive-900">
              Frequently Asked Questions
            </Heading>
            <Text size="2xl" className="text-gray-700 max-w-3xl mx-auto">
              {allFaqsForSchema.length}+ answers on working capital, alternative lending, and what to do when banks decline you.
            </Text>
            <Text size="sm" className="text-gray-400 mt-3">
              Looking for a side-by-side comparison? See{' '}
              <a href="/solutions/compare" className="text-gold-500 hover:underline">
                all 12 funding solutions compared
              </a>
              .
            </Text>
          </FadeIn>
        </Container>
      </Section>

      <FAQClient sections={sections} />
    </>
  )
}
