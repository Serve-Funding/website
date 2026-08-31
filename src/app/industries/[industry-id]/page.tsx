import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
import { CTA } from '@/components/cta'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { getIndustry, getIndustryIds } from '@/data/industries'
import { fundingSolutions } from '@/data/solutions'
import { fundingCases } from '@/data/fundingData'
import { getTitleAsString } from '@/lib/solution-helpers'

interface Props {
  params: Promise<{ 'industry-id': string }>
}

export async function generateStaticParams() {
  return getIndustryIds().map(id => ({ 'industry-id': id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'industry-id': id } = await params
  const ind = getIndustry(id)
  if (!ind) return { title: 'Industry Not Found | Serve Funding' }

  return {
    title: `${ind.title} | Serve Funding`,
    description: ind.excerpt,
    openGraph: {
      title: ind.title,
      description: ind.excerpt,
      url: `https://servefunding.com/industries/${ind.id}`,
      type: 'article',
      images: [
        {
          url: `https://servefunding.com${ind.image}`,
          width: 1024,
          height: 728,
          alt: ind.name,
        },
      ],
    },
    alternates: { canonical: `https://servefunding.com/industries/${ind.id}` },
  }
}

function nameFor(solutionId: string): string {
  const s = fundingSolutions.find(x => x.id === solutionId)
  return s ? getTitleAsString(s.title) : solutionId
}

export default async function IndustryPage({ params }: Props) {
  const { 'industry-id': id } = await params
  const ind = getIndustry(id)
  if (!ind) notFound()

  const matchedCase = ind.publicCaseStudyTitle
    ? fundingCases.find(c => c.title === ind.publicCaseStudyTitle)
    : undefined

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Industries', href: '/industries' },
          { label: ind.name },
        ]}
      />

      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-4xl mx-auto">
            <Heading size="h1" className="mb-4 text-olive-900">
              {ind.title}
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-6">
              {ind.hook}
            </Text>
            <Card padding="md" noHover className="border-l-4 border-l-gold-500">
              <Text className="text-gray-800 whitespace-pre-line">
                {ind.introduction}
              </Text>
            </Card>
          </FadeIn>
        </Container>
      </Section>

      {ind.image && (
        <Section className="py-8 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg relative h-80">
              <Image
                src={ind.image}
                alt={ind.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* Industry-specific challenges */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              The cash-flow challenges {ind.name.toLowerCase()} actually face
            </Heading>
            <ul className="space-y-3 text-gray-700">
              {ind.challenges.map((ch, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-gold-500 font-bold flex-shrink-0">•</span>
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Recommended solutions, ranked */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              What usually fits, ranked
            </Heading>
            <div className="space-y-4">
              {ind.recommendedSolutions
                .slice()
                .sort((a, b) => a.rank - b.rank)
                .map(rec => (
                  <Link
                    key={rec.solutionId}
                    href={`/solutions/${rec.solutionId}`}
                    className="block"
                  >
                    <Card padding="md" className="border-2 border-gray-200 group">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-gold-500 font-bold text-sm">
                          #{rec.rank}
                        </span>
                        <Heading
                          size="h3"
                          className="text-olive-900 group-hover:text-gold-500 transition-colors"
                        >
                          {nameFor(rec.solutionId)}
                        </Heading>
                      </div>
                      <Text className="text-gray-700">{rec.why}</Text>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Worked example */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              How this plays out in practice
            </Heading>
            <Text className="text-gray-700 whitespace-pre-line">
              {ind.workedExample}
            </Text>

            {matchedCase && (
              <Card padding="md" noHover className="mt-8 bg-gold-50 border-l-4 border-l-gold-500">
                <Heading size="h4" className="mb-2 text-olive-900">
                  Public case study: {matchedCase.title}, {matchedCase.amount}
                </Heading>
                <Text size="sm" className="text-gray-700 mb-2">
                  {matchedCase.description}
                </Text>
                <Link
                  href="/fundings"
                  className="text-gold-500 font-semibold text-sm hover:underline"
                >
                  See full case study →
                </Link>
              </Card>
            )}
          </div>
        </Container>
      </Section>

      {/* Mike quotes */}
      {ind.mikeQuotes.length > 0 && (
        <Section className="py-12 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Heading size="h2" className="mb-6 text-olive-900">
                How Michael thinks about {ind.name.toLowerCase()}
              </Heading>
              <div className="space-y-6">
                {ind.mikeQuotes.map((q, i) => (
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
      )}

      {/* What doesn't fit (honest deflection) */}
      {ind.whatDoesntFit.length > 0 && (
        <Section className="py-12 bg-gray-50">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Heading size="h2" className="mb-4 text-olive-900">
                What doesn&apos;t usually fit (and why)
              </Heading>
              <Text className="text-gray-600 mb-6">
                Half of being useful is being honest about what doesn&apos;t work.
                These are products we generally don&apos;t recommend for{' '}
                {ind.name.toLowerCase()}, and the reason.
              </Text>
              <div className="space-y-4">
                {ind.whatDoesntFit.map((item, i) => (
                  <Card key={i} padding="sm" noHover>
                    <div className="font-semibold text-olive-900 mb-1">
                      {nameFor(item.solutionId)}
                    </div>
                    <Text size="sm" className="text-gray-700">
                      {item.why}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* FAQ */}
      <FAQSectionWithSchema
        title={`Common questions from ${ind.name.toLowerCase()}`}
        faqs={ind.faqs.map(f => ({ q: f.question, a: f.answer }))}
        background="white"
        showTease
        schemaName={ind.name}
      />

      <CTA
        title={`Ready to talk about your business?`}
        text="A 20-minute conversation: we listen, we ask the questions that matter for your industry, and we tell you what fits, even if it isn&apos;t us."
        buttonText="Start a Conversation"
        useBG
      />
    </>
  )
}
