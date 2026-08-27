import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Section,
  Container,
  Heading,
  Text,
  Card,
  Button,
  FadeIn,
} from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { CTA } from '@/components/cta'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { getFinancialServiceSchema } from '@/lib/schema-generators'
import { getFundingPage, getFundingPageIds, type FundingPage } from '@/data/funding-pages'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getFundingPageIds().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getFundingPage(slug)
  if (!page) return { title: 'Not Found | Serve Funding' }

  const url = `https://servefunding.com/funding/${page.id}`
  return {
    title: `${page.title} | Serve Funding`,
    description: page.excerpt,
    openGraph: {
      title: page.title,
      description: page.excerpt,
      url,
      type: 'article',
    },
    alternates: { canonical: url },
  }
}

/** The one entry point into the qualifying funnel. `src` is carried for attribution. */
function funnelHref(page: FundingPage) {
  return `/discover?src=${page.id}`
}

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params
  const page = getFundingPage(slug)
  if (!page) notFound()

  return (
    <>
      <SchemaRenderer
        schema={getFinancialServiceSchema({
          id: page.id,
          title: page.h1,
          shortDesc: page.excerpt,
          fullDesc: page.directAnswer,
          features: page.terms.map(t => `${t.label}: ${t.value}`),
          url: `https://servefunding.com/funding/${page.id}`,
          ratesAndTerms: {
            minAmount: page.schema.minAmount,
            maxAmount: page.schema.maxAmount,
            interestRate: page.schema.rate,
            closingTime: page.schema.closingTime,
          },
        })}
      />

      <Breadcrumb
        items={[
          { label: 'Funding', href: '/funding' },
          { label: page.title },
        ]}
      />

      {/* Hero: the question, the answer, and the way in */}
      <Section className="pt-28 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-4xl mx-auto">
            <Heading size="h1" className="mb-6 text-olive-900">
              {page.h1}
            </Heading>
            <Card padding="md" noHover className="border-l-4 border-l-gold-500 mb-8">
              <Text size="lg" className="text-gray-800">
                {page.directAnswer}
              </Text>
            </Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href={funnelHref(page)}>
                <Button variant="gold" size="lg">
                  See What You Qualify For
                </Button>
              </Link>
              <Text size="sm" className="text-gray-600">
                A few questions, no credit pull, no obligation. Or call{' '}
                <a href="tel:+17708207409" className="font-semibold text-olive-900 hover:underline">
                  770-820-7409
                </a>
                .
              </Text>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Qualifying gate — stated where nobody can miss it */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-4 text-olive-900">
              Who this is for
            </Heading>
            <Text className="text-gray-600 mb-6">
              Serve works with companies doing $5MM to $50MM in revenue on asks between
              $250K and $5MM. Being specific about that up front saves everyone a call.
            </Text>
            <ul className="space-y-3 text-gray-700">
              {page.fitsIf.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-gold-500 font-bold flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* The problem, in the reader's words */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              What is actually going on
            </Heading>
            <Text className="text-gray-700 whitespace-pre-line">
              {page.theProblem}
            </Text>
          </div>
        </Container>
      </Section>

      {/* Mechanics */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              How it works
            </Heading>
            <div className="space-y-4">
              {page.howItWorks.map((s, i) => (
                <Card key={i} padding="md" noHover>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-gold-500 font-bold text-sm">{i + 1}</span>
                    <Heading size="h4" className="text-olive-900">
                      {s.step}
                    </Heading>
                  </div>
                  <Text className="text-gray-700">{s.detail}</Text>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Terms — the quotable block */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              Terms, costs and timelines
            </Heading>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {page.terms.map((t, i) => (
                    <tr key={i} className="border-b border-gray-200 align-top">
                      <th scope="row" className="py-3 pr-6 font-semibold text-olive-900 w-1/3">
                        {t.label}
                      </th>
                      <td className="py-3 text-gray-700">{t.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* Positioning */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              {page.versus.heading}
            </Heading>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="py-3 pr-4 font-semibold text-olive-900 w-1/4" />
                    <th className="py-3 pr-4 font-semibold text-gray-600">
                      {page.versus.theirsLabel}
                    </th>
                    <th className="py-3 font-semibold text-olive-900">
                      {page.versus.oursLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.versus.rows.map((r, i) => (
                    <tr key={i} className="border-b border-gray-200 align-top">
                      <th scope="row" className="py-3 pr-4 font-semibold text-olive-900">
                        {r.dimension}
                      </th>
                      <td className="py-3 pr-4 text-gray-600">{r.theirs}</td>
                      <td className="py-3 text-gray-800">{r.ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* Worked example */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              How this plays out, with numbers
            </Heading>
            <Text className="text-gray-700 whitespace-pre-line">
              {page.workedExample}
            </Text>
            <Text size="sm" className="text-gray-500 mt-6 italic">
              A representative structure, sized to a typical file. Details are generalized —
              we do not publish client specifics.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Honest deflection */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-4 text-olive-900">
              When this is the wrong answer
            </Heading>
            <Text className="text-gray-600 mb-6">
              Half of being useful is being clear about what does not work. If one of these
              describes you, the honest path is below — and it may not run through us.
            </Text>
            <div className="space-y-4">
              {page.notFor.map((item, i) => (
                <Card key={i} padding="md" noHover>
                  <div className="font-semibold text-olive-900 mb-1">{item.who}</div>
                  <Text size="sm" className="text-gray-700">
                    {item.instead}
                  </Text>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <FAQSectionWithSchema
        title="Questions we get asked on this"
        faqs={page.faqs.map(f => ({ q: f.question, a: f.answer }))}
        background="white"
        showTease
        schemaName={page.title}
      />

      {/* Go deeper */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h3" className="mb-4 text-olive-900">
              Go deeper
            </Heading>
            <ul className="space-y-2">
              {page.related.map((r, i) => (
                <li key={i}>
                  <Link
                    href={r.href}
                    className="text-olive-900 hover:text-gold-500 transition-colors underline decoration-gold-500/40"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CTA
        title="Capital That Serves You"
        text="Tell us what you are working with and we will tell you what fits — including when the answer is not us."
        buttonText="See What You Qualify For"
        href={funnelHref(page)}
        useBG
      />
    </>
  )
}
