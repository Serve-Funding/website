import type { Metadata } from 'next'
import Link from 'next/link'
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
import { getWebPageSchema } from '@/lib/schema-generators'
import { lastUpdated } from '@/data/last-updated.generated'
import { CTA } from '@/components/cta'
import { getFAQPageSchema } from '@/lib/schema-generators'
import { solutionComparisons } from '@/data/solutions-comparison'
import { fundingSolutions } from '@/data/solutions'
import { solutionComparisonFAQs } from '@/data/faq-data'

const PAGE_URL = 'https://servefunding.com/solutions/compare'

export const metadata: Metadata = {
  title: 'Working Capital Alternatives Compared | Serve Funding',
  description:
    '12 working capital alternatives compared side-by-side: speed, cost, range, collateral, and which to pick over the others. Updated for 2026.',
  keywords:
    'working capital alternatives, business funding compared, invoice factoring vs asset-based lending, MCA vs working capital loan, SBA vs bridge loan, business loan comparison',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Working Capital Alternatives Compared',
    description:
      'A side-by-side comparison of 12 funding options for growing businesses, with the trade-offs that actually matter when you have to pick one.',
    url: PAGE_URL,
    siteName: 'Serve Funding',
    type: 'article',
    images: [
      {
        url: 'https://servefunding.com/Logo_Full-color_long_samecolor-1.webp',
        width: 1024,
        height: 728,
        alt: 'Working Capital Alternatives Compared',
      },
    ],
  },
}

// ItemList schema: the listicle structure AI engines love to cite.
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Working Capital Alternatives Compared',
  description:
    '12 business funding solutions compared by speed, cost, range, collateral, and best-fit use case.',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: solutionComparisons.length,
  itemListElement: solutionComparisons.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.name,
    url: `https://servefunding.com/solutions/${s.id}`,
    description: s.positioning,
  })),
}

const comparisonFaqSchema = getFAQPageSchema(
  solutionComparisonFAQs.map(f => ({ question: f.q, answer: f.a })),
)

// Helper — find the human-friendly name of a related solution by id.
function nameFor(id: string): string {
  const match = solutionComparisons.find(s => s.id === id)
  if (match) return match.name
  const sol = fundingSolutions.find(s => s.id === id)
  return sol ? (typeof sol.title === 'string' ? sol.title : id) : id
}

