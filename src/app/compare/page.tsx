import type { Metadata } from 'next'
import Link from 'next/link'
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
import { comparisons } from '@/data/comparisons'

export const metadata: Metadata = {
  title: 'Head-to-Head Funding Comparisons | Serve Funding',
  description:
    'Side-by-side comparisons of the most common business-financing decisions: factoring vs ABL, SBA vs working capital, bridge vs term, and more.',
  alternates: { canonical: 'https://servefunding.com/compare' },
  openGraph: {
    title: 'Head-to-Head Funding Comparisons',
    description:
      'Plain-English comparisons of common business-financing decisions, with the math, the trade-offs, and when each one fits.',
    url: 'https://servefunding.com/compare',
    siteName: 'Serve Funding',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/Logo_Full-color_long_samecolor-1.webp',
        width: 1024,
        height: 728,
        alt: 'Funding Comparisons',
      },
    ],
  },
}

export default function CompareIndexPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Compare' }]} />

      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Heading size="h1" className="mb-4 text-olive-900">
              Head-to-Head Funding Comparisons
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-3">
              The trade-offs you&apos;re actually weighing — spelled out side by side.
            </Text>
            <Text className="text-gray-600">
              Each comparison walks through the structural difference, when each
              option fits, what it costs, and how Michael Kodinsky thinks about the
              decision after 15+ years arranging both. For a full side-by-side of
              all 12 funding alternatives, see the{' '}
              <Link
                href="/solutions/compare"
                className="text-gold-500 hover:underline"
              >
                solutions comparison
              </Link>
              .
            </Text>
          </FadeIn>
        </Container>
      </Section>

      <Section className="py-12 bg-white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {comparisons.map(c => (
              <Link key={c.id} href={`/compare/${c.id}`} className="group">
                <Card padding="md" className="border-2 border-gray-200">
                  <Heading
                    size="h3"
                    className="mb-2 text-olive-900 group-hover:text-gold-500 transition-colors"
                  >
                    {c.productA.name} vs {c.productB.name}
                  </Heading>
                  <Text size="sm" className="text-gray-600 mb-3">
                    {c.subtitle}
                  </Text>
                  <Text size="sm" className="text-gray-700">
                    {c.excerpt}
                  </Text>
                  <div className="mt-4 text-gold-500 font-semibold text-sm">
                    Read comparison →
                  </div>
                </Card>
              </Link>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      <CTA
        title="Not sure which comparison fits your situation?"
        text="A 20-minute call: we listen to where you are, then point you to the right path — comparison or not."
        buttonText="Start a Conversation"
        useBG
      />
    </>
  )
}
