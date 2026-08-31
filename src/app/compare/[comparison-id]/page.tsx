import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Section,
  Container,
  Heading,
  Text,
  FadeIn,
  Card,
} from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { lastUpdated } from '@/data/last-updated.generated'
import { CTA } from '@/components/cta'
import { getFAQPageSchema, getWebPageSchema } from '@/lib/schema-generators'
import {
  comparisons,
  getComparison,
  getComparisonIds,
} from '@/data/comparisons'

interface Props {
  params: Promise<{ 'comparison-id': string }>
}

export async function generateStaticParams() {
  return getComparisonIds().map(id => ({ 'comparison-id': id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'comparison-id': id } = await params
  const c = getComparison(id)
  if (!c) return { title: 'Comparison Not Found | Serve Funding' }

  return {
    title: `${c.title} | Serve Funding`,
    description: c.excerpt,
    openGraph: {
      title: c.title,
      description: c.excerpt,
      url: `https://servefunding.com/compare/${c.id}`,
      type: 'article',
      images: [
        {
          url: 'https://servefunding.com/Logo_Full-color_long_samecolor-1.webp',
          width: 1024,
          height: 728,
          alt: c.title,
        },
      ],
    },
    alternates: { canonical: `https://servefunding.com/compare/${c.id}` },
  }
}

export default async function ComparisonPage({ params }: Props) {
  const { 'comparison-id': id } = await params
  const c = getComparison(id)
  if (!c) notFound()

  const faqSchema = getFAQPageSchema(c.faqs)

  // ItemList schema treating the two products as compared items — gets cited
  // when AI engines answer "X vs Y" queries.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    description: c.excerpt,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: c.productA.name,
        description: c.productA.positioning,
        url: c.productA.solutionId
          ? `https://servefunding.com/solutions/${c.productA.solutionId}`
          : undefined,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: c.productB.name,
        description: c.productB.positioning,
        url: c.productB.solutionId
          ? `https://servefunding.com/solutions/${c.productB.solutionId}`
          : undefined,
      },
    ],
  }

  return (
    <>
      <SchemaRenderer
        schema={getWebPageSchema({
          url: `https://servefunding.com/compare/${c.id}`,
          name: c.title,
          description: c.excerpt,
          dateModified: lastUpdated('src/data/comparisons.ts'),
        })}
      />
      <SchemaRenderer schema={itemListSchema} />
      <SchemaRenderer schema={faqSchema} />

      <Breadcrumb
        items={[
          { label: 'Compare', href: '/compare' },
          { label: c.title },
        ]}
      />

      {/* Above-the-fold answer block — first 30% citation real estate */}
      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-4xl mx-auto">
            <Heading size="h1" className="mb-4 text-olive-900">
              {c.title}
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-6">
              {c.subtitle}
            </Text>
            <Card padding="md" noHover className="border-l-4 border-l-gold-500">
              <Text className="text-gray-800 whitespace-pre-line">
                {c.introduction}
              </Text>
            </Card>
          </FadeIn>
        </Container>
      </Section>

      {/* Quick-spec table — both products side by side */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              {c.productA.name} vs {c.productB.name} at a glance
            </Heading>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-olive-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Feature</th>
                    <th className="px-4 py-3 font-semibold">{c.productA.name}</th>
                    <th className="px-4 py-3 font-semibold">{c.productB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-olive-900">Speed</td>
                    <td className="px-4 py-3 text-gray-700">{c.productA.speed}</td>
                    <td className="px-4 py-3 text-gray-700">{c.productB.speed}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-olive-900">Cost</td>
                    <td className="px-4 py-3 text-gray-700">{c.productA.cost}</td>
                    <td className="px-4 py-3 text-gray-700">{c.productB.cost}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-olive-900">Range</td>
                    <td className="px-4 py-3 text-gray-700">{c.productA.range}</td>
                    <td className="px-4 py-3 text-gray-700">{c.productB.range}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-olive-900">Collateral</td>
                    <td className="px-4 py-3 text-gray-700">{c.productA.collateral}</td>
                    <td className="px-4 py-3 text-gray-700">{c.productB.collateral}</td>
                  </tr>
                  {c.featureRows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-olive-900">{row.feature}</td>
                      <td className="px-4 py-3 text-gray-700">{row.productA}</td>
                      <td className="px-4 py-3 text-gray-700">{row.productB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* When to pick A */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-2 text-olive-900">
              When to pick {c.productA.name}
            </Heading>
            <Text size="lg" className="text-gray-600 italic mb-6">
              {c.productA.positioning}
            </Text>
            <Text className="text-gray-700 mb-6 whitespace-pre-line">
              {c.whenToPickA.narrative}
            </Text>
            <ul className="space-y-2 text-gray-700 mb-6">
              {c.whenToPickA.bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {c.productA.solutionId && (
              <Link
                href={`/solutions/${c.productA.solutionId}`}
                className="text-gold-500 font-semibold hover:underline"
              >
                Full {c.productA.name} detail →
              </Link>
            )}
          </div>
        </Container>
      </Section>

      {/* When to pick B */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-2 text-olive-900">
              When to pick {c.productB.name}
            </Heading>
            <Text size="lg" className="text-gray-600 italic mb-6">
              {c.productB.positioning}
            </Text>
            <Text className="text-gray-700 mb-6 whitespace-pre-line">
              {c.whenToPickB.narrative}
            </Text>
            <ul className="space-y-2 text-gray-700 mb-6">
              {c.whenToPickB.bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold-500 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {c.productB.solutionId && (
              <Link
                href={`/solutions/${c.productB.solutionId}`}
                className="text-gold-500 font-semibold hover:underline"
              >
                Full {c.productB.name} detail →
              </Link>
            )}
          </div>
        </Container>
      </Section>

      {/* Worked example */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              A worked example
            </Heading>
            <Text className="text-gray-700 mb-6 whitespace-pre-line">
              <strong>Scenario:</strong> {c.workedExample.scenario}
            </Text>
            <Text className="text-gray-700 mb-6 whitespace-pre-line">
              <strong>How the math works out:</strong> {c.workedExample.math}
            </Text>
            <Card padding="sm" noHover className="bg-gold-50 border-l-4 border-l-gold-500">
              <Text className="text-gray-800">
                <strong>Takeaway:</strong> {c.workedExample.takeaway}
              </Text>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Mike's voice */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              How Michael thinks about it
            </Heading>
            <div className="space-y-6">
              {c.mikeQuotes.map((q, i) => (
                <Card key={i} padding="md" noHover className="bg-gray-50">
                  <Text className="text-gray-800 italic mb-3">
                    &ldquo;{q.quote}&rdquo;
                  </Text>
                  <Text size="sm" className="text-gray-600">
                    — Michael Kodinsky, Founder of Serve Funding
                    {q.context && ` · ${q.context}`}
                  </Text>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              Common questions
            </Heading>
            <div className="space-y-6">
              {c.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <Heading size="h4" className="mb-2 text-olive-900">
                    {faq.question}
                  </Heading>
                  <Text className="text-gray-700 whitespace-pre-line">
                    {faq.answer}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTA
        title="Want a real recommendation for your business?"
        text="A 20-minute call: we look at your numbers, tell you which path fits, and shop the deal across our lender network if it makes sense."
        buttonText="Start a Conversation"
        useBG
      />
    </>
  )
}

// Static list at /compare for SEO + UX. Re-uses the same data set.
export { comparisons }
