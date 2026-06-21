import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Search,
  Clock,
  Shield,
  Leaf,
  ChevronRight
} from 'lucide-react'
import {
  Section,
  Container,
  Heading,
  Text,
  Button,
  Card,
  FadeIn,
  StaggerContainer,
  StaggerItem
} from '@/components/ui'
import { COLORS as BRAND_COLORS } from '@/lib/colors'
import { topLevelFAQs } from '@/data/faq-data'
import { fundingSolutions } from '@/data/solutions'
import { fundingCases } from '@/data/fundingData'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { HeroAnimation } from '@/components/HeroAnimation'
import { HeroCarousel } from '@/components/HeroCarousel'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { CTA } from '@/components/cta'

export const metadata: Metadata = {
  title: 'Capital That Serves You | Serve Funding',
  description: 'Trusted working capital advisory. Get funded in 3-10 days with transparency & relationships. Debt refinance, MCA consolidation. $250K-$100MM.',
  keywords: 'working capital, business loans, when banks say no, funding advisory, asset-based lending, invoice factoring, rapid growth funding',
  alternates: { canonical: 'https://servefunding.com' },
  openGraph: {
    title: 'Capital That Serves You | Serve Funding',
    description: 'Entrepreneurs deserve better. Get funded fast with trusted advisors who prioritize your growth. Debt refinance, MCA consolidation, invoice factoring & working capital solutions in 3-10 days.',
    url: 'https://servefunding.com/',
    siteName: 'Serve Funding',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/home/right%20funding%20solutions.webp',
        width: 960,
        height: 628,
        alt: 'The Right Funding Solutions to Serve Healthy Business Growth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capital That Serves You | Serve Funding',
    description: 'Trusted working capital advisory for growing entrepreneurs. Fast funding when banks decline. Relationships > Bots. $250K-$100MM in 3-10 days.',
  },
  robots: 'index, follow',
}

// Lazy load below-the-fold components
const IndustriesGrid = dynamic(() => import('@/components/IndustriesGrid').then(mod => ({ default: mod.IndustriesGrid })), {
  loading: () => <LoadingSkeleton />
})


const heroSlides = [
  {
    heading: "Funding Solutions to Serve Healthy Business Growth",
    desc: <>An advisory service committed to serve<br />the best interests of your company's<br />current needs and future goals.</>,
    image: "/home/right funding solutions.webp",
    width: 960,
    height: 628
  },
  {
    heading: "Creative Capital Empowering Entrepreneurs",
    desc: <>Because your company is unique,<br />you want partners who truly understand<br />your story and align with your objectives.</>,
    image: "/home/creative working capital.webp",
    width: 1024,
    height: 945
  },
    {
    heading: <>You Value Relationships<br />Over Quick Fixes</>,
    desc: <>We partner with like-minded business leaders<br />who want trusted advisors in their corner<br />to ensure they make the best decisions.</>,
    image: "/home/value relationships over bots.webp",
    width: 1024,
    height: 819
  }
]

