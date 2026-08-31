import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Heading, Text, Card, FadeIn } from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { CTA } from '@/components/cta'
import { fundingPages } from '@/data/funding-pages'

export const metadata: Metadata = {
  title: 'Funding by Problem | Serve Funding',
  description: 'Start from the problem rather than the product. Direct answers on MCA consolidation, C&I bridges, purchase orders and asset-based lending by industry.',
  alternates: { canonical: 'https://servefunding.com/funding' },
}

export default function FundingIndexPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Funding' }]} />

      <Section className="pt-28 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-3xl mx-auto">
            <Heading size="h1" className="mb-4 text-olive-900">
              Funding, Starting From the Problem
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-4">
              Most financing pages explain a product. These start from what has gone wrong
              and name the number.
            </Text>
            <Text className="text-gray-600">
              Each page answers one expensive problem directly: what it costs, how long it
              takes, what underwriting needs to see, and when the honest answer is that this
              is not the right tool. Our sweet spot is $5MM to $50MM in revenue on asks
              between $250K and $5MM, and we work meaningfully smaller and larger than that.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-4">
            {fundingPages.map(page => (
              <Link key={page.id} href={`/funding/${page.id}`} className="block">
                <Card padding="md" className="border-2 border-gray-200 group">
                  <Heading
                    size="h3"
                    className="mb-2 text-olive-900 group-hover:text-gold-500 transition-colors"
                  >
                    {page.h1}
                  </Heading>
                  <Text className="text-gray-700">{page.excerpt}</Text>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Not sure which one you are looking at?"
        text="Answer a few questions and we will tell you what fits, including when the answer is not us."
        buttonText="See What You Qualify For"
        href="/discover?src=funding-index"
        useBG
      />
    </>
  )
}