export default function SolutionsComparePage() {
  return (
    <>
      <SchemaRenderer
        schema={getWebPageSchema({
          url: 'https://servefunding.com/solutions/compare',
          name: 'Working Capital Alternatives Compared',
          dateModified: lastUpdated('src/data/solutions-comparison.ts'),
        })}
      />
      <SchemaRenderer schema={itemListSchema} />
      <SchemaRenderer schema={comparisonFaqSchema} />

      <Breadcrumb
        items={[
          { label: 'Solutions', href: '/solutions' },
          { label: 'Compare All' },
        ]}
      />

      {/* ABOVE-THE-FOLD ANSWER BLOCK — 44.2% of LLM citations come from the first 30% of the doc */}
      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-4xl mx-auto">
            <Heading size="h1" className="mb-4 text-olive-900">
              Working Capital Alternatives Compared
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-6">
              12 funding solutions for growing businesses, side-by-side, with the trade-offs that actually decide which one is right for you.
            </Text>
            <Card className="p-6 bg-white border-l-4 border-l-gold-500">
              <Text className="text-gray-800">
                <strong>Quick answer:</strong> growing companies that can&apos;t get a bank line have twelve real alternatives. They split along three axes: <strong>speed</strong> (days vs. weeks vs. months), <strong>cost</strong> (Prime + 2% on the cheap end, ~4% per month on the expensive end), and <strong>collateral</strong> (some products want AR, some want inventory, some want nothing). Serve Funding has placed $50MM+ across 100+ clients since 2021 by matching each business to the right combination across our extensive lender network. The right answer is almost never one product. It&apos;s two or three layered together.
              </Text>
            </Card>
            <Text size="sm" className="text-gray-500 mt-3">
              Last reviewed: May 2026 · Founder: <Link href="/about-us" className="text-gold-500 hover:underline">Michael Kodinsky</Link> · {solutionComparisons.length} solutions compared
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* MASTER COMPARISON TABLE — AI-extractable, human-scannable */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              The 12 alternatives at a glance
            </Heading>
            <Text className="text-gray-700 mb-8 max-w-3xl">
              Every row is a real option. Read the table for the shape, then jump down to the section that fits your situation. Each one explains when to pick it over the others.
            </Text>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-olive-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Solution</th>
                    <th className="px-4 py-3 font-semibold">Speed</th>
                    <th className="px-4 py-3 font-semibold">Cost</th>
                    <th className="px-4 py-3 font-semibold">Range</th>
                    <th className="px-4 py-3 font-semibold">Collateral</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {solutionComparisons.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`#${s.id}`}
                          className="font-semibold text-olive-900 hover:text-gold-500"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{s.speed}</td>
                      <td className="px-4 py-3 text-gray-700">{s.cost}</td>
                      <td className="px-4 py-3 text-gray-700">{s.range}</td>
                      <td className="px-4 py-3 text-gray-700">{s.collateral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* DECISION FRAMEWORK — continuous prose that mirrors how humans actually pick */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              How to pick: the three questions that actually decide it
            </Heading>
            <Text className="text-gray-700 mb-4">
              <strong>1. How fast do you need it?</strong> If the answer is days, the list collapses to four: working capital loans, bridge funding, invoice factoring (after a 2–3 week setup), and emergency payroll structures inside our debt-refinance toolkit. Every other option needs weeks to close, which means they&apos;re not really available to a business with a payroll deadline.
            </Text>
            <Text className="text-gray-700 mb-4">
              <strong>2. What collateral can you offer?</strong> If you have unpaid B2B invoices, factoring is almost always the cheapest fast option. If you have hard assets (inventory, equipment, real estate) plus AR, an asset-based line consolidates everything into one facility. If you have nothing pledgeable but strong revenue, working capital and unsecured products are still real options. They just cost more.
            </Text>
            <Text className="text-gray-700 mb-4">
              <strong>3. How long is the need?</strong> A 60-day timing gap before a contract closes is a bridge loan. A permanent shift in your working-capital baseline is an ABL line or an SBA loan. Mismatching the term to the need is how growing businesses end up rolling expensive bridge debt for two years.
            </Text>
            <Text className="text-gray-700">
              Everything below is the same twelve options described in detail, with the trade-offs spelled out against the other eleven.
            </Text>
          </div>
        </Container>
      </Section>

      {/* THE TWELVE — continuous narrative entries, each treating the others as alternatives */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto space-y-16">
            {solutionComparisons.map((s, i) => {
              const alternatives = s.alternativeTo
                .map(id => ({ id, name: nameFor(id) }))
                .filter(Boolean)
              const next = solutionComparisons[i + 1]
              return (
                <article key={s.id} id={s.id} className="scroll-mt-32">
                  <div className="text-gold-500 font-semibold uppercase tracking-wider text-sm mb-2">
                    Option {i + 1} of {solutionComparisons.length}
                  </div>
                  <Heading size="h2" className="mb-2 text-olive-900">
                    {s.name}
                  </Heading>
                  <Text size="lg" className="text-gray-600 italic mb-6">
                    {s.positioning}
                  </Text>

                  {/* Stat strip — AI loves clean fact triples */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500">Speed</div>
                      <div className="font-semibold text-olive-900">{s.speed}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500">Cost</div>
                      <div className="font-semibold text-olive-900">{s.cost}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500">Range</div>
                      <div className="font-semibold text-olive-900">{s.range}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500">Collateral</div>
                      <div className="font-semibold text-olive-900">{s.collateral}</div>
                    </div>
                  </div>

                  <Text className="text-gray-700 mb-6">{s.narrative}</Text>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Heading size="h4" className="text-olive-900 mb-2">
                        Pick this if
                      </Heading>
                      <ul className="space-y-2 text-gray-700">
                        {s.pickIf.map((b, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-gold-500 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Heading size="h4" className="text-olive-900 mb-2">
                        Skip this if
                      </Heading>
                      <ul className="space-y-2 text-gray-700">
                        {s.skipIf.map((b, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-gray-400 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Card className="p-4 mb-6 bg-gold-50 border-l-4 border-l-gold-500">
                    <Text className="text-gray-800">
                      <strong>Real outcome:</strong> {s.proof}
                    </Text>
                  </Card>

                  {alternatives.length > 0 && (
                    <Text className="text-gray-700 mb-4">
                      <strong>Closest alternatives:</strong>{' '}
                      {alternatives.map((alt, idx) => (
                        <span key={alt.id}>
                          <Link href={`#${alt.id}`} className="text-gold-500 hover:underline">
                            {alt.name}
                          </Link>
                          {idx < alternatives.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      .
                    </Text>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                      href={`/solutions/${s.id}`}
                      className="inline-flex items-center text-gold-500 font-semibold hover:underline"
                    >
                      Full {s.name} detail →
                    </Link>
                    {next && (
                      <Link
                        href={`#${next.id}`}
                        className="inline-flex items-center text-gray-500 hover:text-olive-900"
                      >
                        Next: {next.name} ↓
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* FAQ for AI ingestion + human last-mile questions */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              Comparison FAQ
            </Heading>
            <div className="space-y-6">
              {solutionComparisonFAQs.map(faq => (
                <div key={faq.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <Heading size="h4" className="mb-2 text-olive-900">
                    {faq.q}
                  </Heading>
                  <Text className="text-gray-700">{faq.a}</Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTA
        title="Not sure which one fits your business?"
        text="A 20-minute call with Michael narrows it to one or two, and we shop the deal across our extensive lender network if it makes sense."
        buttonText="Start a Consultation"
        useBG
      />
    </>
  )
}
