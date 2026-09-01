import { fundingSolutions } from '@/data/solutions'
import { getBlogPosts } from '@/lib/blog-utils'
import { solutionSpecificFAQs } from '@/data/faq-data'
import { getFinancialServiceSchema, getHowToSchema, getWebPageSchema } from '@/lib/schema-generators'
import { serveFundingProcess } from '@/data/company-info'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { lastUpdated } from '@/data/last-updated.generated'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getTitleAsString } from '@/lib/solution-helpers'
import {
  Section,
  Container,
  Heading,
  Text,
  Card,
  StaggerContainer
} from '@/components/ui'
import { FeatureList } from '@/components/FeatureList'
import { CTA } from '@/components/cta'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { TermsTable, NotForList, WorkedExample } from '@/components/content-blocks'
import { Breadcrumb } from '@/components/breadcrumb'
import { SolutionDetailClient } from './client'
import type { Metadata } from 'next'

interface SolutionDetailPageProps {
  params: Promise<{
    'solution-id': string
  }>
}

export async function generateMetadata({ params }: SolutionDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const solution = fundingSolutions.find(s => s.id === resolvedParams['solution-id'])

  if (!solution) {
    return {
      title: 'Solution Not Found | Serve Funding',
    }
  }

  const titleStr = getTitleAsString(solution.title)
  // Use seoTitle for search results if available, otherwise use regular title
  const metaTitle = solution.seoTitle ? solution.seoTitle : titleStr

  return {
    title: `${metaTitle} | Serve Funding`,
    description: solution.shortDesc,
    alternates: { canonical: `https://servefunding.com/solutions/${solution.id}` },
    openGraph: {
      title: `${metaTitle} | Serve Funding`,
      description: solution.shortDesc,
      url: `https://servefunding.com/solutions/${solution.id}`,
      type: 'website',
      images: [
        {
          url: `https://servefunding.com/solutions/${solution.image.split('/').pop()}`,
          width: 1024,
          height: 728,
          alt: titleStr,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  return fundingSolutions.map((solution) => ({
    'solution-id': solution.id,
  }))
}

export default async function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const resolvedParams = await params
  const solution = fundingSolutions.find(s => s.id === resolvedParams['solution-id'])

  if (!solution) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Schemas */}
      <SchemaRenderer
        schemas={[
          getWebPageSchema({
            url: `https://servefunding.com/solutions/${solution.id}`,
            name: getTitleAsString(solution.title),
            description: solution.shortDesc,
            dateModified: lastUpdated('src/data/solutions.tsx'),
          }),
          getFinancialServiceSchema({
            id: solution.id,
            title: getTitleAsString(solution.title),
            shortDesc: solution.shortDesc,
            fullDesc: solution.fullDesc,
            features: solution.features,
          }),
          getHowToSchema({
            name: `How to Get ${getTitleAsString(solution.title)} with Serve Funding`,
            description: `Step-by-step process for securing ${getTitleAsString(solution.title).toLowerCase()} through Serve Funding's advisory service.`,
            steps: serveFundingProcess.map(step => ({
              name: step.name,
              description: step.description,
            })),
          }),
        ]}
      />

      <SolutionDetailClient solution={solution}>
        <Breadcrumb items={[
          { label: 'Solutions', href: '/solutions' },
          { label: getTitleAsString(solution.title) }
        ]} />

        {/* Header Section with Image */}
        <Section>
          <Container>
            <div className="max-w-4xl mx-auto">
              <Heading size="h1" className="mb-4">
                {(() => {
                  const titleStr = getTitleAsString(solution.title)
                  const isPlural = titleStr.split(/\s+/).some(w => /s$/.test(w) && !/(ss|us|is)$/i.test(w))
                  return `What ${isPlural ? 'are' : 'is'} ${titleStr}?`
                })()}
              </Heading>

              {/* Solution Image */}
              {solution.image && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg h-80 relative">
                  <Image
                    src={solution.image}
                    alt={getTitleAsString(solution.title)}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Answer Capsule - AI-optimized definition */}
              <div className="p-6 mb-8 rounded-lg bg-gold-light/10 border-l-4 border-olive-green">
                <Text size="lg">
                  {solution.whatIs}
                </Text>
              </div>
            </div>
          </Container>
        </Section>

        {/* Full Description Section */}
        <Section background="gray">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Heading size="h2" className="mb-6">How It Works</Heading>
              <div className="space-y-6">
                {solution.fullDesc.split('\n\n').map(p => p.trim()).filter(Boolean).map((p, i) => (
                  <Text key={i} size="lg">{p}</Text>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Quick Facts Panel */}
        {solution.features && solution.features.length > 0 && (
          <Section>
            <Container>
              <div className="max-w-4xl mx-auto">
                <Heading size="h2" className="mb-6">Quick Facts</Heading>
              </div>
              <div className="max-w-7xl mx-auto">
                {(() => {
                  const facilitySize = solution.features.find(f => f.toLowerCase().includes('size') || f.toLowerCase().includes('amount')) || ''
                  const costOfCapital = solution.features.find(f => f.toLowerCase().includes('cost') || f.toLowerCase().includes('rate')) || ''
                  const fundingTimeline = solution.features.find(f => f.toLowerCase().includes('funding') || f.toLowerCase().includes('timeline')) || ''
                  const bestForList = solution.bestFor || []

                  const scalars = [
                    { label: "Facility / Loan Size", value: facilitySize },
                    { label: "Cost of Capital", value: costOfCapital },
                    { label: "Funding Timeline", value: fundingTimeline },
                  ].filter(s => s.value)

                  // Render as a definition-list "table": label column on the
                  // left, content on the right. On narrow screens it collapses
                  // to a stacked block (label sits above content). Visible
                  // dividers between every row so it reads as a table.
                  // Real HTML table. The browser's table layout guarantees all
                  // rows share the same column widths automatically. Each row
                  // collapses to a stacked block below 640px via max-sm:block.
                  const cellPad = "px-6 py-6 max-sm:px-5 max-sm:py-4"
                  const labelCell = `${cellPad} align-top font-semibold text-olive-900 whitespace-nowrap text-right max-sm:block max-sm:w-full max-sm:text-left max-sm:whitespace-normal max-sm:pb-1`
                  const valueCell = `${cellPad} text-left align-top text-gray-700 leading-relaxed max-sm:block max-sm:w-full max-sm:pt-0`

                  return (
                    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                      <table className="w-full border-collapse max-sm:block">
                        <tbody className="max-sm:block">
                          {scalars.map((item, i) => (
                            <tr key={item.label} className={`max-sm:block ${i > 0 ? 'border-t border-gray-200' : ''}`}>
                              <th scope="row" className={labelCell}>{item.label}</th>
                              <td className={valueCell}>{item.value}</td>
                            </tr>
                          ))}
                          {bestForList.length > 0 && (
                            <tr className={`max-sm:block ${scalars.length > 0 ? 'border-t border-gray-200' : ''}`}>
                              <th scope="row" className={labelCell}>Best For</th>
                              <td className={valueCell}>
                                <ul className="list-disc pl-5 space-y-1.5 marker:text-gold-500">
                                  {bestForList.map((b, j) => (
                                    <li key={j}>{b}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
              </div>
            </Container>
          </Section>
        )}

        {/* Features/Benefits Section */}
        <Section>
          <Container>
            <div className="max-w-4xl mx-auto">
              <Heading size="h2" className="mb-6">Key Features & Benefits</Heading>
              <FeatureList features={solution.features} />
            </div>
          </Container>
        </Section>


        {/* Terms, worked example and deflections. Populated per solution as the
            /funding content is folded in; each renders nothing until its field
            is filled, so partial migration is safe. */}
        <TermsTable terms={solution.terms ?? []} />
        <WorkedExample text={solution.workedExample} />
        <NotForList items={solution.notFor ?? []} />

        {/* FAQ Section - AIEO Optimized */}
        {(() => {
          const relatedFAQs = solutionSpecificFAQs.filter(
            faq => faq.relatedSolutions?.includes(solution.id)
          )
          return relatedFAQs.length > 0 && (
            <FAQSectionWithSchema
              title={`${getTitleAsString(solution.title)} - Common Questions`}
              description={`Get answers to the most common questions about ${getTitleAsString(solution.title).toLowerCase()}`}
              faqs={relatedFAQs}
              background="gray"
              schemaName={getTitleAsString(solution.title)}
            />
          )
        })()}

        {/* CTA Button Section */}
        <CTA
          title="Ready to Get Started?"
          text={`Learn more about ${getTitleAsString(solution.title)} and how it can help your business grow. Schedule a consultation with one of our funding experts today.`}
          buttonText="Let's Talk!"
          useBG
        />


        {/* Related Blog Posts / Case Studies */}
        {(() => {
          const allBlogPosts = getBlogPosts()
          const relatedPosts = allBlogPosts.filter(post =>
            post.relatedSolutions?.includes(solution.id)
          ).slice(0, 3)

          return relatedPosts.length > 0 ? (
            <Section background="gray">
              <Container>
                <div className="max-w-4xl mx-auto">
                  <Heading size="h2" className="mb-4">See It In Action</Heading>
                  <Text size="lg" className="text-gray-700 mb-8">
                    Real companies using {solution.title} to solve their capital challenges
                  </Text>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map(post => (
                      <Link key={post.id} href={`/blog/${post.id}`} className="group h-full">
                        <Card>
                          <Heading size="h3" className="mb-3 text-olive-900 group-hover:text-gold-500 transition-colors line-clamp-2">
                            {post.title}
                          </Heading>
                          <Text className="text-gray-700 text-sm mb-4 flex-grow">
                            {post.excerpt}
                          </Text>
                          <Text className="text-xs text-gray-600 mb-4">
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </Text>
                          <div className="flex items-center gap-2 text-gold-500 group-hover:gap-3 transition-all">
                            <span className="text-sm font-semibold">Read Story</span>
                            <ChevronRight size={16} />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </StaggerContainer>
                </div>
              </Container>
            </Section>
          ) : null
        })()}

        {/* Related Solutions */}
        <Section>
          <Container>
            <div className="max-w-4xl mx-auto">
              <Heading size="h2" className="mb-6">Other Funding Solutions</Heading>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fundingSolutions
                  .filter(s => s.id !== solution.id)
                  .slice(0, 3)
                  .map(relatedSolution => (
                    <Link key={relatedSolution.id} href={`/solutions/${relatedSolution.id}`} className="h-full block">
                      <Card>
                        <Heading size="h3" className="mb-2">
                          {relatedSolution.title}
                        </Heading>
                        <Text size="sm" className="mb-4 line-clamp-2">
                          {relatedSolution.whatIs}
                        </Text>
                        <span className="font-semibold text-sm text-olive-green">Learn more about {getTitleAsString(relatedSolution.title)} →</span>
                      </Card>
                    </Link>
                  ))}
              </StaggerContainer>
            </div>
          </Container>
        </Section>

        {/* Navigation Back */}
        <Section>
          <Container>
            <div className="text-center">
              <Link
                href="/solutions"
                className="inline-block hover:underline font-semibold text-olive-green"
              >
                ← Back to All Solutions
              </Link>
            </div>
          </Container>
        </Section>
      </SolutionDetailClient>
    </main>
  )
}
