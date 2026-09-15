'use client'

import {
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import {
  Section,
  Container,
  Heading,
  Text,
  Button,
  Card,
  FadeIn,
  StaggerContainer
} from '@/components/ui'
import { LAYOUT } from '@/lib/layout'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { CTA } from '@/components/cta'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { fundingSolutions } from '@/data/solutions'
import { solutionComparisonFAQs } from '@/data/faq-data'
import Link from 'next/link'
import { trackSolutionClick } from '@/lib/tracking'
import { getTitleAsString } from '@/lib/solution-helpers'
import { COLORS } from '@/lib/colors'

// Comparison data derived from fundingSolutions
const comparisonData = [
  { name: 'Working Capital Loans', id: 'working-capital-loans', speed: '2-10 days', collateral: 'None (revenue-based)', amount: '$100K - $10M+', bestFor: 'Payroll, seasonal gaps, rapid growth' },
  { name: 'Invoice Factoring', id: 'invoice-factoring', speed: '3 weeks setup, then 24-48 hrs', collateral: 'Unpaid invoices (AR)', amount: '$250K - $100MM', bestFor: 'Slow-paying customers, strong AR' },
  { name: 'Asset-Based Lending', id: 'asset-based-lending', speed: '6-8 weeks', collateral: 'AR, inventory, equipment', amount: '$250K - $25M', bestFor: 'Growing companies with strong assets' },
  { name: 'Equipment Financing', id: 'equipment-leasing', speed: '2-4 weeks', collateral: 'Equipment being financed', amount: '$100K - $50M+', bestFor: 'Machinery, vehicles, technology' },
  { name: 'PO Funding', id: 'purchase-order-funding', speed: '2-4 weeks', collateral: 'Purchase orders', amount: '$250K - $50M', bestFor: 'Large orders, international sourcing' },
  { name: 'Bridge Funding', id: 'bridge-funding', speed: '3-5 days', collateral: 'Varies (often unsecured)', amount: '$50K - $5M+', bestFor: 'Timing gaps, seasonal needs' },
  { name: 'SBA Loans', id: 'sba-loans', speed: '4-12 weeks', collateral: 'Cash flow + assets', amount: '$250K - $5M+', bestFor: 'Lowest rates, established businesses' },
  { name: 'Debt Refinance', id: 'debt-refinance', speed: '10-20 days', collateral: 'Existing assets or cash flow', amount: '$250K - $10M+', bestFor: 'MCA escape, payment reduction' },
]

export function SolutionsClient() {
  const handleSolutionClick = (solutionId: string) => {
    trackSolutionClick(solutionId)
  }

  return (
    <>
      {/* Hero Section */}
      <HeroFadeIn
        title={<>The Right Funding<br />for Your Business</>}
        subtitle={<>Serve Funding offers working capital solutions including asset-based lending, <br />invoice factoring, equipment leasing, PO financing, government contracting, <br />inventory financing, and unsecured loans. Funding range: $250K-$100MM.</>}
      />

      {/* Solutions Overview with CTA */}
      <Section background="white" className="py-16">
        <Container>
          <FadeIn>
            <Heading size="h2" className='text-center'>
              Our Creative Working Capital Solutions
            </Heading>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {fundingSolutions.map((solution, index) => (
                <Link
                  key={solution.id}
                  href={`/solutions/${solution.id}`}
                  onClick={() => handleSolutionClick(solution.id)}
                  className="group cursor-pointer block h-full"
                >
                  <Card color='background'>
                    <Heading size="h3" color='primary' className="mb-3 group-hover:text-gold-500 transition-colors">
                      {solution.title}
                    </Heading>
                    {/* Answer Capsule - AI Optimized */}
                    <Text color='dark' className="text-sm leading-relaxed mb-3 italic border-l-2 border-gold-500 pl-4">
                      {solution.whatIs}
                    </Text>
                    <Text color='dark' className="text-sm leading-relaxed">
                      {solution.shortDesc}
                    </Text>
                  </Card>
                </Link>
              ))}
            </StaggerContainer>
          </FadeIn>
        </Container>
      </Section>

      {/* Solution Comparison Section */}
      <Section background="gray">
        <Container>
          <FadeIn className="text-center mb-12">
            <Heading size="h2">
              Compare <span className="text-gold-500">Funding Solutions</span>
            </Heading>
            <Text size="2xl" className="text-gray-700">
              Find the right fit based on speed, collateral, and funding amount
            </Text>
          </FadeIn>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                  <th className="p-4 text-left font-semibold">Solution</th>
                  <th className="p-4 text-left font-semibold">Speed</th>
                  <th className="p-4 text-left font-semibold">Collateral</th>
                  <th className="p-4 text-left font-semibold">Amount Range</th>
                  <th className="p-4 text-left font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gold-500/5 transition-colors`}>
                    <td className="p-4 font-semibold text-olive-900">
                      <Link href={`/solutions/${item.id}`} className="hover:text-gold-500 transition-colors">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">{item.speed}</td>
                    <td className="p-4 text-gray-700">{item.collateral}</td>
                    <td className="p-4 text-gray-700">{item.amount}</td>
                    <td className="p-4 text-gray-700">{item.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <StaggerContainer className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisonData.map((item) => (
              <Link key={item.id} href={`/solutions/${item.id}`} className="block group">
                <Card color="background" padding="md">
                  <Heading size="h4" className="mb-3 text-olive-900 group-hover:text-gold-500 transition-colors">
                    {item.name}
                  </Heading>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-olive-900">Speed:</span>
                      <span className="text-gray-700">{item.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-olive-900">Collateral:</span>
                      <span className="text-gray-700 text-right ml-2">{item.collateral}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-olive-900">Amount:</span>
                      <span className="text-gray-700">{item.amount}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="font-semibold text-olive-900">Best For: </span>
                      <span className="text-gray-700">{item.bestFor}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </StaggerContainer>

          {/* Comparison Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "Compare Business Funding Solutions",
                "description": "Side-by-side comparison of working capital loans, invoice factoring, asset-based lending, and more business funding options.",
                "articleBody": `Comparison of: ${comparisonData.map(i => i.name).join(", ")}. Each solution varies by speed (${comparisonData.map(i => `${i.name}: ${i.speed}`).join('; ')}), collateral requirements, and funding amounts.`
              })
            }}
          />
        </Container>
      </Section>

      {/* Why Choose Serve Funding Section */}
      <Section background="white">
        <Container>
          <FadeIn className="text-center mb-12">
            <Heading size="h2">
              Why Choose <span className="text-gold-500">Serve Funding?</span>
            </Heading>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <Heading size="h4" className="mb-4 text-olive-900">
                Tailored Solutions
              </Heading>
              <Text className="text-gray-700">
                Every business is unique. Our funding options are customized to your specific needs.
              </Text>
            </Card>

            <Card>
              <Heading size="h4" className="mb-4 text-olive-900">
                Expert Guidance
              </Heading>
              <Text className="text-gray-700">
                Our team has years of experience in structuring financing that drives growth.
              </Text>
            </Card>

            <Card>
              <Heading size="h4" className="mb-4 text-olive-900">
                Flexible Terms
              </Heading>
              <Text className="text-gray-700">
                We offer flexible terms that adapt as your business evolves.
              </Text>
            </Card>
          </StaggerContainer>

          <FadeIn className="text-center">
            <Text size="2xl" className="mb-6 text-gray-700">
              Ready to find the right solution for your business? Our team is ready to guide you through every step.
            </Text>
            <Link href="/discover">
              <Button variant="gold" size="lg">Explore Funding Options</Button>
            </Link>
          </FadeIn>
        </Container>
      </Section>

      {/* Detailed Solutions Section */}
      <Section background="white" className="py-20">
        <Container>
          <StaggerContainer className="space-y-24">
            {fundingSolutions.map((solution, index) => (
              <div key={solution.id} id={solution.id} style={{ scrollMarginTop: LAYOUT.scrollMarginTop }} className={`flex flex-col lg:flex-row gap-12 w-full lg:items-stretch ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <div className={`lg:flex-[0.6] ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                  <Heading size="h2" className="mb-6 text-olive-900">
                    <span className="text-olive-900">{solution.title}</span>
                  </Heading>
                  <Text className="text-gray-700 mb-6 leading-relaxed text-lg">
                    {solution.whatIs}
                  </Text>

                  <Link href={`/solutions/${solution.id}`} onClick={() => handleSolutionClick(solution.id)}>
                    <Button variant="default" className="flex items-center gap-2">
                      Read more <ChevronRight size={18} />
                    </Button>
                  </Link>
                </div>

                {/* Image Content */}
                <div className={`relative h-auto rounded-3xl overflow-hidden group m-4 lg:m-0 lg:mt-20 lg:flex-shrink-0 lg:flex-[0.4]`}>
                  <Image
                    src={solution.image}
                    alt={getTitleAsString(solution.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-900/40 to-transparent"></div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* FAQ Section */}
      <FAQSectionWithSchema
        title="Funding Solutions - Common Questions"
        description="Get answers to the most common questions about choosing the right business funding solution"
        faqs={solutionComparisonFAQs}
        background="gray"
        schemaName="Business Funding Solutions"
      />

      {/* Final CTA */}
      <CTA
        title="Ready to Take the Next Step?"
        text="Answer a few questions and find out whether your deal fits lenders in our network. Then complete your application or talk to an advisor first, whichever you prefer."
        buttonText="Explore Funding Options"
        href="/discover"
        useBG
      />
    </>
  )
}