export default function Home() {

  return (
    <>
      {/* Hero Section */}
      <Section className="min-h-[80vh] lg:min-h-[65vh]">
        <HeroCarousel slides={heroSlides} />
      </Section>

      {/* Value Props Section */}
      <Section className="!pt-0">
        <Container>
          <FadeIn className="text-center mb-20">
            <Heading size="h2" color='dark' className="!mt-0 !mb-3">Need Business Growth Capital?</Heading>
            <Heading size="h2" color='primary' className="!my-3">We Are Here to Serve You.</Heading>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Transparent",
                icon: Search,
                desc: "We value honest, open communication. We believe that transparency is where trust-based relationships begin."
              },
              {
                title: "Timely",
                icon: Clock,
                desc: <>Time is your most valuable resource. <br />We invest our time and expertise to ensure an efficient process.</>
              },
              {
                title: "Trusted",
                icon: Shield,
                desc: <>We represent your firm to our trusted lender partners to protect <br />your best interests.</>
              }
            ].map((item, index) => (
              <Card key={`value-prop-${index}`} className="items-center text-center group value-card">
                  <div
                    className="icon-flip-outer w-24 h-24 rounded-full mb-8"
                    style={{
                      perspective: '1000px'
                    }}
                  >
                    <div
                      className="icon-flip-inner w-24 h-24 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: BRAND_COLORS.primary
                      }}
                    >
                      <item.icon
                        size={40}
                        style={{ color: BRAND_COLORS.secondary }}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <Heading size="h3" className="mb-4 text-olive-900" style={{ color: BRAND_COLORS.primary }}>{item.title}</Heading>
                  <Text className="text-gray-600 font-medium">
                    {item.desc}
                  </Text>
                </Card>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Trust-Based Partnership Section */}
      <CTA
        title="Capital That Serves You"
        text="Answer a few questions to find out what credit options are available to you. Takes a few minutes and there's no obligation."
        buttonText="Explore Funding Options"
        background="gray"
      />

      {/* Funding Solutions Section */}
      <Section background="background" className="!pt-0">
        <Container className='mb-14'>
          <FadeIn className="text-center mb-20">
            <Heading size="h2" className="mb-4">
              Business Financing from $250K to $100MM
            </Heading>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-6xl mx-auto">
            {[
              "Financing Periods Of Rapid Growth",
              "The Bank Says \"No,\" Or Calls Your Line",
              "Fund New Contracts & Purchase Orders",
              "Unsecured Loans & Lines Of Credit",
              "Bridge Funding For Short-Term Gaps",
              "M&A: Capital For Strategic Acquisitions",
              "Longer Payment Terms: Net-60, Net-90+",
              "Working Capital For Seasonal Shortfalls",
              "MCA (Cash Advance) Consolidations",
              "Cover Unexpected Payroll Shortfalls"
            ].map((item, index) => (
              <StaggerItem key={`benefit-${index}`} className="flex items-center gap-4 group ml-8">
                <Leaf size={28} style={{ color: BRAND_COLORS.primary }} />
                <Text size="2xl">{item}</Text>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Solutions Showcase Section */}
      <Section className="py-20" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <Container>
          <FadeIn className="text-center mb-16">
            <Heading size="h2" color="highlight" className="mb-4" style={{ color: '#ffffff'}}>
              Creative Working Capital
            </Heading>
            <Text size="2xl" className="text-white/90 max-w-2xl mx-auto">
              From $250K to $100MM, we offer <br /><b style={{ background: `linear-gradient(to bottom, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.highlight})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>creative working capital solutions</b> <br />tailored to your business needs
            </Text>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {fundingSolutions.map((solution) => (
              <Link key={solution.id} href={`/solutions/${solution.id}`} className="group cursor-pointer block h-full">
                <Card style={{ background: `linear-gradient(to bottom, white, ${BRAND_COLORS.background})` }}>
                  <div className="flex-1">
                    <Heading size="h3" color='primary'>
                      {solution.title}
                    </Heading>
                    <Text>
                      {solution.shortDesc}
                    </Text>
                  </div>
                  <div className="mt-4 flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span className="text-sm font-semibold">Learn More</span>
                    <ChevronRight size={16} />
                  </div>
                </Card>
              </Link>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Industries Section */}
      <Section>
        <Container>
          <FadeIn>
            <Heading size="h2" className="mb-16 text-center">Industries Served</Heading>
          </FadeIn>
          <IndustriesGrid />
        </Container>
      </Section>

      {/* Process Section */}
      <Section background="gray">
        <Container>
          <FadeIn>
            <Heading size="h2" className="mb-16 text-center">Outlining Our Process</Heading>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[
              {
                step: 1,
                title: "Discovery",
                desc: "We genuinely care and listen to your needs and objectives so our process stays strategic to your growth goals."
              },
              {
                step: 2,
                title: "Diligence",
                desc: "We lead a comprehensive capital search and advise you on your evolving options for short and long-term growth."
              },
              {
                step: 3,
                title: "Delivery",
                desc: "We take responsibility to guide your lender engagements all the way to a timely closing. We are here to serve you."
              }
            ].map((item) => (
              <Card key={item.step} className="items-center text-center group" hoverColor={BRAND_COLORS.secondary}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 bg-white/50 border-2 border-gold-light" style={{ color: BRAND_COLORS.primary }}>
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <Heading size="h3" className="mb-4 transition-colors" style={{ color: BRAND_COLORS.primary }}>
                  {item.title}
                </Heading>
                <Text className="text-gray-600 font-medium transition-colors">
                  {item.desc}
                </Text>
              </Card>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Successful Client Fundings Section */}
      <Section className="py-20" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <Container>
          <FadeIn className="text-center mb-16">
            <Heading size="h2" color="highlight" className="mb-4">Successful Client Fundings</Heading>
            <Text size="2xl" className="text-white/90 max-w-2xl mx-auto">
              See how we've helped businesses across industries<br />secure the capital they needed to grow
            </Text>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {fundingCases.slice(0, 6).map((caseStudy, index) => (
              <Link key={`case-study-${index}`} href={`/fundings#${caseStudy.title.toLowerCase().replace(/\s+/g, '-')}`} className="group cursor-pointer block h-full">
                <Card padding="md">
                    <Heading size="h4" className="mb-2 text-olive-900 group-hover:text-gold-500 transition-colors line-clamp-2">
                      <span 
                        className="bg-gradient-to-b bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(to bottom, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.dark})` }}
                      >
                        {caseStudy.amount}
                      </span>{' '}
                      {caseStudy.title}
                    </Heading>
                    <Text className="text-sm text-gray-500 mb-3">
                      {caseStudy.company}
                    </Text>
                    <div className="overflow-hidden flex-1 mb-4" style={{ maxHeight: '6em' }}>
                      <Text className="text-gray-700">
                        {caseStudy.fullStory}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 text-gold-500 group-hover:gap-3 transition-all">
                      <span className="text-sm font-semibold">Read More</span>
                      <ChevronRight size={16} />
                    </div>
                  </Card>
                </Link>
            ))}
          </StaggerContainer>

          <FadeIn className="text-center">
            <Link href="/fundings">
              <Button variant="white" size="lg">Explore All Fundings</Button>
            </Link>
          </FadeIn>
        </Container>
      </Section>

      {/* FAQ Section - AIEO Optimized */}
      <FAQSectionWithSchema
        title="Frequently Asked Questions"
        description={<>Get answers to the most common questions about <br />Serve Funding and working capital financing</>}
        faqs={topLevelFAQs}
        background="white"
        schemaName="Business Financing Advisory"
      />

      {/* About Us Link Section */}
      <Section background="background">
        <Container>
          <FadeIn className="text-center">
            <Heading size="h2" className="mb-4">Meet the Team Behind Serve Funding</Heading>
            <Text size="2xl" className="text-gray-700 mb-8 max-w-2xl mx-auto">
              Learn about our mission, values, and the experienced team committed to helping your business grow.
            </Text>
            <Link href="/about-us">
              <Button variant="default" size="lg">
                Learn Our Story <ChevronRight size={18} className="ml-2" />
              </Button>
            </Link>
          </FadeIn>
        </Container>
      </Section>

      <CTA
        title="Ready to Get Started?"
        text="Answer a few questions and schedule a call at your convenience. Takes a few minutes and there's no obligation."
        buttonText="Explore Funding Options"
        href="/discover"
      />
    </>
  )
}
