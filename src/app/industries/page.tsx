import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Section,
  Container,
  Heading,
  Text,
  FadeIn,
  Card,
  StaggerContainer,
} from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { CTA } from '@/components/cta'
import { industries } from '@/data/industries'

export const metadata: Metadata = {
  title: 'Funding by Industry | Serve Funding',
  description:
    'Industry-specific funding guides for staffing, healthcare, manufacturing, government contractors, construction, and e-commerce businesses.',
  alternates: { canonical: 'https://servefunding.com/industries' },
  openGraph: {
    title: 'Funding by Industry',
    description:
      'How working-capital funding actually works in your industry: recommended products, common challenges, and what doesn&apos;t fit.',
    url: 'https://servefunding.com/industries',
    siteName: 'Serve Funding',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/Logo_Full-color_long_samecolor-1.webp',
        width: 1024,
        height: 728,
        alt: 'Funding by Industry',
      },
    ],
  },
}

export default function IndustriesIndexPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Industries' }]} />

      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Heading size="h1" className="mb-4 text-olive-900">
              Funding by Industry
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-3">
              Each industry has its own cash-flow shape, and a different right answer.
            </Text>
            <Text className="text-gray-600">
              These guides walk through the funding products that actually fit each industry, with the math, the trade-offs, and what doesn&apos;t typically work. Serve Funding is channel-neutral and product-neutral. We shop the deal across an extensive lender network to find what fits, regardless of industry.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-12 bg-white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {industries.map(ind => (
              <Link key={ind.id} href={`/industries/${ind.id}`} className="group">
                <Card className="overflow-hidden">
                  {ind.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={ind.image}
                        alt={ind.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <Heading
                      size="h3"
                      className="mb-2 text-olive-900 group-hover:text-gold-500 transition-colors"
                    >
                      {ind.name}
                    </Heading>
                    <Text size="sm" className="text-gray-700 mb-3">
                      {ind.hook}
                    </Text>
                    <div className="text-gold-500 font-semibold text-sm">
                      Read the guide →
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      <CTA
        title="Don't see your industry?"
        text="We work with growing businesses across every industry. A 20-minute call surfaces the right fit even when your industry isn&apos;t listed."
        buttonText="Start a Conversation"
        useBG
      />
    </>
  )
}
